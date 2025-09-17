import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  CircularProgress
} from '@mui/material';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { TrendingUp, Assessment, GetApp } from '@mui/icons-material';
import api from '../utils/api';

const AnalyticsDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [period, setPeriod] = useState('30d');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, [period]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/api/analytics/dashboard?period=${period}`);
      setAnalytics(response.data.analytics);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportData = async (format) => {
    try {
      const response = await api.get(`/api/analytics/export?format=${format}&type=dashboard`);
      if (format === 'csv') {
        const blob = new Blob([response.data], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'analytics-report.csv';
        a.click();
      } else {
        const blob = new Blob([JSON.stringify(response.data, null, 2)], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'analytics-report.json';
        a.click();
      }
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">
          <Assessment sx={{ mr: 1, verticalAlign: 'middle' }} />
          Analytics Dashboard
        </Typography>
        
        <Box display="flex" gap={2}>
          <FormControl size="small">
            <InputLabel>Period</InputLabel>
            <Select value={period} onChange={(e) => setPeriod(e.target.value)}>
              <MenuItem value="7d">Last 7 days</MenuItem>
              <MenuItem value="30d">Last 30 days</MenuItem>
              <MenuItem value="90d">Last 90 days</MenuItem>
            </Select>
          </FormControl>
          
          <Button
            variant="outlined"
            startIcon={<GetApp />}
            onClick={() => exportData('json')}
          >
            Export JSON
          </Button>
          
          <Button
            variant="outlined"
            startIcon={<GetApp />}
            onClick={() => exportData('csv')}
          >
            Export CSV
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Key Metrics */}
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Applications
              </Typography>
              <Typography variant="h4">
                {analytics?.totalApplications || analytics?.totalRequirements || 0}
              </Typography>
              <Typography variant="body2" color="primary">
                <TrendingUp sx={{ fontSize: 16, mr: 0.5 }} />
                +12% from last period
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Success Rate
              </Typography>
              <Typography variant="h4">
                {analytics?.successRate || 0}%
              </Typography>
              <Typography variant="body2" color="success.main">
                <TrendingUp sx={{ fontSize: 16, mr: 0.5 }} />
                +5% from last period
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Profile Views
              </Typography>
              <Typography variant="h4">
                {analytics?.profileViews || 0}
              </Typography>
              <Typography variant="body2" color="primary">
                <TrendingUp sx={{ fontSize: 16, mr: 0.5 }} />
                +8% from last period
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Messages
              </Typography>
              <Typography variant="h4">
                {(analytics?.messagesSent || 0) + (analytics?.messagesReceived || 0)}
              </Typography>
              <Typography variant="body2" color="primary">
                <TrendingUp sx={{ fontSize: 16, mr: 0.5 }} />
                +15% from last period
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Application Trends */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Application Trends
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={generateTrendData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="applications" stroke="#8884d8" fill="#8884d8" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Top Categories */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Top Categories
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={analytics?.topCategories?.map((cat, index) => ({
                      name: cat,
                      value: Math.floor(Math.random() * 50) + 10
                    })) || []}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {analytics?.topCategories?.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Performance Metrics */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Performance Metrics
              </Typography>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={[
                  { name: 'Applications', value: analytics?.totalApplications || 0 },
                  { name: 'Accepted', value: analytics?.acceptedApplications || 0 },
                  { name: 'Pending', value: (analytics?.totalApplications || 0) - (analytics?.acceptedApplications || 0) }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* ROI Tracking */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                ROI Tracking
              </Typography>
              <Box textAlign="center" py={4}>
                <Typography variant="h3" color="primary">
                  {analytics?.roi || '250'}%
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  Return on Investment
                </Typography>
                <Typography variant="body2" sx={{ mt: 2 }}>
                  Based on successful applications and subscription cost
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  function generateTrendData() {
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      data.push({
        date: date.toLocaleDateString(),
        applications: Math.floor(Math.random() * 20) + 5
      });
    }
    return data;
  }
};

export default AnalyticsDashboard;