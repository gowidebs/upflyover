import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Alert
} from '@mui/material';
import {
  Visibility,
  CheckCircle,
  Cancel,
  Download,
  Business,
  AccountBalance,
  Description,
  VerifiedUser
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import axios from 'axios';

const AdminKYC = () => {
  const [kycSubmissions, setKycSubmissions] = useState([]);
  const [selectedKyc, setSelectedKyc] = useState(null);
  const [reviewDialog, setReviewDialog] = useState(false);
  const [reviewAction, setReviewAction] = useState('');
  const [reviewNotes, setReviewNotes] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchKycSubmissions();
  }, []);

  const fetchKycSubmissions = async () => {
    try {
      const response = await axios.get('/api/admin/kyc/submissions');
      setKycSubmissions(response.data);
    } catch (error) {
      toast.error('Failed to fetch KYC submissions');
    }
  };

  const handleReview = (kyc, action) => {
    setSelectedKyc(kyc);
    setReviewAction(action);
    setReviewDialog(true);
  };

  const submitReview = async () => {
    setLoading(true);
    try {
      await axios.post('/api/admin/kyc/review', {
        kycId: selectedKyc.id,
        action: reviewAction,
        notes: reviewNotes
      });
      
      toast.success(`KYC ${reviewAction === 'approve' ? 'approved' : 'rejected'} successfully`);
      setReviewDialog(false);
      setReviewNotes('');
      fetchKycSubmissions();
    } catch (error) {
      toast.error('Failed to submit review');
    }
    setLoading(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'submitted': return 'warning';
      case 'approved': return 'success';
      case 'rejected': return 'error';
      default: return 'default';
    }
  };

  const documentIcons = {
    businessLicense: <Business />,
    taxCertificate: <AccountBalance />,
    bankStatement: <Description />,
    ownershipProof: <VerifiedUser />
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        KYC Document Review
      </Typography>
      
      <Alert severity="info" sx={{ mb: 3 }}>
        Review and approve/reject KYC submissions. Approved companies get full platform access.
      </Alert>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Company</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Submitted</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Documents</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {kycSubmissions.map((kyc) => (
              <TableRow key={kyc.id}>
                <TableCell>{kyc.companyName}</TableCell>
                <TableCell>{kyc.companyEmail}</TableCell>
                <TableCell>{new Date(kyc.submittedAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Chip 
                    label={kyc.status.toUpperCase()} 
                    color={getStatusColor(kyc.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {Object.entries(kyc.documents).map(([type, filename]) => 
                      filename && (
                        <IconButton 
                          key={type}
                          size="small"
                          onClick={() => window.open(`/api/admin/kyc/document/${filename}`, '_blank')}
                        >
                          {documentIcons[type]}
                        </IconButton>
                      )
                    )}
                  </Box>
                </TableCell>
                <TableCell>
                  {kyc.status === 'submitted' && (
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        size="small"
                        variant="contained"
                        color="success"
                        startIcon={<CheckCircle />}
                        onClick={() => handleReview(kyc, 'approve')}
                      >
                        Approve
                      </Button>
                      <Button
                        size="small"
                        variant="contained"
                        color="error"
                        startIcon={<Cancel />}
                        onClick={() => handleReview(kyc, 'reject')}
                      >
                        Reject
                      </Button>
                    </Box>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={reviewDialog} onClose={() => setReviewDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {reviewAction === 'approve' ? 'Approve' : 'Reject'} KYC Submission
        </DialogTitle>
        <DialogContent>
          {selectedKyc && (
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Company Details</Typography>
                    <Typography><strong>Name:</strong> {selectedKyc.companyName}</Typography>
                    <Typography><strong>Email:</strong> {selectedKyc.companyEmail}</Typography>
                    <Typography><strong>Registration:</strong> {selectedKyc.businessRegistrationNumber}</Typography>
                    <Typography><strong>Tax ID:</strong> {selectedKyc.taxId}</Typography>
                    <Typography><strong>Bank Account:</strong> {selectedKyc.bankAccountNumber}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Documents</Typography>
                    {Object.entries(selectedKyc.documents).map(([type, filename]) => 
                      filename && (
                        <Box key={type} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          {documentIcons[type]}
                          <Typography sx={{ ml: 1, flex: 1 }}>{type}</Typography>
                          <Button
                            size="small"
                            startIcon={<Visibility />}
                            onClick={() => window.open(`/api/admin/kyc/document/${filename}`, '_blank')}
                          >
                            View
                          </Button>
                        </Box>
                      )
                    )}
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Review Notes"
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  placeholder="Add notes about your decision..."
                />
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReviewDialog(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={submitReview}
            disabled={loading}
            color={reviewAction === 'approve' ? 'success' : 'error'}
          >
            {loading ? 'Processing...' : `${reviewAction === 'approve' ? 'Approve' : 'Reject'} KYC`}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminKYC;