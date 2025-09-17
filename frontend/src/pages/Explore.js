import React, { useState } from 'react';
import {
  Container, Typography, Box, Grid, Card, CardContent,
  TextField, Button, Chip, Stack, Avatar, Rating,
  InputAdornment, FormControl, InputLabel, Select, MenuItem,
  Tabs, Tab, IconButton, Tooltip
} from '@mui/material';
import {
  Search, FilterList, LocationOn, Business, Star,
  Favorite, FavoriteBorder, Message, TrendingUp
} from '@mui/icons-material';

const Explore = () => {
  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [favorites, setFavorites] = useState(new Set());

  const featuredCompanies = [
    {
      id: 1,
      name: 'Gulf Trading LLC',
      category: 'Import/Export',
      location: 'Dubai, UAE',
      logo: 'GT',
      rating: 4.8,
      reviews: 124,
      description: 'Leading import/export company specializing in electronics and consumer goods.',
      verified: true,
      featured: true
    },
    {
      id: 2,
      name: 'Tech Solutions Inc',
      category: 'Technology',
      location: 'Abu Dhabi, UAE',
      logo: 'TS',
      rating: 4.9,
      reviews: 89,
      description: 'Innovative technology solutions and software development services.',
      verified: true,
      featured: true
    },
    {
      id: 3,
      name: 'Green Energy Ltd',
      category: 'Renewable Energy',
      location: 'Riyadh, Saudi Arabia',
      logo: 'GE',
      rating: 4.7,
      reviews: 156,
      description: 'Sustainable energy solutions and solar power installations.',
      verified: true,
      featured: true
    }
  ];

  const trendingRequirements = [
    {
      id: 1,
      title: 'Software Development Services',
      category: 'Technology',
      budget: '$50,000 - $100,000',
      location: 'Dubai, UAE',
      responses: 12,
      urgent: false
    },
    {
      id: 2,
      title: 'Industrial Equipment Supply',
      category: 'Manufacturing',
      budget: '$200,000 - $500,000',
      location: 'Sharjah, UAE',
      responses: 8,
      urgent: true
    },
    {
      id: 3,
      title: 'Digital Marketing Campaign',
      category: 'Marketing',
      budget: '$20,000 - $50,000',
      location: 'Abu Dhabi, UAE',
      responses: 15,
      urgent: false
    }
  ];

  const categories = ['All Categories', 'Technology', 'Manufacturing', 'Import/Export', 'Renewable Energy', 'Marketing'];

  const toggleFavorite = (id) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(id)) {
      newFavorites.delete(id);
    } else {
      newFavorites.add(id);
    }
    setFavorites(newFavorites);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" gutterBottom sx={{ fontWeight: 700, color: 'rgb(30, 86, 86)' }}>
          Explore Upflyover
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Discover verified companies and business opportunities worldwide
        </Typography>
      </Box>

      {/* Search Bar */}
      <Card elevation={2} sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search companies, requirements, or industries..."
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
              <InputLabel>Category</InputLabel>
              <Select
                value={categoryFilter}
                label="Category"
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <Button
              fullWidth
              variant="contained"
              startIcon={<Search />}
              sx={{
                bgcolor: 'rgb(30, 86, 86)',
                height: 56,
                '&:hover': { bgcolor: 'rgb(20, 66, 66)' }
              }}
            >
              Search
            </Button>
          </Grid>
        </Grid>
      </Card>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
        <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
          <Tab label="Featured Companies" />
          <Tab label="Trending Requirements" />
          <Tab label="Industries" />
        </Tabs>
      </Box>

      {/* Featured Companies Tab */}
      {tabValue === 0 && (
        <Box>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, color: 'rgb(30, 86, 86)', mb: 3 }}>
            Featured Companies
          </Typography>
          <Grid container spacing={3}>
            {featuredCompanies.map((company) => (
              <Grid item xs={12} md={4} key={company.id}>
                <Card 
                  elevation={2}
                  sx={{ 
                    height: '100%',
                    transition: 'transform 0.2s',
                    '&:hover': { transform: 'translateY(-4px)' }
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
                      <Avatar 
                        sx={{ 
                          bgcolor: 'rgb(30, 86, 86)',
                          width: 56,
                          height: 56,
                          fontSize: '1.5rem'
                        }}
                      >
                        {company.logo}
                      </Avatar>
                      <IconButton 
                        onClick={() => toggleFavorite(company.id)}
                        color={favorites.has(company.id) ? 'error' : 'default'}
                      >
                        {favorites.has(company.id) ? <Favorite /> : <FavoriteBorder />}
                      </IconButton>
                    </Stack>
                    
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                      {company.name}
                    </Typography>
                    
                    <Chip 
                      label={company.category} 
                      size="small" 
                      color="primary" 
                      variant="outlined"
                      sx={{ mb: 2 }}
                    />
                    
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                      <LocationOn fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        {company.location}
                      </Typography>
                    </Stack>
                    
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                      <Rating value={company.rating} precision={0.1} size="small" readOnly />
                      <Typography variant="body2" color="text.secondary">
                        ({company.reviews})
                      </Typography>
                    </Stack>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                      {company.description}
                    </Typography>
                    
                    <Stack direction="row" spacing={1}>
                      <Button 
                        variant="contained" 
                        size="small" 
                        startIcon={<Message />}
                        sx={{ 
                          flex: 1,
                          bgcolor: 'rgb(30, 86, 86)',
                          '&:hover': { bgcolor: 'rgb(20, 66, 66)' }
                        }}
                      >
                        Connect
                      </Button>
                      <Button variant="outlined" size="small" sx={{ flex: 1 }}>
                        View Profile
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Trending Requirements Tab */}
      {tabValue === 1 && (
        <Box>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, color: 'rgb(30, 86, 86)', mb: 3 }}>
            Trending Requirements
          </Typography>
          <Grid container spacing={3}>
            {trendingRequirements.map((requirement) => (
              <Grid item xs={12} key={requirement.id}>
                <Card 
                  elevation={2}
                  sx={{
                    transition: 'transform 0.2s',
                    '&:hover': { transform: 'translateY(-2px)' },
                    border: requirement.urgent ? '2px solid #ff9800' : 'none'
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={8}>
                        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                          <Typography variant="h6" fontWeight="bold">
                            {requirement.title}
                          </Typography>
                          {requirement.urgent && (
                            <Chip label="Urgent" color="warning" size="small" />
                          )}
                        </Stack>
                        <Chip 
                          label={requirement.category} 
                          size="small" 
                          variant="outlined"
                          sx={{ mb: 2 }}
                        />
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <LocationOn fontSize="small" color="action" />
                          <Typography variant="body2" color="text.secondary">
                            {requirement.location}
                          </Typography>
                        </Stack>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Box sx={{ textAlign: 'right' }}>
                          <Typography variant="h6" color="success.main" fontWeight="bold">
                            {requirement.budget}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            {requirement.responses} responses
                          </Typography>
                          <Button
                            variant="contained"
                            size="small"
                            sx={{
                              bgcolor: 'rgb(30, 86, 86)',
                              '&:hover': { bgcolor: 'rgb(20, 66, 66)' }
                            }}
                          >
                            View Details
                          </Button>
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Industries Tab */}
      {tabValue === 2 && (
        <Box>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, color: 'rgb(30, 86, 86)', mb: 3 }}>
            Explore by Industry
          </Typography>
          <Grid container spacing={3}>
            {[
              { icon: '🏭', title: 'Manufacturing', companies: '2,500+', color: '#1976d2' },
              { icon: '💻', title: 'Technology', companies: '1,800+', color: '#388e3c' },
              { icon: '🏗️', title: 'Construction', companies: '1,200+', color: '#f57c00' },
              { icon: '🌱', title: 'Agriculture', companies: '900+', color: '#689f38' },
              { icon: '⚡', title: 'Energy', companies: '750+', color: '#fbc02d' },
              { icon: '🚚', title: 'Logistics', companies: '650+', color: '#7b1fa2' }
            ].map((industry, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card 
                  sx={{ 
                    p: 3, 
                    textAlign: 'center', 
                    height: '100%',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    '&:hover': { 
                      transform: 'translateY(-8px)',
                      boxShadow: 4
                    }
                  }}
                >
                  <Typography variant="h2" sx={{ mb: 2 }}>{industry.icon}</Typography>
                  <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: industry.color }}>
                    {industry.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                    {industry.companies} companies
                  </Typography>
                  <Button 
                    variant="outlined" 
                    size="small"
                    sx={{ 
                      borderColor: industry.color,
                      color: industry.color,
                      '&:hover': { 
                        borderColor: industry.color,
                        bgcolor: `${industry.color}10`
                      }
                    }}
                  >
                    Explore
                  </Button>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Container>
  );
};

export default Explore;