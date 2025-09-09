import React, { useState } from 'react';
import {
  Container, Typography, Grid, Card, CardContent, Box,
  Button, Chip, Stack, Avatar, IconButton, Tabs, Tab,
  TextField, Dialog, DialogTitle, DialogContent, DialogActions,
  FormControl, InputLabel, Select, MenuItem, Divider,
  List, ListItem, ListItemAvatar, ListItemText
} from '@mui/material';
import {
  Add, Schedule, LocationOn, Business, AttachMoney,
  Visibility, Message, Bookmark, BookmarkBorder,
  FilterList, Search, TrendingUp
} from '@mui/icons-material';

const Requirements = () => {
  const [tabValue, setTabValue] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [bookmarked, setBookmarked] = useState(new Set());
  const [newRequirement, setNewRequirement] = useState({
    title: '',
    category: '',
    budget: '',
    location: '',
    description: '',
    deadline: ''
  });

  // Mock requirements data
  const requirements = [
    {
      id: 1,
      title: 'Software Development Services',
      category: 'Technology',
      company: 'Gulf Trading LLC',
      companyLogo: 'GT',
      budget: '$50,000 - $100,000',
      location: 'Dubai, UAE',
      deadline: '30 days',
      description: 'Looking for experienced software development team to build a comprehensive inventory management system.',
      postedDate: '2 days ago',
      responses: 12,
      views: 156,
      tags: ['Software Development', 'Inventory Management', 'Web Application'],
      urgent: false
    },
    {
      id: 2,
      title: 'Industrial Equipment Supply',
      category: 'Manufacturing',
      company: 'Emirates Manufacturing',
      companyLogo: 'EM',
      budget: '$200,000 - $500,000',
      location: 'Sharjah, UAE',
      deadline: '45 days',
      description: 'Seeking reliable suppliers for high-quality industrial machinery and equipment for our new production line.',
      postedDate: '1 day ago',
      responses: 8,
      views: 89,
      tags: ['Industrial Equipment', 'Manufacturing', 'Machinery'],
      urgent: true
    },
    {
      id: 3,
      title: 'Digital Marketing Campaign',
      category: 'Marketing',
      company: 'Tech Solutions Inc',
      companyLogo: 'TS',
      budget: '$20,000 - $50,000',
      location: 'Abu Dhabi, UAE',
      deadline: '21 days',
      description: 'Need a comprehensive digital marketing strategy and execution for our new product launch in the GCC market.',
      postedDate: '3 days ago',
      responses: 15,
      views: 234,
      tags: ['Digital Marketing', 'Product Launch', 'GCC Market'],
      urgent: false
    },
    {
      id: 4,
      title: 'Solar Panel Installation',
      category: 'Renewable Energy',
      company: 'Green Energy Solutions',
      companyLogo: 'GE',
      budget: '$100,000 - $300,000',
      location: 'Riyadh, Saudi Arabia',
      deadline: '60 days',
      description: 'Large-scale solar panel installation project for commercial building. Looking for certified installers.',
      postedDate: '5 days ago',
      responses: 6,
      views: 78,
      tags: ['Solar Energy', 'Installation', 'Commercial'],
      urgent: false
    }
  ];

  const myRequirements = [
    {
      id: 101,
      title: 'Office Furniture Supply',
      category: 'Furniture',
      budget: '$15,000 - $25,000',
      status: 'Active',
      responses: 7,
      views: 45,
      postedDate: '1 week ago'
    },
    {
      id: 102,
      title: 'IT Support Services',
      category: 'Technology',
      budget: '$5,000 - $10,000',
      status: 'Closed',
      responses: 12,
      views: 89,
      postedDate: '2 weeks ago'
    }
  ];

  const categories = ['All Categories', 'Technology', 'Manufacturing', 'Marketing', 'Renewable Energy', 'Construction', 'Furniture'];

  const toggleBookmark = (requirementId) => {
    const newBookmarked = new Set(bookmarked);
    if (newBookmarked.has(requirementId)) {
      newBookmarked.delete(requirementId);
    } else {
      newBookmarked.add(requirementId);
    }
    setBookmarked(newBookmarked);
  };

  const handleSubmitRequirement = () => {
    // Handle requirement submission
    console.log('New requirement:', newRequirement);
    setOpenDialog(false);
    setNewRequirement({
      title: '',
      category: '',
      budget: '',
      location: '',
      description: '',
      deadline: ''
    });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h3" gutterBottom>
              Business Requirements
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Post your requirements or browse opportunities from verified companies on Upflyover
            </Typography>
          </Box>
          <Button 
            variant="contained" 
            startIcon={<Add />}
            size="large"
            onClick={() => setOpenDialog(true)}
          >
            Post Requirement
          </Button>
        </Stack>
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
          <Tab label="Browse Requirements" />
          <Tab label="My Requirements" />
          <Tab label="Saved" />
        </Tabs>
      </Box>

      {/* Browse Requirements Tab */}
      {tabValue === 0 && (
        <Box>
          {/* Filters */}
          <Card elevation={2} sx={{ p: 3, mb: 4 }}>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  placeholder="Search requirements..."
                  InputProps={{
                    startAdornment: <Search sx={{ mr: 1, color: 'action.active' }} />
                  }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select label="Category">
                    {categories.map((category) => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Budget Range</InputLabel>
                  <Select label="Budget Range">
                    <MenuItem value="all">All Budgets</MenuItem>
                    <MenuItem value="0-10k">$0 - $10,000</MenuItem>
                    <MenuItem value="10k-50k">$10,000 - $50,000</MenuItem>
                    <MenuItem value="50k-100k">$50,000 - $100,000</MenuItem>
                    <MenuItem value="100k+">$100,000+</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={2}>
                <Button fullWidth variant="outlined" startIcon={<FilterList />}>
                  More Filters
                </Button>
              </Grid>
            </Grid>
          </Card>

          {/* Requirements List */}
          <Grid container spacing={3}>
            {requirements.map((requirement) => (
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
                        <Stack direction="row" alignItems="flex-start" spacing={2}>
                          <Avatar sx={{ bgcolor: 'primary.main' }}>
                            {requirement.companyLogo}
                          </Avatar>
                          <Box sx={{ flex: 1 }}>
                            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                              <Typography variant="h6" fontWeight="bold">
                                {requirement.title}
                              </Typography>
                              {requirement.urgent && (
                                <Chip label="Urgent" color="warning" size="small" />
                              )}
                            </Stack>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                              by {requirement.company}
                            </Typography>
                            <Typography variant="body2" sx={{ mb: 2 }}>
                              {requirement.description}
                            </Typography>
                            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                              {requirement.tags.map((tag, index) => (
                                <Chip key={index} label={tag} size="small" variant="outlined" />
                              ))}
                            </Stack>
                          </Box>
                        </Stack>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Box sx={{ textAlign: 'right' }}>
                          <Typography variant="h6" color="success.main" fontWeight="bold">
                            {requirement.budget}
                          </Typography>
                          <Stack direction="row" alignItems="center" justifyContent="flex-end" spacing={1} sx={{ mt: 1 }}>
                            <LocationOn fontSize="small" color="action" />
                            <Typography variant="body2" color="text.secondary">
                              {requirement.location}
                            </Typography>
                          </Stack>
                          <Stack direction="row" alignItems="center" justifyContent="flex-end" spacing={1} sx={{ mt: 1 }}>
                            <Schedule fontSize="small" color="action" />
                            <Typography variant="body2" color="text.secondary">
                              Deadline: {requirement.deadline}
                            </Typography>
                          </Stack>
                          <Divider sx={{ my: 2 }} />
                          <Stack direction="row" justifyContent="space-between" sx={{ mb: 2 }}>
                            <Stack alignItems="center">
                              <Typography variant="h6">{requirement.responses}</Typography>
                              <Typography variant="caption">Responses</Typography>
                            </Stack>
                            <Stack alignItems="center">
                              <Typography variant="h6">{requirement.views}</Typography>
                              <Typography variant="caption">Views</Typography>
                            </Stack>
                          </Stack>
                          <Stack direction="row" spacing={1}>
                            <Button variant="contained" size="small" startIcon={<Message />}>
                              Respond
                            </Button>
                            <IconButton 
                              onClick={() => toggleBookmark(requirement.id)}
                              color={bookmarked.has(requirement.id) ? 'primary' : 'default'}
                            >
                              {bookmarked.has(requirement.id) ? <Bookmark /> : <BookmarkBorder />}
                            </IconButton>
                          </Stack>
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

      {/* My Requirements Tab */}
      {tabValue === 1 && (
        <Box>
          <Grid container spacing={3}>
            {myRequirements.map((requirement) => (
              <Grid item xs={12} md={6} key={requirement.id}>
                <Card elevation={2}>
                  <CardContent>
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
                      <Typography variant="h6" fontWeight="bold">
                        {requirement.title}
                      </Typography>
                      <Chip 
                        label={requirement.status} 
                        color={requirement.status === 'Active' ? 'success' : 'default'}
                        size="small"
                      />
                    </Stack>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Category: {requirement.category}
                    </Typography>
                    <Typography variant="body1" color="success.main" fontWeight="bold" sx={{ mb: 2 }}>
                      {requirement.budget}
                    </Typography>
                    <Stack direction="row" justifyContent="space-between" sx={{ mb: 2 }}>
                      <Stack alignItems="center">
                        <Typography variant="h6">{requirement.responses}</Typography>
                        <Typography variant="caption">Responses</Typography>
                      </Stack>
                      <Stack alignItems="center">
                        <Typography variant="h6">{requirement.views}</Typography>
                        <Typography variant="caption">Views</Typography>
                      </Stack>
                    </Stack>
                    <Typography variant="caption" color="text.secondary">
                      Posted {requirement.postedDate}
                    </Typography>
                    <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                      <Button variant="outlined" size="small" fullWidth>
                        View Details
                      </Button>
                      <Button variant="contained" size="small" fullWidth>
                        Manage
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Saved Requirements Tab */}
      {tabValue === 2 && (
        <Box>
          <Typography variant="h6" color="text.secondary" textAlign="center" sx={{ py: 8 }}>
            No saved requirements yet. Start browsing to save interesting opportunities!
          </Typography>
        </Box>
      )}

      {/* Post Requirement Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Post New Requirement</DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Requirement Title"
                value={newRequirement.title}
                onChange={(e) => setNewRequirement({...newRequirement, title: e.target.value})}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={newRequirement.category}
                  label="Category"
                  onChange={(e) => setNewRequirement({...newRequirement, category: e.target.value})}
                >
                  {categories.slice(1).map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Budget Range"
                value={newRequirement.budget}
                onChange={(e) => setNewRequirement({...newRequirement, budget: e.target.value})}
                placeholder="e.g., $10,000 - $50,000"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Location"
                value={newRequirement.location}
                onChange={(e) => setNewRequirement({...newRequirement, location: e.target.value})}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Deadline"
                value={newRequirement.deadline}
                onChange={(e) => setNewRequirement({...newRequirement, deadline: e.target.value})}
                placeholder="e.g., 30 days"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Description"
                value={newRequirement.description}
                onChange={(e) => setNewRequirement({...newRequirement, description: e.target.value})}
                placeholder="Describe your requirement in detail..."
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSubmitRequirement} variant="contained">
            Post Requirement
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Requirements;