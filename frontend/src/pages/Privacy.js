import React from 'react';
import { Container, Typography, Box, Card, CardContent } from '@mui/material';

const Privacy = () => {
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h2" gutterBottom sx={{ fontWeight: 700, color: 'rgb(30, 86, 86)' }}>
          Privacy Policy
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Last updated: December 15, 2024
        </Typography>
      </Box>

      <Card sx={{ p: 4 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: 'rgb(30, 86, 86)' }}>
            Information We Collect
          </Typography>
          <Typography variant="body1" sx={{ mb: 4 }}>
            We collect information you provide directly to us, such as when you create an account, 
            update your profile, or communicate with us. This includes your name, email address, 
            company information, and business details.
          </Typography>

          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: 'rgb(30, 86, 86)' }}>
            How We Use Your Information
          </Typography>
          <Typography variant="body1" sx={{ mb: 4 }}>
            We use the information we collect to provide, maintain, and improve our services, 
            process transactions, send communications, and ensure platform security. We also 
            use this information to match you with relevant business opportunities.
          </Typography>

          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: 'rgb(30, 86, 86)' }}>
            Information Sharing
          </Typography>
          <Typography variant="body1" sx={{ mb: 4 }}>
            We do not sell, trade, or otherwise transfer your personal information to third parties 
            without your consent, except as described in this policy. We may share information with 
            service providers who assist us in operating our platform.
          </Typography>

          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: 'rgb(30, 86, 86)' }}>
            Data Security
          </Typography>
          <Typography variant="body1" sx={{ mb: 4 }}>
            We implement appropriate security measures to protect your personal information against 
            unauthorized access, alteration, disclosure, or destruction. This includes encryption, 
            secure servers, and regular security audits.
          </Typography>

          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: 'rgb(30, 86, 86)' }}>
            Your Rights
          </Typography>
          <Typography variant="body1" sx={{ mb: 4 }}>
            You have the right to access, update, or delete your personal information. You may also 
            opt out of certain communications from us. To exercise these rights, please contact us 
            at privacy@upflyover.com.
          </Typography>

          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: 'rgb(30, 86, 86)' }}>
            Contact Us
          </Typography>
          <Typography variant="body1">
            If you have any questions about this Privacy Policy, please contact us at 
            privacy@upflyover.com or write to us at our Dubai office.
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Privacy;