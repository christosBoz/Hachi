import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import CreateFolderForm from '../components/CreateFolderForm/CreateFolderForm';
import { Box, Typography, IconButton } from '@mui/material';
import HachiLogoLong from '../assets/HachiLogoLong.png';
import SearchBar from '../components/Searchbar';
import notification from '../assets/sidebarIcons/notification.png';
import plusIcon from '../assets/sidebarIcons/plusIcon.png';
import defaultpic from '../assets/defaultprofilepic.png';
import Sidebar from '../components/sidebar';

function Banner({ onCreateFolder }) {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showPlusDropdown, setShowPlusDropdown] = useState(false);

  const ProfileDropdown = () => (
    <Box sx={{
      position: 'absolute',
      top: '48px',
      right: 0,
      width: '180px',
      bgcolor: 'white',
      border: '1px solid #ccc',
      borderRadius: 1,
      boxShadow: 2,
      zIndex: 10
    }}>
      {[{ label: 'Settings' }, { label: 'Logout' }].map((item, idx) => (
        <Box
          key={idx}
          onClick={() => console.log(item.label)}
          sx={{ p: 2, cursor: 'pointer', '&:hover': { backgroundColor: '#f7f7f7' } }}
        >
          {item.label}
        </Box>
      ))}
    </Box>
  );

  const PlusDropdown = () => (
    <Box sx={{
      position: 'absolute',
      top: '48px',
      right: 48,
      width: '180px',
      bgcolor: 'white',
      border: '1px solid #ccc',
      borderRadius: 1,
      boxShadow: 2,
      zIndex: 10
    }}>
      {[{ label: 'Create Folder', action: onCreateFolder }, { label: 'Flashcards' }, { label: 'Notes' }].map((item, idx) => (
        <Box
          key={idx}
          onClick={item.action || (() => console.log(item.label))}
          sx={{ p: 2, cursor: 'pointer', '&:hover': { backgroundColor: '#f7f7f7' } }}
        >
          {item.label}
        </Box>
      ))}
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', height: '64px', px: 3, borderBottom: '1px solid #ddd', position: 'relative' }}>
      <img src={HachiLogoLong} alt="Hachi Logo" style={{ height: '100%' }} />
      <Box sx={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', width: '40%' }}>
        <SearchBar onSearch={(text) => console.log("Search submitted:", text)} />
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', marginLeft: 'auto', gap: 2 }}>
        <img src={notification} alt="notification" style={{ height: '32px', cursor: 'pointer' }} />
        <img src={plusIcon} alt="plus" style={{ height: '32px', cursor: 'pointer' }} onClick={() => {
          setShowPlusDropdown(prev => !prev);
          setShowProfileDropdown(false);
        }} />
        <img src={defaultpic} alt="profile" style={{ height: '32px', borderRadius: '50%', cursor: 'pointer' }} onClick={() => {
          setShowProfileDropdown(prev => !prev);
          setShowPlusDropdown(false);
        }} />
        {showPlusDropdown && <PlusDropdown />}
        {showProfileDropdown && <ProfileDropdown />}
      </Box>
    </Box>
  );
}

export default function Folder() {
  const { name: folderNameParam } = useParams();

  const [createFolderOpen, setCreateFolderOpen] = useState(false);
  const [school, setSchool] = useState('');
  const [folderName, setFolderName] = useState('');
  const [subject, setSubject] = useState('');

  const handleCreateFolder = ({ folderName, school, subject, file }) => {
    console.log("Folder Name:", folderName);
    console.log("School:", school);
    console.log("Subject:", subject);
    console.log("Image File:", file);
    setCreateFolderOpen(false);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Banner onCreateFolder={() => setCreateFolderOpen(true)} />
      <Box sx={{ display: "flex", flexGrow: 1 }}>
        <Sidebar onCreateFolder={() => setCreateFolderOpen(true)} />
        <Box sx={{ flexGrow: 1, padding: 3 }}>
          <Typography variant="h4">
            Welcome to the "{decodeURIComponent(folderNameParam)}" Folder
          </Typography>
        </Box>
      </Box>
      {createFolderOpen && (
        <CreateFolderForm
          school={school}
          setSchool={setSchool}
          folderName={folderName}
          setFolderName={setFolderName}
          subject={subject}
          setSubject={setSubject}
          onSubmit={handleCreateFolder}
          onClose={() => setCreateFolderOpen(false)}
        />
      )}
    </Box>
  );
}
