import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Stepper,
  Step,
  StepLabel,
  Grid,
  Card,
  CardContent
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

const IndividualVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userId } = location.state || {};
  
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [mobileData, setMobileData] = useState({
    phone: '',
    otp: ''
  });
  
  const [personalData, setPersonalData] = useState({
    fullName: '',
    emiratesId: '',
    dateOfBirth: '',
    nationality: '',
    address: ''
  });
  
  const [kycData, setKycData] = useState({
    emiratesIdFront: null,
    emiratesIdBack: null,
    passport: null
  });

  const steps = ['Mobile Verification', 'Personal Details', 'KYC Documents'];

  const handleMobileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/individual/verify-mobile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          phone: mobileData.phone
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('OTP sent to your mobile number');
        // Move to OTP verification step within mobile verification
      } else {
        setError(data.error || 'Failed to send OTP');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    }

    setLoading(false);
  };

  const handleOtpVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/individual/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          phone: mobileData.phone,
          otp: mobileData.otp
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Mobile number verified successfully');
        setActiveStep(1);
      } else {
        setError(data.error || 'Invalid OTP');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    }

    setLoading(false);
  };

  const handlePersonalDetailsSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/individual/personal-details', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          ...personalData
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Personal details saved successfully');
        setActiveStep(2);
      } else {
        setError(data.error || 'Failed to save personal details');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    }

    setLoading(false);
  };

  const handleKycSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('userId', userId);
    if (kycData.emiratesIdFront) formData.append('emiratesIdFront', kycData.emiratesIdFront);
    if (kycData.emiratesIdBack) formData.append('emiratesIdBack', kycData.emiratesIdBack);
    if (kycData.passport) formData.append('passport', kycData.passport);

    try {
      const response = await fetch('/api/auth/individual/kyc-submit', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('KYC documents submitted successfully! Your account will be reviewed within 1-2 business days.');
        navigate('/kyc-pending', { state: { userType: 'individual' } });
      } else {
        setError(data.error || 'Failed to submit KYC documents');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    }

    setLoading(false);
  };

  const renderMobileVerification = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Verify Your Mobile Number
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          We'll send you an OTP to verify your mobile number
        </Typography>
        
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        
        <Box component="form" onSubmit={mobileData.otp ? handleOtpVerify : handleMobileSubmit}>
          <TextField
            fullWidth
            label="Mobile Number"
            value={mobileData.phone}
            onChange={(e) => setMobileData({...mobileData, phone: e.target.value})}
            placeholder="+971501234567"
            helperText="Include country code"
            required
            disabled={mobileData.otp}
            sx={{ mb: 2 }}
          />
          
          {mobileData.otp !== '' && (
            <TextField
              fullWidth
              label="Enter OTP"
              value={mobileData.otp}
              onChange={(e) => setMobileData({...mobileData, otp: e.target.value})}
              required
              sx={{ mb: 2 }}
            />
          )}
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
          >
            {loading ? 'Processing...' : (mobileData.otp ? 'Verify OTP' : 'Send OTP')}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );

  const renderPersonalDetails = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Personal Information
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Please provide your personal details for verification
        </Typography>
        
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        
        <Box component="form" onSubmit={handlePersonalDetailsSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Full Name"
                value={personalData.fullName}
                onChange={(e) => setPersonalData({...personalData, fullName: e.target.value})}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Emirates ID"
                value={personalData.emiratesId}
                onChange={(e) => setPersonalData({...personalData, emiratesId: e.target.value})}
                placeholder="784-XXXX-XXXXXXX-X"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Date of Birth"
                type="date"
                value={personalData.dateOfBirth}
                onChange={(e) => setPersonalData({...personalData, dateOfBirth: e.target.value})}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Nationality"
                value={personalData.nationality}
                onChange={(e) => setPersonalData({...personalData, nationality: e.target.value})}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                multiline
                rows={3}
                value={personalData.address}
                onChange={(e) => setPersonalData({...personalData, address: e.target.value})}
                required
              />
            </Grid>
          </Grid>
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{ mt: 3 }}
          >
            {loading ? 'Saving...' : 'Continue'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );

  const renderKycDocuments = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          KYC Document Upload
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Upload clear photos of your identification documents
        </Typography>
        
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        
        <Box component="form" onSubmit={handleKycSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" gutterBottom>
                Emirates ID (Front) *
              </Typography>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setKycData({...kycData, emiratesIdFront: e.target.files[0]})}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" gutterBottom>
                Emirates ID (Back) *
              </Typography>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setKycData({...kycData, emiratesIdBack: e.target.files[0]})}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Passport (Optional)
              </Typography>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setKycData({...kycData, passport: e.target.files[0]})}
              />
            </Grid>
          </Grid>
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{ mt: 3 }}
          >
            {loading ? 'Submitting...' : 'Submit KYC Documents'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );

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
    <Container component="main" maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography component="h1" variant="h4" gutterBottom align="center">
          Individual Account Verification
        </Typography>
        
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {activeStep === 0 && renderMobileVerification()}
        {activeStep === 1 && renderPersonalDetails()}
        {activeStep === 2 && renderKycDocuments()}
      </Paper>
    </Container>
  );
};

export default IndividualVerification;