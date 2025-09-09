import React, { useState } from 'react';
import {
  Container, Typography, Grid, Card, CardContent, Avatar,
  Chip, Button, TextField, Box, InputAdornment, Select,
  MenuItem, FormControl, InputLabel, Stack, Rating,
  IconButton, Tooltip, Paper
} from '@mui/material';
import {
  Search, FilterList, LocationOn, Business,
  Language, Verified, Star, Message, Favorite,
  FavoriteBorder, Share
} from '@mui/icons-material';

const Companies = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [industryFilter, setIndustryFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [favorites, setFavorites] = useState(new Set());

  // Mock company data
  const companies = [
    {
      id: 1,
      name: 'Gulf Trading LLC',
      industry: 'Import/Export',
      location: 'Dubai, UAE',
      logo: 'GT',
      verified: true,
      rating: 4.8,
      reviews: 124,
      description: 'Leading import/export company specializing in electronics and consumer goods across the GCC region.',
      employees: '50-200',
      founded: 2015,
      specialties: ['Electronics', 'Consumer Goods', 'Logistics']
    },
    {
      id: 2,
      name: 'Tech Solutions Inc',
      industry: 'Technology',
      location: 'Abu Dhabi, UAE',
      logo: 'TS',
      verified: true,
      rating: 4.9,
      reviews: 89,
      description: 'Innovative technology solutions provider offering software development and IT consulting services.',
      employees: '200-500',
      founded: 2012,
      specialties: ['Software Development', 'IT Consulting', 'Cloud Services']
    },
    {
      id: 3,
      name: 'Emirates Manufacturing',
      industry: 'Manufacturing',
      location: 'Sharjah, UAE',
      logo: 'EM',
      verified: true,
      rating: 4.7,
      reviews: 156,
      description: 'Premium manufacturing company producing high-quality industrial components and machinery.',
      employees: '500+',
      founded: 2008,
      specialties: ['Industrial Components', 'Machinery', 'Quality Control']
    },
    {
      id: 4,
      name: 'Green Energy Solutions',
      industry: 'Renewable Energy',
      location: 'Riyadh, Saudi Arabia',
      logo: 'GE',
      verified: true,
      rating: 4.6,
      reviews: 78,
      description: 'Sustainable energy solutions provider focusing on solar and wind power installations.',
      employees: '100-200',
      founded: 2018,
      specialties: ['Solar Power', 'Wind Energy', 'Sustainability']
    },
    {
      id: 5,
      name: 'Digital Marketing Hub',
      industry: 'Marketing',
      location: 'Kuwait City, Kuwait',
      logo: 'DM',
      verified: false,
      rating: 4.4,
      reviews: 45,
      description: 'Full-service digital marketing agency helping businesses grow their online presence.',
      employees: '20-50',
      founded: 2020,
      specialties: ['Digital Marketing', 'SEO', 'Social Media']
    },
    {
      id: 6,
      name: 'Construction Masters',
      industry: 'Construction',
      location: 'Doha, Qatar',
      logo: 'CM',
      verified: true,
      rating: 4.5,
      reviews: 203,
      description: 'Premier construction company delivering world-class infrastructure and building projects.',
      employees: '1000+',
      founded: 2005,
      specialties: ['Infrastructure', 'Commercial Buildings', 'Project Management']
    }
  ];

  const industries = ['All Industries', 'Technology', 'Manufacturing', 'Import/Export', 'Renewable Energy', 'Marketing', 'Construction'];
  const locations = ['All Locations', 'Dubai, UAE', 'Abu Dhabi, UAE', 'Sharjah, UAE', 'Riyadh, Saudi Arabia', 'Kuwait City, Kuwait', 'Doha, Qatar'];

  const toggleFavorite = (companyId) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(companyId)) {
      newFavorites.delete(companyId);
    } else {
      newFavorites.add(companyId);
    }
    setFavorites(newFavorites);
  };

  const filteredCompanies = companies.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesIndustry = !industryFilter || industryFilter === 'All Industries' || company.industry === industryFilter;
    const matchesLocation = !locationFilter || locationFilter === 'All Locations' || company.location === locationFilter;
    return matchesSearch && matchesIndustry && matchesLocation;
  });

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
            <FormControl fullWidth>
              <InputLabel>Location</InputLabel>
              <Select
                value={locationFilter}
                label="Location"
                onChange={(e) => setLocationFilter(e.target.value)}
              >
                {locations.map((location) => (
                  <MenuItem key={location} value={location}>
                    {location}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<FilterList />}
              sx={{ height: 56 }}
            >
              More Filters
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Results Count */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="body1" color="text.secondary">
          Showing {filteredCompanies.length} companies
        </Typography>
      </Box>

      {/* Company Cards */}
      <Grid container spacing={3}>
        {filteredCompanies.map((company) => (
          <Grid item xs={12} md={6} lg={4} key={company.id}>
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
                        {company.location}
                      </Typography>
                    </Stack>
                  </Box>
                  <IconButton 
                    onClick={() => toggleFavorite(company.id)}
                    color={favorites.has(company.id) ? 'error' : 'default'}
                  >
                    {favorites.has(company.id) ? <Favorite /> : <FavoriteBorder />}
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
                  {company.description}
                </Typography>

                {/* Company Details */}
                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    Employees: {company.employees} • Founded: {company.founded}
                  </Typography>
                </Box>

                {/* Specialties */}
                <Stack direction="row" spacing={1} sx={{ mb: 3, flexWrap: 'wrap', gap: 1 }}>
                  {company.specialties.slice(0, 2).map((specialty, index) => (
                    <Chip 
                      key={index}
                      label={specialty} 
                      size="small" 
                      variant="outlined"
                      sx={{ fontSize: '0.7rem' }}
                    />
                  ))}
                  {company.specialties.length > 2 && (
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
                    sx={{ flex: 1 }}
                  >
                    Connect
                  </Button>
                  <Button 
                    variant="outlined" 
                    size="small"
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
        ))}
      </Grid>

      {/* Load More */}
      {filteredCompanies.length > 0 && (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Button variant="outlined" size="large">
            Load More Companies
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default Companies;