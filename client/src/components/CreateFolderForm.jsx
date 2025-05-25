import React, { useState, useEffect } from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControlLabel
} from '@mui/material';
import Cropper from 'react-easy-crop';
import getCroppedImg from '../utils/cropImage';

export default function CreateFolderForm({
  school,
  setSchool,
  folderName,
  setFolderName,
  subject,
  setSubject,
  onSubmit,
  onClose
}) {
  const [showMoreInfo, setShowMoreInfo] = useState(false);
  const [schoolResults, setSchoolResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Auto-fill school
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await fetch("http://localhost:5138/api/account/profile", {
          credentials: "include"
        });
        if (res.ok) {
          const data = await res.json();
          if (data.user?.schoolName) {
            setSchool(data.user.schoolName);
          } else if (data.user?.schoolId) {
            const schoolRes = await fetch(`http://localhost:5138/api/schools/${data.user.schoolId}`);
            if (schoolRes.ok) {
              const schoolData = await schoolRes.json();
              setSchool(`${schoolData.name}, ${schoolData.city}, ${schoolData.state}`);
            }
          }
        }
      } catch (err) {
        console.error("Failed to fetch user school info:", err);
      }
    };
    fetchUserProfile();
  }, [setSchool]);

  // School search
  useEffect(() => {
    const fetchSchools = async () => {
      if (!school || school.length < 2) {
        setSchoolResults([]);
        return;
      }
      try {
        const res = await fetch(`http://localhost:5138/api/schools/search?query=${encodeURIComponent(school)}`);
        const data = await res.json();
        setSchoolResults(data);
        setShowDropdown(true);
      } catch (err) {
        console.error("Error fetching schools:", err);
      }
    };
    const timeout = setTimeout(fetchSchools, 300);
    return () => clearTimeout(timeout);
  }, [school]);

  const validate = () => {
    const newErrors = {};
    if (!folderName.trim()) newErrors.folderName = "Folder name is required";
    if (!imageFile) newErrors.image = "Folder icon is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setErrors((prev) => ({ ...prev, image: undefined }));
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const validationErrors = {};
  if (!folderName.trim()) validationErrors.folderName = "Folder name is required.";
  if (!imageFile) validationErrors.image = "Folder icon is required.";
  setErrors(validationErrors);
  if (Object.keys(validationErrors).length > 0) return;

  setLoading(true);

  try {
    let finalImage = imageFile;

    if (imagePreview && croppedAreaPixels) {
      finalImage = await getCroppedImg(imagePreview, croppedAreaPixels);
    }

    const blob = new Blob([finalImage], { type: imageFile.type || 'image/png' });
    const formData = new FormData();
    formData.append("Name", folderName);
    formData.append("School", school);
    formData.append("CourseCode", subject || "");
    formData.append("IsSchool", showMoreInfo);
    formData.append("File", blob, imageFile.name || "image.png");

    const res = await fetch("http://localhost:5138/api/folder/create-folder", {
      method: "POST",
      body: formData,
      credentials: "include"
    });

    if (res.ok) {
      const data = await res.json();
      console.log("Folder created:", data);
      onSubmit(data.folder); // you can close modal or update UI
    } else {
      console.error("Folder creation failed");
    }
  } catch (err) {
    console.error("Error creating folder:", err);
  } finally {
    setLoading(false);
  }
};

  return (
    <Modal open onClose={onClose}>
      <Box
        sx={{
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          width: 400,
          mx: 'auto',
          my: '10vh',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          position: 'relative'
        }}
      >
        <Typography variant="h6" fontWeight="bold">Create a New Folder</Typography>

        <TextField
          label="Folder Name"
          fullWidth
          error={Boolean(errors.folderName)}
          helperText={errors.folderName}
          value={folderName}
          onChange={(e) => {
            setFolderName(e.target.value);
            setErrors((prev) => ({ ...prev, folderName: undefined }));
          }}
        />

        <Button variant="outlined" component="label">
          Upload Folder Icon
          <input type="file" accept="image/*" hidden onChange={handleFileUpload} />
        </Button>
        {errors.image && <Typography color="error" fontSize={13}>{errors.image}</Typography>}

        {imagePreview && (
          <Box sx={{ position: 'relative', width: '100%', height: 180 }}>
            <Cropper
              image={imagePreview}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={(_, croppedPixels) => setCroppedAreaPixels(croppedPixels)}
            />
          </Box>
        )}

        <FormControlLabel
          control={<Checkbox checked={showMoreInfo} onChange={() => setShowMoreInfo(prev => !prev)} />}
          label="Add School Information"
        />

        {showMoreInfo && (
          <>
            <TextField
              label="School"
              fullWidth
              value={school}
              onChange={(e) => setSchool(e.target.value)}
              onFocus={() => setShowDropdown(true)}
              onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
            />

            {showDropdown && schoolResults.length > 0 && (
              <Box sx={{
                border: '1px solid #ccc',
                borderRadius: '4px',
                maxHeight: '150px',
                overflowY: 'auto',
                bgcolor: '#fff',
                zIndex: 20,
                position: 'absolute',
                width: '90%',
              }}>
                {schoolResults.map((s, idx) => (
                  <Box
                    key={idx}
                    onMouseDown={() => {
                      setSchool(`${s.name}, ${s.city}, ${s.state}`);
                      setShowDropdown(false);
                    }}
                    sx={{
                      px: 2,
                      py: 1,
                      borderBottom: '1px solid #eee',
                      cursor: 'pointer',
                      '&:hover': { backgroundColor: '#f7f7f7' }
                    }}
                  >
                    <Typography fontWeight="bold">{s.name}</Typography>
                    <Typography variant="body2" color="text.secondary">{s.city}, {s.state}</Typography>
                  </Box>
                ))}
              </Box>
            )}

            <TextField
              label="Subject"
              fullWidth
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </>
        )}

        <Button variant="contained" onClick={handleSubmit} disabled={loading}>
          {loading ? "Creating..." : "Create"}
        </Button>
      </Box>
    </Modal>
  );
}
