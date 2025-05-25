import React, { useEffect, useState } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import homeIcon from '../assets/sidebarIcons/homeIcon.png';
import folderIcon from '../assets/sidebarIcons/folderIcon.png';
import plusIcon from '../assets/sidebarIcons/plusIcon.png';

function Sidebar({ onCreateFolder }) {
  const [userFolders, setUserFolders] = useState([]);
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate(); // ✅ for routing

  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const res = await fetch("http://localhost:5138/api/folder/my-folders", {
          credentials: "include"
        });
        if (res.ok) {
          const data = await res.json();
          setUserFolders(data);
        } else {
          console.error("Failed to fetch folders");
        }
      } catch (err) {
        console.error("Error fetching folders:", err);
      }
    };

    fetchFolders();
  }, []);

  const SidebarItem = ({ icon, label, onClick }) => (
    <Box
      onClick={onClick}
      sx={{
        display: 'flex',
        alignItems: 'center',
        px: 2,
        py: 1.5,
        cursor: 'pointer',
        '&:hover': { backgroundColor: '#f0f0f0' },
        borderRadius: 1,
      }}
    >
      <img src={icon} alt={label} style={{ width: 36, height: 36, marginRight: collapsed ? 0 : 12 }} />
      {!collapsed && <Typography fontSize="0.95rem">{label}</Typography>}
    </Box>
  );

  return (
    <Box sx={{ width: collapsed ? '64px' : '220px', height: '100%', borderRight: '1px solid #ddd', p: 2, bgcolor: '#fafafa', transition: 'width 0.3s' }}>
      <IconButton size="small" onClick={() => setCollapsed(prev => !prev)} sx={{ mb: 1 }}>
        {collapsed ? '→' : '←'}
      </IconButton>

      {!collapsed && <Typography variant="caption" sx={{ ml: 1, color: 'gray' }}>Navigation</Typography>}
      <SidebarItem icon={homeIcon} label="Dashboard" onClick={() => navigate('/dashboard')} />
      <SidebarItem icon={folderIcon} label="Materials" onClick={() => navigate('/materials')} />
      <Box sx={{ my: 2 }}><hr /></Box>

      {!collapsed && <Typography variant="caption" sx={{ ml: 1, color: 'gray' }}>Your Folders</Typography>}
      {userFolders.map((folder) => (
        <SidebarItem
          key={folder.folderId}
          icon={folder.pictureUrl || folderIcon}
          label={folder.name}
          onClick={() => navigate(`/folder/${encodeURIComponent(folder.name)}`)} // ✅ route to /folder/name
        />
      ))}

      <SidebarItem icon={plusIcon} label="Create folder" onClick={onCreateFolder} />
      <Box sx={{ my: 2 }}><hr /></Box>
      {!collapsed && <Typography variant="caption" sx={{ ml: 1, color: 'gray' }}>Settings</Typography>}
      <SidebarItem icon={homeIcon} label="Settings" onClick={() => navigate('/settings')} />
    </Box>
  );
}

export default Sidebar;
