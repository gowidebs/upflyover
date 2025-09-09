import React, { useState } from 'react';
import {
  Container, Typography, Grid, Card, CardContent, Box,
  Avatar, Button, TextField, Chip, Stack, Divider,
  IconButton, Paper, List, ListItem, ListItemText,
  ListItemIcon, Dialog, DialogTitle, DialogContent,
  DialogActions, FormControl, InputLabel, Select, MenuItem,
  Rating, LinearProgress, Alert
} from '@mui/material';
import {
  Edit, Camera, Business, LocationOn, Language,
  Email, Phone, Verified, Star, Add, Delete,
  Upload, Save, Cancel, Info, TrendingUp
} from '@mui/icons-material';

const Profile = () => {
  const [editMode, setEditMode] = useState(false);
  const [openCertDialog, setCertDialog] = useState(false);
  const [profileData, setProfileData] = useState({
    companyName: 'Gulf Trading LLC',
    industry: 'Import/Export',
    location: 'Dubai, UAE',
    website: 'www.gulftrading.ae',
    email: 'info@gulftrading.ae',
    phone: '+971 4 123 4567',
    employees: '50-200',
    founded: '2015',
    description: 'Leading import/export company specializing in electronics and consumer goods across the GCC region. We pride ourselves on quality products, reliable service, and building long-term partnerships with our clients.',
    specialties: ['Electronics', 'Consumer Goods', 'Logistics', 'Supply Chain'],
    languages: ['English', 'Arabic', 'Hindi']
  });

  const [stats] = useState({
    profileViews: 1234,
    connections: 89,
    rating: 4.8,
    reviews: 124,
    completeness: 85
  });

  const [certifications] = useState([
    { id: 1, name: 'ISO 9001:2015', issuer: 'ISO', date: '2023', verified: true },
    { id: 2, name: 'Dubai Chamber Membership', issuer: 'Dubai Chamber', date: '2023', verified: true },
    { id: 3, name: 'UAE Trade License', issuer: 'DED', date: '2023', verified: true }
  ]);

  const [portfolio] = useState([
    { id: 1, title: 'Electronics Distribution Center', image: '/api/placeholder/300/200' },
    { id: 2, title: 'Warehouse Facility', image: '/api/placeholder/300/200' },
    { id: 3, title: 'Product Showcase', image: '/api/placeholder/300/200' }
  ]);

  const handleSave = () => {
    // Handle save logic
    setEditMode(false);
  };

  const handleCancel = () => {
    // Reset changes
    setEditMode(false);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography variant="h3" gutterBottom>
              Company Profile
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage your company information and showcase your business
            </Typography>
          </Box>
          {!editMode ? (
            <Button 
              variant="contained" 
              startIcon={<Edit />}
              onClick={() => setEditMode(true)}
            >
              Edit Profile
            </Button>
          ) : (
            <Stack direction="row" spacing={1}>
              <Button 
                variant="outlined" 
                startIcon={<Cancel />}
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button 
                variant="contained" 
                startIcon={<Save />}
                onClick={handleSave}
              >
                Save Changes
              </Button>
            </Stack>
          )}
        </Stack>
      </Box>

      {/* Profile Completion Alert */}
      {stats.completeness < 100 && (
        <Alert severity="info" sx={{ mb: 4 }}>
          Your profile is {stats.completeness}% complete. Add more information to increase visibility!
        </Alert>
      )}

      <Grid container spacing={4}>
        {/* Main Profile Card */}
        <Grid item xs={12} lg={8}>
          <Card elevation={2}>
            <CardContent sx={{ p: 4 }}>
              {/* Company Header */}
              <Stack direction="row" spacing={3} alignItems="flex-start" sx={{ mb: 4 }}>
                <Box sx={{ position: 'relative' }}>
                  <Avatar 
                    sx={{ 
                      width: 120, 
                      height: 120, 
                      fontSize: '3rem',
                      bgcolor: 'primary.main'
                    }}
                  >
                    GT
                  </Avatar>
                  {editMode && (
                    <IconButton 
                      sx={{ 
                        position: 'absolute', 
                        bottom: 0, 
                        right: 0,
                        bgcolor: 'background.paper',
                        boxShadow: 2
                      }}
                    >
                      <Camera />
                    </IconButton>
                  )}
                </Box>
                <Box sx={{ flex: 1 }}>
                  {editMode ? (
                    <TextField
                      fullWidth
                      value={profileData.companyName}
                      onChange={(e) => setProfileData({...profileData, companyName: e.target.value})}
                      sx={{ mb: 2 }}
                    />
                  ) : (
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                      <Typography variant="h4" fontWeight="bold">
                        {profileData.companyName}
                      </Typography>
                      <Verified color="success" />
                    </Stack>
                  )}
                  
                  <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                    <Chip label={profileData.industry} color="primary" />
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                      <LocationOn fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        {profileData.location}
                      </Typography>
                    </Stack>
                  </Stack>
                  
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Rating value={stats.rating} precision={0.1} readOnly />
                    <Typography variant="body2" color="text.secondary">
                      {stats.rating} ({stats.reviews} reviews)
                    </Typography>
                  </Stack>
                </Box>
              </Stack>

              {/* Company Description */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" gutterBottom>
                  About Company
                </Typography>
                {editMode ? (
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    value={profileData.description}
                    onChange={(e) => setProfileData({...profileData, description: e.target.value})}
                  />
                ) : (
                  <Typography variant="body1" color="text.secondary">
                    {profileData.description}
                  </Typography>
                )}
              </Box>

              {/* Company Details */}
              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" gutterBottom>
                    Contact Information
                  </Typography>
                  <Stack spacing={2}>
                    {editMode ? (
                      <>
                        <TextField
                          fullWidth
                          label="Website"
                          value={profileData.website}
                          onChange={(e) => setProfileData({...profileData, website: e.target.value})}
                        />
                        <TextField
                          fullWidth
                          label="Email"
                          value={profileData.email}
                          onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                        />
                        <TextField
                          fullWidth
                          label="Phone"
                          value={profileData.phone}
                          onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                        />
                      </>
                    ) : (
                      <>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Language fontSize="small" color="action" />
                          <Typography variant="body2">{profileData.website}</Typography>
                        </Stack>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Email fontSize="small" color="action" />
                          <Typography variant="body2">{profileData.email}</Typography>
                        </Stack>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Phone fontSize="small" color="action" />
                          <Typography variant="body2">{profileData.phone}</Typography>
                        </Stack>
                      </>
                    )}
                  </Stack>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" gutterBottom>
                    Company Details
                  </Typography>
                  <Stack spacing={2}>
                    {editMode ? (
                      <>
                        <TextField
                          fullWidth
                          label="Employees"
                          value={profileData.employees}
                          onChange={(e) => setProfileData({...profileData, employees: e.target.value})}
                        />
                        <TextField
                          fullWidth
                          label="Founded"
                          value={profileData.founded}
                          onChange={(e) => setProfileData({...profileData, founded: e.target.value})}
                        />
                      </>
                    ) : (
                      <>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Business fontSize="small" color="action" />
                          <Typography variant="body2">Employees: {profileData.employees}</Typography>
                        </Stack>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Info fontSize="small" color="action" />
                          <Typography variant="body2">Founded: {profileData.founded}</Typography>
                        </Stack>
                      </>
                    )}
                  </Stack>
                </Grid>
              </Grid>

              {/* Specialties */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Specialties
                </Typography>
                <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                  {profileData.specialties.map((specialty, index) => (
                    <Chip 
                      key={index} 
                      label={specialty} 
                      variant="outlined"
                      onDelete={editMode ? () => {} : undefined}
                    />
                  ))}
                  {editMode && (
                    <Chip 
                      label="+ Add Specialty" 
                      variant="outlined" 
                      onClick={() => {}}
                      icon={<Add />}
                    />
                  )}
                </Stack>
              </Box>

              {/* Languages */}
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Languages
                </Typography>
                <Stack direction="row" spacing={1}>
                  {profileData.languages.map((language, index) => (
                    <Chip key={index} label={language} size="small" />
                  ))}
                </Stack>
              </Box>
            </CardContent>
          </Card>

          {/* Portfolio Section */}
          <Card elevation={2} sx={{ mt: 3 }}>
            <CardContent sx={{ p: 4 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                <Typography variant="h6">
                  Portfolio
                </Typography>
                {editMode && (
                  <Button startIcon={<Upload />} variant="outlined">
                    Add Images
                  </Button>
                )}
              </Stack>
              <Grid container spacing={2}>
                {portfolio.map((item) => (
                  <Grid item xs={12} sm={6} md={4} key={item.id}>
                    <Paper 
                      elevation={2} 
                      sx={{ 
                        aspectRatio: '3/2',
                        bgcolor: 'grey.100',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative'
                      }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        {item.title}
                      </Typography>
                      {editMode && (
                        <IconButton 
                          sx={{ position: 'absolute', top: 8, right: 8 }}
                          size="small"
                        >
                          <Delete />
                        </IconButton>
                      )}
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} lg={4}>
          {/* Profile Stats */}
          <Card elevation={2} sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Profile Statistics
              </Typography>
              <Stack spacing={2}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2">Profile Views</Typography>
                  <Typography variant="h6">{stats.profileViews}</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2">Connections</Typography>
                  <Typography variant="h6">{stats.connections}</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2">Profile Rating</Typography>
                  <Typography variant="h6">{stats.rating}/5</Typography>
                </Stack>
                <Divider />
                <Box>
                  <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                    <Typography variant="body2">Profile Completeness</Typography>
                    <Typography variant="body2">{stats.completeness}%</Typography>
                  </Stack>
                  <LinearProgress 
                    variant="determinate" 
                    value={stats.completeness} 
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>
              </Stack>
            </CardContent>
          </Card>

          {/* Certifications */}
          <Card elevation={2}>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Typography variant="h6">
                  Certifications
                </Typography>
                {editMode && (
                  <IconButton onClick={() => setCertDialog(true)}>
                    <Add />
                  </IconButton>
                )}
              </Stack>
              <List>
                {certifications.map((cert, index) => (
                  <React.Fragment key={cert.id}>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon>
                        <Verified color={cert.verified ? 'success' : 'disabled'} />
                      </ListItemIcon>
                      <ListItemText
                        primary={cert.name}
                        secondary={`${cert.issuer} • ${cert.date}`}
                      />
                      {editMode && (
                        <IconButton size="small">
                          <Delete />
                        </IconButton>
                      )}
                    </ListItem>
                    {index < certifications.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Add Certification Dialog */}
      <Dialog open={openCertDialog} onClose={() => setCertDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Certification</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField fullWidth label="Certification Name" />
            <TextField fullWidth label="Issuing Organization" />
            <TextField fullWidth label="Issue Date" type="date" InputLabelProps={{ shrink: true }} />
            <Button variant="outlined" startIcon={<Upload />}>
              Upload Certificate
            </Button>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCertDialog(false)}>Cancel</Button>
          <Button variant="contained">Add Certification</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Profile;