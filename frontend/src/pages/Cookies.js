import React from 'react';
import { Container, Typography, Box, Card, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const Cookies = () => {
  const cookieTypes = [
    {
      name: 'Essential Cookies',
      purpose: 'Required for the website to function properly',
      duration: 'Session',
      examples: 'Authentication, security, form submissions'
    },
    {
      name: 'Analytics Cookies',
      purpose: 'Help us understand how visitors use our website',
      duration: '2 years',
      examples: 'Google Analytics, page views, user behavior'
    },
    {
      name: 'Functional Cookies',
      purpose: 'Remember your preferences and settings',
      duration: '1 year',
      examples: 'Language preference, theme settings'
    },
    {
      name: 'Marketing Cookies',
      purpose: 'Used to deliver relevant advertisements',
      duration: '90 days',
      examples: 'Ad targeting, conversion tracking'
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h2" gutterBottom sx={{ fontWeight: 700, color: 'rgb(30, 86, 86)' }}>
          Cookie Policy
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Last updated: December 15, 2024
        </Typography>
      </Box>

      <Card sx={{ p: 4, mb: 4 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: 'rgb(30, 86, 86)' }}>
            What Are Cookies?
          </Typography>
          <Typography variant="body1" sx={{ mb: 4 }}>
            Cookies are small text files that are placed on your computer or mobile device when you 
            visit our website. They are widely used to make websites work more efficiently and provide 
            information to website owners.
          </Typography>

          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: 'rgb(30, 86, 86)' }}>
            How We Use Cookies
          </Typography>
          <Typography variant="body1" sx={{ mb: 4 }}>
            We use cookies to enhance your experience on our platform, remember your preferences, 
            analyze website traffic, and provide personalized content. This helps us improve our 
            services and deliver a better user experience.
          </Typography>
        </CardContent>
      </Card>

      <Card sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: 'rgb(30, 86, 86)' }}>
          Types of Cookies We Use
        </Typography>
        <TableContainer component={Paper} sx={{ mt: 3 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f8f9fa' }}>
                <TableCell sx={{ fontWeight: 600 }}>Cookie Type</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Purpose</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Duration</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Examples</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {cookieTypes.map((cookie, index) => (
                <TableRow key={index}>
                  <TableCell sx={{ fontWeight: 500 }}>{cookie.name}</TableCell>
                  <TableCell>{cookie.purpose}</TableCell>
                  <TableCell>{cookie.duration}</TableCell>
                  <TableCell>{cookie.examples}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'rgb(30, 86, 86)' }}>
            Managing Cookies
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            You can control and manage cookies in various ways:
          </Typography>
          <Typography variant="body1" component="div" sx={{ ml: 2 }}>
            • Browser settings: Most browsers allow you to refuse cookies or delete existing ones<br/>
            • Cookie preferences: Use our cookie preference center to customize your settings<br/>
            • Opt-out tools: Use industry opt-out tools for advertising cookies<br/>
            • Third-party settings: Manage cookies directly through third-party services
          </Typography>
        </Box>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'rgb(30, 86, 86)' }}>
            Contact Us
          </Typography>
          <Typography variant="body1">
            If you have any questions about our use of cookies, please contact us at 
            privacy@upflyover.com.
          </Typography>
        </Box>
      </Card>
    </Container>
  );
};

export default Cookies;