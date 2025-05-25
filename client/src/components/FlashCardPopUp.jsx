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


export default function FlashCardPopUp({
onClose
}) 
{
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("clicking submite")
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


    </Box>
    </Modal>
  );
}
