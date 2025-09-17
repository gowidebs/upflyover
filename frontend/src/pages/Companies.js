import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Grid, Card, CardContent, Avatar,
  Chip, Button, TextField, Box, InputAdornment, Select,
  MenuItem, FormControl, InputLabel, Stack, Rating,
  IconButton, Tooltip, Paper, CircularProgress, Alert
} from '@mui/material';
import {
  Search, FilterList, LocationOn, Business,
  Language, Verified, Star, Message, Favorite,
  FavoriteBorder, Share
} from '@mui/icons-material';
import MessagingSystem from '../components/MessagingSystem';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Companies = () => {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [industries, setIndustries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [industryFilter, setIndustryFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [favorites, setFavorites] = useState(new Set());
  const [messagingOpen, setMessagingOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });

  useEffect(() => {
    loadCompanies();
    loadIndustries();
  }, []);
  
  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      loadCompanies();
    }, 500);
    
    return () => clearTimeout(delayedSearch);
  }, [searchTerm, industryFilter, locationFilter]);
  
  const loadCompanies = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (industryFilter && industryFilter !== 'All Industries') params.append('industry', industryFilter);
      if (locationFilter) params.append('location', locationFilter);
      params.append('page', pagination.page);
      
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/companies?${params}`);
      setCompanies(response.data.companies);
      setPagination({
        page: response.data.page,
        totalPages: response.data.totalPages,
        total: response.data.total
      });
      setError('');
    } catch (error) {
      console.error('Error loading companies:', error);
      setError('Failed to load companies');
    } finally {
      setLoading(false);
    }
  };
  
  const loadIndustries = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/companies/filters/industries`);
      setIndustries(['All Industries', ...response.data.industries]);
    } catch (error) {
      console.error('Error loading industries:', error);
    }
  };

  const toggleFavorite = (companyId) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(companyId)) {
      newFavorites.delete(companyId);
    } else {
      newFavorites.add(companyId);
    }
    setFavorites(newFavorites);
  };
  
  const handleConnect = (company) => {
    setSelectedCompany(company);
    setMessagingOpen(true);
  };

  const loadMoreCompanies = async () => {
    if (pagination.page < pagination.totalPages) {
      try {
        const params = new URLSearchParams();
        if (searchTerm) params.append('search', searchTerm);
        if (industryFilter && industryFilter !== 'All Industries') params.append('industry', industryFilter);
        if (locationFilter) params.append('location', locationFilter);
        params.append('page', pagination.page + 1);
        
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/companies?${params}`);
        setCompanies(prev => [...prev, ...response.data.companies]);
        setPagination({
          page: response.data.page,
          totalPages: response.data.totalPages,
          total: response.data.total
        });
      } catch (error) {
        console.error('Error loading more companies:', error);
      }
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" gutterBottom>
          Company Directory
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Discover and connect with verified companies worldwide
        </Typography>
      </Box>

      {/* Search and Filters */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Search companies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                )
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Industry</InputLabel>
              <Select
                value={industryFilter}
                label="Industry"
                onChange={(e) => setIndustryFilter(e.target.value)}
              >
                {industries.map((industry) => (
                  <MenuItem key={industry} value={industry}>
                    {industry}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Location"
              placeholder="Enter location..."
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<FilterList />}
              onClick={() => {
                setSearchTerm('');
                setIndustryFilter('');
                setLocationFilter('');
              }}
              sx={{ height: 56 }}
            >
              Clear Filters
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Results Count */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="body1" color="text.secondary">
          {loading ? 'Loading...' : `Showing ${companies.length} of ${pagination.total} companies`}
        </Typography>
      </Box>
      
      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Loading State */}
      {loading && companies.length === 0 ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* Company Cards */}
          <Grid container spacing={3}>
            {companies.length === 0 && !loading ? (
              <Grid item xs={12}>
                <Alert severity="info">
                  No companies found. Try adjusting your search filters.
                </Alert>
              </Grid>
            ) : (
              companies.map((company) => (
                <Grid item xs={12} md={6} lg={4} key={company.id || company._id}>
                  <Card 
                    elevation={2}
                    sx={{ 
                      height: '100%',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      '&:hover': { 
                        transform: 'translateY(-4px)',
                        boxShadow: 4
                      }
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      {/* Company Header */}
                      <Stack direction="row" spacing={2} alignItems="flex-start" sx={{ mb: 2 }}>
                        <Avatar 
                          sx={{ 
                            bgcolor: 'primary.main',
                            width: 56,
                            height: 56,
                            fontSize: '1.5rem'
                          }}
                        >
                          {company.logo}
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                              {company.name}
                            </Typography>
                            {company.verified && (
                              <Tooltip title="Verified Company">
                                <Verified color="success" fontSize="small" />
                              </Tooltip>
                            )}
                          </Stack>
                          <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 0.5 }}>
                            <LocationOn fontSize="small" color="action" />
                            <Typography variant="body2" color="text.secondary">
                              {company.country || company.location || 'Location not specified'}
                            </Typography>
                          </Stack>
                        </Box>
                        <IconButton 
                          onClick={() => toggleFavorite(company.id || company._id)}
                          color={favorites.has(company.id || company._id) ? 'error' : 'default'}
                        >
                          {favorites.has(company.id || company._id) ? <Favorite /> : <FavoriteBorder />}
                        </IconButton>
                      </Stack>

                {/* Industry & Rating */}
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                  <Chip 
                    label={company.industry} 
                    size="small" 
                    color="primary" 
                    variant="outlined"
                  />
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    <Rating value={company.rating} precision={0.1} size="small" readOnly />
                    <Typography variant="body2" color="text.secondary">
                      ({company.reviews})
                    </Typography>
                  </Stack>
                </Stack>

                      {/* Description */}
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {company.description || 'No description available'}
                      </Typography>

                      {/* Company Details */}
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="caption" color="text.secondary">
                          Employees: {company.employees} • Founded: {company.founded}
                        </Typography>
                      </Box>

                      {/* Specialties */}
                      <Stack direction="row" spacing={1} sx={{ mb: 3, flexWrap: 'wrap', gap: 1 }}>
                        {company.specialties?.slice(0, 2).map((specialty, index) => (
                          <Chip 
                            key={index}
                            label={specialty} 
                            size="small" 
                            variant="outlined"
                            sx={{ fontSize: '0.7rem' }}
                          />
                        ))}
                        {company.specialties?.length > 2 && (
                          <Chip 
                            label={`+${company.specialties.length - 2} more`}
                            size="small" 
                            variant="outlined"
                            sx={{ fontSize: '0.7rem' }}
                          />
                        )}
                      </Stack>

                      {/* Action Buttons */}
                      <Stack direction="row" spacing={1}>
                        <Button 
                          variant="contained" 
                          size="small" 
                          startIcon={<Message />}
                          onClick={() => handleConnect(company)}
                          sx={{ flex: 1 }}
                        >
                          Connect
                        </Button>
                        <Button 
                          variant="outlined" 
                          size="small"
                          onClick={() => navigate(`/companies/${company.id || company._id}`)}
                          sx={{ flex: 1 }}
                        >
                          View Profile
                        </Button>
                        <IconButton size="small">
                          <Share fontSize="small" />
                        </IconButton>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            )}
          </Grid>
        </>
      )}

      {/* Load More */}
      {pagination.page < pagination.totalPages && (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Button 
            variant="outlined" 
            size="large"
            onClick={loadMoreCompanies}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Load More Companies'}
          </Button>
        </Box>
      )}
      
      {/* Messaging System */}
      <MessagingSystem
        open={messagingOpen}
        onClose={() => setMessagingOpen(false)}
        recipientId={selectedCompany?.id}
        recipientName={selectedCompany?.name}
      />
    </Container>
  );
};

export default Companies;