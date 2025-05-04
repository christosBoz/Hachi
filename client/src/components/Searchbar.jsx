import React, { useState } from 'react';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';

function SearchBar({ placeholder = "Search...", onSearch }) {
  const [query, setQuery] = useState("");

  const handleChange = (e) => {
    setQuery(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // optional, prevents form submission if inside form
      if (onSearch) onSearch(query);
    }
  };

  const handleClear = () => {
    setQuery("");
    if (onSearch) onSearch("");
  };

  return (
    <TextField
      variant="outlined"
      placeholder={placeholder}
      value={query}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      fullWidth
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
        endAdornment: query && (
          <InputAdornment position="end">
            <IconButton onClick={handleClear}>
              <CloseIcon />
            </IconButton>
          </InputAdornment>
        ),
        sx: {
          width: "20vw",
          borderRadius: "12px",
          backgroundColor: "#f0f0f0"
        }
      }}
      sx={{
        "& .MuiOutlinedInput-root": {
          "& fieldset": { borderColor: "#ccc" },
          "&:hover fieldset": { borderColor: "#666" },
          "&.Mui-focused fieldset": { borderColor: "#1976d2" },
        },
        "& input::placeholder": {
          color: "#000",
          fontStyle: "italic"
        }
      }}
    />
  );
}

export default SearchBar;
