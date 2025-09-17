import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Grid,
  Chip,
  CircularProgress
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const VerifyOTP = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  
  const [companyId, setCompanyId] = useState('');
  const [emailOTP, setEmailOTP] = useState('');
  const [phoneOTP, setPhoneOTP] = useState('');
  const [emailVerified, setEmailVerified] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState({ email: false, phone: false });
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(600); // 10 minutes

  useEffect(() => {
    // Get company ID from location state
    if (location.state?.companyId) {
      setCompanyId(location.state.companyId);
    } else {
      navigate('/signup');
    }
  }, [location, navigate]);

  useEffect(() => {
    // Countdown timer
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer(timer - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const verifyEmailOTP = async () => {
    if (!emailOTP || emailOTP.length !== 6) {
      setError('Please enter a valid 6-digit email OTP');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post('/auth/verify-email-otp', {
        companyId,
        otp: emailOTP
      });

      setEmailVerified(true);
      toast.success('Email verified successfully!');
      
      // Check if both are verified
      if (phoneVerified) {
        completeVerification();
      }
    } catch (error) {
      setError(error.response?.data?.error || 'Email verification failed');
    }

    setLoading(false);
  };

  const verifyPhoneOTP = async () => {
    if (!phoneOTP || phoneOTP.length !== 6) {
      setError('Please enter a valid 6-digit phone OTP');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post('/auth/verify-phone-otp', {
        companyId,
        otp: phoneOTP
      });

      setPhoneVerified(true);
      toast.success('Phone verified successfully!');
      
      // Check if both are verified
      if (emailVerified) {
        completeVerification();
      }
    } catch (error) {
      setError(error.response?.data?.error || 'Phone verification failed');
    }

    setLoading(false);
  };

  const completeVerification = async () => {
    try {
      const response = await axios.post('/auth/complete-verification', {
        companyId
      });

      const { token, company } = response.data;
      
      // Store token and user data
      localStorage.setItem('upflyover_token', token);
      
      toast.success('Account verified successfully! Welcome to Upflyover!');
      navigate('/dashboard');
    } catch (error) {
      setError(error.response?.data?.error || 'Verification completion failed');
    }
  };

  // Check if we can proceed with single verification
  const canProceedWithSingle = emailVerified || phoneVerified;

  const proceedWithSingleVerification = () => {
    if (canProceedWithSingle) {
      completeVerification();
    }
  };

  const resendOTP = async (type) => {
    setResendLoading({ ...resendLoading, [type]: true });
    
    try {
      await axios.post('/auth/resend-otp', {
        companyId,
        type
      });

      toast.success(`${type === 'email' ? 'Email' : 'Phone'} OTP sent successfully!`);
      setTimer(600); // Reset timer
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to resend OTP');
    }

    setResendLoading({ ...resendLoading, [type]: false });
  };

  const handleEmailOTPChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setEmailOTP(value);
    setError('');
  };

  const handlePhoneOTPChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setPhoneOTP(value);
    setError('');
  };

  return (
    <Container component="main" maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography component="h1" variant="h4" gutterBottom>
            Verify Your Account
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
            We've sent verification codes to your email and phone number. Please enter them below to complete your registration.
          </Typography>

          <Box sx={{ mb: 2 }}>
            <Chip 
              label={`Time remaining: ${formatTime(timer)}`} 
              color={timer < 60 ? 'error' : 'primary'} 
              variant="outlined" 
            />
          </Box>

          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {error}
            </Alert>
          )}

          <Grid container spacing={3} sx={{ width: '100%' }}>
            {/* Email OTP Section */}
            <Grid item xs={12} md={6}>
              <Paper variant="outlined" sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    Email Verification
                  </Typography>
                  {emailVerified && (
                    <Chip label="Verified" color="success" size="small" />
                  )}
                </Box>
                
                <TextField
                  fullWidth
                  label="Email OTP"
                  value={emailOTP}
                  onChange={handleEmailOTPChange}
                  placeholder="Enter 6-digit code"
                  disabled={emailVerified || loading}
                  inputProps={{ maxLength: 6, style: { textAlign: 'center', fontSize: '1.2em' } }}
                  sx={{ mb: 2 }}
                />
                
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="contained"
                    onClick={verifyEmailOTP}
                    disabled={emailVerified || loading || emailOTP.length !== 6}
                    sx={{ flexGrow: 1 }}
                  >
                    {loading ? <CircularProgress size={20} /> : 'Verify Email'}
                  </Button>
                  
                  <Button
                    variant="outlined"
                    onClick={() => resendOTP('email')}
                    disabled={emailVerified || resendLoading.email}
                    size="small"
                  >
                    {resendLoading.email ? <CircularProgress size={16} /> : 'Resend'}
                  </Button>
                </Box>
              </Paper>
            </Grid>

            {/* Phone OTP Section */}
            <Grid item xs={12} md={6}>
              <Paper variant="outlined" sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    Phone Verification
                  </Typography>
                  {phoneVerified && (
                    <Chip label="Verified" color="success" size="small" />
                  )}
                </Box>
                
                <TextField
                  fullWidth
                  label="Phone OTP"
                  value={phoneOTP}
                  onChange={handlePhoneOTPChange}
                  placeholder="Enter 6-digit code"
                  disabled={phoneVerified || loading}
                  inputProps={{ maxLength: 6, style: { textAlign: 'center', fontSize: '1.2em' } }}
                  sx={{ mb: 2 }}
                />
                
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="contained"
                    onClick={verifyPhoneOTP}
                    disabled={phoneVerified || loading || phoneOTP.length !== 6}
                    sx={{ flexGrow: 1 }}
                  >
                    {loading ? <CircularProgress size={20} /> : 'Verify Phone'}
                  </Button>
                  
                  <Button
                    variant="outlined"
                    onClick={() => resendOTP('phone')}
                    disabled={phoneVerified || resendLoading.phone}
                    size="small"
                  >
                    {resendLoading.phone ? <CircularProgress size={16} /> : 'Resend'}
                  </Button>
                </Box>
              </Paper>
            </Grid>
          </Grid>

          {emailVerified && phoneVerified && (
            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Alert severity="success" sx={{ mb: 2 }}>
                Both email and phone verified successfully! Completing your registration...
              </Alert>
              <CircularProgress />
            </Box>
          )}

          {canProceedWithSingle && !(emailVerified && phoneVerified) && (
            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Alert severity="info" sx={{ mb: 2 }}>
                {emailVerified ? 'Email verified!' : 'Phone verified!'} You can proceed now or verify the other contact method later.
              </Alert>
              <Button
                variant="contained"
                onClick={proceedWithSingleVerification}
                sx={{ mr: 2 }}
              >
                Continue to Dashboard
              </Button>
              <Button
                variant="outlined"
                onClick={() => {/* Continue verification */}}
              >
                Verify {emailVerified ? 'Phone' : 'Email'} Now
              </Button>
            </Box>
          )}

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Didn't receive the codes? Check your spam folder or click resend above.
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default VerifyOTP;