import React, { useState, useEffect, useRef } from 'react';
import {
  TextField,
  InputAdornment,
  Paper,
  List,
  ListItem,
  ListItemText,
  Box,
  Typography,
  Chip,
  CircularProgress
} from '@mui/material';
import { Search, TrendingUp } from '@mui/icons-material';
import axios from 'axios';

const SearchBar = ({ 
  placeholder = "Search companies and requirements...",
  onSearch,
  onSuggestionClick,
  fullWidth = true,
  variant = "outlined"
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const searchRef = useRef(null);
  const suggestionsRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchRef.current && 
        !searchRef.current.contains(event.target) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (query.length >= 2) {
        fetchSuggestions(query);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(delayedSearch);
  }, [query]);

  const fetchSuggestions = async (searchTerm) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/search/suggestions?q=${encodeURIComponent(searchTerm)}`
      );
      setSuggestions(response.data.suggestions);
      setShowSuggestions(response.data.suggestions.length > 0);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    
    if (onSearch) {
      onSearch(value);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    
    if (onSuggestionClick) {
      onSuggestionClick(suggestion);
    } else if (onSearch) {
      onSearch(suggestion);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      setShowSuggestions(false);
      if (onSearch) {
        onSearch(query);
      }
    }
  };

  return (
    <Box sx={{ position: 'relative' }} ref={searchRef}>
      <TextField
        fullWidth={fullWidth}
        variant={variant}
        placeholder={placeholder}
        value={query}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={() => {
          if (suggestions.length > 0) {
            setShowSuggestions(true);
          }
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              {loading ? (
                <CircularProgress size={20} />
              ) : (
                <Search />
              )}
            </InputAdornment>
          )
        }}
      />
      
      {showSuggestions && suggestions.length > 0 && (
        <Paper
          ref={suggestionsRef}
          elevation={8}
          sx={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            zIndex: 1300,
            maxHeight: 300,
            overflow: 'auto',
            mt: 1
          }}
        >
          <Box sx={{ p: 1 }}>
            <Typography variant="caption" color="text.secondary" sx={{ px: 2, py: 1 }}>
              <TrendingUp fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }} />
              Suggestions
            </Typography>
          </Box>
          <List dense>
            {suggestions.map((suggestion, index) => (
              <ListItem
                key={index}
                button
                onClick={() => handleSuggestionClick(suggestion)}
                sx={{
                  '&:hover': {
                    backgroundColor: 'action.hover'
                  }
                }}
              >
                <ListItemText
                  primary={suggestion}
                  primaryTypographyProps={{
                    variant: 'body2'
                  }}
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
    </Box>
  );
};

export default SearchBar;