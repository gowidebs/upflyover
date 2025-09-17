import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Button,
  TextField,
  Alert,
  Stepper,
  Step,
  StepLabel,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  CloudUpload,
  CheckCircle,
  Warning,
  Info,
  Business,
  AccountBalance,
  Description,
  VerifiedUser
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const KYC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [kycData, setKycData] = useState({
    businessRegistrationNumber: '',
    taxId: '',
    description: ''
  });
  const [files, setFiles] = useState({
    businessLicense: null,
    taxCertificate: null
  });
  const [kycStatus, setKycStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [previewDialog, setPreviewDialog] = useState({ open: false, file: null });

  const steps = ['Company Information', 'Document Upload', 'Review & Submit'];

  const requiredDocuments = [
    {
      key: 'businessLicense',
      title: 'Business License / Registration Certificate',
      description: 'Valid business registration certificate or license',
      icon: <Business />,
      required: true
    },
    {
      key: 'taxCertificate',
      title: 'Tax Registration Certificate',
      description: 'Tax registration certificate or VAT certificate',
      icon: <AccountBalance />,
      required: true
    }
  ];

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchKycStatus();
  }, [isAuthenticated, navigate]);

  const fetchKycStatus = async () => {
    try {
      const response = await axios.get('/api/kyc/status');
      setKycStatus(response.data);
    } catch (error) {
      console.error('Failed to fetch KYC status:', error);
    }
  };

  const handleInputChange = (field, value) => {
    setKycData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (documentType, file) => {
    if (file && file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }
    setFiles(prev => ({ ...prev, [documentType]: file }));
  };

  const handleNext = () => {
    if (activeStep === 0) {
      // Validate company information
      if (!kycData.businessRegistrationNumber || !kycData.taxId) {
        toast.error('Please fill in all required fields');
        return;
      }
    } else if (activeStep === 1) {
      // Validate required documents
      const requiredDocs = requiredDocuments.filter(doc => doc.required);
      const missingDocs = requiredDocs.filter(doc => !files[doc.key]);
      if (missingDocs.length > 0) {
        toast.error(`Please upload: ${missingDocs.map(doc => doc.title).join(', ')}`);
        return;
      }
    }
    setActiveStep(prev => prev + 1);
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    
    try {
      const formData = new FormData();
      
      // Add text data
      Object.keys(kycData).forEach(key => {
        formData.append(key, kycData[key]);
      });
      
      // Add files
      Object.keys(files).forEach(key => {
        if (files[key]) {
          formData.append(key, files[key]);
        }
      });

      await axios.post('/api/kyc/submit', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      toast.success('KYC documents submitted successfully! We will review them within 2-3 business days.');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to submit KYC documents');
    }
    
    setLoading(false);
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Company Registration Details
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Business Registration Number"
                value={kycData.businessRegistrationNumber}
                onChange={(e) => handleInputChange('businessRegistrationNumber', e.target.value)}
                helperText="Enter your official business registration number"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Tax ID / VAT Number"
                value={kycData.taxId}
                onChange={(e) => handleInputChange('taxId', e.target.value)}
                helperText="Enter your tax identification number"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Business Description"
                value={kycData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                helperText="Describe your business activities and services"
              />
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Document Upload
              </Typography>
              <Alert severity="info" sx={{ mb: 3 }}>
                Please upload clear, high-quality images or PDFs. Maximum file size: 5MB per document.
              </Alert>
            </Grid>
            {requiredDocuments.map((doc) => (
              <Grid item xs={12} md={6} key={doc.key}>
                <Card variant="outlined">
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      {doc.icon}
                      <Box sx={{ ml: 2 }}>
                        <Typography variant="subtitle1">
                          {doc.title} {doc.required && <span style={{ color: 'red' }}>*</span>}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {doc.description}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <input
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                      style={{ display: 'none' }}
                      id={`file-${doc.key}`}
                      type="file"
                      onChange={(e) => handleFileChange(doc.key, e.target.files[0])}
                    />
                    <label htmlFor={`file-${doc.key}`}>
                      <Button
                        variant="outlined"
                        component="span"
                        startIcon={<CloudUpload />}
                        fullWidth
                        sx={{ mb: 1 }}
                      >
                        Choose File
                      </Button>
                    </label>
                    
                    {files[doc.key] && (
                      <Box sx={{ mt: 1 }}>
                        <Chip
                          label={files[doc.key].name}
                          onDelete={() => setFiles(prev => ({ ...prev, [doc.key]: null }))}
                          color="success"
                          size="small"
                        />
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        );

      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Review Your Information
              </Typography>
              <Alert severity="warning" sx={{ mb: 3 }}>
                Please review all information carefully before submitting. After verification, your account will be activated within 1-2 business days. Changes cannot be made after submission.
              </Alert>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    Company Information
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemText
                        primary="Business Registration Number"
                        secondary={kycData.businessRegistrationNumber}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Tax ID"
                        secondary={kycData.taxId}
                      />
                    </ListItem>

                  </List>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    Uploaded Documents
                  </Typography>
                  <List dense>
                    {requiredDocuments.map((doc) => (
                      <ListItem key={doc.key}>
                        <ListItemIcon>
                          {files[doc.key] ? <CheckCircle color="success" /> : <Warning color="warning" />}
                        </ListItemIcon>
                        <ListItemText
                          primary={doc.title}
                          secondary={files[doc.key] ? files[doc.key].name : 'Not uploaded'}
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        );

      default:
        return 'Unknown step';
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  // Show status if KYC already submitted
  if (kycStatus && kycStatus.status !== 'pending') {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <Box sx={{ mb: 3 }}>
              {kycStatus.status === 'approved' ? (
                <CheckCircle sx={{ fontSize: 80, color: 'success.main' }} />
              ) : kycStatus.status === 'submitted' ? (
                <Info sx={{ fontSize: 80, color: 'info.main' }} />
              ) : (
                <Warning sx={{ fontSize: 80, color: 'warning.main' }} />
              )}
            </Box>
            
            <Typography variant="h4" gutterBottom>
              KYC {kycStatus.status === 'approved' ? 'Approved' : 
                   kycStatus.status === 'submitted' ? 'Under Review' : 'Rejected'}
            </Typography>
            
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              {kycStatus.status === 'approved' 
                ? 'Your company has been successfully verified. You now have access to all premium features.'
                : kycStatus.status === 'submitted'
                ? 'Your KYC documents are currently under review. We will notify you within 2-3 business days.'
                : 'Your KYC submission was rejected. Please contact support for more information.'
              }
            </Typography>
            
            <Button
              variant="contained"
              onClick={() => navigate('/dashboard')}
            >
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        KYC Verification
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Complete your Know Your Customer (KYC) verification to build trust and access premium features.
      </Typography>

      <Paper sx={{ p: 3 }}>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {getStepContent(activeStep)}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
          >
            Back
          </Button>
          
          {activeStep === steps.length - 1 ? (
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit KYC'}
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleNext}
            >
              Next
            </Button>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default KYC;