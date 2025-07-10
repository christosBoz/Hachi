import React, { useState } from 'react';
import { Box, Typography, Button, IconButton, TextField, Grid, Paper } from '@mui/material';
import Sidebar from '../components/sidebar';
import HachiLogoLong from '../assets/HachiLogoLong.png';
import SearchBar from '../components/Searchbar';
import notification from '../assets/sidebarIcons/notification.png';
import plusIcon from '../assets/sidebarIcons/plusIcon.png';
import defaultpic from '../assets/defaultprofilepic.png';
import ImageIcon from '@mui/icons-material/Image';

export default function Flashcard() {
  const [cards, setCards] = useState([{ term: '', definition: '', image: null }]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleChange = (index, field, value) => {
    const newCards = [...cards];
    newCards[index][field] = value;
    setCards(newCards);
  };

  const handleImageChange = (index, file) => {
    const newCards = [...cards];
    newCards[index].image = URL.createObjectURL(file);
    setCards(newCards);
  };

  const addCard = () => {
    setCards([...cards, { term: '', definition: '', image: null }]);
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', backgroundColor: '#f7f7fb' }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', px: 3, py: 2, borderBottom: '1px solid #ddd', bgcolor: 'white' }}>
          <img src={HachiLogoLong} alt="Logo" style={{ height: 40 }} />
          <Box sx={{ flexGrow: 1, mx: 3 }}>
            <SearchBar onSearch={(text) => console.log("Search:", text)} />
          </Box>
          <IconButton><img src={notification} alt="Notification" height={24} /></IconButton>
          <IconButton><img src={plusIcon} alt="Add" height={24} /></IconButton>
          <IconButton><img src={defaultpic} alt="Profile" height={32} style={{ borderRadius: '50%' }} /></IconButton>
        </Box>

        <Box sx={{ p: 4, overflowY: 'auto' }}>
          <Typography variant="h5" gutterBottom>Create a new flashcard set</Typography>

          <Grid container spacing={2} alignItems="center" sx={{ mb: 4 }}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                sx={{ backgroundColor: 'white', borderRadius: 1 }}
              />
            </Grid>
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Add a description..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                sx={{ backgroundColor: 'white', borderRadius: 1 }}
              />
            </Grid>
          </Grid>

          {cards.map((card, index) => (
            <Paper key={index} elevation={3} sx={{ mb: 3, p: 3, borderRadius: 3 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    label={`Term ${index + 1}`}
                    value={card.term}
                    onChange={(e) => handleChange(index, 'term', e.target.value)}
                    sx={{ backgroundColor: 'white', borderRadius: 1 }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label={`Definition ${index + 1}`}
                    value={card.definition}
                    onChange={(e) => handleChange(index, 'definition', e.target.value)}
                    sx={{ backgroundColor: 'white', borderRadius: 1 }}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <Button variant="outlined" component="label" fullWidth sx={{ height: '56px', justifyContent: 'center' }}>
                    <ImageIcon />
                    <input
                      hidden
                      accept="image/*"
                      type="file"
                      onChange={(e) => handleImageChange(index, e.target.files[0])}
                    />
                  </Button>
                  {card.image && (
                    <Box sx={{ mt: 2 }}>
                      <img src={card.image} alt={`Card ${index + 1}`} style={{ width: '100%', maxHeight: '200px', objectFit: 'contain', borderRadius: '8px' }} />
                    </Box>
                  )}
                </Grid>
              </Grid>
            </Paper>
          ))}

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button variant="outlined" onClick={addCard}>Add a card</Button>
            <Button variant="contained" color="primary">Save and practice</Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}