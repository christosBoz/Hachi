import React, { useState } from 'react';
import { Box, Typography, Button, IconButton, TextField, Grid, Paper } from '@mui/material';
import Sidebar from '../components/sidebar';
import HachiLogoLong from '../assets/HachiLogoLong.png';
import SearchBar from '../components/Searchbar';
import notification from '../assets/sidebarIcons/notification.png';
import plusIcon from '../assets/sidebarIcons/plusIcon.png';
import defaultpic from '../assets/defaultprofilepic.png';

export default function Flashcard() {
  const [cards, setCards] = useState([{ term: '', definition: '' }]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleChange = (index, field, value) => {
    const newCards = [...cards];
    newCards[index][field] = value;
    setCards(newCards);
  };

  const addCard = () => {
    setCards([...cards, { term: '', definition: '' }]);
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
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Add a description..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            sx={{ mb: 4 }}
          />

          {cards.map((card, index) => (
            <Paper key={index} elevation={2} sx={{ mb: 2, p: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label={`Term ${index + 1}`}
                    value={card.term}
                    onChange={(e) => handleChange(index, 'term', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label={`Definition ${index + 1}`}
                    value={card.definition}
                    onChange={(e) => handleChange(index, 'definition', e.target.value)}
                  />
                </Grid>
              </Grid>
            </Paper>
          ))}

          <Button variant="outlined" onClick={addCard} sx={{ mt: 2 }}>Add a card</Button>
          <Button variant="contained" color="primary" sx={{ mt: 2, ml: 2 }}>Save and practice</Button>
        </Box>
      </Box>
    </Box>
  );
}
