import React, { useState, useEffect, useMemo } from 'react';
import {
  Box, Card, CardContent, Typography, Button, Dialog, DialogTitle, DialogContent,
  TextField, Select, MenuItem, FormControl, InputLabel, Chip, IconButton,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Tabs, Tab, LinearProgress, Grid, Alert, Checkbox, Menu
} from '@mui/material';
import {
  Add, Edit, Delete, Visibility, GetApp, MoreVert, Analytics,
  CheckCircle, Cancel, Schedule, PlayArrow
} from '@mui/icons-material';
import api from '../utils/api';

const RequirementManager = () => {
  const [requirements, setRequirements] = useState([]);
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedRequirements, setSelectedRequirements] = useState([]);
  const [bulkMenuAnchor, setBulkMenuAnchor] = useState(null);
  const [analyticsDialog, setAnalyticsDialog] = useState(false);
  const [selectedAnalytics, setSelectedAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadRequirements();
  }, []);

  const loadRequirements = async () => {
    try {
      setLoading(true);
      const response = await api.get('/requirements/my');
      setRequirements(response.data.requirements || []);
    } catch (error) {
      setError('Failed to load requirements. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status, notes = '') => {
    try {
      await api.put(`/requirements/${id}/status`, { status, notes });
      loadRequirements();
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const getAnalytics = async (id) => {
    try {
      const response = await api.get(`/requirements/${id}/analytics`);
      setSelectedAnalytics(response.data.analytics);
      setAnalyticsDialog(true);
    } catch (error) {
      console.error('Failed to get analytics:', error);
    }
  };

  const handleBulkAction = async (action, data = {}) => {
    if (selectedRequirements.length === 0) return;
    
    try {
      await api.post('/requirements/bulk', {
        action,
        requirementIds: selectedRequirements,
        data
      });
      setSelectedRequirements([]);
      setBulkMenuAnchor(null);
      loadRequirements();
    } catch (error) {
      console.error('Bulk action failed:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'success';
      case 'in-progress': return 'warning';
      case 'completed': return 'primary';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'open': return <PlayArrow />;
      case 'in-progress': return <Schedule />;
      case 'completed': return <CheckCircle />;
      case 'cancelled': return <Cancel />;
      default: return null;
    }
  };

  const filteredRequirements = useMemo(() => {
    return requirements.filter(req => {
      switch (selectedTab) {
        case 0: return true; // All
        case 1: return req.status === 'open';
        case 2: return req.status === 'in-progress';
        case 3: return req.status === 'completed';
        default: return true;
      }
    });
  }, [requirements, selectedTab]);

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Requirement Management</Typography>
        <Box>
          {selectedRequirements.length > 0 && (
            <Button
              variant="outlined"
              startIcon={<MoreVert />}
              onClick={(e) => setBulkMenuAnchor(e.currentTarget)}
              sx={{ mr: 2 }}
            >
              Bulk Actions ({selectedRequirements.length})
            </Button>
          )}
          <Button variant="contained" startIcon={<Add />}>
            New Requirement
          </Button>
        </Box>
      </Box>

      <Tabs value={selectedTab} onChange={(e, v) => setSelectedTab(v)} sx={{ mb: 3 }}>
        <Tab label="All Requirements" />
        <Tab label="Open" />
        <Tab label="In Progress" />
        <Tab label="Completed" />
      </Tabs>

      {loading && <LinearProgress sx={{ mb: 2 }} />}
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={filteredRequirements.length > 0 && selectedRequirements.length === filteredRequirements.length}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedRequirements(filteredRequirements.map(r => r.id));
                    } else {
                      setSelectedRequirements([]);
                    }
                  }}
                />
              </TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Budget</TableCell>
              <TableCell>Applications</TableCell>
              <TableCell>Created</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRequirements.map((req) => (
              <TableRow key={req.id}>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedRequirements.includes(req.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedRequirements([...selectedRequirements, req.id]);
                      } else {
                        setSelectedRequirements(selectedRequirements.filter(id => id !== req.id));
                      }
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="subtitle2">{req.title}</Typography>
                    {req.attachments?.length > 0 && (
                      <Chip size="small" label={`${req.attachments.length} files`} />
                    )}
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    icon={getStatusIcon(req.status)}
                    label={req.status}
                    color={getStatusColor(req.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>{req.category}</TableCell>
                <TableCell>{req.budget || 'Not specified'}</TableCell>
                <TableCell>{req.applications || 0}</TableCell>
                <TableCell>{new Date(req.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  <IconButton onClick={() => getAnalytics(req.id)} size="small">
                    <Analytics />
                  </IconButton>
                  <IconButton size="small">
                    <Edit />
                  </IconButton>
                  <Select
                    value={req.status}
                    onChange={(e) => updateStatus(req.id, e.target.value)}
                    size="small"
                    sx={{ minWidth: 100 }}
                  >
                    <MenuItem value="open">Open</MenuItem>
                    <MenuItem value="in-progress">In Progress</MenuItem>
                    <MenuItem value="completed">Completed</MenuItem>
                    <MenuItem value="cancelled">Cancelled</MenuItem>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Bulk Actions Menu */}
      <Menu
        anchorEl={bulkMenuAnchor}
        open={Boolean(bulkMenuAnchor)}
        onClose={() => setBulkMenuAnchor(null)}
      >
        <MenuItem onClick={() => handleBulkAction('updateStatus', { status: 'open' })}>
          Mark as Open
        </MenuItem>
        <MenuItem onClick={() => handleBulkAction('updateStatus', { status: 'completed' })}>
          Mark as Completed
        </MenuItem>
        <MenuItem onClick={() => handleBulkAction('delete')}>
          Delete Selected
        </MenuItem>
      </Menu>

      {/* Analytics Dialog */}
      <Dialog open={analyticsDialog} onClose={() => setAnalyticsDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Requirement Analytics</DialogTitle>
        <DialogContent>
          {selectedAnalytics && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">Views & Engagement</Typography>
                    <Typography variant="h4">{selectedAnalytics.totalViews}</Typography>
                    <Typography color="text.secondary">Total Views</Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      Application Rate: {selectedAnalytics.applicationRate}%
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">Applications</Typography>
                    <Typography variant="h4">{selectedAnalytics.totalApplications}</Typography>
                    <Typography color="text.secondary">Total Applications</Typography>
                    <Box sx={{ mt: 1 }}>
                      <Chip label={`${selectedAnalytics.acceptedApplications} Accepted`} color="success" size="small" />
                      <Chip label={`${selectedAnalytics.pendingApplications} Pending`} color="warning" size="small" sx={{ ml: 1 }} />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 2 }}>Top Applicants</Typography>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Company</TableCell>
                        <TableCell>Applied Date</TableCell>
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedAnalytics.topCompanies?.map((company, index) => (
                        <TableRow key={index}>
                          <TableCell>{company.name}</TableCell>
                          <TableCell>{new Date(company.appliedAt).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Chip label={company.status} size="small" />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default RequirementManager;