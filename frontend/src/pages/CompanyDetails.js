import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Grid, Card, CardContent, Avatar,
  Chip, Button, Box, Stack, Rating, Divider, List, ListItem,
  ListItemText, CircularProgress, Alert, Paper
} from '@mui/material';
import {
  LocationOn, Business, Language, Verified, Star, Message,
  Phone, Email, Public, LinkedIn, Facebook, Twitter
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import MessageButton from '../components/MessageButton';

const CompanyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadCompanyDetails();
  }, [id]);

  const loadCompanyDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/companies/${id}`);
      setCompany(response.data.company);
      setError('');
    } catch (error) {
      console.error('Error loading company details:', error);
      setError('Company not found');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading company details...</Typography>
      </Container>
    );
  }

  if (error || !company) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Alert severity="error">
          {error || 'Company not found'}
        </Alert>
        <Button onClick={() => navigate('/companies')} sx={{ mt: 2 }}>
          Back to Companies
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Company Header */}
      <Card elevation={2} sx={{ mb: 4 }}>
        <CardContent sx={{ p: 4 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Stack direction="row" spacing={3} alignItems="flex-start">
                <Avatar
                  sx={{
                    bgcolor: 'primary.main',
                    width: 80,
                    height: 80,
                    fontSize: '2rem'
                  }}
                >
                  {company.logo}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                    <Typography variant="h4" fontWeight="bold">
                      {company.name}
                    </Typography>
                    {company.verified && (
                      <Verified color="success" />
                    )}
                  </Stack>
                  
                  <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                      <LocationOn fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        {company.country || 'Location not specified'}
                      </Typography>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                      <Business fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        {company.industry || 'Industry not specified'}
                      </Typography>
                    </Stack>
                  </Stack>
                  
                  <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                    <Rating value={company.rating} precision={0.1} size="small" readOnly />
                    <Typography variant="body2" color="text.secondary">
                      ({company.reviews} reviews)
                    </Typography>
                  </Stack>
                  
                  <Typography variant="body1" color="text.secondary">
                    {company.description || 'No description available'}
                  </Typography>
                </Box>
              </Stack>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Stack spacing={2}>
                <MessageButton
                  recipientId={company.id || company._id}
                  recipientName={company.name}
                  variant="contained"
                  size="large"
                  fullWidth
                />
                <Button variant="outlined" size="large" fullWidth>
                  Save Company
                </Button>
                <Button variant="outlined" size="large" fullWidth>
                  Share Profile
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Grid container spacing={4}>
        {/* Company Information */}
        <Grid item xs={12} md={8}>
          <Stack spacing={3}>
            {/* About */}
            <Card elevation={2}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  About {company.name}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {company.description || 'No detailed description available.'}
                </Typography>
              </CardContent>
            </Card>

            {/* Services */}
            {company.specialties && company.specialties.length > 0 && (
              <Card elevation={2}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Services & Specialties
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                    {company.specialties.map((specialty, index) => (
                      <Chip
                        key={index}
                        label={specialty}
                        variant="outlined"
                        color="primary"
                      />
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            )}

            {/* Portfolio */}
            {company.portfolio && company.portfolio.length > 0 && (
              <Card elevation={2}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Portfolio & Projects
                  </Typography>
                  <List>
                    {company.portfolio.map((project, index) => (
                      <ListItem key={index} sx={{ px: 0 }}>
                        <ListItemText primary={project} />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            )}

            {/* Certifications */}
            {company.certifications && company.certifications.length > 0 && (
              <Card elevation={2}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Certifications & Awards
                  </Typography>
                  <List>
                    {company.certifications.map((cert, index) => (
                      <ListItem key={index} sx={{ px: 0 }}>
                        <ListItemText primary={cert} />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            )}
          </Stack>
        </Grid>

        {/* Company Details Sidebar */}
        <Grid item xs={12} md={4}>
          <Stack spacing={3}>
            {/* Quick Info */}
            <Card elevation={2}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Company Details
                </Typography>
                <List sx={{ p: 0 }}>
                  <ListItem sx={{ px: 0, py: 1 }}>
                    <ListItemText
                      primary="Industry"
                      secondary={company.industry || 'Not specified'}
                    />
                  </ListItem>
                  <Divider />
                  <ListItem sx={{ px: 0, py: 1 }}>
                    <ListItemText
                      primary="Company Size"
                      secondary={`${company.employees} employees`}
                    />
                  </ListItem>
                  <Divider />
                  <ListItem sx={{ px: 0, py: 1 }}>
                    <ListItemText
                      primary="Founded"
                      secondary={company.founded}
                    />
                  </ListItem>
                  <Divider />
                  <ListItem sx={{ px: 0, py: 1 }}>
                    <ListItemText
                      primary="Location"
                      secondary={company.country || 'Not specified'}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card elevation={2}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Contact Information
                </Typography>
                <Stack spacing={2}>
                  {company.email && (
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Email fontSize="small" color="action" />
                      <Typography variant="body2">{company.email}</Typography>
                    </Stack>
                  )}
                  {company.phone && (
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Phone fontSize="small" color="action" />
                      <Typography variant="body2">{company.phone}</Typography>
                    </Stack>
                  )}
                  {company.website && (
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Public fontSize="small" color="action" />
                      <Typography variant="body2">{company.website}</Typography>
                    </Stack>
                  )}
                </Stack>
              </CardContent>
            </Card>

            {/* Social Media */}
            {(company.linkedIn || company.facebook || company.twitter) && (
              <Card elevation={2}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Social Media
                  </Typography>
                  <Stack spacing={2}>
                    {company.linkedIn && (
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <LinkedIn fontSize="small" color="action" />
                        <Typography variant="body2">LinkedIn</Typography>
                      </Stack>
                    )}
                    {company.facebook && (
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Facebook fontSize="small" color="action" />
                        <Typography variant="body2">Facebook</Typography>
                      </Stack>
                    )}
                    {company.twitter && (
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Twitter fontSize="small" color="action" />
                        <Typography variant="body2">Twitter</Typography>
                      </Stack>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            )}
          </Stack>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CompanyDetails;