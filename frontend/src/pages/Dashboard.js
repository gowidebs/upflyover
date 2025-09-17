import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Grid, Card, CardContent, Box,
  Avatar, Button, Chip, Stack, LinearProgress,
  List, ListItem, ListItemAvatar, ListItemText,
  IconButton, Paper, Divider, Alert, Dialog,
  DialogTitle, DialogContent, DialogActions, TextField
} from '@mui/material';
import {
  TrendingUp, Business, Message, Notifications,
  Add, Visibility, ThumbUp, Schedule,
  CheckCircle, Warning, Info, Star, Edit, VerifiedUser
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import VerifyRemaining from '../components/VerifyRemaining';
import SubscriptionStatus from '../components/SubscriptionStatus';
import MessagesWidget from '../components/MessagesWidget';


const Dashboard = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const [kycStatus, setKycStatus] = useState(null);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated && !loading) {
      navigate('/login');
      return;
    }
    if (isAuthenticated) {
      fetchKycStatus();
    }
  }, [isAuthenticated, loading, navigate]);

  const fetchKycStatus = async () => {
    // Mock KYC status for now
    setKycStatus({ status: 'pending', submittedAt: null });
  };

  const calculateProfileCompletion = () => {
    const requiredFields = ['name', 'contactPerson', 'phone', 'industry', 'country', 'companySize'];
    const completedFields = requiredFields.filter(field => user?.[field] && user[field].trim() !== '');
    return Math.round((completedFields.length / requiredFields.length) * 100);
  };

  const stats = [
    { title: 'Profile Completion', value: `${calculateProfileCompletion()}%`, change: 'Complete to unlock features', icon: <Business />, color: 'primary' },
    { title: 'KYC Status', value: kycStatus?.status || 'Pending', change: 'Verification required', icon: <VerifiedUser />, color: 'warning' },
    { title: 'Email Status', value: user?.emailVerified ? 'Verified' : 'Pending', change: user?.emailVerified ? 'Verified' : 'Verify email', icon: <CheckCircle />, color: user?.emailVerified ? 'success' : 'warning' },
    { title: 'Account Type', value: user?.companySize || 'Not Set', change: 'Update profile', icon: <Info />, color: 'info' }
  ];



  const recentActivity = [
    {
      id: 1,
      type: 'registration',
      title: 'Account Created',
      description: `Welcome to Upflyover, ${user?.name}!`,
      time: 'Today',
      avatar: user?.name?.charAt(0) || 'U',
      status: 'completed'
    },
    {
      id: 2,
      type: 'verification',
      title: 'Email Verification',
      description: user?.emailVerified ? 'Email verified successfully' : 'Email verification pending',
      time: user?.emailVerified ? 'Completed' : 'Pending',
      avatar: 'E',
      status: user?.emailVerified ? 'completed' : 'pending'
    },
    {
      id: 3,
      type: 'profile',
      title: 'Profile Setup',
      description: `Profile ${calculateProfileCompletion()}% complete`,
      time: calculateProfileCompletion() === 100 ? 'Completed' : 'In Progress',
      avatar: 'P',
      status: calculateProfileCompletion() === 100 ? 'completed' : 'pending'
    },
    {
      id: 4,
      type: 'kyc',
      title: 'KYC Verification',
      description: `Status: ${kycStatus?.status || 'Not started'}`,
      time: kycStatus?.submittedAt ? 'Submitted' : 'Pending',
      avatar: 'K',
      status: kycStatus?.status === 'approved' ? 'completed' : 'pending'
    }
  ];

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <LinearProgress sx={{ mb: 2 }} />
        <Typography>Loading dashboard...</Typography>
      </Container>
    );
  }

  const quickActions = [
    { 
      title: 'Complete Profile', 
      description: 'Add missing company information', 
      icon: <Edit />, 
      color: 'primary',
      action: () => setProfileDialogOpen(true),
      disabled: calculateProfileCompletion() === 100
    },
    { 
      title: 'Submit KYC', 
      description: 'Verify your company documents', 
      icon: <VerifiedUser />, 
      color: 'success',
      action: () => navigate('/kyc'),
      disabled: kycStatus?.status === 'approved'
    },
    { 
      title: 'Browse Companies', 
      description: 'Discover business partners', 
      icon: <Business />, 
      color: 'info',
      action: () => navigate('/companies')
    },
    { 
      title: 'Post Requirement', 
      description: 'Find suppliers for your needs', 
      icon: <Add />, 
      color: 'warning',
      action: () => navigate('/requirements')
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Welcome Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" gutterBottom>
          Welcome to Upflyover, {user?.name || 'Company'}!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Complete your setup to start networking with verified companies worldwide.
        </Typography>
      </Box>

      {/* Setup Alerts */}
      {user?.needsAdditionalVerification && (
        <VerifyRemaining 
          user={user} 
          onVerificationComplete={() => window.location.reload()} 
        />
      )}
      
      {calculateProfileCompletion() < 100 && (
        <Alert 
          severity="info" 
          sx={{ mb: 2 }}
          action={
            <Button color="inherit" size="small" onClick={() => setProfileDialogOpen(true)}>
              Complete Now
            </Button>
          }
        >
          Your profile is {calculateProfileCompletion()}% complete. Complete it to improve visibility!
        </Alert>
      )}

      {(!kycStatus || kycStatus.status === 'pending') && (
        <Alert 
          severity="warning" 
          sx={{ mb: 4 }}
          action={
            <Button color="inherit" size="small" onClick={() => navigate('/kyc')}>
              Submit KYC
            </Button>
          }
        >
          KYC verification required to access premium features and build trust.
        </Alert>
      )}

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card elevation={2}>
              <CardContent>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="h5" fontWeight="bold">
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {stat.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                      {stat.change}
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: `${stat.color}.main` }}>
                    {stat.icon}
                  </Avatar>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Account Setup Progress */}
        <Grid item xs={12} lg={8}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Account Setup Progress
              </Typography>
              <List>
                {recentActivity.map((activity, index) => (
                  <React.Fragment key={activity.id}>
                    <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                      <ListItemAvatar>
                        <Avatar sx={{ 
                          bgcolor: activity.status === 'completed' ? 'success.main' : 'warning.main'
                        }}>
                          {activity.avatar}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={activity.title}
                        secondary={
                          <>
                            <Typography variant="body2" color="text.secondary">
                              {activity.description}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {activity.time}
                            </Typography>
                          </>
                        }
                      />
                      <Chip 
                        label={activity.status} 
                        size="small" 
                        color={activity.status === 'completed' ? 'success' : 'warning'}
                      />
                    </ListItem>
                    {index < recentActivity.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Profile Completion */}
        <Grid item xs={12} lg={4}>
          <Card elevation={2} sx={{ height: 400 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Profile Completion
              </Typography>
              <Box sx={{ textAlign: 'center', py: 2 }}>
                <Typography variant="h3" color="primary.main" fontWeight="bold">
                  {calculateProfileCompletion()}%
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={calculateProfileCompletion()} 
                  sx={{ mt: 2, mb: 3, height: 8, borderRadius: 4 }}
                />
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Complete your profile to increase visibility and trust
                </Typography>
                <Button 
                  variant="contained" 
                  fullWidth
                  onClick={() => setProfileDialogOpen(true)}
                  disabled={calculateProfileCompletion() === 100}
                >
                  {calculateProfileCompletion() === 100 ? 'Profile Complete' : 'Complete Profile'}
                </Button>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="subtitle2" gutterBottom>
                Missing Information:
              </Typography>
              <Stack spacing={1}>
                {['name', 'contactPerson', 'phone', 'industry', 'country', 'companySize'].map(field => (
                  <Stack direction="row" alignItems="center" spacing={1} key={field}>
                    {user?.[field] ? 
                      <CheckCircle color="success" fontSize="small" /> : 
                      <Warning color="warning" fontSize="small" />
                    }
                    <Typography variant="body2">
                      {field === 'contactPerson' ? 'Contact Person' : 
                       field === 'companySize' ? 'Company Size' :
                       field.charAt(0).toUpperCase() + field.slice(1)}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>



        {/* Messages Widget */}
        <Grid item xs={12} lg={4}>
          <MessagesWidget />
        </Grid>
        
        {/* Subscription Status */}
        <Grid item xs={12} lg={4}>
          <SubscriptionStatus />
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} lg={4}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Grid container spacing={2}>
                {quickActions.map((action, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <Paper 
                      elevation={1} 
                      sx={{ 
                        p: 2, 
                        cursor: action.disabled ? 'default' : 'pointer',
                        transition: 'all 0.2s',
                        opacity: action.disabled ? 0.6 : 1,
                        '&:hover': action.disabled ? {} : { 
                          elevation: 3,
                          transform: 'translateY(-2px)'
                        }
                      }}
                      onClick={action.disabled ? undefined : action.action}
                    >
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Avatar sx={{ bgcolor: `${action.color}.main` }}>
                          {action.icon}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2" fontWeight="bold">
                            {action.title}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {action.description}
                          </Typography>
                        </Box>
                      </Stack>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Profile Update Dialog */}
      <Dialog open={profileDialogOpen} onClose={() => setProfileDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Complete Your Profile</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Complete your company profile to improve visibility and build trust with potential partners.
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => {
              setProfileDialogOpen(false);
              navigate('/profile');
            }}
          >
            Go to Profile Settings
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setProfileDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Dashboard;