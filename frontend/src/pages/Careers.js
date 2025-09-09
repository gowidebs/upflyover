import React from 'react';
import { Container, Typography, Box, Grid, Card, CardContent, Button, Chip, Stack } from '@mui/material';
import { LocationOn, Schedule, Business } from '@mui/icons-material';

const Careers = () => {
  const jobs = [
    {
      title: 'Senior Frontend Developer',
      department: 'Engineering',
      location: 'Dubai, UAE',
      type: 'Full-time',
      experience: '3-5 years',
      description: 'Build amazing user experiences for our B2B platform using React and modern web technologies.'
    },
    {
      title: 'Business Development Manager',
      department: 'Sales',
      location: 'Remote',
      type: 'Full-time',
      experience: '5+ years',
      description: 'Drive growth by building relationships with enterprise clients across the GCC region.'
    },
    {
      title: 'Product Designer',
      department: 'Design',
      location: 'Dubai, UAE',
      type: 'Full-time',
      experience: '2-4 years',
      description: 'Design intuitive interfaces that help businesses connect and grow on our platform.'
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box sx={{ textAlign: 'center', mb: 8 }}>
        <Typography variant="h2" gutterBottom sx={{ fontWeight: 700, color: 'rgb(30, 86, 86)' }}>
          Join Our Team
        </Typography>
        <Typography variant="h5" sx={{ color: 'text.secondary', mb: 4 }}>
          Help us build the future of B2B networking
        </Typography>
        <Typography variant="body1" sx={{ maxWidth: 600, mx: 'auto' }}>
          We're looking for passionate individuals who want to make a difference in how businesses connect globally.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {jobs.map((job, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Card sx={{ height: '100%', p: 3 }}>
              <CardContent>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: 'rgb(30, 86, 86)' }}>
                  {job.title}
                </Typography>
                <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                  <Chip label={job.department} size="small" color="primary" />
                  <Chip label={job.type} size="small" variant="outlined" />
                </Stack>
                <Stack spacing={1} sx={{ mb: 3 }}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <LocationOn fontSize="small" color="action" />
                    <Typography variant="body2">{job.location}</Typography>
                  </Stack>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Business fontSize="small" color="action" />
                    <Typography variant="body2">{job.experience} experience</Typography>
                  </Stack>
                </Stack>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  {job.description}
                </Typography>
                <Button variant="contained" sx={{ bgcolor: 'rgb(30, 86, 86)' }}>
                  Apply Now
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Careers;