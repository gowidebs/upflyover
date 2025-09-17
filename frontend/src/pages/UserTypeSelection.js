import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  Grid,
  Alert
} from '@mui/material';
import { Business, Person } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

const UserTypeSelection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { userId, email } = location.state || {};

  const handleUserTypeSelection = async (userType) => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/select-user-type', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          userType
        }),
      });

      const data = await response.json();

      if (response.ok) {
        if (userType === 'individual') {
          toast.success('Please verify your mobile number and complete KYC');
          navigate('/individual-verification', { state: { userId, userType } });
        } else {
          toast.success('Please complete company KYC verification');
          navigate('/kyc', { state: { userId, userType } });
        }
      } else {
        setError(data.error || 'Selection failed');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    }

    setLoading(false);
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
    <Container component="main" maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography component="h1" variant="h4" gutterBottom>
            Choose Your Account Type
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4, textAlign: 'center' }}>
            Welcome {email}! Please select how you want to use Upflyover
          </Typography>

          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {error}
            </Alert>
          )}

          <Grid container spacing={4} sx={{ maxWidth: 800 }}>
            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 3 }}>
                  <Person sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                  <Typography variant="h5" component="h2" gutterBottom>
                    Individual
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    I want to post requirements and get quotations
                  </Typography>
                  <Box sx={{ textAlign: 'left', mt: 2 }}>
                    <Typography variant="body2" sx={{ mb: 1 }}>• Post up to 4 requirements/month</Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>• Receive quotations from companies</Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>• Emirates ID verification required</Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>• Mobile number verification</Typography>
                  </Box>
                </CardContent>
                <CardActions sx={{ p: 3, pt: 0 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    onClick={() => handleUserTypeSelection('individual')}
                    disabled={loading}
                  >
                    Continue as Individual
                  </Button>
                </CardActions>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 3 }}>
                  <Business sx={{ fontSize: 60, color: 'secondary.main', mb: 2 }} />
                  <Typography variant="h5" component="h2" gutterBottom>
                    Company
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    I want to provide services and respond to requirements
                  </Typography>
                  <Box sx={{ textAlign: 'left', mt: 2 }}>
                    <Typography variant="body2" sx={{ mb: 1 }}>• Browse all requirements</Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>• Submit quotations and proposals</Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>• Full company KYC verification</Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>• Access to premium features</Typography>
                  </Box>
                </CardContent>
                <CardActions sx={{ p: 3, pt: 0 }}>
                  <Button
                    fullWidth
                    variant="outlined"
                    size="large"
                    onClick={() => handleUserTypeSelection('company')}
                    disabled={loading}
                  >
                    Continue as Company
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default UserTypeSelection;