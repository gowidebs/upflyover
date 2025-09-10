import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Box,
  Alert,
  CircularProgress
} from '@mui/material';
import { toast } from 'react-toastify';
import axios from 'axios';

const VerifyRemaining = ({ user, onVerificationComplete }) => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState('');

  const needsEmailVerification = !user.emailVerified;
  const needsPhoneVerification = !user.phoneVerified;
  const verificationType = needsEmailVerification ? 'email' : 'phone';

  if (!needsEmailVerification && !needsPhoneVerification) {
    return null; // Both verified
  }

  const sendOTP = async () => {
    setLoading(true);
    setError('');

    try {
      await axios.post('/api/auth/verify-remaining', {
        type: verificationType
      });

      setOtpSent(true);
      toast.success(`Verification code sent to your ${verificationType}`);
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to send verification code');
    }

    setLoading(false);
  };

  const verifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const endpoint = verificationType === 'email' 
        ? '/api/auth/verify-email-otp' 
        : '/api/auth/verify-phone-otp';

      await axios.post(endpoint, {
        companyId: user.id,
        otp
      });

      toast.success(`${verificationType} verified successfully!`);
      onVerificationComplete();
    } catch (error) {
      setError(error.response?.data?.error || 'Verification failed');
    }

    setLoading(false);
  };

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Complete Your Verification
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Verify your {verificationType} to enhance account security
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {!otpSent ? (
          <Button
            variant="contained"
            onClick={sendOTP}
            disabled={loading}
            fullWidth
          >
            {loading ? <CircularProgress size={20} /> : `Send Code to ${verificationType}`}
          </Button>
        ) : (
          <Box>
            <TextField
              fullWidth
              label="Verification Code"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="Enter 6-digit code"
              sx={{ mb: 2 }}
            />
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="contained"
                onClick={verifyOTP}
                disabled={loading || otp.length !== 6}
                sx={{ flexGrow: 1 }}
              >
                {loading ? <CircularProgress size={20} /> : 'Verify'}
              </Button>
              <Button
                variant="outlined"
                onClick={sendOTP}
                disabled={loading}
              >
                Resend
              </Button>
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default VerifyRemaining;