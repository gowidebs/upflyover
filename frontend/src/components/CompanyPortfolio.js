import React, { useState, useEffect } from 'react';
import {
  Box, Card, CardContent, Typography, Button, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Grid, Chip, Rating, Avatar, Divider, IconButton,
  ImageList, ImageListItem, Tab, Tabs, Paper, Stack, Badge
} from '@mui/material';
import {
  Add, Edit, Delete, Star, Verified, Business, Image, VideoLibrary,
  Description, AttachMoney, CheckCircle
} from '@mui/icons-material';
import api from '../utils/api';

const CompanyPortfolio = ({ companyId, isOwner = false }) => {
  const [company, setCompany] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [portfolioDialog, setPortfolioDialog] = useState(false);
  const [serviceDialog, setServiceDialog] = useState(false);
  const [testimonialDialog, setTestimonialDialog] = useState(false);
  const [reviewDialog, setReviewDialog] = useState(false);
  
  const [portfolioForm, setPortfolioForm] = useState({
    title: '', description: '', category: 'web-development', files: []
  });
  
  const [serviceForm, setServiceForm] = useState({
    name: '', description: '', price: '', category: 'development', features: []
  });
  
  const [testimonialForm, setTestimonialForm] = useState({
    clientName: '', clientCompany: '', testimonial: '', rating: 5, projectType: ''
  });
  
  const [reviewForm, setReviewForm] = useState({
    rating: 5, review: '', projectType: ''
  });

  useEffect(() => {
    loadCompanyData();
  }, [companyId]);

  const loadCompanyData = async () => {
    try {
      const response = await api.get(`/companies/${companyId}`);
      setCompany(response.data.company);
    } catch (error) {
      console.error('Failed to load company data:', error);
    }
  };

  const handlePortfolioUpload = async () => {
    try {
      const formData = new FormData();
      formData.append('title', portfolioForm.title);
      formData.append('description', portfolioForm.description);
      formData.append('category', portfolioForm.category);
      
      portfolioForm.files.forEach(file => {
        formData.append('media', file);
      });
      
      await api.post('/companies/portfolio/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setPortfolioDialog(false);
      setPortfolioForm({ title: '', description: '', category: 'web-development', files: [] });
      loadCompanyData();
    } catch (error) {
      console.error('Portfolio upload failed:', error);
    }
  };

  const handleServiceAdd = async () => {
    try {
      await api.post('/companies/services', serviceForm);
      setServiceDialog(false);
      setServiceForm({ name: '', description: '', price: '', category: 'development', features: [] });
      loadCompanyData();
    } catch (error) {
      console.error('Service creation failed:', error);
    }
  };

  const handleTestimonialAdd = async () => {
    try {
      await api.post('/companies/testimonials', testimonialForm);
      setTestimonialDialog(false);
      setTestimonialForm({ clientName: '', clientCompany: '', testimonial: '', rating: 5, projectType: '' });
      loadCompanyData();
    } catch (error) {
      console.error('Testimonial creation failed:', error);
    }
  };

  const handleReviewSubmit = async () => {
    try {
      await api.post(`/companies/${companyId}/reviews`, reviewForm);
      setReviewDialog(false);
      setReviewForm({ rating: 5, review: '', projectType: '' });
      loadCompanyData();
    } catch (error) {
      console.error('Review submission failed:', error);
    }
  };

  const getVerificationLevel = (company) => {
    let level = 0;
    if (company?.kycStatus === 'approved') level++;
    if (company?.emailVerified) level++;
    if (company?.phoneVerified) level++;
    if (company?.portfolio?.length > 0) level++;
    if (company?.reviews?.length >= 5) level++;
    return level;
  };

  const getVerificationBadge = (level) => {
    const badges = [
      { label: 'Unverified', color: 'default' },
      { label: 'Basic', color: 'primary' },
      { label: 'Verified', color: 'success' },
      { label: 'Premium', color: 'warning' },
      { label: 'Elite', color: 'error' },
      { label: 'Platinum', color: 'secondary' }
    ];
    return badges[level] || badges[0];
  };

  if (!company) return <Typography>Loading...</Typography>;

  const verificationLevel = getVerificationLevel(company);
  const verificationBadge = getVerificationBadge(verificationLevel);

  return (
    <Box>
      {/* Company Header */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="flex-start">
            <Box display="flex" alignItems="center" gap={2}>
              <Avatar sx={{ width: 80, height: 80, bgcolor: 'primary.main' }}>
                <Business sx={{ fontSize: 40 }} />
              </Avatar>
              <Box>
                <Box display="flex" alignItems="center" gap={1}>
                  <Typography variant="h4">{company.name}</Typography>
                  <Badge
                    badgeContent={<Verified />}
                    color={verificationBadge.color}
                    invisible={verificationLevel === 0}
                  >
                    <Chip label={verificationBadge.label} color={verificationBadge.color} size="small" />
                  </Badge>
                </Box>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                  {company.industry} • {company.country}
                </Typography>
                <Box display="flex" alignItems="center" gap={2}>
                  <Rating value={company.averageRating || 0} readOnly size="small" />
                  <Typography variant="body2">
                    ({company.totalReviews || 0} reviews)
                  </Typography>
                </Box>
              </Box>
            </Box>
            {!isOwner && (
              <Button variant="contained" onClick={() => setReviewDialog(true)}>
                Write Review
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)}>
          <Tab label="Portfolio" />
          <Tab label="Services" />
          <Tab label="Reviews" />
          <Tab label="About" />
        </Tabs>
      </Paper>

      {/* Portfolio Tab */}
      {tabValue === 0 && (
        <Box>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h5">Portfolio</Typography>
            {isOwner && (
              <Button variant="contained" startIcon={<Add />} onClick={() => setPortfolioDialog(true)}>
                Add Project
              </Button>
            )}
          </Box>
          
          <Grid container spacing={3}>
            {company.portfolio?.map((item) => (
              <Grid item xs={12} md={6} key={item.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>{item.title}</Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {item.description}
                    </Typography>
                    <Chip label={item.category} size="small" sx={{ mb: 2 }} />
                    
                    {item.media?.length > 0 && (
                      <ImageList cols={2} rowHeight={120}>
                        {item.media.slice(0, 4).map((media, index) => (
                          <ImageListItem key={index}>
                            {media.mimetype?.startsWith('image/') ? (
                              <img
                                src={`${process.env.REACT_APP_API_URL}/uploads/${media.filename}`}
                                alt={media.originalName}
                                loading="lazy"
                              />
                            ) : (
                              <Box display="flex" alignItems="center" justifyContent="center" height="100%" bgcolor="grey.100">
                                <VideoLibrary />
                              </Box>
                            )}
                          </ImageListItem>
                        ))}
                      </ImageList>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Services Tab */}
      {tabValue === 1 && (
        <Box>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h5">Services</Typography>
            {isOwner && (
              <Button variant="contained" startIcon={<Add />} onClick={() => setServiceDialog(true)}>
                Add Service
              </Button>
            )}
          </Box>
          
          <Grid container spacing={3}>
            {company.services?.map((service) => (
              <Grid item xs={12} md={4} key={service.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>{service.name}</Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {service.description}
                    </Typography>
                    <Typography variant="h6" color="primary" gutterBottom>
                      {service.price}
                    </Typography>
                    <Stack spacing={1}>
                      {service.features?.map((feature, index) => (
                        <Box key={index} display="flex" alignItems="center" gap={1}>
                          <CheckCircle color="success" fontSize="small" />
                          <Typography variant="body2">{feature}</Typography>
                        </Box>
                      ))}
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Reviews Tab */}
      {tabValue === 2 && (
        <Box>
          <Typography variant="h5" gutterBottom>Reviews & Testimonials</Typography>
          
          {/* Testimonials Section */}
          {isOwner && (
            <Box mb={4}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">Client Testimonials</Typography>
                <Button variant="outlined" startIcon={<Add />} onClick={() => setTestimonialDialog(true)}>
                  Add Testimonial
                </Button>
              </Box>
              
              <Grid container spacing={2}>
                {company.testimonials?.map((testimonial) => (
                  <Grid item xs={12} md={6} key={testimonial.id}>
                    <Card variant="outlined">
                      <CardContent>
                        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                          <Box>
                            <Typography variant="subtitle1">{testimonial.clientName}</Typography>
                            <Typography variant="body2" color="text.secondary">
                              {testimonial.clientCompany}
                            </Typography>
                          </Box>
                          <Rating value={testimonial.rating} readOnly size="small" />
                        </Box>
                        <Typography variant="body2" paragraph>
                          "{testimonial.testimonial}"
                        </Typography>
                        <Chip label={testimonial.projectType} size="small" />
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
          
          {/* Reviews Section */}
          <Typography variant="h6" gutterBottom>Customer Reviews</Typography>
          <Stack spacing={2}>
            {company.reviews?.map((review) => (
              <Card key={review.id} variant="outlined">
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                    <Box>
                      <Typography variant="subtitle1">{review.reviewerName}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </Typography>
                    </Box>
                    <Rating value={review.rating} readOnly size="small" />
                  </Box>
                  <Typography variant="body2" paragraph>{review.review}</Typography>
                  {review.projectType && <Chip label={review.projectType} size="small" />}
                </CardContent>
              </Card>
            ))}
          </Stack>
        </Box>
      )}

      {/* About Tab */}
      {tabValue === 3 && (
        <Box>
          <Typography variant="h5" gutterBottom>About {company.name}</Typography>
          <Typography variant="body1" paragraph>{company.description}</Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>Company Details</Typography>
              <Stack spacing={1}>
                <Typography><strong>Industry:</strong> {company.industry}</Typography>
                <Typography><strong>Size:</strong> {company.companySize}</Typography>
                <Typography><strong>Founded:</strong> {company.yearEstablished}</Typography>
                <Typography><strong>Location:</strong> {company.country}</Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>Contact Information</Typography>
              <Stack spacing={1}>
                <Typography><strong>Website:</strong> {company.website}</Typography>
                <Typography><strong>Email:</strong> {company.email}</Typography>
                <Typography><strong>Phone:</strong> {company.phone}</Typography>
              </Stack>
            </Grid>
          </Grid>
        </Box>
      )}

      {/* Dialogs */}
      <Dialog open={portfolioDialog} onClose={() => setPortfolioDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Add Portfolio Project</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Project Title"
                value={portfolioForm.title}
                onChange={(e) => setPortfolioForm(prev => ({ ...prev, title: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                value={portfolioForm.description}
                onChange={(e) => setPortfolioForm(prev => ({ ...prev, description: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12}>
              <input
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={(e) => setPortfolioForm(prev => ({ ...prev, files: Array.from(e.target.files) }))}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPortfolioDialog(false)}>Cancel</Button>
          <Button onClick={handlePortfolioUpload} variant="contained">Upload</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={reviewDialog} onClose={() => setReviewDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Write a Review</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <Typography component="legend">Rating</Typography>
              <Rating
                value={reviewForm.rating}
                onChange={(e, value) => setReviewForm(prev => ({ ...prev, rating: value }))}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Your Review"
                value={reviewForm.review}
                onChange={(e) => setReviewForm(prev => ({ ...prev, review: e.target.value }))}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReviewDialog(false)}>Cancel</Button>
          <Button onClick={handleReviewSubmit} variant="contained">Submit Review</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CompanyPortfolio;