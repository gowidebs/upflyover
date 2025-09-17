import React, { useState, useEffect } from 'react';
import {
  Box, Card, CardContent, Typography, Button, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, FormControl, InputLabel, Select, MenuItem, Chip,
  Switch, FormControlLabel, Grid, List, ListItem, ListItemText, IconButton,
  Divider, Paper, Stack
} from '@mui/material';
import {
  Save, Delete, Search, LocationOn, Sort, TrendingUp, History,
  Bookmark, Notifications
} from '@mui/icons-material';
import api from '../utils/api';
import SearchBar from './SearchBar';

const AdvancedSearch = ({ onSearch, initialFilters = {} }) => {
  const [filters, setFilters] = useState({
    query: '',
    type: 'all',
    sortBy: 'relevance',
    location: '',
    radius: '50',
    ...initialFilters
  });
  
  const [saveDialog, setSaveDialog] = useState(false);
  const [savedSearches, setSavedSearches] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [searchAnalytics, setSearchAnalytics] = useState(null);
  const [saveForm, setSaveForm] = useState({ name: '', alertEnabled: false });

  useEffect(() => {
    loadSavedSearches();
    loadRecommendations();
    loadSearchAnalytics();
  }, []);

  const loadSavedSearches = async () => {
    try {
      const response = await api.get('/search/saved');
      setSavedSearches(response.data.savedSearches || []);
    } catch (error) {
      console.error('Failed to load saved searches:', error);
    }
  };

  const loadRecommendations = async () => {
    try {
      const response = await api.get('/search/recommendations');
      setRecommendations(response.data.recommendations || []);
    } catch (error) {
      console.error('Failed to load recommendations:', error);
    }
  };

  const loadSearchAnalytics = async () => {
    try {
      const response = await api.get('/search/analytics');
      setSearchAnalytics(response.data);
    } catch (error) {
      console.error('Failed to load search analytics:', error);
    }
  };

  const handleSearch = () => {
    const searchParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) searchParams.append(key, value);
    });
    
    if (onSearch) {
      onSearch(filters);
    }
  };

  const handleSaveSearch = async () => {
    try {
      await api.post('/search/save', {
        name: saveForm.name,
        query: filters.query,
        filters,
        alertEnabled: saveForm.alertEnabled
      });
      
      setSaveDialog(false);
      setSaveForm({ name: '', alertEnabled: false });
      loadSavedSearches();
    } catch (error) {
      console.error('Failed to save search:', error);
    }
  };

  const handleLoadSavedSearch = (savedSearch) => {
    setFilters({ ...savedSearch.filters, query: savedSearch.query });
    handleSearch();
  };

  const handleDeleteSavedSearch = async (searchId) => {
    try {
      await api.delete(`/search/saved/${searchId}`);
      loadSavedSearches();
    } catch (error) {
      console.error('Failed to delete saved search:', error);
    }
  };

  const sortOptions = [
    { value: 'relevance', label: 'Relevance' },
    { value: 'date', label: 'Date' },
    { value: 'rating', label: 'Rating' },
    { value: 'name', label: 'Name' },
    { value: 'budget', label: 'Budget' }
  ];

  return (
    <Box>
      {/* Main Search Interface */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <SearchBar
                placeholder="Search companies and requirements..."
                onSearch={(query) => setFilters(prev => ({ ...prev, query }))}
                value={filters.query}
              />
            </Grid>
            
            <Grid item xs={12} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Type</InputLabel>
                <Select
                  value={filters.type}
                  onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                >
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="companies">Companies</MenuItem>
                  <MenuItem value="requirements">Requirements</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Sort By</InputLabel>
                <Select
                  value={filters.sortBy}
                  onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
                >
                  {sortOptions.map(option => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={2}>
              <TextField
                fullWidth
                size="small"
                label="Location"
                value={filters.location}
                onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                InputProps={{
                  startAdornment: <LocationOn fontSize="small" sx={{ mr: 1 }} />
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={2}>
              <Stack direction="row" spacing={1}>
                <Button
                  variant="contained"
                  startIcon={<Search />}
                  onClick={handleSearch}
                  fullWidth
                >
                  Search
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Save />}
                  onClick={() => setSaveDialog(true)}
                  disabled={!filters.query}
                >
                  Save
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        {/* Saved Searches */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              <Bookmark sx={{ mr: 1, verticalAlign: 'middle' }} />
              Saved Searches
            </Typography>
            <List dense>
              {savedSearches.map((search) => (
                <ListItem key={search.id}>
                  <ListItemText
                    primary={search.name}
                    secondary={`"${search.query}" • ${new Date(search.createdAt).toLocaleDateString()}`}
                    onClick={() => handleLoadSavedSearch(search)}
                    sx={{ cursor: 'pointer' }}
                  />
                  <IconButton size="small" onClick={() => handleDeleteSavedSearch(search.id)}>
                    <Delete />
                  </IconButton>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Recommendations */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              <TrendingUp sx={{ mr: 1, verticalAlign: 'middle' }} />
              Recommendations
            </Typography>
            <List dense>
              {recommendations.slice(0, 5).map((item, index) => (
                <ListItem key={index} button>
                  <ListItemText
                    primary={item.name || item.title}
                    secondary={item.industry || item.category}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Search Analytics */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              <History sx={{ mr: 1, verticalAlign: 'middle' }} />
              Search History
            </Typography>
            {searchAnalytics && (
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Total searches: {searchAnalytics.totalSearches}
                </Typography>
                <Typography variant="subtitle2" gutterBottom>Top Queries:</Typography>
                <Stack spacing={1}>
                  {searchAnalytics.topQueries?.slice(0, 5).map((query, index) => (
                    <Chip
                      key={index}
                      label={`${query.query} (${query.count})`}
                      size="small"
                      onClick={() => setFilters(prev => ({ ...prev, query: query.query }))}
                    />
                  ))}
                </Stack>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Save Search Dialog */}
      <Dialog open={saveDialog} onClose={() => setSaveDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Save Search</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Search Name"
                value={saveForm.name}
                onChange={(e) => setSaveForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Web Development Companies in Dubai"
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary">
                Query: "{filters.query}"
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={saveForm.alertEnabled}
                    onChange={(e) => setSaveForm(prev => ({ ...prev, alertEnabled: e.target.checked }))}
                  />
                }
                label="Enable alerts for new matches"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSaveDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveSearch} variant="contained" disabled={!saveForm.name}>
            Save Search
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdvancedSearch;