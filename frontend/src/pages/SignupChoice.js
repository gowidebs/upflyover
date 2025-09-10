import React from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Business, Person } from '@mui/icons-material';

const SignupChoice = () => {
  const navigate = useNavigate();

  return (
    <Container component="main" maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography component="h1" variant="h4" gutterBottom>
            Join Upflyover
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4, textAlign: 'center' }}>
            Choose how you want to join our platform
          </Typography>

          <Grid container spacing={4} sx={{ maxWidth: 800 }}>
            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 3 }}>
                  <Person sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                  <Typography variant="h5" component="h2" gutterBottom>
                    Individual
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Perfect for freelancers, consultants, and individual professionals
                  </Typography>
                  <Box sx={{ textAlign: 'left', mt: 2 }}>
                    <Typography variant="body2" sx={{ mb: 1 }}>✓ Post up to 4 requirements/month (Free)</Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>✓ Receive quotations from companies</Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>✓ Manual verification for quality</Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>✓ Emirates ID verification</Typography>
                  </Box>
                </CardContent>
                <CardActions sx={{ p: 3, pt: 0 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    onClick={() => navigate('/signup/individual')}
                  >
                    Sign Up as Individual
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
                    For businesses looking to provide services and grow their network
                  </Typography>
                  <Box sx={{ textAlign: 'left', mt: 2 }}>
                    <Typography variant="body2" sx={{ mb: 1 }}>✓ Browse and respond to requirements</Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>✓ Submit quotations and proposals</Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>✓ Full KYC verification</Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>✓ Multiple pricing tiers available</Typography>
                  </Box>
                </CardContent>
                <CardActions sx={{ p: 3, pt: 0 }}>
                  <Button
                    fullWidth
                    variant="outlined"
                    size="large"
                    onClick={() => navigate('/register')}
                  >
                    Sign Up as Company
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          </Grid>

          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Already have an account?{' '}
              <Button variant="text" onClick={() => navigate('/login')}>
                Sign In
              </Button>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default SignupChoice;