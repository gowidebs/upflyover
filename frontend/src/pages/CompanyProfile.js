import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Grid, Card, CardContent, Box,
  TextField, Button, Chip, Stack, Avatar, Divider,
  IconButton, Dialog, DialogTitle, DialogContent, DialogActions,
  List, ListItem, ListItemText, ListItemSecondaryAction,
  Fab, Alert, Paper, CardMedia
} from '@mui/material';
import {
  Edit, Add, Delete, Business, Language, Phone,
  Email, LocationOn, Work, Star, Visibility
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const CompanyProfile = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [serviceDialog, setServiceDialog] = useState(false);
  const [portfolioDialog, setPortfolioDialog] = useState(false);

  const [profile, setProfile] = useState({
    // Basic Info
    name: '',
    tagline: '',
    description: '',
    website: '',
    email: '',
    phone: '',
    address: '',
    
    // Services
    services: [],
    
    // Portfolio
    portfolio: [],
    
    // Social & Business Info
    linkedIn: '',
    facebook: '',
    twitter: '',
    instagram: '',
    yearEstablished: '',
    teamSize: '',
    certifications: []
  });

  const [newService, setNewService] = useState({
    title: '',
    description: '',
    price: '',
    category: ''
  });

  const [newPortfolio, setNewPortfolio] = useState({
    title: '',
    description: '',
    client: '',
    year: '',
    category: '',
    images: [],
    link: ''
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    loadProfile();
  }, [isAuthenticated, navigate]);

  const loadProfile = async () => {
    try {
      // Load existing profile data
      if (user) {
        setProfile(prev => ({
          ...prev,
          name: user.name || '',
          email: user.email || '',
          phone: user.phone || '',
          website: user.website || '',
          description: user.description || ''
        }));
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      
      const response = await axios.put('/api/company/profile', profile, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.data.success) {
        setEditMode(false);
        toast.success('Profile updated successfully!');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  const handleAddService = () => {
    if (newService.title && newService.description) {
      setProfile(prev => ({
        ...prev,
        services: [...prev.services, { ...newService, id: Date.now() }]
      }));
      setNewService({ title: '', description: '', price: '', category: '' });
      setServiceDialog(false);
    }
  };

  const handleAddPortfolio = () => {
    if (newPortfolio.title && newPortfolio.description) {
      setProfile(prev => ({
        ...prev,
        portfolio: [...prev.portfolio, { ...newPortfolio, id: Date.now() }]
      }));
      setNewPortfolio({ title: '', description: '', client: '', year: '', category: '', images: [], link: '' });
      setPortfolioDialog(false);
    }
  };

  const handleDeleteService = (serviceId) => {
    setProfile(prev => ({
      ...prev,
      services: prev.services.filter(s => s.id !== serviceId)
    }));
  };

  const handleDeletePortfolio = (portfolioId) => {
    setProfile(prev => ({
      ...prev,
      portfolio: prev.portfolio.filter(p => p.id !== portfolioId)
    }));
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" fontWeight="bold">
          Company Profile
        </Typography>
        <Button
          variant={editMode ? "outlined" : "contained"}
          startIcon={<Edit />}
          onClick={() => setEditMode(!editMode)}
        >
          {editMode ? 'Cancel' : 'Edit Profile'}
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Basic Information */}
        <Grid item xs={12} md={8}>
          <Card elevation={2} sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Company Information
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Company Name"
                    value={profile.name}
                    onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                    disabled={!editMode}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Tagline"
                    placeholder="Brief description of what you do"
                    value={profile.tagline}
                    onChange={(e) => setProfile(prev => ({ ...prev, tagline: e.target.value }))}
                    disabled={!editMode}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Company Description"
                    placeholder="Detailed description of your company, mission, and values"
                    value={profile.description}
                    onChange={(e) => setProfile(prev => ({ ...prev, description: e.target.value }))}
                    disabled={!editMode}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Website"
                    value={profile.website}
                    onChange={(e) => setProfile(prev => ({ ...prev, website: e.target.value }))}
                    disabled={!editMode}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Year Established"
                    value={profile.yearEstablished}
                    onChange={(e) => setProfile(prev => ({ ...prev, yearEstablished: e.target.value }))}
                    disabled={!editMode}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Address"
                    value={profile.address}
                    onChange={(e) => setProfile(prev => ({ ...prev, address: e.target.value }))}
                    disabled={!editMode}
                  />
                </Grid>
              </Grid>
              
              {editMode && (
                <Box sx={{ mt: 3, textAlign: 'right' }}>
                  <Button
                    variant="contained"
                    onClick={handleSaveProfile}
                    loading={loading}
                  >
                    Save Changes
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>

          {/* Services Section */}
          <Card elevation={2} sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Services & Offerings
                </Typography>
                {editMode && (
                  <Button
                    variant="outlined"
                    startIcon={<Add />}
                    onClick={() => setServiceDialog(true)}
                  >
                    Add Service
                  </Button>
                )}
              </Box>
              
              {profile.services.length === 0 ? (
                <Alert severity="info">
                  No services added yet. Add your services to showcase what you offer.
                </Alert>
              ) : (
                <Grid container spacing={2}>
                  {profile.services.map((service) => (
                    <Grid item xs={12} md={6} key={service.id}>
                      <Card variant="outlined">
                        <CardContent>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="subtitle1" fontWeight="bold">
                                {service.title}
                              </Typography>
                              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                {service.description}
                              </Typography>
                              {service.category && (
                                <Chip label={service.category} size="small" />
                              )}
                              {service.price && (
                                <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                                  {service.price}
                                </Typography>
                              )}
                            </Box>
                            {editMode && (
                              <IconButton
                                size="small"
                                onClick={() => handleDeleteService(service.id)}
                                color="error"
                              >
                                <Delete />
                              </IconButton>
                            )}
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </CardContent>
          </Card>

          {/* Portfolio Section */}
          <Card elevation={2}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Portfolio & Recent Work
                </Typography>
                {editMode && (
                  <Button
                    variant="outlined"
                    startIcon={<Add />}
                    onClick={() => setPortfolioDialog(true)}
                  >
                    Add Project
                  </Button>
                )}
              </Box>
              
              {profile.portfolio.length === 0 ? (
                <Alert severity="info">
                  No portfolio items added yet. Showcase your best work and projects.
                </Alert>
              ) : (
                <Grid container spacing={3}>
                  {profile.portfolio.map((item) => (
                    <Grid item xs={12} md={6} key={item.id}>
                      <Card variant="outlined">
                        <CardContent>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="h6" gutterBottom>
                                {item.title}
                              </Typography>
                              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                {item.description}
                              </Typography>
                              
                              <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                                {item.client && (
                                  <Chip label={`Client: ${item.client}`} size="small" variant="outlined" />
                                )}
                                {item.year && (
                                  <Chip label={item.year} size="small" variant="outlined" />
                                )}
                              </Stack>
                              
                              {item.category && (
                                <Chip label={item.category} size="small" color="primary" />
                              )}
                              
                              {item.link && (
                                <Button
                                  size="small"
                                  startIcon={<Visibility />}
                                  href={item.link}
                                  target="_blank"
                                  sx={{ mt: 1 }}
                                >
                                  View Project
                                </Button>
                              )}
                            </Box>
                            {editMode && (
                              <IconButton
                                size="small"
                                onClick={() => handleDeletePortfolio(item.id)}
                                color="error"
                              >
                                <Delete />
                              </IconButton>
                            )}
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          <Card elevation={2} sx={{ mb: 3 }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Avatar
                sx={{ width: 100, height: 100, mx: 'auto', mb: 2, bgcolor: 'primary.main' }}
              >
                <Business sx={{ fontSize: 50 }} />
              </Avatar>
              <Typography variant="h5" gutterBottom>
                {profile.name || 'Company Name'}
              </Typography>
              {profile.tagline && (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {profile.tagline}
                </Typography>
              )}
              
              <Stack spacing={1}>
                {profile.website && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Language fontSize="small" />
                    <Typography variant="body2">{profile.website}</Typography>
                  </Box>
                )}
                {profile.phone && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Phone fontSize="small" />
                    <Typography variant="body2">{profile.phone}</Typography>
                  </Box>
                )}
                {profile.email && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Email fontSize="small" />
                    <Typography variant="body2">{profile.email}</Typography>
                  </Box>
                )}
                {profile.address && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocationOn fontSize="small" />
                    <Typography variant="body2">{profile.address}</Typography>
                  </Box>
                )}
              </Stack>
            </CardContent>
          </Card>

          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Stats
              </Typography>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Services Offered
                  </Typography>
                  <Typography variant="h6">
                    {profile.services.length}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Portfolio Items
                  </Typography>
                  <Typography variant="h6">
                    {profile.portfolio.length}
                  </Typography>
                </Box>
                {profile.yearEstablished && (
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Years in Business
                    </Typography>
                    <Typography variant="h6">
                      {new Date().getFullYear() - parseInt(profile.yearEstablished)}
                    </Typography>
                  </Box>
                )}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Add Service Dialog */}
      <Dialog open={serviceDialog} onClose={() => setServiceDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Add New Service</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Service Title"
                value={newService.title}
                onChange={(e) => setNewService(prev => ({ ...prev, title: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Service Description"
                value={newService.description}
                onChange={(e) => setNewService(prev => ({ ...prev, description: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Category"
                value={newService.category}
                onChange={(e) => setNewService(prev => ({ ...prev, category: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Price (Optional)"
                placeholder="e.g., $500, Contact for quote"
                value={newService.price}
                onChange={(e) => setNewService(prev => ({ ...prev, price: e.target.value }))}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setServiceDialog(false)}>Cancel</Button>
          <Button onClick={handleAddService} variant="contained">Add Service</Button>
        </DialogActions>
      </Dialog>

      {/* Add Portfolio Dialog */}
      <Dialog open={portfolioDialog} onClose={() => setPortfolioDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Add Portfolio Item</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Project Title"
                value={newPortfolio.title}
                onChange={(e) => setNewPortfolio(prev => ({ ...prev, title: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Project Description"
                value={newPortfolio.description}
                onChange={(e) => setNewPortfolio(prev => ({ ...prev, description: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Client Name"
                value={newPortfolio.client}
                onChange={(e) => setNewPortfolio(prev => ({ ...prev, client: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Year"
                value={newPortfolio.year}
                onChange={(e) => setNewPortfolio(prev => ({ ...prev, year: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Category"
                value={newPortfolio.category}
                onChange={(e) => setNewPortfolio(prev => ({ ...prev, category: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Project Link (Optional)"
                value={newPortfolio.link}
                onChange={(e) => setNewPortfolio(prev => ({ ...prev, link: e.target.value }))}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPortfolioDialog(false)}>Cancel</Button>
          <Button onClick={handleAddPortfolio} variant="contained">Add Project</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CompanyProfile;