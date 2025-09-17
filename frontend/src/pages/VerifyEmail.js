import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Alert,
  CircularProgress,
  TextField
} from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const VerifyEmail = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [manualToken, setManualToken] = useState('');

  const token = searchParams.get('token');

  useEffect(() => {
    if (token) {
      verifyEmail(token);
    }
  }, [token]);

  const verifyEmail = async (verificationToken) => {
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('/api/auth/verify-email', {
        token: verificationToken
      });

      if (response.data.token) {
        // Auto-login after verification
        localStorage.setItem('upflyover_token', response.data.token);
        setSuccess(true);
        toast.success('Email verified successfully! Welcome to Upflyover!');
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      }
    } catch (error) {
      setError(error.response?.data?.error || 'Verification failed');
    }

    setLoading(false);
  };

  const handleManualVerification = () => {
    if (manualToken.trim()) {
      verifyEmail(manualToken.trim());
    }
  };

  return (
    <Container component="main" maxWidth="sm" sx={{ mt: 8, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography component="h1" variant="h4" gutterBottom>
            Email Verification
          </Typography>

          {loading && (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', my: 3 }}>
              <CircularProgress sx={{ mb: 2 }} />
              <Typography>Verifying your email...</Typography>
            </Box>
          )}

          {success && (
            <Alert severity="success" sx={{ width: '100%', mb: 2 }}>
              Email verified successfully! Redirecting to dashboard...
            </Alert>
          )}

          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {error}
            </Alert>
          )}

          {!token && !loading && (
            <Box sx={{ width: '100%', mt: 2 }}>
              <Typography variant="body1" sx={{ mb: 3, textAlign: 'center' }}>
                Please check your email for the verification link, or enter the verification code below:
              </Typography>
              
              <TextField
                fullWidth
                label="Verification Token"
                value={manualToken}
                onChange={(e) => setManualToken(e.target.value)}
                sx={{ mb: 2 }}
                placeholder="Enter verification token from email"
              />
              
              <Button
                fullWidth
                variant="contained"
                onClick={handleManualVerification}
                disabled={!manualToken.trim() || loading}
              >
                Verify Email
              </Button>
            </Box>
          )}

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Button
              variant="text"
              onClick={() => navigate('/login')}
            >
              Back to Login
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default VerifyEmail;