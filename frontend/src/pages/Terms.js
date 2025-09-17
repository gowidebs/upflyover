import React from 'react';
import { Container, Typography, Box, Card, CardContent } from '@mui/material';

const Terms = () => {
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h2" gutterBottom sx={{ fontWeight: 700, color: 'rgb(30, 86, 86)' }}>
          Terms of Service
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Last updated: December 15, 2024
        </Typography>
      </Box>

      <Card sx={{ p: 4 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: 'rgb(30, 86, 86)' }}>
            Acceptance of Terms
          </Typography>
          <Typography variant="body1" sx={{ mb: 4 }}>
            By accessing and using Upflyover, you accept and agree to be bound by the terms and 
            provision of this agreement. If you do not agree to abide by the above, please do 
            not use this service.
          </Typography>

          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: 'rgb(30, 86, 86)' }}>
            Use License
          </Typography>
          <Typography variant="body1" sx={{ mb: 4 }}>
            Permission is granted to temporarily use Upflyover for personal, non-commercial 
            transitory viewing only. This is the grant of a license, not a transfer of title, 
            and under this license you may not modify or copy the materials.
          </Typography>

          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: 'rgb(30, 86, 86)' }}>
            User Accounts
          </Typography>
          <Typography variant="body1" sx={{ mb: 4 }}>
            When you create an account with us, you must provide information that is accurate, 
            complete, and current at all times. You are responsible for safeguarding the password 
            and for all activities that occur under your account.
          </Typography>

          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: 'rgb(30, 86, 86)' }}>
            Prohibited Uses
          </Typography>
          <Typography variant="body1" sx={{ mb: 4 }}>
            You may not use our service for any unlawful purpose, to solicit others to perform 
            unlawful acts, to violate any international, federal, provincial, or state regulations, 
            rules, laws, or local ordinances, or to transmit any harassing, abusive, or threatening material.
          </Typography>

          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: 'rgb(30, 86, 86)' }}>
            Disclaimer
          </Typography>
          <Typography variant="body1" sx={{ mb: 4 }}>
            The materials on Upflyover are provided on an 'as is' basis. Upflyover makes no 
            warranties, expressed or implied, and hereby disclaims and negates all other warranties 
            including without limitation, implied warranties or conditions of merchantability.
          </Typography>

          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: 'rgb(30, 86, 86)' }}>
            Contact Information
          </Typography>
          <Typography variant="body1">
            If you have any questions about these Terms of Service, please contact us at 
            legal@upflyover.com.
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Terms;