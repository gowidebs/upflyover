import React from 'react';
import {
  Container,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Alert
} from '@mui/material';
import { Warning, Assignment } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const KYCPending = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const getStatusMessage = () => {
    if (user?.kycStatus === 'pending') {
      return {
        title: 'KYC Verification Required',
        message: 'Please complete your KYC verification to access all platform features.',
        action: 'Complete KYC',
        route: '/kyc',
        severity: 'warning'
      };
    } else if (user?.kycStatus === 'submitted') {
      return {
        title: 'KYC Under Review',
        message: 'Your KYC documents are being reviewed. You will be notified once approved.',
        action: 'Back to Dashboard',
        route: '/dashboard',
        severity: 'info'
      };
    } else if (user?.kycStatus === 'rejected') {
      return {
        title: 'KYC Verification Rejected',
        message: 'Your KYC submission was rejected. Please resubmit with correct documents.',
        action: 'Resubmit KYC',
        route: '/kyc',
        severity: 'error'
      };
    }
    return {
      title: 'Account Status',
      message: 'Please contact support for assistance.',
      action: 'Contact Support',
      route: '/contact',
      severity: 'info'
    };
  };

  const status = getStatusMessage();

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Card>
        <CardContent sx={{ textAlign: 'center', py: 6 }}>
          <Box sx={{ mb: 3 }}>
            {status.severity === 'warning' ? (
              <Assignment sx={{ fontSize: 80, color: 'warning.main' }} />
            ) : (
              <Warning sx={{ fontSize: 80, color: `${status.severity}.main` }} />
            )}
          </Box>
          
          <Typography variant="h4" gutterBottom>
            {status.title}
          </Typography>
          
          <Alert severity={status.severity} sx={{ mb: 3, maxWidth: 500, mx: 'auto' }}>
            {status.message}
          </Alert>
          
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate(status.route)}
            sx={{ px: 4, py: 1.5 }}
          >
            {status.action}
          </Button>
        </CardContent>
      </Card>
    </Container>
  );
};

export default KYCPending;