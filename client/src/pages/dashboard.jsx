// App.jsx or Dashboard.jsx (Main page)
import React, { useState } from 'react';
import CreateFolderForm from '../components/CreateFolderForm';
import { Box, Typography, IconButton } from '@mui/material';
import HachiLogoLong from '../assets/HachiLogoLong.png';
import SearchBar from '../components/Searchbar';
import notification from '../assets/sidebarIcons/notification.png';
import plusIcon from '../assets/sidebarIcons/plusIcon.png';
import defaultpic from '../assets/defaultprofilepic.png';
import homeIcon from '../assets/sidebarIcons/homeIcon.png';
import folderIcon from '../assets/sidebarIcons/folderIcon.png';

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

function Sidebar({ onCreateFolder }) {
  const [collapsed, setCollapsed] = useState(false);

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
      <img src={icon} alt={label} style={{ width: 20, height: 20, marginRight: collapsed ? 0 : 12 }} />
      {!collapsed && <Typography fontSize="0.95rem">{label}</Typography>}
    </Box>
  );

  return (
    <Box sx={{ width: collapsed ? '64px' : '220px', height: '100%', borderRight: '1px solid #ddd', p: 2, bgcolor: '#fafafa', transition: 'width 0.3s' }}>
      <IconButton size="small" onClick={() => setCollapsed(prev => !prev)} sx={{ mb: 1 }}>
        {collapsed ? '→' : '←'}
      </IconButton>
      {!collapsed && <Typography variant="caption" sx={{ ml: 1, color: 'gray' }}>Navigation</Typography>}
      <SidebarItem icon={homeIcon} label="Dashboard" />
      <SidebarItem icon={folderIcon} label="Materials" />
      <Box sx={{ my: 2 }}><hr /></Box>
      {!collapsed && <Typography variant="caption" sx={{ ml: 1, color: 'gray' }}>Your Folders</Typography>}
      <SidebarItem icon={plusIcon} label="Create folder" onClick={onCreateFolder} />
      <Box sx={{ my: 2 }}><hr /></Box>
      {!collapsed && <Typography variant="caption" sx={{ ml: 1, color: 'gray' }}>Settings</Typography>}
      <SidebarItem icon={homeIcon} label="Settings" />
    </Box>
  );
}

export default function Dashboard() {
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
          <Typography variant="h4">Welcome to the Dashboard</Typography>
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
