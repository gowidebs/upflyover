import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Grid, Card, CardContent, Box,
  TextField, Button, Chip, Stack, Dialog, DialogTitle,
  DialogContent, DialogActions, FormControl, InputLabel,
  Select, MenuItem, Alert, Fab, IconButton, Avatar,
  Divider, List, ListItem, ListItemText, ListItemAvatar,
  Badge, Tab, Tabs, Paper
} from '@mui/material';
import {
  Add, Search, FilterList, Business, LocationOn,
  AccessTime, AttachMoney, Send, Visibility, Edit, Delete
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Requirements = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [requirements, setRequirements] = useState([]);
  const [myRequirements, setMyRequirements] = useState([]);
  const [applications, setApplications] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const [postDialog, setPostDialog] = useState(false);
  const [applyDialog, setApplyDialog] = useState(false);
  const [selectedRequirement, setSelectedRequirement] = useState(null);

  const [filters, setFilters] = useState({
    category: '',
    location: '',
    budget: '',
    search: ''
  });

  const [newRequirement, setNewRequirement] = useState({
    title: '',
    description: '',
    category: '',
    budget: '',
    timeline: '',
    location: '',
    skills: [],
    requirements: ''
  });
  
  const [attachments, setAttachments] = useState([]);

  const [application, setApplication] = useState({
    proposal: '',
    timeline: '',
    budget: '',
    experience: '',
    portfolio: ''
  });

  const categories = [
    'Web Development', 'Mobile App Development', 'Digital Marketing',
    'Graphic Design', 'Content Writing', 'SEO Services',
    'Software Development', 'Consulting', 'Legal Services',
    'Accounting', 'HR Services', 'IT Support', 'Other'
  ];

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    loadRequirements();
    loadMyRequirements();
    loadApplications();
  }, [isAuthenticated, navigate]);

  const loadRequirements = async () => {
    try {
      const response = await axios.get('/api/requirements', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      setRequirements(response.data.requirements || []);
    } catch (error) {
      console.error('Error loading requirements:', error);
    }
  };

  const loadMyRequirements = async () => {
    try {
      const response = await axios.get('/api/requirements/my', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      setMyRequirements(response.data.requirements || []);
    } catch (error) {
      console.error('Error loading my requirements:', error);
    }
  };

  const loadApplications = async () => {
    try {
      const response = await axios.get('/api/applications/my', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      setApplications(response.data.applications || []);
    } catch (error) {
      console.error('Error loading applications:', error);
    }
  };

  const handlePostRequirement = async () => {
    try {
      setLoading(true);
      
      const formData = new FormData();
      
      // Add text fields
      Object.keys(newRequirement).forEach(key => {
        formData.append(key, newRequirement[key]);
      });
      
      // Add files
      attachments.forEach(file => {
        formData.append('attachments', file);
      });
      
      const response = await axios.post('/api/requirements', formData, {
        headers: { 
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        setPostDialog(false);
        setNewRequirement({
          title: '', description: '', category: '', budget: '',
          timeline: '', location: '', skills: [], requirements: ''
        });
        setAttachments([]);
        loadRequirements();
        loadMyRequirements();
        alert('Requirement posted successfully!');
      }
    } catch (error) {
      console.error('Error posting requirement:', error);
      alert('Failed to post requirement');
    } finally {
      setLoading(false);
    }
  };
  
  const handleFileChange = (event) => {
    const files = Array.from(event.target.files || []);
    
    // Validate file size (10MB limit)
    const validFiles = files.filter(file => {
      if (file.size > 10 * 1024 * 1024) {
        alert(`File ${file.name} is too large. Maximum size is 10MB.`);
        return false;
      }
      return true;
    });
    
    setAttachments(prev => [...prev, ...validFiles]);
  };
  
  const removeAttachment = (index) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };
  
  const downloadAttachment = async (requirementId, filename, originalName) => {
    try {
      const response = await axios.get(`/api/requirements/${requirementId}/download/${filename}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', originalName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download file');
    }
  };

  const handleApply = async () => {
    try {
      setLoading(true);
      
      const response = await axios.post(`/api/requirements/${selectedRequirement.id}/apply`, application, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });

      if (response.data.success) {
        setApplyDialog(false);
        setApplication({
          proposal: '', timeline: '', budget: '', experience: '', portfolio: ''
        });
        loadApplications();
        alert('Application submitted successfully!');
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('Failed to submit application');
    } finally {
      setLoading(false);
    }
  };

  const filteredRequirements = requirements.filter(req => {
    return (
      (!filters.category || req.category === filters.category) &&
      (!filters.location || req.location.toLowerCase().includes(filters.location.toLowerCase())) &&
      (!filters.search || req.title.toLowerCase().includes(filters.search.toLowerCase()) ||
       req.description.toLowerCase().includes(filters.search.toLowerCase()))
    );
  });

  const formatBudget = (budget) => {
    if (!budget) return 'Budget not specified';
    return budget.includes('$') ? budget : `$${budget}`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'success';
      case 'in_progress': return 'warning';
      case 'completed': return 'info';
      case 'closed': return 'error';
      default: return 'default';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" fontWeight="bold">
          Business Requirements
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setPostDialog(true)}
        >
          Post Requirement
        </Button>
      </Box>

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
          <Tab label="Browse Requirements" />
          <Tab label="My Requirements" />
          <Tab label="My Applications" />
        </Tabs>
      </Paper>

      {/* Browse Requirements Tab */}
      {tabValue === 0 && (
        <>
          {/* Filters */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    placeholder="Search requirements..."
                    value={filters.search}
                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                    InputProps={{
                      startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <FormControl fullWidth>
                    <InputLabel>Category</InputLabel>
                    <Select
                      value={filters.category}
                      onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                    >
                      <MenuItem value="">All Categories</MenuItem>
                      {categories.map(cat => (
                        <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    label="Location"
                    value={filters.location}
                    onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <Button
                    variant="outlined"
                    startIcon={<FilterList />}
                    onClick={() => setFilters({ category: '', location: '', budget: '', search: '' })}
                  >
                    Clear Filters
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Requirements List */}
          <Grid container spacing={3}>
            {filteredRequirements.length === 0 ? (
              <Grid item xs={12}>
                <Alert severity="info">
                  No requirements found. Be the first to post a requirement!
                </Alert>
              </Grid>
            ) : (
              filteredRequirements.map((req) => (
                <Grid item xs={12} md={6} key={req.id}>
                  <Card elevation={2} sx={{ height: '100%' }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Typography variant="h6" gutterBottom>
                          {req.title}
                        </Typography>
                        <Chip 
                          label={req.status || 'open'} 
                          color={getStatusColor(req.status)} 
                          size="small" 
                        />
                      </Box>
                      
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {req.description.length > 150 
                          ? `${req.description.substring(0, 150)}...` 
                          : req.description
                        }
                      </Typography>
                      
                      <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                        <Chip label={req.category} size="small" color="primary" />
                        {req.isRecommended && (
                          <Chip 
                            label="Recommended" 
                            size="small" 
                            color="success" 
                            variant="outlined"
                          />
                        )}
                        {req.location && (
                          <Chip 
                            icon={<LocationOn />} 
                            label={req.location} 
                            size="small" 
                            variant="outlined" 
                          />
                        )}
                      </Stack>
                      
                      {/* Attachments */}
                      {req.attachments && req.attachments.length > 0 && (
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            📎 Attachments ({req.attachments.length}):
                          </Typography>
                          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                            {req.attachments.map((att, index) => (
                              <Chip
                                key={index}
                                label={att.originalName || `File ${index + 1}`}
                                size="small"
                                variant="outlined"
                                onClick={() => downloadAttachment(req.id, att.filename, att.originalName)}
                                sx={{ cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}
                              />
                            ))}
                          </Stack>
                        </Box>
                      )}
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          <AttachMoney sx={{ fontSize: 16, mr: 0.5 }} />
                          {formatBudget(req.budget)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          <AccessTime sx={{ fontSize: 16, mr: 0.5 }} />
                          {req.timeline || 'Timeline flexible'}
                        </Typography>
                      </Box>
                      
                      <Divider sx={{ my: 2 }} />
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar sx={{ width: 32, height: 32, mr: 1, bgcolor: 'primary.main' }}>
                            <Business sx={{ fontSize: 16 }} />
                          </Avatar>
                          <Typography variant="body2">
                            {req.companyName || 'Anonymous'}
                          </Typography>
                        </Box>
                        
                        <Button
                          variant="contained"
                          size="small"
                          startIcon={<Send />}
                          onClick={() => {
                            setSelectedRequirement(req);
                            setApplyDialog(true);
                          }}
                        >
                          Apply
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            )}
          </Grid>
        </>
      )}

      {/* My Requirements Tab */}
      {tabValue === 1 && (
        <Grid container spacing={3}>
          {myRequirements.length === 0 ? (
            <Grid item xs={12}>
              <Alert severity="info">
                You haven't posted any requirements yet. Click "Post Requirement" to get started!
              </Alert>
            </Grid>
          ) : (
            myRequirements.map((req) => (
              <Grid item xs={12} key={req.id}>
                <Card elevation={2}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" gutterBottom>
                          {req.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {req.description}
                        </Typography>
                        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                          <Chip label={req.category} size="small" color="primary" />
                          <Chip 
                            label={`${req.applications || 0} Applications`} 
                            size="small" 
                            variant="outlined" 
                          />
                          <Chip 
                            label={req.status || 'open'} 
                            color={getStatusColor(req.status)} 
                            size="small" 
                          />
                        </Stack>
                      </Box>
                      <Box>
                        <IconButton size="small">
                          <Edit />
                        </IconButton>
                        <IconButton size="small">
                          <Visibility />
                        </IconButton>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      )}

      {/* My Applications Tab */}
      {tabValue === 2 && (
        <Grid container spacing={3}>
          {applications.length === 0 ? (
            <Grid item xs={12}>
              <Alert severity="info">
                You haven't applied to any requirements yet. Browse requirements and apply!
              </Alert>
            </Grid>
          ) : (
            applications.map((app) => (
              <Grid item xs={12} key={app.id}>
                <Card elevation={2}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {app.requirementTitle}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Applied on: {new Date(app.appliedAt).toLocaleDateString()}
                    </Typography>
                    <Chip 
                      label={app.status || 'pending'} 
                      color={getStatusColor(app.status)} 
                      size="small" 
                    />
                  </CardContent>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      )}

      {/* Post Requirement Dialog */}
      <Dialog open={postDialog} onClose={() => setPostDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Post New Requirement</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Requirement Title"
                value={newRequirement.title}
                onChange={(e) => setNewRequirement(prev => ({ ...prev, title: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Detailed Description"
                value={newRequirement.description}
                onChange={(e) => setNewRequirement(prev => ({ ...prev, description: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={newRequirement.category}
                  onChange={(e) => setNewRequirement(prev => ({ ...prev, category: e.target.value }))}
                >
                  {categories.map(cat => (
                    <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Budget"
                placeholder="e.g., $5000, $500-1000, Negotiable"
                value={newRequirement.budget}
                onChange={(e) => setNewRequirement(prev => ({ ...prev, budget: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Timeline"
                placeholder="e.g., 2 weeks, 1 month, ASAP"
                value={newRequirement.timeline}
                onChange={(e) => setNewRequirement(prev => ({ ...prev, timeline: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Location"
                placeholder="e.g., Dubai, Remote, UAE"
                value={newRequirement.location}
                onChange={(e) => setNewRequirement(prev => ({ ...prev, location: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Specific Requirements"
                placeholder="List any specific skills, experience, or requirements..."
                value={newRequirement.requirements}
                onChange={(e) => setNewRequirement(prev => ({ ...prev, requirements: e.target.value }))}
              />
            </Grid>
            
            {/* File Upload Section */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Attachments (Optional)
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Upload PDFs, documents, images, or zip files to provide more details about your requirement.
              </Typography>
              
              <input
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.zip,.rar,.jpg,.jpeg,.png,.txt"
                onChange={handleFileChange}
                style={{ marginBottom: '16px' }}
              />
              
              {attachments.length > 0 && (
                <Box>
                  <Typography variant="body2" sx={{ mb: 1 }}>Selected files:</Typography>
                  <Stack spacing={1}>
                    {attachments.map((file, index) => (
                      <Box key={index} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography variant="body2">
                          {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                        </Typography>
                        <IconButton size="small" onClick={() => removeAttachment(index)}>
                          <Delete fontSize="small" />
                        </IconButton>
                      </Box>
                    ))}
                  </Stack>
                </Box>
              )}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPostDialog(false)}>Cancel</Button>
          <Button onClick={handlePostRequirement} variant="contained" disabled={loading}>
            Post Requirement
          </Button>
        </DialogActions>
      </Dialog>

      {/* Apply Dialog */}
      <Dialog open={applyDialog} onClose={() => setApplyDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Apply for: {selectedRequirement?.title}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Your Proposal"
                placeholder="Explain how you can help with this requirement..."
                value={application.proposal}
                onChange={(e) => setApplication(prev => ({ ...prev, proposal: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Your Timeline"
                placeholder="How long will it take?"
                value={application.timeline}
                onChange={(e) => setApplication(prev => ({ ...prev, timeline: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Your Budget"
                placeholder="Your pricing for this project"
                value={application.budget}
                onChange={(e) => setApplication(prev => ({ ...prev, budget: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Relevant Experience"
                placeholder="Describe your relevant experience and past projects..."
                value={application.experience}
                onChange={(e) => setApplication(prev => ({ ...prev, experience: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Portfolio/Examples"
                placeholder="Links to your work or portfolio (optional)"
                value={application.portfolio}
                onChange={(e) => setApplication(prev => ({ ...prev, portfolio: e.target.value }))}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setApplyDialog(false)}>Cancel</Button>
          <Button onClick={handleApply} variant="contained" disabled={loading}>
            Submit Application
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Requirements;