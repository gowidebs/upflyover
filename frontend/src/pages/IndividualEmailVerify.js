import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

const IndividualEmailVerify = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userId, userType } = location.state || {};
  
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleVerifyEmail = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'https://upflyover-production.up.railway.app/api';
      const response = await fetch(`${apiUrl}/auth/individual/verify-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          otp
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Email verified successfully!');
        navigate('/user-type-selection', { 
          state: { 
            userId: data.userId, 
            email: data.email 
          } 
        });
      } else {
        setError(data.error || 'Verification failed');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    }

    setLoading(false);
  };

  const handleResendOTP = async () => {
    // Implement resend OTP functionality
    toast.info('OTP resent to your email');
  };

  if (!userId) {
    return (
      <Container component="main" maxWidth="sm" sx={{ mt: 8 }}>
        <Alert severity="error">
          Invalid access. Please sign up again.
        </Alert>
      </Container>
    );
  }

  return (
    <Container component="main" maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography component="h1" variant="h4" gutterBottom>
            Verify Your Email
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
            We've sent a verification code to your email address. Please enter it below.
          </Typography>

          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleVerifyEmail} sx={{ width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="otp"
              label="Verification Code"
              name="otp"
              autoFocus
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter 6-digit code"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? 'Verifying...' : 'Verify Email'}
            </Button>
            <Button
              fullWidth
              variant="text"
              onClick={handleResendOTP}
            >
              Resend Code
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default IndividualEmailVerify;