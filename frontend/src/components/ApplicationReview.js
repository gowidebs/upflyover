import React, { useState, useEffect } from 'react';
import {
  Box, Card, CardContent, Typography, Button, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Chip, Avatar, Rating, Divider, Grid, Alert
} from '@mui/material';
import { CheckCircle, Cancel, Star, Business, Email, Phone } from '@mui/icons-material';
import api from '../utils/api';

const ApplicationReview = ({ requirementId, open, onClose }) => {
  const [applications, setApplications] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [reviewDialog, setReviewDialog] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [action, setAction] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && requirementId) {
      loadApplications();
    }
  }, [open, requirementId]);

  const loadApplications = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/requirements/${requirementId}/applications`);
      setApplications(response.data.applications || []);
    } catch (error) {
      console.error('Failed to load applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async () => {
    if (!selectedApp || !action) return;
    
    try {
      await api.put(`/requirements/${requirementId}/applications/${selectedApp.id}/review`, {
        action,
        feedback
      });
      
      setReviewDialog(false);
      setSelectedApp(null);
      setFeedback('');
      setAction('');
      loadApplications();
    } catch (error) {
      console.error('Failed to review application:', error);
    }
  };

  const openReviewDialog = (app, reviewAction) => {
    setSelectedApp(app);
    setAction(reviewAction);
    setReviewDialog(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted': return 'success';
      case 'rejected': return 'error';
      case 'shortlisted': return 'warning';
      default: return 'default';
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
        <DialogTitle>Review Applications</DialogTitle>
        <DialogContent>
          {applications.length === 0 ? (
            <Alert severity="info">No applications received yet.</Alert>
          ) : (
            <Grid container spacing={2}>
              {applications.map((app) => (
                <Grid item xs={12} key={app.id}>
                  <Card variant="outlined">
                    <CardContent>
                      <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                        <Box display="flex" alignItems="center" gap={2}>
                          <Avatar>
                            <Business />
                          </Avatar>
                          <Box>
                            <Typography variant="h6">{app.companyName}</Typography>
                            <Typography variant="body2" color="text.secondary">
                              Applied: {new Date(app.appliedAt).toLocaleDateString()}
                            </Typography>
                            <Chip 
                              label={app.status} 
                              color={getStatusColor(app.status)} 
                              size="small" 
                              sx={{ mt: 1 }}
                            />
                          </Box>
                        </Box>
                        
                        {app.status === 'pending' && (
                          <Box display="flex" gap={1}>
                            <Button
                              variant="outlined"
                              color="warning"
                              size="small"
                              startIcon={<Star />}
                              onClick={() => openReviewDialog(app, 'shortlist')}
                            >
                              Shortlist
                            </Button>
                            <Button
                              variant="outlined"
                              color="success"
                              size="small"
                              startIcon={<CheckCircle />}
                              onClick={() => openReviewDialog(app, 'accept')}
                            >
                              Accept
                            </Button>
                            <Button
                              variant="outlined"
                              color="error"
                              size="small"
                              startIcon={<Cancel />}
                              onClick={() => openReviewDialog(app, 'reject')}
                            >
                              Reject
                            </Button>
                          </Box>
                        )}
                      </Box>

                      <Divider sx={{ my: 2 }} />

                      <Typography variant="subtitle2" gutterBottom>Proposal</Typography>
                      <Typography variant="body2" paragraph>
                        {app.proposal}
                      </Typography>

                      <Grid container spacing={2}>
                        <Grid item xs={12} md={4}>
                          <Typography variant="subtitle2">Timeline</Typography>
                          <Typography variant="body2">{app.timeline || 'Not specified'}</Typography>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <Typography variant="subtitle2">Budget</Typography>
                          <Typography variant="body2">{app.budget || 'Not specified'}</Typography>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <Typography variant="subtitle2">Experience</Typography>
                          <Typography variant="body2">{app.experience || 'Not specified'}</Typography>
                        </Grid>
                      </Grid>

                      {app.portfolio && (
                        <Box mt={2}>
                          <Typography variant="subtitle2">Portfolio</Typography>
                          <Typography variant="body2">{app.portfolio}</Typography>
                        </Box>
                      )}

                      {app.feedback && (
                        <Box mt={2}>
                          <Alert severity="info">
                            <Typography variant="subtitle2">Feedback</Typography>
                            <Typography variant="body2">{app.feedback}</Typography>
                          </Alert>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Review Dialog */}
      <Dialog open={reviewDialog} onClose={() => setReviewDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {action === 'accept' ? 'Accept Application' : 
           action === 'reject' ? 'Reject Application' : 'Shortlist Application'}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" paragraph>
            Company: {selectedApp?.companyName}
          </Typography>
          
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Feedback (Optional)"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder={
              action === 'accept' ? 'Congratulations! We would like to proceed...' :
              action === 'reject' ? 'Thank you for your interest. Unfortunately...' :
              'Your application has been shortlisted for further review...'
            }
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReviewDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleReview} 
            variant="contained"
            color={action === 'accept' ? 'success' : action === 'reject' ? 'error' : 'warning'}
          >
            {action === 'accept' ? 'Accept' : action === 'reject' ? 'Reject' : 'Shortlist'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ApplicationReview;