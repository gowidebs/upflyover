import React, { useState } from 'react';
import { Container, Typography, Box, Grid, Card, CardContent, TextField, Accordion, AccordionSummary, AccordionDetails, Button, Stack } from '@mui/material';
import { Search, ExpandMore, Help as HelpIcon, Message, Phone } from '@mui/icons-material';

const Help = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const faqs = [
    {
      question: 'How do I create a company profile?',
      answer: 'To create a company profile, click on "Sign Up" and fill in your company details including business license, contact information, and company description. Our verification team will review and approve your profile within 24-48 hours.'
    },
    {
      question: 'How does the AI matching system work?',
      answer: 'Our AI analyzes your company profile, requirements, and preferences to match you with the most relevant business partners. The system considers factors like industry, location, company size, and past successful partnerships.'
    },
    {
      question: 'What are the subscription plans?',
      answer: 'We offer three plans: Free (basic features), Professional ($99/month), and Enterprise ($299/month). Each plan includes different levels of access to companies, requirements posting, and premium features.'
    },
    {
      question: 'How do I verify my company?',
      answer: 'Company verification requires uploading your business license, tax registration, and other legal documents. Our team reviews these documents and may contact you for additional information if needed.'
    },
    {
      question: 'Can I cancel my subscription anytime?',
      answer: 'Yes, you can cancel your subscription at any time from your account settings. Your access will continue until the end of your current billing period.'
    }
  ];

  const helpCategories = [
    { title: 'Getting Started', icon: '🚀', articles: 12 },
    { title: 'Account Management', icon: '👤', articles: 8 },
    { title: 'Billing & Payments', icon: '💳', articles: 6 },
    { title: 'Company Verification', icon: '✅', articles: 5 },
    { title: 'Messaging & Communication', icon: '💬', articles: 7 },
    { title: 'API Documentation', icon: '⚙️', articles: 15 }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box sx={{ textAlign: 'center', mb: 8 }}>
        <Typography variant="h2" gutterBottom sx={{ fontWeight: 700, color: 'rgb(30, 86, 86)' }}>
          Help Center
        </Typography>
        <Typography variant="h5" sx={{ color: 'text.secondary', mb: 4 }}>
          Find answers to your questions and get support
        </Typography>
        
        <TextField
          fullWidth
          placeholder="Search for help articles..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ maxWidth: 600, mx: 'auto' }}
          InputProps={{
            startAdornment: <Search sx={{ mr: 1, color: 'action.active' }} />
          }}
        />
      </Box>

      {/* Help Categories */}
      <Box sx={{ mb: 8 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, color: 'rgb(30, 86, 86)', mb: 4 }}>
          Browse by Category
        </Typography>
        <Grid container spacing={3}>
          {helpCategories.map((category, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ cursor: 'pointer', '&:hover': { transform: 'translateY(-2px)' }, transition: 'transform 0.2s' }}>
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <Typography variant="h2" sx={{ mb: 2 }}>{category.icon}</Typography>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    {category.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {category.articles} articles
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* FAQ Section */}
      <Box sx={{ mb: 8 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, color: 'rgb(30, 86, 86)', mb: 4 }}>
          Frequently Asked Questions
        </Typography>
        {faqs.map((faq, index) => (
          <Accordion key={index} sx={{ mb: 1 }}>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="h6" sx={{ fontWeight: 500 }}>
                {faq.question}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body1" color="text.secondary">
                {faq.answer}
              </Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>

      {/* Contact Support */}
      <Card sx={{ p: 4, bgcolor: '#f8f9fa' }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, color: 'rgb(30, 86, 86)', textAlign: 'center' }}>
          Still Need Help?
        </Typography>
        <Typography variant="body1" sx={{ textAlign: 'center', mb: 4, color: 'text.secondary' }}>
          Our support team is here to help you succeed
        </Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
          <Button
            variant="contained"
            startIcon={<Message />}
            sx={{ bgcolor: 'rgb(30, 86, 86)' }}
          >
            Live Chat
          </Button>
          <Button
            variant="outlined"
            startIcon={<Phone />}
          >
            Call Support
          </Button>
        </Stack>
      </Card>
    </Container>
  );
};

export default Help;