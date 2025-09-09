import React, { useState } from 'react';
import { 
  Container, Typography, Box, Grid, Card, CardContent, 
  TextField, Button, Stack, Avatar 
} from '@mui/material';
import { Email, Phone, LocationOn, Schedule, Send } from '@mui/icons-material';
import MobileAppSection from '../components/MobileAppSection';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', subject: '', message: ''
  });

  const contactMethods = [
    {
      icon: <Email />,
      title: 'Email Support',
      info: 'support@upflyover.com',
      description: '24/7 support via email'
    },
    {
      icon: <Phone />,
      title: 'Phone Support',
      info: '+971 4 123 4567',
      description: 'Mon-Fri, 9AM-6PM GST'
    },
    {
      icon: <LocationOn />,
      title: 'Office Address',
      info: 'Dubai Internet City, UAE',
      description: 'Visit us in person'
    },
    {
      icon: <Schedule />,
      title: 'Live Chat',
      info: 'Available 24/7',
      description: 'Instant support online'
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box sx={{ textAlign: 'center', mb: 8 }}>
        <Typography variant="h2" gutterBottom sx={{ fontWeight: 700, color: 'rgb(30, 86, 86)' }}>
          Contact Us
        </Typography>
        <Typography variant="h5" sx={{ color: 'text.secondary' }}>
          Get in touch with our team - we're here to help
        </Typography>
      </Box>

      <Grid container spacing={6}>
        {/* Contact Methods */}
        <Grid item xs={12} md={6}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, color: 'rgb(30, 86, 86)', mb: 4 }}>
            Get In Touch
          </Typography>
          <Grid container spacing={3}>
            {contactMethods.map((method, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Card sx={{ p: 3, textAlign: 'center', height: '100%' }}>
                  <Avatar sx={{ bgcolor: 'rgb(30, 86, 86)', mx: 'auto', mb: 2 }}>
                    {method.icon}
                  </Avatar>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    {method.title}
                  </Typography>
                  <Typography variant="body1" gutterBottom sx={{ fontWeight: 500 }}>
                    {method.info}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {method.description}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>


        </Grid>

        {/* Contact Form */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, color: 'rgb(30, 86, 86)' }}>
              Send us a Message
            </Typography>
            <Box component="form" onSubmit={handleSubmit}>
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  label="Full Name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
                <TextField
                  fullWidth
                  label="Email Address"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
                <TextField
                  fullWidth
                  label="Subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  required
                />
                <TextField
                  fullWidth
                  label="Message"
                  multiline
                  rows={6}
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  required
                />
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  startIcon={<Send />}
                  sx={{
                    bgcolor: 'rgb(30, 86, 86)',
                    '&:hover': { bgcolor: 'rgb(20, 66, 66)' }
                  }}
                >
                  Send Message
                </Button>
              </Stack>
            </Box>
          </Card>
        </Grid>
      </Grid>
      
      {/* Mobile App Section */}
      <MobileAppSection />
    </Container>
  );
};

export default Contact;