import React from 'react';
import { Box, Container, Typography, Button, Grid, Stack } from '@mui/material';
import UpflyoverLogo from './UpflyoverLogo';

const MobileAppSection = () => {
  return (
    <Box sx={{ py: 8, bgcolor: '#f8f9fa' }}>
      <Container maxWidth="lg">
        <Grid container spacing={6} alignItems="center">
          {/* App Mockup */}
          <Grid item xs={12} md={6}>
            <Box sx={{ textAlign: 'center', position: 'relative' }}>
              {/* iPhone Frame */}
              <Box
                sx={{
                  width: 300,
                  height: 600,
                  background: '#1a1a1a',
                  borderRadius: '40px',
                  mx: 'auto',
                  position: 'relative',
                  boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
                  padding: '20px'
                }}
              >
                {/* Notch */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: 8,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 120,
                    height: 25,
                    bgcolor: '#1a1a1a',
                    borderRadius: '0 0 15px 15px',
                    zIndex: 2
                  }}
                />
                {/* Screen */}
                <Box
                  sx={{
                    width: '100%',
                    height: '100%',
                    bgcolor: 'white',
                    borderRadius: '30px',
                    overflow: 'hidden',
                    position: 'relative'
                  }}
                >
                  {/* Status Bar */}
                  <Box sx={{ 
                    height: 40, 
                    bgcolor: 'rgb(30, 86, 86)',
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    px: 2,
                    color: 'white'
                  }}>
                    <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                      9:41 AM
                    </Typography>
                    <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                      100% 🔋
                    </Typography>
                  </Box>
                  
                  {/* App Header */}
                  <Box sx={{ 
                    p: 2, 
                    bgcolor: 'rgb(30, 86, 86)', 
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <UpflyoverLogo size={24} color="white" showText={true} />
                  </Box>
                  
                  {/* Welcome Section */}
                  <Box sx={{ p: 2, bgcolor: '#f8f9fa' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'rgb(30, 86, 86)' }}>
                      Welcome back, Ahmed!
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      You have 3 new connection requests
                    </Typography>
                  </Box>
                  
                  {/* Stats Cards */}
                  <Box sx={{ p: 2 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Box sx={{ 
                          p: 2, 
                          bgcolor: 'white', 
                          borderRadius: 2, 
                          textAlign: 'center',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                          border: '1px solid #e0e0e0'
                        }}>
                          <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'rgb(30, 86, 86)' }}>
                            89
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Connections
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box sx={{ 
                          p: 2, 
                          bgcolor: 'white', 
                          borderRadius: 2, 
                          textAlign: 'center',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                          border: '1px solid #e0e0e0'
                        }}>
                          <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'rgb(30, 86, 86)' }}>
                            23
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Messages
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                  
                  {/* Recent Activity */}
                  <Box sx={{ px: 2, pb: 2 }}>
                    <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, color: 'rgb(30, 86, 86)' }}>
                      Recent Activity
                    </Typography>
                    <Stack spacing={1}>
                      {[
                        { icon: '🏢', text: 'Gulf Trading LLC sent connection request' },
                        { icon: '💬', text: 'New message from Tech Solutions' },
                        { icon: '📋', text: 'Your requirement got 3 responses' }
                      ].map((item, index) => (
                        <Box key={index} sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: 1,
                          p: 1,
                          bgcolor: 'white',
                          borderRadius: 1,
                          border: '1px solid #f0f0f0'
                        }}>
                          <Typography sx={{ fontSize: '1.2rem' }}>
                            {item.icon}
                          </Typography>
                          <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                            {item.text}
                          </Typography>
                        </Box>
                      ))}
                    </Stack>
                  </Box>
                  
                  {/* Bottom Navigation */}
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: 60,
                      bgcolor: 'white',
                      borderTop: '1px solid #e0e0e0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-around'
                    }}
                  >
                    {['🏠', '🏢', '📋', '💬'].map((icon, index) => (
                      <Box key={index} sx={{ 
                        textAlign: 'center',
                        p: 1,
                        borderRadius: 2,
                        bgcolor: index === 0 ? 'rgba(30, 86, 86, 0.1)' : 'transparent'
                      }}>
                        <Typography sx={{ fontSize: '1.5rem' }}>{icon}</Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Box>
            </Box>
          </Grid>

          {/* Content */}
          <Grid item xs={12} md={6}>
            <Typography variant="h3" gutterBottom sx={{ fontWeight: 700, color: 'rgb(30, 86, 86)' }}>
              Take Upflyover Anywhere
            </Typography>
            <Typography variant="h6" sx={{ color: 'text.secondary', mb: 4 }}>
              Connect with businesses on the go with our powerful mobile app
            </Typography>
            
            <Stack spacing={2} sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'rgb(30, 86, 86)' }} />
                <Typography variant="body1">Real-time notifications for new connections</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'rgb(30, 86, 86)' }} />
                <Typography variant="body1">Browse companies and requirements offline</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'rgb(30, 86, 86)' }} />
                <Typography variant="body1">Instant messaging and video calls</Typography>
              </Box>
            </Stack>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Button
                variant="contained"
                sx={{
                  bgcolor: 'black',
                  color: 'white',
                  px: 3,
                  py: 1.5,
                  borderRadius: 2,
                  '&:hover': { bgcolor: '#333' }
                }}
                href="https://apps.apple.com/app/upflyover"
                target="_blank"
              >
                📱 Download for iOS
              </Button>
              <Button
                variant="contained"
                sx={{
                  bgcolor: 'rgb(30, 86, 86)',
                  color: 'white',
                  px: 3,
                  py: 1.5,
                  borderRadius: 2,
                  '&:hover': { bgcolor: 'rgb(20, 66, 66)' }
                }}
                href="https://play.google.com/store/apps/details?id=com.upflyover"
                target="_blank"
              >
                🤖 Download for Android
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default MobileAppSection;