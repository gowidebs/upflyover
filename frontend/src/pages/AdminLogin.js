import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert
} from '@mui/material';
import { AdminPanelSettings } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simple admin check (in production, use proper authentication)
    if (credentials.username === 'admin' && credentials.password === 'upflyover2025') {
      localStorage.setItem('admin_token', 'admin_authenticated');
      toast.success('Admin login successful');
      navigate('/admin/kyc');
    } else {
      toast.error('Invalid admin credentials');
    }
    
    setLoading(false);
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <AdminPanelSettings sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
          <Typography variant="h4">Admin Login</Typography>
        </Box>
        
        <Alert severity="info" sx={{ mb: 3 }}>
          Admin access for KYC document review and approval
        </Alert>

        <form onSubmit={handleLogin}>
          <TextField
            fullWidth
            label="Username"
            value={credentials.username}
            onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
            sx={{ mb: 2 }}
            required
          />
          <TextField
            fullWidth
            type="password"
            label="Password"
            value={credentials.password}
            onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
            sx={{ mb: 3 }}
            required
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{ py: 1.5 }}
          >
            {loading ? 'Logging in...' : 'Login as Admin'}
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default AdminLogin;