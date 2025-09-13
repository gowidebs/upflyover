import React, { useEffect, useState } from 'react';
import { 
  Container, Typography, Box, Card, CardContent, 
  Button, CircularProgress, Alert 
} from '@mui/material';
import { CheckCircle, Error } from '@mui/icons-material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getSubscriptionStatus } from '../utils/stripe';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [subscription, setSubscription] = useState(null);
  
  const sessionId = searchParams.get('session_id');
  const token = localStorage.getItem('token');
  
  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    
    if (!sessionId) {
      setError('Invalid payment session');
      setLoading(false);
      return;
    }
    
    verifyPayment();
  }, [sessionId, token, navigate]);
  
  const verifyPayment = async () => {
    try {
      // Wait a moment for webhook to process
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const status = await getSubscriptionStatus(token);
      setSubscription(status);
      
      if (status.hasSubscription && status.status === 'active') {
        setSuccess(true);
      } else if (status.status === 'trialing') {
        setSuccess(true);
      } else {
        setError('Payment verification failed. Please contact support.');
      }
    } catch (error) {
      console.error('Payment verification error:', error);
      setError('Failed to verify payment. Please contact support.');
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 3 }}>
          Verifying your payment...
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 1 }}>
          Please wait while we confirm your subscription
        </Typography>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Card sx={{ textAlign: 'center', p: 4 }}>
        <CardContent>
          {success ? (
            <>
              <CheckCircle sx={{ fontSize: 80, color: 'success.main', mb: 3 }} />
              <Typography variant="h4" gutterBottom sx={{ color: 'success.main' }}>
                Payment Successful!
              </Typography>
              <Typography variant="h6" gutterBottom>
                Welcome to {subscription?.plan === 'professional' ? 'Professional' : 'Enterprise'} Plan
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 4 }}>
                Your subscription is now active. You can start using all premium features immediately.
              </Typography>
              
              {subscription?.trialEnd && (
                <Alert severity="info" sx={{ mb: 3 }}>
                  Your 14-day free trial is active until {new Date(subscription.trialEnd * 1000).toLocaleDateString()}
                </Alert>
              )}
              
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                <Button 
                  variant="contained" 
                  onClick={() => navigate('/dashboard')}
                  sx={{ bgcolor: 'rgb(30, 86, 86)' }}
                >
                  Go to Dashboard
                </Button>
                <Button 
                  variant="outlined" 
                  onClick={() => navigate('/requirements')}
                >
                  Browse Requirements
                </Button>
              </Box>
            </>
          ) : (
            <>
              <Error sx={{ fontSize: 80, color: 'error.main', mb: 3 }} />
              <Typography variant="h4" gutterBottom sx={{ color: 'error.main' }}>
                Payment Verification Failed
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 4 }}>
                {error || 'There was an issue verifying your payment. Please contact our support team.'}
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                <Button 
                  variant="contained" 
                  onClick={() => navigate('/pricing')}
                  sx={{ bgcolor: 'rgb(30, 86, 86)' }}
                >
                  Try Again
                </Button>
                <Button 
                  variant="outlined" 
                  onClick={() => window.location.href = 'mailto:support@upflyover.com'}
                >
                  Contact Support
                </Button>
              </Box>
            </>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default PaymentSuccess;