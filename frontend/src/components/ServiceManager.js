import React, { useState, useEffect } from 'react';
import {
  Box, Card, CardContent, Typography, Button, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Grid, Chip, Switch, FormControlLabel, IconButton,
  List, ListItem, ListItemText, ListItemSecondaryAction, Divider
} from '@mui/material';
import { Add, Edit, Delete, AttachMoney, CheckCircle, Cancel } from '@mui/icons-material';
import api from '../utils/api';

const ServiceManager = () => {
  const [services, setServices] = useState([]);
  const [serviceDialog, setServiceDialog] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [serviceForm, setServiceForm] = useState({
    name: '', description: '', price: '', category: 'development', features: [], active: true
  });
  const [newFeature, setNewFeature] = useState('');

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const response = await api.get('/companies/services');
      setServices(response.data.services || []);
    } catch (error) {
      console.error('Failed to load services:', error);
    }
  };

  const handleServiceSave = async () => {
    try {
      if (editingService) {
        await api.put(`/companies/services/${editingService.id}`, serviceForm);
      } else {
        await api.post('/companies/services', serviceForm);
      }
      
      setServiceDialog(false);
      setEditingService(null);
      setServiceForm({ name: '', description: '', price: '', category: 'development', features: [], active: true });
      loadServices();
    } catch (error) {
      console.error('Service save failed:', error);
    }
  };

  const handleServiceDelete = async (serviceId) => {
    try {
      await api.delete(`/companies/services/${serviceId}`);
      loadServices();
    } catch (error) {
      console.error('Service deletion failed:', error);
    }
  };

  const handleEditService = (service) => {
    setEditingService(service);
    setServiceForm({
      name: service.name,
      description: service.description,
      price: service.price,
      category: service.category,
      features: service.features || [],
      active: service.active
    });
    setServiceDialog(true);
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setServiceForm(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }));
      setNewFeature('');
    }
  };

  const removeFeature = (index) => {
    setServiceForm(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const categories = [
    'development', 'design', 'marketing', 'consulting', 'support', 'other'
  ];

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5">Service Offerings</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setServiceDialog(true)}
        >
          Add Service
        </Button>
      </Box>

      <Grid container spacing={3}>
        {services.map((service) => (
          <Grid item xs={12} md={6} lg={4} key={service.id}>
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                  <Typography variant="h6">{service.name}</Typography>
                  <Box>
                    <IconButton size="small" onClick={() => handleEditService(service)}>
                      <Edit />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleServiceDelete(service.id)}>
                      <Delete />
                    </IconButton>
                  </Box>
                </Box>
                
                <Typography variant="body2" color="text.secondary" paragraph>
                  {service.description}
                </Typography>
                
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <AttachMoney color="primary" />
                  <Typography variant="h6" color="primary">
                    {service.price}
                  </Typography>
                </Box>
                
                <Chip 
                  label={service.category} 
                  size="small" 
                  sx={{ mb: 2 }} 
                />
                
                {service.features?.length > 0 && (
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>Features:</Typography>
                    {service.features.slice(0, 3).map((feature, index) => (
                      <Box key={index} display="flex" alignItems="center" gap={1} mb={0.5}>
                        <CheckCircle color="success" fontSize="small" />
                        <Typography variant="body2">{feature}</Typography>
                      </Box>
                    ))}
                    {service.features.length > 3 && (
                      <Typography variant="body2" color="text.secondary">
                        +{service.features.length - 3} more features
                      </Typography>
                    )}
                  </Box>
                )}
                
                <Box display="flex" alignItems="center" justifyContent="space-between" mt={2}>
                  <Chip
                    icon={service.active ? <CheckCircle /> : <Cancel />}
                    label={service.active ? 'Active' : 'Inactive'}
                    color={service.active ? 'success' : 'default'}
                    size="small"
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Service Dialog */}
      <Dialog open={serviceDialog} onClose={() => setServiceDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingService ? 'Edit Service' : 'Add New Service'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Service Name"
                value={serviceForm.name}
                onChange={(e) => setServiceForm(prev => ({ ...prev, name: e.target.value }))}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                value={serviceForm.description}
                onChange={(e) => setServiceForm(prev => ({ ...prev, description: e.target.value }))}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Price"
                placeholder="e.g., $500, $50/hour, Contact for quote"
                value={serviceForm.price}
                onChange={(e) => setServiceForm(prev => ({ ...prev, price: e.target.value }))}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                label="Category"
                value={serviceForm.category}
                onChange={(e) => setServiceForm(prev => ({ ...prev, category: e.target.value }))}
                SelectProps={{ native: true }}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </TextField>
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>Features</Typography>
              <Box display="flex" gap={1} mb={2}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Add a feature"
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addFeature()}
                />
                <Button onClick={addFeature} variant="outlined">Add</Button>
              </Box>
              
              <List dense>
                {serviceForm.features.map((feature, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={feature} />
                    <ListItemSecondaryAction>
                      <IconButton size="small" onClick={() => removeFeature(index)}>
                        <Delete />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </Grid>
            
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={serviceForm.active}
                    onChange={(e) => setServiceForm(prev => ({ ...prev, active: e.target.checked }))}
                  />
                }
                label="Active Service"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setServiceDialog(false)}>Cancel</Button>
          <Button onClick={handleServiceSave} variant="contained">
            {editingService ? 'Update' : 'Create'} Service
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ServiceManager;