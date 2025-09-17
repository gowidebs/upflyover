import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import {
  Code,
  Add,
  Refresh,
  Delete,
  GetApp,
  Webhook,
  Security,
  Description
} from '@mui/icons-material';
import api from '../utils/api';

const DeveloperPortal = () => {
  const [tabValue, setTabValue] = useState(0);
  const [apiKeys, setApiKeys] = useState([]);
  const [webhooks, setWebhooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState('');
  const [registerDialog, setRegisterDialog] = useState(false);
  const [webhookDialog, setWebhookDialog] = useState(false);
  const [registrationData, setRegistrationData] = useState({
    name: '',
    email: '',
    company: '',
    purpose: ''
  });
  const [webhookData, setWebhookData] = useState({
    url: '',
    events: [],
    secret: ''
  });

  const availableEvents = [
    'company.created',
    'company.updated',
    'requirement.created',
    'requirement.updated',
    'application.created',
    'application.updated'
  ];

  useEffect(() => {
    if (tabValue === 0) loadApiKeys();
    if (tabValue === 1) loadWebhooks();
  }, [tabValue]);

  const loadApiKeys = async () => {
    try {
      const response = await api.get('/api/developer/keys');
      setApiKeys([response.data.keyInfo]);
    } catch (error) {
      console.error('Failed to load API keys:', error);
    }
  };

  const loadWebhooks = async () => {
    try {
      const response = await api.get('/api/webhooks');
      setWebhooks(response.data.webhooks);
    } catch (error) {
      console.error('Failed to load webhooks:', error);
    }
  };

  const registerDeveloper = async () => {
    setLoading(true);
    try {
      const response = await api.post('/api/developer/register', registrationData);
      setAlert(`Registration successful! Your API key: ${response.data.apiKey}`);
      setRegisterDialog(false);
      loadApiKeys();
    } catch (error) {
      setAlert('Registration failed: ' + (error.response?.data?.error || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const regenerateApiKey = async () => {
    try {
      const response = await api.post('/api/developer/keys/regenerate');
      setAlert(`New API key generated: ${response.data.apiKey}`);
      loadApiKeys();
    } catch (error) {
      setAlert('Failed to regenerate API key');
    }
  };

  const createWebhook = async () => {
    setLoading(true);
    try {
      await api.post('/api/webhooks', webhookData);
      setAlert('Webhook created successfully');
      setWebhookDialog(false);
      setWebhookData({ url: '', events: [], secret: '' });
      loadWebhooks();
    } catch (error) {
      setAlert('Failed to create webhook');
    } finally {
      setLoading(false);
    }
  };

  const downloadSDK = (language) => {
    window.open(`/api/sdk/${language}`, '_blank');
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        <Code sx={{ mr: 1, verticalAlign: 'middle' }} />
        Developer Portal
      </Typography>

      {alert && (
        <Alert 
          severity={alert.includes('success') ? 'success' : 'error'} 
          sx={{ mb: 2 }}
          onClose={() => setAlert('')}
        >
          {alert}
        </Alert>
      )}

      <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} sx={{ mb: 3 }}>
        <Tab label="API Keys" />
        <Tab label="Webhooks" />
        <Tab label="Documentation" />
        <Tab label="SDKs" />
      </Tabs>

      {/* API Keys Tab */}
      {tabValue === 0 && (
        <Box>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h6">API Key Management</Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setRegisterDialog(true)}
            >
              Register for API Access
            </Button>
          </Box>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Company</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell>Last Used</TableCell>
                  <TableCell>Requests</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {apiKeys.map((key) => (
                  <TableRow key={key.id}>
                    <TableCell>{key.name}</TableCell>
                    <TableCell>{key.email}</TableCell>
                    <TableCell>{key.company}</TableCell>
                    <TableCell>{new Date(key.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      {key.lastUsed ? new Date(key.lastUsed).toLocaleDateString() : 'Never'}
                    </TableCell>
                    <TableCell>{key.requestCount}</TableCell>
                    <TableCell>
                      <IconButton onClick={regenerateApiKey} size="small">
                        <Refresh />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {/* Webhooks Tab */}
      {tabValue === 1 && (
        <Box>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h6">Webhook Management</Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setWebhookDialog(true)}
            >
              Add Webhook
            </Button>
          </Box>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>URL</TableCell>
                  <TableCell>Events</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Last Triggered</TableCell>
                  <TableCell>Deliveries</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {webhooks.map((webhook) => (
                  <TableRow key={webhook.id}>
                    <TableCell>{webhook.url}</TableCell>
                    <TableCell>
                      {webhook.events.map(event => (
                        <Chip key={event} label={event} size="small" sx={{ mr: 0.5 }} />
                      ))}
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={webhook.active ? 'Active' : 'Inactive'} 
                        color={webhook.active ? 'success' : 'error'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {webhook.lastTriggered ? new Date(webhook.lastTriggered).toLocaleDateString() : 'Never'}
                    </TableCell>
                    <TableCell>{webhook.deliveryCount}</TableCell>
                    <TableCell>
                      <IconButton size="small">
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {/* Documentation Tab */}
      {tabValue === 2 && (
        <Box>
          <Typography variant="h6" gutterBottom>API Documentation</Typography>
          
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <Description sx={{ mr: 1, verticalAlign: 'middle' }} />
                Interactive API Documentation
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Explore our comprehensive API documentation with interactive examples
              </Typography>
              <Button
                variant="contained"
                onClick={() => window.open('/api/docs', '_blank')}
              >
                View Swagger Documentation
              </Button>
            </CardContent>
          </Card>

          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Quick Start Guide</Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                1. Register for API access to get your API key<br/>
                2. Include your API key in the X-API-Key header<br/>
                3. Make requests to /api/public/* endpoints<br/>
                4. Set up webhooks to receive real-time updates
              </Typography>
              
              <Typography variant="subtitle2" gutterBottom>Example Request:</Typography>
              <Box component="pre" sx={{ bgcolor: 'grey.100', p: 2, borderRadius: 1, fontSize: '0.875rem' }}>
{`curl -X GET "https://api.upflyover.com/api/public/companies" \\
  -H "X-API-Key: your-api-key-here" \\
  -H "Content-Type: application/json"`}
              </Box>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Rate Limits</Typography>
              <Typography variant="body2">
                • General API: 100 requests per 15 minutes<br/>
                • Authentication: 5 requests per 15 minutes<br/>
                • Public API: 60 requests per minute<br/>
                • Developer API: 1000 requests per hour
              </Typography>
            </CardContent>
          </Card>
        </Box>
      )}

      {/* SDKs Tab */}
      {tabValue === 3 && (
        <Box>
          <Typography variant="h6" gutterBottom>Software Development Kits</Typography>
          
          <List>
            <ListItem>
              <ListItemText
                primary="JavaScript SDK"
                secondary="For Node.js and browser applications"
              />
              <ListItemSecondaryAction>
                <Button
                  variant="outlined"
                  startIcon={<GetApp />}
                  onClick={() => downloadSDK('javascript')}
                >
                  Download
                </Button>
              </ListItemSecondaryAction>
            </ListItem>
            
            <ListItem>
              <ListItemText
                primary="Python SDK"
                secondary="For Python applications and data science"
              />
              <ListItemSecondaryAction>
                <Button
                  variant="outlined"
                  startIcon={<GetApp />}
                  onClick={() => downloadSDK('python')}
                >
                  Download
                </Button>
              </ListItemSecondaryAction>
            </ListItem>
            
            <ListItem>
              <ListItemText
                primary="PHP SDK"
                secondary="For PHP web applications"
              />
              <ListItemSecondaryAction>
                <Button
                  variant="outlined"
                  startIcon={<GetApp />}
                  onClick={() => downloadSDK('php')}
                >
                  Download
                </Button>
              </ListItemSecondaryAction>
            </ListItem>
          </List>
        </Box>
      )}

      {/* Registration Dialog */}
      <Dialog open={registerDialog} onClose={() => setRegisterDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Register for API Access</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Name"
            value={registrationData.name}
            onChange={(e) => setRegistrationData({...registrationData, name: e.target.value})}
            sx={{ mb: 2, mt: 1 }}
          />
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={registrationData.email}
            onChange={(e) => setRegistrationData({...registrationData, email: e.target.value})}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Company"
            value={registrationData.company}
            onChange={(e) => setRegistrationData({...registrationData, company: e.target.value})}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Purpose"
            value={registrationData.purpose}
            onChange={(e) => setRegistrationData({...registrationData, purpose: e.target.value})}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRegisterDialog(false)}>Cancel</Button>
          <Button onClick={registerDeveloper} disabled={loading} variant="contained">
            {loading ? 'Registering...' : 'Register'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Webhook Dialog */}
      <Dialog open={webhookDialog} onClose={() => setWebhookDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Webhook</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Webhook URL"
            value={webhookData.url}
            onChange={(e) => setWebhookData({...webhookData, url: e.target.value})}
            sx={{ mb: 2, mt: 1 }}
          />
          <TextField
            fullWidth
            label="Secret (optional)"
            value={webhookData.secret}
            onChange={(e) => setWebhookData({...webhookData, secret: e.target.value})}
            sx={{ mb: 2 }}
          />
          <Typography variant="subtitle2" gutterBottom>Events to Subscribe:</Typography>
          {availableEvents.map(event => (
            <FormControlLabel
              key={event}
              control={
                <Checkbox
                  checked={webhookData.events.includes(event)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setWebhookData({...webhookData, events: [...webhookData.events, event]});
                    } else {
                      setWebhookData({...webhookData, events: webhookData.events.filter(e => e !== event)});
                    }
                  }}
                />
              }
              label={event}
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setWebhookDialog(false)}>Cancel</Button>
          <Button onClick={createWebhook} disabled={loading} variant="contained">
            {loading ? 'Creating...' : 'Create Webhook'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DeveloperPortal;