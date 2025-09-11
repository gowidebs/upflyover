import React from 'react';
import {
  Box, Container, Typography, Button, Grid, Card, CardContent,
  Avatar, Chip, Paper, Stack, Rating, TextField
} from '@mui/material';
import {
  Business, TrendingUp, Security, Language,
  ConnectWithoutContact, Verified, Star
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import MobileAppSection from '../components/MobileAppSection';

const Home = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Business />,
      title: 'Dual Role System',
      description: 'Every company acts as both supplier and receiver'
    },
    {
      icon: <TrendingUp />,
      title: 'AI-Driven Matching',
      description: 'Smart algorithms match companies based on needs'
    },
    {
      icon: <Security />,
      title: 'Verified Companies',
      description: 'All companies go through verification process'
    },
    {
      icon: <Language />,
      title: 'Global Reach',
      description: 'Connect with businesses worldwide'
    }
  ];

  const testimonials = [
    {
      name: 'Ahmed Al-Rashid',
      company: 'Gulf Trading LLC',
      avatar: 'A',
      rating: 5,
      text: 'Upflyover helped us find reliable suppliers across the GCC region.'
    },
    {
      name: 'Sarah Johnson',
      company: 'Tech Solutions Inc',
      avatar: 'S',
      rating: 5,
      text: 'The AI matching system is incredibly accurate and saves time.'
    },
    {
      name: 'Mohammed Hassan',
      company: 'Emirates Manufacturing',
      avatar: 'M',
      rating: 5,
      text: 'Best B2B platform for connecting with verified companies.'
    }
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, rgb(30, 86, 86) 0%, rgb(20, 66, 66) 100%)',
          color: 'white',
          py: 12
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h2" gutterBottom sx={{ fontWeight: 700 }}>
                Fly Over Business Barriers
              </Typography>
              <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
                The world's most trusted B2B networking platform
              </Typography>
              <Typography variant="body1" sx={{ mb: 6, fontSize: '1.2rem' }}>
                Join thousands of verified companies worldwide. Find suppliers, 
                customers, and business partners with our AI-powered matching system.
              </Typography>
              <Stack direction="row" spacing={2}>
                <Button 
                  variant="contained" 
                  size="large" 
                  sx={{ 
                    bgcolor: 'white', 
                    color: 'rgb(30, 86, 86)',
                    '&:hover': { bgcolor: '#f5f5f5' }
                  }}
                  onClick={() => navigate('/signup-choice')}
                >
                  Start Free Trial
                </Button>
                <Button 
                  variant="outlined" 
                  size="large" 
                  sx={{ 
                    borderColor: 'white', 
                    color: 'white',
                    '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' }
                  }}
                  onClick={() => navigate('/companies')}
                >
                  Explore Companies
                </Button>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ textAlign: 'center' }}>
                <Paper
                  elevation={8}
                  sx={{
                    p: 3,
                    borderRadius: 4,
                    bgcolor: 'rgba(255,255,255,0.95)'
                  }}
                >
                  <Typography variant="h6" color="text.primary" gutterBottom>
                    Platform Statistics
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={4}>
                      <Typography variant="h4" color="primary.main" fontWeight="bold">
                        10K+
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Companies
                      </Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography variant="h4" color="primary.main" fontWeight="bold">
                        50K+
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Connections
                      </Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography variant="h4" color="primary.main" fontWeight="bold">
                        95%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Success Rate
                      </Typography>
                    </Grid>
                  </Grid>
                </Paper>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: 12, position: 'relative', overflow: 'hidden' }}>
        {/* Background Pattern */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `
              radial-gradient(circle at 20% 20%, rgba(30, 86, 86, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 80% 80%, rgba(30, 86, 86, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 40% 60%, rgba(30, 86, 86, 0.05) 0%, transparent 50%)
            `,
            zIndex: 0
          }}
        />
        
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography 
              variant="h2" 
              gutterBottom
              sx={{
                fontWeight: 800,
                background: 'linear-gradient(45deg, rgb(30, 86, 86), rgb(50, 106, 106))',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 3
              }}
            >
              Why Choose Upflyover?
            </Typography>
            <Box
              sx={{
                width: 80,
                height: 4,
                bgcolor: 'rgb(30, 86, 86)',
                mx: 'auto',
                mb: 3,
                borderRadius: 2
              }}
            />
            <Typography 
              variant="h6" 
              sx={{ 
                color: 'text.secondary',
                maxWidth: 600,
                mx: 'auto',
                lineHeight: 1.6
              }}
            >
              Discover the revolutionary features that make Upflyover the world's most trusted B2B networking platform
            </Typography>
          </Box>
          
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card 
                  elevation={0}
                  sx={{ 
                    height: '100%',
                    background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
                    border: '1px solid rgba(30, 86, 86, 0.1)',
                    borderRadius: 4,
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': { 
                      transform: 'translateY(-12px) scale(1.02)',
                      boxShadow: '0 20px 40px rgba(30, 86, 86, 0.15)',
                      border: '1px solid rgba(30, 86, 86, 0.3)',
                      '& .feature-icon': {
                        transform: 'scale(1.1) rotate(5deg)',
                        bgcolor: 'rgb(30, 86, 86)'
                      },
                      '& .feature-glow': {
                        opacity: 1
                      }
                    }
                  }}
                >
                  {/* Hover Glow Effect */}
                  <Box
                    className="feature-glow"
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '2px',
                      background: 'linear-gradient(90deg, transparent, rgb(30, 86, 86), transparent)',
                      opacity: 0,
                      transition: 'opacity 0.4s ease'
                    }}
                  />
                  
                  <CardContent sx={{ p: 4, textAlign: 'center', position: 'relative' }}>
                    {/* Floating Icon */}
                    <Box
                      sx={{
                        position: 'relative',
                        display: 'inline-block',
                        mb: 3
                      }}
                    >
                      <Avatar 
                        className="feature-icon"
                        sx={{ 
                          bgcolor: 'rgba(30, 86, 86, 0.1)',
                          color: 'rgb(30, 86, 86)',
                          width: 80, 
                          height: 80, 
                          mx: 'auto',
                          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                          boxShadow: '0 8px 32px rgba(30, 86, 86, 0.1)'
                        }}
                      >
                        <Box sx={{ fontSize: 32 }}>
                          {feature.icon}
                        </Box>
                      </Avatar>
                      
                      {/* Icon Background Glow */}
                      <Box
                        sx={{
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          width: 100,
                          height: 100,
                          borderRadius: '50%',
                          background: 'radial-gradient(circle, rgba(30, 86, 86, 0.1) 0%, transparent 70%)',
                          zIndex: -1
                        }}
                      />
                    </Box>
                    
                    <Typography 
                      variant="h5" 
                      gutterBottom
                      sx={{
                        fontWeight: 700,
                        color: 'rgb(30, 86, 86)',
                        mb: 2
                      }}
                    >
                      {feature.title}
                    </Typography>
                    
                    <Typography 
                      variant="body1" 
                      sx={{
                        color: 'text.secondary',
                        lineHeight: 1.6,
                        fontSize: '0.95rem'
                      }}
                    >
                      {feature.description}
                    </Typography>
                    
                    {/* Bottom Accent */}
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: 0,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: 40,
                        height: 3,
                        bgcolor: 'rgba(30, 86, 86, 0.2)',
                        borderRadius: '2px 2px 0 0'
                      }}
                    />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          
          {/* Bottom CTA */}
          <Box sx={{ textAlign: 'center', mt: 8 }}>
            <Typography variant="h6" gutterBottom sx={{ color: 'text.secondary' }}>
              Ready to experience the difference?
            </Typography>
            <Button
              variant="contained"
              size="large"
              sx={{
                bgcolor: 'rgb(30, 86, 86)',
                color: 'white',
                px: 4,
                py: 1.5,
                borderRadius: 3,
                fontSize: '1.1rem',
                fontWeight: 600,
                textTransform: 'none',
                boxShadow: '0 8px 32px rgba(30, 86, 86, 0.3)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  bgcolor: 'rgb(20, 66, 66)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 12px 40px rgba(30, 86, 86, 0.4)'
                }
              }}
              onClick={() => navigate('/signup-choice')}
            >
              Start Your Journey Today
            </Button>
          </Box>
        </Container>
      </Box>

      {/* How It Works Section */}
      <Box sx={{ py: 12, bgcolor: '#f8f9fa' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography 
              variant="h2" 
              gutterBottom
              sx={{
                fontWeight: 800,
                color: 'rgb(30, 86, 86)',
                mb: 3
              }}
            >
              How It Works
            </Typography>
            <Typography variant="h6" sx={{ color: 'text.secondary', maxWidth: 600, mx: 'auto' }}>
              Get started in minutes and connect with verified businesses worldwide
            </Typography>
          </Box>
          
          <Grid container spacing={4} alignItems="center">
            {[
              {
                step: '01',
                title: 'Create Your Profile',
                description: 'Sign up and build your comprehensive company profile with verification',
                icon: '🏢'
              },
              {
                step: '02', 
                title: 'Post Requirements',
                description: 'Share your business needs or browse opportunities from other companies',
                icon: '📋'
              },
              {
                step: '03',
                title: 'AI Matching',
                description: 'Our intelligent system matches you with the most relevant partners',
                icon: '🤖'
              },
              {
                step: '04',
                title: 'Connect & Trade',
                description: 'Start conversations, negotiate deals, and grow your business network',
                icon: '🤝'
              }
            ].map((item, index) => (
              <Grid item xs={12} md={3} key={index}>
                <Box sx={{ textAlign: 'center', position: 'relative' }}>
                  <Box
                    sx={{
                      width: 100,
                      height: 100,
                      borderRadius: '50%',
                      bgcolor: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 3,
                      fontSize: '2.5rem',
                      boxShadow: '0 8px 32px rgba(30, 86, 86, 0.1)',
                      border: '3px solid rgb(30, 86, 86)',
                      position: 'relative'
                    }}
                  >
                    {item.icon}
                    <Box
                      sx={{
                        position: 'absolute',
                        top: -10,
                        right: -10,
                        width: 30,
                        height: 30,
                        borderRadius: '50%',
                        bgcolor: 'rgb(30, 86, 86)',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.8rem',
                        fontWeight: 'bold'
                      }}
                    >
                      {item.step}
                    </Box>
                  </Box>
                  <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: 'rgb(30, 86, 86)' }}>
                    {item.title}
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                    {item.description}
                  </Typography>
                  {index < 3 && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 50,
                        right: -50,
                        width: 100,
                        height: 2,
                        bgcolor: 'rgba(30, 86, 86, 0.3)',
                        display: { xs: 'none', md: 'block' }
                      }}
                    />
                  )}
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Box sx={{ bgcolor: 'background.default', py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" textAlign="center" gutterBottom>
            Trusted by Companies Worldwide
          </Typography>
          <Typography variant="body1" textAlign="center" sx={{ mb: 6, color: 'text.secondary' }}>
            See what our verified partners say about Upflyover
          </Typography>
          <Grid container spacing={4}>
            {testimonials.map((testimonial, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card elevation={2} sx={{ height: '100%' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        {testimonial.avatar}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {testimonial.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {testimonial.company}
                        </Typography>
                      </Box>
                      <Chip icon={<Verified />} label="Verified" size="small" color="success" />
                    </Stack>
                    <Rating value={testimonial.rating} readOnly sx={{ mb: 2 }} />
                    <Typography variant="body2">
                      "{testimonial.text}"
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Platform Statistics */}
      <Box sx={{ py: 8, bgcolor: 'rgb(30, 86, 86)', color: 'white' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h3" gutterBottom sx={{ fontWeight: 700 }}>
                Trusted by Businesses Worldwide
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9, mb: 4 }}>
                Join thousands of companies already growing their business through Upflyover
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Grid container spacing={3}>
                {[
                  { number: '10,000+', label: 'Verified Companies' },
                  { number: '50,000+', label: 'Business Connections' },
                  { number: '$2.5B+', label: 'Deals Facilitated' },
                  { number: '95%', label: 'Success Rate' }
                ].map((stat, index) => (
                  <Grid item xs={6} key={index}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
                        {stat.number}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.8 }}>
                        {stat.label}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Industry Solutions */}
      <Box sx={{ py: 12 }}>
        <Container maxWidth="lg">
          <Typography variant="h2" textAlign="center" gutterBottom sx={{ fontWeight: 700, color: 'rgb(30, 86, 86)', mb: 6 }}>
            Solutions for Every Industry
          </Typography>
          <Grid container spacing={4}>
            {[
              { icon: '🏭', title: 'Manufacturing', desc: 'Connect with suppliers, distributors, and OEMs' },
              { icon: '💻', title: 'Technology', desc: 'Find development partners and tech solutions' },
              { icon: '🏗️', title: 'Construction', desc: 'Source materials and connect with contractors' },
              { icon: '🌱', title: 'Agriculture', desc: 'Link farmers with buyers and suppliers' },
              { icon: '⚡', title: 'Energy', desc: 'Renewable energy partnerships and solutions' },
              { icon: '🚚', title: 'Logistics', desc: 'Streamline supply chain and transportation' }
            ].map((industry, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card 
                  sx={{ 
                    p: 3, 
                    textAlign: 'center', 
                    height: '100%',
                    transition: 'transform 0.3s',
                    '&:hover': { transform: 'translateY(-8px)' }
                  }}
                >
                  <Typography variant="h2" sx={{ mb: 2 }}>{industry.icon}</Typography>
                  <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: 'rgb(30, 86, 86)' }}>
                    {industry.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {industry.desc}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Success Stories */}
      <Box sx={{ py: 12, bgcolor: '#f8f9fa' }}>
        <Container maxWidth="lg">
          <Typography variant="h2" textAlign="center" gutterBottom sx={{ fontWeight: 700, color: 'rgb(30, 86, 86)', mb: 6 }}>
            Success Stories
          </Typography>
          <Grid container spacing={4}>
            {[
              {
                company: 'TechCorp Solutions',
                result: '300% increase in qualified leads',
                story: 'Found 15 new suppliers and expanded to 3 new markets within 6 months',
                avatar: 'TC'
              },
              {
                company: 'Green Energy Ltd',
                result: '$5M in new partnerships',
                story: 'Connected with solar panel manufacturers across 12 countries',
                avatar: 'GE'
              },
              {
                company: 'Manufacturing Plus',
                result: '50% cost reduction',
                story: 'Streamlined supply chain by finding local component suppliers',
                avatar: 'MP'
              }
            ].map((story, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card sx={{ p: 4, height: '100%' }}>
                  <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                    <Avatar sx={{ bgcolor: 'rgb(30, 86, 86)' }}>{story.avatar}</Avatar>
                    <Box>
                      <Typography variant="h6" fontWeight="bold">{story.company}</Typography>
                      <Typography variant="body2" color="success.main" fontWeight="bold">
                        {story.result}
                      </Typography>
                    </Box>
                  </Stack>
                  <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
                    "{story.story}"
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* FAQ Section */}
      <Box sx={{ py: 12 }}>
        <Container maxWidth="md">
          <Typography variant="h2" textAlign="center" gutterBottom sx={{ fontWeight: 700, color: 'rgb(30, 86, 86)', mb: 6 }}>
            Frequently Asked Questions
          </Typography>
          <Stack spacing={2}>
            {[
              {
                q: 'How does Upflyover verify companies?',
                a: 'We use a comprehensive verification process including business license checks, financial verification, and reference validation.'
              },
              {
                q: 'Is there a free trial available?',
                a: 'Yes! We offer a 14-day free trial with full access to all features. No credit card required.'
              },
              {
                q: 'What industries does Upflyover support?',
                a: 'Upflyover supports all industries including manufacturing, technology, construction, agriculture, energy, and more.'
              },
              {
                q: 'How secure is my company data?',
                a: 'We use enterprise-grade security with SSL encryption, SOC 2 compliance, and regular security audits.'
              }
            ].map((faq, index) => (
              <Card key={index} sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'rgb(30, 86, 86)' }}>
                  {faq.q}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {faq.a}
                </Typography>
              </Card>
            ))}
          </Stack>
        </Container>
      </Box>

      {/* Newsletter Signup */}
      <Box sx={{ py: 8, bgcolor: 'rgb(30, 86, 86)', color: 'white' }}>
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Typography variant="h3" gutterBottom sx={{ fontWeight: 700 }}>
            Stay Updated
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, opacity: 0.9 }}>
            Get the latest B2B insights, platform updates, and success stories delivered to your inbox
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ maxWidth: 400, mx: 'auto' }}>
            <TextField
              fullWidth
              placeholder="Enter your email"
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'white',
                  '& fieldset': { borderColor: 'transparent' }
                }
              }}
            />
            <Button
              variant="contained"
              sx={{
                bgcolor: 'white',
                color: 'rgb(30, 86, 86)',
                px: 4,
                '&:hover': { bgcolor: '#f5f5f5' }
              }}
            >
              Subscribe
            </Button>
          </Stack>
        </Container>
      </Box>

      {/* Mobile App Section */}
      <MobileAppSection />

      {/* CTA Section */}
      <Box sx={{ bgcolor: '#f8f9fa', color: 'rgb(30, 86, 86)', py: 8 }}>
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Typography variant="h3" gutterBottom sx={{ fontWeight: 700 }}>
            Ready to Grow Your Business?
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.8 }}>
            Join Upflyover today and connect with verified companies worldwide
          </Typography>
          <Button 
            variant="contained" 
            size="large" 
            sx={{ 
              bgcolor: 'rgb(30, 86, 86)', 
              color: 'white',
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              '&:hover': { bgcolor: 'rgb(20, 66, 66)' }
            }}
            onClick={() => navigate('/signup-choice')}
          >
            Get Started - It's Free
          </Button>
        </Container>
      </Box>


    </Box>
  );
};

export default Home;