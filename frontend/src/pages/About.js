import React from 'react';
import { Container, Typography, Box, Grid, Card, CardContent, Avatar, Stack } from '@mui/material';
import MobileAppSection from '../components/MobileAppSection';

const About = () => {
  const team = [
    { name: 'Munas Moosa', role: 'CEO & Founder', avatar: 'MM' },
    { name: 'Ashique Ebrahim', role: 'CTO', avatar: 'AE' },
    { name: 'Sarath', role: 'Head of Business', avatar: 'S' },
    { name: 'Fadhil', role: 'Head of Product', avatar: 'F' }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      {/* Hero Section */}
      <Box sx={{ textAlign: 'center', mb: 8 }}>
        <Typography variant="h2" gutterBottom sx={{ fontWeight: 700, color: 'rgb(30, 86, 86)' }}>
          About Upflyover
        </Typography>
        <Typography variant="h5" sx={{ color: 'text.secondary', maxWidth: 800, mx: 'auto' }}>
          We're on a mission to connect businesses worldwide and eliminate barriers to global trade
        </Typography>
      </Box>

      {/* Mission & Vision */}
      <Grid container spacing={6} sx={{ mb: 8 }}>
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 4, height: '100%', bgcolor: 'rgb(30, 86, 86)', color: 'white' }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
              Our Mission
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
              To create the world's most trusted B2B ecosystem where every company, 
              regardless of size or location, can connect, collaborate, and grow through 
              intelligent matching and verified partnerships.
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 4, height: '100%', border: '2px solid rgb(30, 86, 86)' }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, color: 'rgb(30, 86, 86)' }}>
              Our Vision
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary' }}>
              A world where geographical boundaries don't limit business opportunities, 
              where AI-powered matching creates perfect partnerships, and where trust 
              and transparency drive global commerce.
            </Typography>
          </Card>
        </Grid>
      </Grid>

      {/* Story */}
      <Box sx={{ mb: 8 }}>
        <Typography variant="h3" gutterBottom sx={{ fontWeight: 600, color: 'rgb(30, 86, 86)', textAlign: 'center', mb: 4 }}>
          Our Story
        </Typography>
        <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.8, color: 'text.secondary', textAlign: 'center', maxWidth: 900, mx: 'auto' }}>
          Founded in 2023 in Dubai, Upflyover was born from the frustration of finding reliable business partners 
          across borders. Our founders, experienced in international trade, recognized the need for a platform that 
          combines advanced AI matching with rigorous verification processes. Today, we're proud to serve over 
          10,000 verified companies across 50+ countries, facilitating billions in business deals.
        </Typography>
      </Box>

      {/* Team */}
      <Box>
        <Typography variant="h3" gutterBottom sx={{ fontWeight: 600, color: 'rgb(30, 86, 86)', textAlign: 'center', mb: 6 }}>
          Leadership Team
        </Typography>
        <Grid container spacing={4}>
          {team.map((member, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card sx={{ textAlign: 'center', p: 3 }}>
                <Avatar 
                  sx={{ 
                    width: 80, 
                    height: 80, 
                    mx: 'auto', 
                    mb: 2, 
                    bgcolor: 'rgb(30, 86, 86)',
                    fontSize: '1.5rem'
                  }}
                >
                  {member.avatar}
                </Avatar>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  {member.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {member.role}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
      
      {/* Mobile App Section */}
      <MobileAppSection />
    </Container>
  );
};

export default About;