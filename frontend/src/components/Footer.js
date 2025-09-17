import React from 'react';
import { Box, Container, Grid, Typography, Button, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import UpflyoverLogo from './UpflyoverLogo';

const Footer = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ bgcolor: 'rgb(30, 86, 86)', color: 'white', py: 6 }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Logo and Description */}
          <Grid item xs={12} md={4}>
            <Stack spacing={2}>
              <UpflyoverLogo size={32} color="white" showText={true} />
              <Typography variant="body2" sx={{ opacity: 0.8, maxWidth: 300 }}>
                The world's most trusted B2B networking platform. Connect, trade, and grow your business with verified companies worldwide.
              </Typography>
              <Stack direction="row" spacing={1}>
                {[
                  { icon: '📧', href: 'mailto:support@upflyover.com' },
                  { icon: '🔗', href: 'https://linkedin.com/company/upflyover' },
                  { icon: '🐦', href: 'https://twitter.com/upflyover' },
                  { icon: '📘', href: 'https://facebook.com/upflyover' }
                ].map((social, index) => (
                  <Button
                    key={index}
                    href={social.href}
                    target="_blank"
                    sx={{
                      minWidth: 40,
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      bgcolor: 'rgba(255,255,255,0.1)',
                      color: 'white',
                      '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' }
                    }}
                  >
                    {social.icon}
                  </Button>
                ))}
              </Stack>
            </Stack>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Platform
            </Typography>
            <Stack spacing={1}>
              {[
                { text: 'Companies', path: '/companies' },
                { text: 'Requirements', path: '/requirements' },
                { text: 'Dashboard', path: '/dashboard' },
                { text: 'Pricing', path: '/pricing' }
              ].map((link) => (
                <Typography
                  key={link.text}
                  variant="body2"
                  onClick={() => navigate(link.path)}
                  sx={{
                    opacity: 0.8,
                    cursor: 'pointer',
                    '&:hover': { opacity: 1 }
                  }}
                >
                  {link.text}
                </Typography>
              ))}
            </Stack>
          </Grid>

          {/* Company */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Company
            </Typography>
            <Stack spacing={1}>
              {[
                { text: 'About Us', path: '/about' },
                { text: 'Careers', path: '/careers' },
                { text: 'Blog', path: '/blog' },
                { text: 'Contact', path: '/contact' }
              ].map((link) => (
                <Typography
                  key={link.text}
                  variant="body2"
                  onClick={() => navigate(link.path)}
                  sx={{
                    opacity: 0.8,
                    cursor: 'pointer',
                    '&:hover': { opacity: 1 }
                  }}
                >
                  {link.text}
                </Typography>
              ))}
            </Stack>
          </Grid>

          {/* Support */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Support
            </Typography>
            <Stack spacing={1}>
              {[
                { text: 'Help Center', path: '/help' },
                { text: 'API Docs', path: '/api-docs' },
                { text: 'Security', path: '/security' },
                { text: 'Privacy', path: '/privacy' }
              ].map((link) => (
                <Typography
                  key={link.text}
                  variant="body2"
                  onClick={() => navigate(link.path)}
                  sx={{
                    opacity: 0.8,
                    cursor: 'pointer',
                    '&:hover': { opacity: 1 }
                  }}
                >
                  {link.text}
                </Typography>
              ))}
            </Stack>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Contact
            </Typography>
            <Stack spacing={1}>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                📍 Dubai, UAE
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                📞 +971 4 123 4567
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                ✉️ support@upflyover.com
              </Typography>
            </Stack>
          </Grid>
        </Grid>

        {/* Bottom Bar */}
        <Box sx={{ borderTop: '1px solid rgba(255,255,255,0.1)', mt: 4, pt: 3 }}>
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item xs={12} md={6}>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                © 2024 Upflyover. All rights reserved.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Stack 
                direction="row" 
                spacing={3} 
                justifyContent={{ xs: 'flex-start', md: 'flex-end' }}
                sx={{ mt: { xs: 2, md: 0 } }}
              >
                <Typography 
                  variant="body2" 
                  onClick={() => navigate('/terms')}
                  sx={{ opacity: 0.8, cursor: 'pointer', '&:hover': { opacity: 1 } }}
                >
                  Terms of Service
                </Typography>
                <Typography 
                  variant="body2" 
                  onClick={() => navigate('/privacy')}
                  sx={{ opacity: 0.8, cursor: 'pointer', '&:hover': { opacity: 1 } }}
                >
                  Privacy Policy
                </Typography>
                <Typography 
                  variant="body2" 
                  onClick={() => navigate('/cookies')}
                  sx={{ opacity: 0.8, cursor: 'pointer', '&:hover': { opacity: 1 } }}
                >
                  Cookies
                </Typography>
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;