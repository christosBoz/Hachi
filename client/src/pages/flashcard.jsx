import { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Typography,
  Grid,
  Paper,
  Button,
  Box,
} from "@mui/material";

function FlashCard() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [cards, setCards] = useState([{ front: "", back: "" }]);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [showTopBar, setShowTopBar] = useState(false);

  const handleCardChange = (index, field, value) => {
    const newCards = [...cards];
    newCards[index][field] = value;
    setCards(newCards);
  };

  const handleSave = () => {
    const nonEmptyCards = cards.filter(
      (card) => card.front.trim() !== "" || card.back.trim() !== ""
    );
    console.log("Saving Cards: ", nonEmptyCards);
  };

  const addCard = () => {
    const newCards = [...cards];
    newCards.splice(activeCardIndex + 1, 0, { front: "", back: "" });
    setCards(newCards);
    setActiveCardIndex(activeCardIndex + 1);
  };

  useEffect(() => {
    setFlipped(false);
  }, [activeCardIndex]);

  return (
    <Container maxWidth="xl" sx={{ py: 4, overflowY: "auto" }}>
      <Typography variant="h4" gutterBottom>
        Create Flashcard Set
      </Typography>

      {/* Topbar (Title & Description Inputs) */}
      {showTopBar && (
        <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            Flashcard Set Details
          </Typography>
          <TextField
            fullWidth
            label="Enter FlashCard Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Description"
            multiline
            minRows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            margin="normal"
          />
        </Paper>
      )}

      {/* Top buttons */}
      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <Button variant="contained" onClick={handleSave}>
          Save Cards
        </Button>
        <Button
          variant="outlined"
          onClick={() => setShowTopBar(!showTopBar)}
        >
          {showTopBar ? "Hide Top Bar" : "Show Top Bar"}
        </Button>
      </Box>

      <Grid container spacing={4} alignItems="flex-start">
        {/* Editor Panel */}
        <Grid item xs={12} md={6}>
          <Paper
            elevation={3}
            sx={{
              p: 2,
              height: "75vh",
              overflowY: "auto",
              backgroundColor: "#fafafa",
              display: "flex",
              flexDirection: "column",
              gap: 2,
              borderRadius: 2,
              border: "1px solid #e0e0e0",
            }}
          >
            {cards.map((card, index) => (
              <Box
                key={index}
                sx={{
                  border:
                    index === activeCardIndex
                      ? "2px solid #1976d2"
                      : "1px solid #ccc",
                  borderRadius: "8px",
                  p: 2,
                  cursor: "pointer",
                  backgroundColor:
                    index === activeCardIndex ? "#e3f2fd" : "#fff",
                  transition: "background-color 0.3s, box-shadow 0.3s",
                  "&:hover": {
                    boxShadow: 2,
                    backgroundColor: "#f9f9f9",
                  },
                }}
                onClick={() => setActiveCardIndex(index)}
              >
                <Typography variant="subtitle1" fontWeight="bold">
                  Card {index + 1}
                </Typography>

                <TextField
                  fullWidth
                  label="Front"
                  placeholder="Enter term"
                  value={card.front}
                  onChange={(e) =>
                    handleCardChange(index, "front", e.target.value)
                  }
                  margin="dense"
                />

                <TextField
                  fullWidth
                  label="Back"
                  placeholder="Enter definition"
                  multiline
                  minRows={3}
                  value={card.back}
                  onChange={(e) =>
                    handleCardChange(index, "back", e.target.value)
                  }
                  margin="dense"
                />

                <Button
                  variant="text"
                  onClick={() => {
                    const newCards = [...cards];
                    newCards.splice(index + 1, 0, { front: "", back: "" });
                    setCards(newCards);
                    setActiveCardIndex(index + 1);
                  }}
                  sx={{ mt: 1 }}
                >
                  + Add card below
                </Button>
              </Box>
            ))}
          </Paper>
        </Grid>

        {/* Live Preview */}
        <Grid item xs={12} md={6}>
          <Paper
            elevation={3}
            sx={{
              width: "100%",
              minHeight: "75vh",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              p: 3,
              borderRadius: 2,
              backgroundColor: "#f5f5f5",
            }}
          >
            <Typography variant="h6" gutterBottom>
              Preview (Card {activeCardIndex + 1})
            </Typography>

            <Box
              onClick={() => setFlipped(!flipped)}
              sx={{
                width: "600px",
                height: "400px",
                perspective: "1000px",
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  height: "100%",
                  position: "relative",
                  transformStyle: "preserve-3d",
                  transition: "transform 0.6s",
                  transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
                }}
              >
                {/* Front Side */}
                <Box
                  sx={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    backfaceVisibility: "hidden",
                    backgroundColor: "#f9f9f9",
                    borderRadius: "12px",
                    boxShadow: 3,
                    p: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                  }}
                >
                  <Box>
                    <Typography variant="subtitle2" fontWeight="bold">
                      Front
                    </Typography>
                    <Typography>
                      {cards[activeCardIndex]?.front || <i>Empty</i>}
                    </Typography>
                  </Box>
                </Box>

                {/* Back Side */}
                <Box
                  sx={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    backfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                    backgroundColor: "#e6f7ff",
                    borderRadius: "12px",
                    boxShadow: 3,
                    p: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                  }}
                >
                  <Box>
                    <Typography variant="subtitle2" fontWeight="bold">
                      Back
                    </Typography>
                    <Typography>
                      {cards[activeCardIndex]?.back || <i>Empty</i>}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default FlashCard;
