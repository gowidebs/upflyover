import React from 'react';
import { Container, Typography, Box, Grid, Card, CardContent, Avatar, Chip, Button } from '@mui/material';
import { Schedule, Person } from '@mui/icons-material';

const Blog = () => {
  const posts = [
    {
      title: 'The Future of B2B Networking in the Digital Age',
      excerpt: 'Explore how digital transformation is reshaping business relationships and partnerships globally.',
      author: 'Sarah Johnson',
      date: 'Dec 15, 2024',
      category: 'Industry Insights',
      readTime: '5 min read'
    },
    {
      title: 'How AI is Revolutionizing Business Matching',
      excerpt: 'Discover how artificial intelligence is making business partnerships more efficient and effective.',
      author: 'Ahmed Al-Rashid',
      date: 'Dec 10, 2024',
      category: 'Technology',
      readTime: '7 min read'
    },
    {
      title: 'Building Trust in Global B2B Relationships',
      excerpt: 'Learn the key strategies for establishing and maintaining trust with international business partners.',
      author: 'Lisa Chen',
      date: 'Dec 5, 2024',
      category: 'Business Strategy',
      readTime: '6 min read'
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box sx={{ textAlign: 'center', mb: 8 }}>
        <Typography variant="h2" gutterBottom sx={{ fontWeight: 700, color: 'rgb(30, 86, 86)' }}>
          Upflyover Blog
        </Typography>
        <Typography variant="h5" sx={{ color: 'text.secondary' }}>
          Insights, trends, and stories from the world of B2B networking
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {posts.map((post, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Card sx={{ height: '100%', cursor: 'pointer', '&:hover': { transform: 'translateY(-4px)' }, transition: 'transform 0.2s' }}>
              <Box sx={{ height: 200, bgcolor: 'rgb(30, 86, 86)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="h4" sx={{ color: 'white' }}>📝</Typography>
              </Box>
              <CardContent sx={{ p: 3 }}>
                <Chip label={post.category} size="small" color="primary" sx={{ mb: 2 }} />
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  {post.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  {post.excerpt}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar sx={{ width: 24, height: 24, bgcolor: 'rgb(30, 86, 86)', fontSize: '0.8rem' }}>
                      {post.author.charAt(0)}
                    </Avatar>
                    <Typography variant="caption">{post.author}</Typography>
                  </Box>
                  <Typography variant="caption" color="text.secondary">{post.readTime}</Typography>
                </Box>
                <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
                  {post.date}
                </Typography>
                <Button variant="outlined" size="small">Read More</Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Blog;