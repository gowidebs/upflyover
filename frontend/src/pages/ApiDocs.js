import React from 'react';
import { Container, Typography, Box, Card, CardContent, Grid, Chip, Button } from '@mui/material';
import { Code, Description, Security, Speed } from '@mui/icons-material';

const ApiDocs = () => {
  const endpoints = [
    {
      method: 'GET',
      endpoint: '/api/companies',
      description: 'Retrieve list of companies with filtering options',
      auth: 'Required'
    },
    {
      method: 'POST',
      endpoint: '/api/companies',
      description: 'Create a new company profile',
      auth: 'Required'
    },
    {
      method: 'GET',
      endpoint: '/api/requirements',
      description: 'Get business requirements with search and filters',
      auth: 'Required'
    },
    {
      method: 'POST',
      endpoint: '/api/requirements',
      description: 'Post a new business requirement',
      auth: 'Required'
    },
    {
      method: 'GET',
      endpoint: '/api/matches',
      description: 'Get AI-powered company matches',
      auth: 'Required'
    },
    {
      method: 'POST',
      endpoint: '/api/auth/login',
      description: 'Authenticate user and get access token',
      auth: 'None'
    }
  ];

  const features = [
    {
      icon: <Code />,
      title: 'RESTful API',
      description: 'Clean, intuitive REST endpoints with JSON responses'
    },
    {
      icon: <Security />,
      title: 'Secure Authentication',
      description: 'JWT-based authentication with API key support'
    },
    {
      icon: <Speed />,
      title: 'High Performance',
      description: 'Fast response times with rate limiting and caching'
    },
    {
      icon: <Description />,
      title: 'Comprehensive Docs',
      description: 'Detailed documentation with code examples'
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box sx={{ textAlign: 'center', mb: 8 }}>
        <Typography variant="h2" gutterBottom sx={{ fontWeight: 700, color: 'rgb(30, 86, 86)' }}>
          API Documentation
        </Typography>
        <Typography variant="h5" sx={{ color: 'text.secondary', mb: 4 }}>
          Integrate Upflyover into your applications
        </Typography>
        <Typography variant="body1" sx={{ maxWidth: 800, mx: 'auto' }}>
          Our REST API allows you to access company data, post requirements, and leverage our 
          AI matching capabilities in your own applications.
        </Typography>
      </Box>

      {/* API Features */}
      <Box sx={{ mb: 8 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, color: 'rgb(30, 86, 86)', mb: 4, textAlign: 'center' }}>
          API Features
        </Typography>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card sx={{ height: '100%', textAlign: 'center', p: 2 }}>
                <CardContent>
                  <Box sx={{ 
                    width: 60, 
                    height: 60, 
                    borderRadius: '50%', 
                    bgcolor: 'rgba(30, 86, 86, 0.1)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 2
                  }}>
                    <Box sx={{ color: 'rgb(30, 86, 86)', fontSize: 24 }}>
                      {feature.icon}
                    </Box>
                  </Box>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Getting Started */}
      <Grid container spacing={6} sx={{ mb: 8 }}>
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 4, height: '100%' }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, color: 'rgb(30, 86, 86)' }}>
              Getting Started
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              To get started with our API:
            </Typography>
            <Box component="ol" sx={{ pl: 2 }}>
              <Typography component="li" variant="body1" sx={{ mb: 1 }}>
                Sign up for an Upflyover account
              </Typography>
              <Typography component="li" variant="body1" sx={{ mb: 1 }}>
                Generate your API key in account settings
              </Typography>
              <Typography component="li" variant="body1" sx={{ mb: 1 }}>
                Make your first API call
              </Typography>
              <Typography component="li" variant="body1" sx={{ mb: 1 }}>
                Start building amazing integrations
              </Typography>
            </Box>
            <Button 
              variant="contained" 
              sx={{ mt: 3, bgcolor: 'rgb(30, 86, 86)' }}
            >
              Get API Key
            </Button>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ p: 4, height: '100%', bgcolor: '#f8f9fa' }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, color: 'rgb(30, 86, 86)' }}>
              Base URL
            </Typography>
            <Box sx={{ 
              bgcolor: '#333', 
              color: 'white', 
              p: 2, 
              borderRadius: 1, 
              fontFamily: 'monospace',
              mb: 3
            }}>
              https://api.upflyover.com/v1
            </Box>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Authentication
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Include your API key in the Authorization header:
            </Typography>
            <Box sx={{ 
              bgcolor: '#333', 
              color: 'white', 
              p: 2, 
              borderRadius: 1, 
              fontFamily: 'monospace',
              fontSize: '0.9rem'
            }}>
              Authorization: Bearer {API_KEY}
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* API Endpoints */}
      <Card sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, color: 'rgb(30, 86, 86)' }}>
          API Endpoints
        </Typography>
        <Grid container spacing={2}>
          {endpoints.map((endpoint, index) => (
            <Grid item xs={12} key={index}>
              <Card variant="outlined" sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Chip 
                    label={endpoint.method} 
                    color={endpoint.method === 'GET' ? 'success' : 'primary'}
                    sx={{ fontWeight: 600, minWidth: 60 }}
                  />
                  <Typography variant="h6" sx={{ fontFamily: 'monospace', fontWeight: 600 }}>
                    {endpoint.endpoint}
                  </Typography>
                  <Chip 
                    label={endpoint.auth} 
                    variant="outlined" 
                    size="small"
                    color={endpoint.auth === 'Required' ? 'warning' : 'default'}
                  />
                </Box>
                <Typography variant="body1" color="text.secondary">
                  {endpoint.description}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Card>
    </Container>
  );
};

export default ApiDocs;