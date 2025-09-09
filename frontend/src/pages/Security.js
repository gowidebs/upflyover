import React from 'react';
import { Container, Typography, Box, Grid, Card, CardContent, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { Security as SecurityIcon, Check, Shield, Lock, Verified } from '@mui/icons-material';

const Security = () => {
  const securityFeatures = [
    {
      icon: <Shield />,
      title: 'Data Encryption',
      description: 'All data is encrypted in transit and at rest using industry-standard AES-256 encryption.'
    },
    {
      icon: <Lock />,
      title: 'Secure Authentication',
      description: 'Multi-factor authentication and secure password policies protect your account.'
    },
    {
      icon: <Verified />,
      title: 'Company Verification',
      description: 'Rigorous verification process ensures all companies on our platform are legitimate.'
    },
    {
      icon: <SecurityIcon />,
      title: 'Regular Security Audits',
      description: 'Third-party security audits and penetration testing ensure platform security.'
    }
  ];

  const certifications = [
    'SOC 2 Type II Certified',
    'ISO 27001 Compliant',
    'GDPR Compliant',
    'SSL/TLS Encryption',
    'Regular Penetration Testing',
    'Data Backup & Recovery'
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box sx={{ textAlign: 'center', mb: 8 }}>
        <Typography variant="h2" gutterBottom sx={{ fontWeight: 700, color: 'rgb(30, 86, 86)' }}>
          Security & Trust
        </Typography>
        <Typography variant="h5" sx={{ color: 'text.secondary', mb: 4 }}>
          Your data and privacy are our top priorities
        </Typography>
        <Typography variant="body1" sx={{ maxWidth: 800, mx: 'auto' }}>
          We implement enterprise-grade security measures to protect your business information and ensure safe, 
          trusted connections between companies on our platform.
        </Typography>
      </Box>

      {/* Security Features */}
      <Box sx={{ mb: 8 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, color: 'rgb(30, 86, 86)', mb: 4, textAlign: 'center' }}>
          Security Features
        </Typography>
        <Grid container spacing={4}>
          {securityFeatures.map((feature, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Card sx={{ height: '100%', p: 3 }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Box sx={{ 
                    width: 80, 
                    height: 80, 
                    borderRadius: '50%', 
                    bgcolor: 'rgba(30, 86, 86, 0.1)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 3
                  }}>
                    <Box sx={{ color: 'rgb(30, 86, 86)', fontSize: 32 }}>
                      {feature.icon}
                    </Box>
                  </Box>
                  <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: 'rgb(30, 86, 86)' }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Certifications */}
      <Grid container spacing={6}>
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 4, height: '100%' }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, color: 'rgb(30, 86, 86)' }}>
              Certifications & Compliance
            </Typography>
            <List>
              {certifications.map((cert, index) => (
                <ListItem key={index} sx={{ px: 0 }}>
                  <ListItemIcon>
                    <Check color="success" />
                  </ListItemIcon>
                  <ListItemText primary={cert} />
                </ListItem>
              ))}
            </List>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ p: 4, height: '100%', bgcolor: '#f8f9fa' }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, color: 'rgb(30, 86, 86)' }}>
              Data Protection
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              We are committed to protecting your business data and personal information:
            </Typography>
            <List>
              <ListItem sx={{ px: 0 }}>
                <ListItemIcon><Check color="success" /></ListItemIcon>
                <ListItemText primary="Data is stored in secure, geographically distributed data centers" />
              </ListItem>
              <ListItem sx={{ px: 0 }}>
                <ListItemIcon><Check color="success" /></ListItemIcon>
                <ListItemText primary="Regular automated backups ensure data recovery" />
              </ListItem>
              <ListItem sx={{ px: 0 }}>
                <ListItemIcon><Check color="success" /></ListItemIcon>
                <ListItemText primary="Access controls limit data access to authorized personnel only" />
              </ListItem>
              <ListItem sx={{ px: 0 }}>
                <ListItemIcon><Check color="success" /></ListItemIcon>
                <ListItemText primary="Data retention policies ensure compliance with regulations" />
              </ListItem>
            </List>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Security;