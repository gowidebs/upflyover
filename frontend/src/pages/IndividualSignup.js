import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Link,
  Alert,
  Divider,
  IconButton
} from '@mui/material';
import { Google, Apple, Email } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

const IndividualSignup = () => {
  const navigate = useNavigate();
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleEmailSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'https://upflyover-production.up.railway.app/api';
      const response = await fetch(`${apiUrl}/auth/individual/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userType: 'individual'
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Registration successful! Please verify your email.');
        navigate('/verify-individual-email', { state: { userId: data.userId, userType: 'individual' } });
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    }

    setLoading(false);
  };

  const handleGoogleSignup = async (credentialResponse) => {
    try {
      setLoading(true);
      setError('');

      // Decode the Google JWT token
      const decoded = jwtDecode(credentialResponse.credential);
      
      // Register with Google data
      const apiUrl = process.env.REACT_APP_API_URL || 'https://upflyover-production.up.railway.app/api';
      const response = await fetch(`${apiUrl}/auth/individual/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: decoded.email,
          password: 'google-oauth-' + decoded.sub, // Use Google ID as password
          fullName: decoded.name,
          userType: 'individual',
          provider: 'google',
          googleId: decoded.sub,
          emailVerified: true // Google emails are pre-verified
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Google signup successful! Please select your user type.');
        navigate('/user-type-selection', { 
          state: { 
            userId: data.userId, 
            email: decoded.email,
            userType: 'individual',
            provider: 'google'
          } 
        });
      } else {
        setError(data.error || 'Google signup failed');
      }
    } catch (error) {
      console.error('Google signup error:', error);
      if (error.message.includes('CORS')) {
        setError('Connection error. Please try email signup.');
      } else {
        setError('Google signup failed. Please try email signup instead.');
      }
    }
    setLoading(false);
  };

  const handleGoogleError = (error) => {
    console.error('Google OAuth error:', error);
    setError('Google signup failed. Please try email signup instead.');
    setLoading(false);
  };

  const handleAppleSignup = () => {
    // Implement Apple OAuth
    toast.info('Apple signup will be implemented soon');
  };

  return (
    <Container component="main" maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography component="h1" variant="h4" gutterBottom>
            Individual Signup
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
            Join as an individual to post requirements and get quotations
          </Typography>

          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {error}
            </Alert>
          )}

          {!showEmailForm ? (
            <Box sx={{ width: '100%' }}>
              {process.env.REACT_APP_GOOGLE_CLIENT_ID && process.env.REACT_APP_GOOGLE_CLIENT_ID !== 'your-google-client-id-here' ? (
                <Box sx={{ mb: 2 }}>
                  <GoogleLogin
                    onSuccess={handleGoogleSignup}
                    onError={handleGoogleError}
                    useOneTap={false}
                    theme="outline"
                    size="large"
                    width="100%"
                    text="continue_with"
                    shape="rectangular"
                  />
                </Box>
              ) : (
                <Button
                  fullWidth
                  variant="outlined"
                  size="large"
                  startIcon={<Google />}
                  onClick={() => toast.info('Google OAuth is being configured. Please use email signup for now.')}
                  sx={{ mb: 2, py: 1.5 }}
                >
                  Continue with Google (Coming Soon)
                </Button>
              )}
              
              <Button
                fullWidth
                variant="outlined"
                size="large"
                startIcon={<Apple />}
                onClick={handleAppleSignup}
                sx={{ mb: 2, py: 1.5, color: 'black', borderColor: 'black' }}
              >
                Continue with Apple
              </Button>

              <Divider sx={{ my: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  or
                </Typography>
              </Divider>

              <Button
                fullWidth
                variant="contained"
                size="large"
                startIcon={<Email />}
                onClick={() => setShowEmailForm(true)}
                sx={{ py: 1.5 }}
              >
                Continue with Email
              </Button>
            </Box>
          ) : (
            <Box component="form" onSubmit={handleEmailSignup} sx={{ width: '100%' }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={formData.email}
                onChange={handleChange}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
                helperText="Minimum 8 characters"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={loading}
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>
              <Button
                fullWidth
                variant="text"
                onClick={() => setShowEmailForm(false)}
              >
                Back to other options
              </Button>
            </Box>
          )}

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Want to register as a company?{' '}
              <Link
                component="button"
                variant="body2"
                onClick={() => navigate('/register')}
                type="button"
              >
                Company Signup
              </Link>
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Already have an account?{' '}
              <Link
                component="button"
                variant="body2"
                onClick={() => navigate('/login')}
                type="button"
              >
                Sign In
              </Link>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default IndividualSignup;