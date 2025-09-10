import React from 'react';
import { 
  Container, Typography, Box, Grid, Card, CardContent, 
  Button, Stack, Chip, List, ListItem, ListItemIcon, ListItemText 
} from '@mui/material';
import { Check, Star, Business, TrendingUp, Person } from '@mui/icons-material';
import MobileAppSection from '../components/MobileAppSection';

const Pricing = () => {
  const plans = [
    {
      name: 'Starter',
      price: 'Free',
      period: 'Forever',
      description: 'Perfect for individuals and freelancers',
      subtitle: 'Individual Profile (No company required)',
      features: [
        'Individual profile setup',
        'Post 4 requirements/month',
        'Browse 500 companies',
        'Basic messaging (5 conversations/month)',
        'Manual verification by our team',
        'Email support'
      ],
      buttonText: 'Get Started Free',
      popular: false
    },
    {
      name: 'Professional',
      price: '$99',
      period: '/month',
      description: 'Ideal for growing companies',
      subtitle: '3 Team Users Included',
      features: [
        'Enhanced company profile with verification badge',
        '3 team users included',
        'Post 20 requirements/month',
        'Browse unlimited companies',
        'Advanced messaging & video calls',
        'AI-powered matching',
        'Analytics dashboard',
        'Auto-approval for verified companies',
        'Priority support'
      ],
      buttonText: 'Start Free Trial',
      popular: true
    },
    {
      name: 'Enterprise',
      price: '$299',
      period: '/month',
      description: 'For large organizations',
      subtitle: '10 Team Users Included',
      features: [
        'Premium company profile with trust badges',
        '10 team users included',
        'Unlimited requirements',
        'Advanced team management',
        'Custom integrations (API access)',
        'Advanced analytics & reports',
        'Dedicated account manager',
        'White-label options',
        '24/7 phone support'
      ],
      buttonText: 'Contact Sales',
      popular: false
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box sx={{ textAlign: 'center', mb: 8 }}>
        <Typography variant="h2" gutterBottom sx={{ fontWeight: 700, color: 'rgb(30, 86, 86)' }}>
          Simple, Transparent Pricing
        </Typography>
        <Typography variant="h5" sx={{ color: 'text.secondary', mb: 4 }}>
          From individuals to enterprises - we have the perfect plan for you
        </Typography>
        <Chip 
          label="14-day free trial on all paid plans" 
          color="success" 
          sx={{ fontSize: '1rem', py: 2 }}
        />
      </Box>

      <Grid container spacing={4} sx={{ mb: 8 }}>
        {plans.map((plan, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Card 
              sx={{ 
                height: '100%',
                position: 'relative',
                border: plan.popular ? '3px solid rgb(30, 86, 86)' : '1px solid #e0e0e0',
                transform: plan.popular ? 'scale(1.05)' : 'none'
              }}
            >
              {plan.popular && (
                <Chip
                  label="Most Popular"
                  color="primary"
                  icon={<Star />}
                  sx={{
                    position: 'absolute',
                    top: -12,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    bgcolor: 'rgb(30, 86, 86)'
                  }}
                />
              )}
              <CardContent sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, color: 'rgb(30, 86, 86)' }}>
                  {plan.name}
                </Typography>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h2" component="span" sx={{ fontWeight: 700 }}>
                    {plan.price}
                  </Typography>
                  <Typography variant="h6" component="span" color="text.secondary">
                    {plan.period}
                  </Typography>
                </Box>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                  {plan.description}
                </Typography>
                <Typography variant="body2" color="primary" sx={{ mb: 4, fontWeight: 500 }}>
                  {plan.subtitle}
                </Typography>
                
                <List sx={{ mb: 4 }}>
                  {plan.features.map((feature, idx) => (
                    <ListItem key={idx} sx={{ py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <Check color="success" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText 
                        primary={feature} 
                        primaryTypographyProps={{ variant: 'body2' }}
                      />
                    </ListItem>
                  ))}
                </List>

                <Button
                  variant={plan.popular ? 'contained' : 'outlined'}
                  fullWidth
                  size="large"
                  sx={{
                    py: 1.5,
                    bgcolor: plan.popular ? 'rgb(30, 86, 86)' : 'transparent',
                    borderColor: 'rgb(30, 86, 86)',
                    color: plan.popular ? 'white' : 'rgb(30, 86, 86)',
                    '&:hover': {
                      bgcolor: plan.popular ? 'rgb(20, 66, 66)' : 'rgba(30, 86, 86, 0.1)'
                    }
                  }}
                >
                  {plan.buttonText}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Enterprise Solutions */}
      <Box sx={{ textAlign: 'center', py: 8, bgcolor: '#f8f9fa', borderRadius: 4 }}>
        <Typography variant="h3" gutterBottom sx={{ fontWeight: 600, color: 'rgb(30, 86, 86)' }}>
          Enterprise Solutions
        </Typography>
        <Typography variant="h5" sx={{ mb: 2, color: 'text.primary', fontWeight: 500 }}>
          Custom Pricing for Multinational Corporations
        </Typography>
        <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary', maxWidth: 600, mx: 'auto' }}>
          Unlimited users, multi-region support, custom development, and on-premise deployment options for Fortune 500 companies.
        </Typography>
        <Grid container spacing={4} sx={{ maxWidth: 800, mx: 'auto' }}>
          {[
            { icon: <Business />, title: 'Unlimited Users', desc: 'No limits on team size' },
            { icon: <TrendingUp />, title: 'Multi-Region Support', desc: 'Global deployment and compliance' },
            { icon: <Star />, title: 'Custom Development', desc: 'Tailored features and integrations' }
          ].map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Stack alignItems="center" spacing={2}>
                <Box sx={{ 
                  p: 2, 
                  borderRadius: '50%', 
                  bgcolor: 'rgb(30, 86, 86)', 
                  color: 'white' 
                }}>
                  {feature.icon}
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" textAlign="center">
                  {feature.desc}
                </Typography>
              </Stack>
            </Grid>
          ))}
        </Grid>
        <Button
          variant="contained"
          size="large"
          sx={{
            mt: 4,
            bgcolor: 'rgb(30, 86, 86)',
            '&:hover': { bgcolor: 'rgb(20, 66, 66)' }
          }}
        >
          Contact Enterprise Sales
        </Button>
      </Box>
      
      {/* Mobile App Section */}
      <MobileAppSection />
    </Container>
  );
};

export default Pricing;