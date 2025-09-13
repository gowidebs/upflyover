import React, { useState, useEffect } from 'react';
import { 
  Card, CardContent, Typography, Button, Box, 
  Chip, Alert, CircularProgress 
} from '@mui/material';
import { Star, Cancel, Settings } from '@mui/icons-material';
import { 
  getSubscriptionStatus, 
  cancelSubscription, 
  createBillingPortalSession 
} from '../utils/stripe';

const SubscriptionStatus = () => {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  
  const token = localStorage.getItem('token');
  
  useEffect(() => {
    loadSubscription();
  }, []);
  
  const loadSubscription = async () => {
    try {
      const status = await getSubscriptionStatus(token);
      setSubscription(status);
    } catch (error) {
      setError('Failed to load subscription status');
    } finally {
      setLoading(false);
    }
  };
  
  const handleCancelSubscription = async () => {
    if (!window.confirm('Are you sure you want to cancel your subscription? You will lose access to premium features at the end of your billing period.')) {
      return;
    }
    
    setActionLoading(true);
    try {
      await cancelSubscription(token);
      await loadSubscription(); // Refresh status
      alert('Subscription cancelled successfully. You will retain access until the end of your billing period.');
    } catch (error) {
      setError('Failed to cancel subscription');
    } finally {
      setActionLoading(false);
    }
  };
  
  const handleBillingPortal = async () => {
    setActionLoading(true);
    try {
      const result = await createBillingPortalSession(token);
      window.location.href = result.portalUrl;
    } catch (error) {
      setError('Failed to access billing portal');
      setActionLoading(false);
    }
  };
  
  if (loading) {
    return (
      <Card>
        <CardContent sx={{ textAlign: 'center', py: 4 }}>
          <CircularProgress />
          <Typography sx={{ mt: 2 }}>Loading subscription...</Typography>
        </CardContent>
      </Card>
    );
  }
  
  if (!subscription) {
    return null;
  }
  
  const getPlanColor = (plan) => {
    switch (plan) {
      case 'professional': return 'primary';
      case 'enterprise': return 'secondary';
      default: return 'default';
    }
  };
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'trialing': return 'info';
      case 'canceled': return 'warning';
      case 'past_due': return 'error';
      default: return 'default';
    }
  };
  
  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Star sx={{ mr: 1, color: 'rgb(30, 86, 86)' }} />
          <Typography variant="h6">Subscription Status</Typography>
        </Box>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>\n            {error}\n          </Alert>\n        )}\n        \n        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <Chip \n            label={subscription.plan.charAt(0).toUpperCase() + subscription.plan.slice(1)} \n            color={getPlanColor(subscription.plan)}\n            variant=\"outlined\"\n          />\n          {subscription.hasSubscription && (\n            <Chip \n              label={subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)} \n              color={getStatusColor(subscription.status)}\n              size=\"small\"\n            />\n          )}\n        </Box>\n        \n        {subscription.plan === 'starter' ? (\n          <Typography color=\"text.secondary\" sx={{ mb: 2 }}>\n            You're on the free Starter plan. Upgrade to unlock premium features.\n          </Typography>\n        ) : (\n          <>\n            {subscription.trialEnd && new Date(subscription.trialEnd * 1000) > new Date() && (\n              <Alert severity=\"info\" sx={{ mb: 2 }}>\n                Free trial active until {new Date(subscription.trialEnd * 1000).toLocaleDateString()}\n              </Alert>\n            )}\n            \n            {subscription.cancelAtPeriodEnd && (\n              <Alert severity=\"warning\" sx={{ mb: 2 }}>\n                Subscription will end on {new Date(subscription.currentPeriodEnd * 1000).toLocaleDateString()}\n              </Alert>\n            )}\n            \n            <Typography color=\"text.secondary\" sx={{ mb: 2 }}>\n              {subscription.cancelAtPeriodEnd \n                ? 'Your subscription is set to cancel at the end of the billing period.'\n                : `Next billing date: ${new Date(subscription.currentPeriodEnd * 1000).toLocaleDateString()}`\n              }\n            </Typography>\n          </>\n        )}\n        \n        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {subscription.hasSubscription && (\n            <>\n              <Button\n                variant=\"outlined\"\n                startIcon={<Settings />}\n                onClick={handleBillingPortal}\n                disabled={actionLoading}\n                size=\"small\"\n              >\n                Manage Billing\n              </Button>\n              \n              {!subscription.cancelAtPeriodEnd && (\n                <Button\n                  variant=\"outlined\"\n                  color=\"error\"\n                  startIcon={<Cancel />}\n                  onClick={handleCancelSubscription}\n                  disabled={actionLoading}\n                  size=\"small\"\n                >\n                  Cancel Subscription\n                </Button>\n              )}\n            </>\n          )}\n        </Box>\n      </CardContent>\n    </Card>\n  );\n};\n\nexport default SubscriptionStatus;