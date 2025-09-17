import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  List,
  ListItem,
  ListItemText,
  Chip,
  LinearProgress
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
import { Dashboard, TrendingUp, People, Business } from '@mui/icons-material';
import api from '../utils/api';

const PlatformAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [period, setPeriod] = useState('30d');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, [period]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/api/analytics/platform?period=${period}`);
      setAnalytics(response.data.analytics);
    } catch (error) {
      console.error('Failed to load platform analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !analytics) {
    return <Box p={3}>Loading platform analytics...</Box>;
  }

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">
          <Dashboard sx={{ mr: 1, verticalAlign: 'middle' }} />
          Platform Analytics
        </Typography>
        
        <FormControl size="small">
          <InputLabel>Period</InputLabel>
          <Select value={period} onChange={(e) => setPeriod(e.target.value)}>
            <MenuItem value="7d">Last 7 days</MenuItem>
            <MenuItem value="30d">Last 30 days</MenuItem>
            <MenuItem value="90d">Last 90 days</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={3}>
        {/* Key Platform Metrics */}
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Users
              </Typography>
              <Typography variant="h4">
                {analytics.totalUsers.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="primary">
                <TrendingUp sx={{ fontSize: 16, mr: 0.5 }} />
                +{analytics.newUsers} new this period
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Active Users
              </Typography>
              <Typography variant="h4">
                {analytics.activeUsers.toLocaleString()}
              </Typography>
              <Typography variant="body2">
                {((analytics.activeUsers / analytics.totalUsers) * 100).toFixed(1)}% of total
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Requirements
              </Typography>
              <Typography variant="h4">
                {analytics.totalRequirements.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="success.main">
                +{analytics.newRequirements} new this period
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
              <Typography variant="h4" color="primary">
                {analytics.conversionRate}%
              </Typography>
              <Typography variant="body2">
                {analytics.successfulMatches} successful matches
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* User Growth Trend */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                User Growth Trend
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={analytics.userGrowthTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="count" stroke="#8884d8" fill="#8884d8" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* User Distribution */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                User Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Companies', value: analytics.totalCompanies },
                      { name: 'Individuals', value: analytics.totalIndividuals }
                    ]}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    <Cell fill="#0088FE" />
                    <Cell fill="#00C49F" />
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Application Trends */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Application Activity Trends
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analytics.applicationTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="count" stroke="#82ca9d" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Platform Health */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Platform Health
              </Typography>
              <Box mb={2}>
                <Typography variant="body2" gutterBottom>
                  User Engagement
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={85} 
                  sx={{ height: 8, borderRadius: 4 }}
                />
                <Typography variant="caption">85%</Typography>
              </Box>
              
              <Box mb={2}>
                <Typography variant="body2" gutterBottom>
                  Match Success Rate
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={parseFloat(analytics.conversionRate)} 
                  sx={{ height: 8, borderRadius: 4 }}
                  color="success"
                />
                <Typography variant="caption">{analytics.conversionRate}%</Typography>
              </Box>
              
              <Box>
                <Typography variant="body2" gutterBottom>
                  Platform Utilization
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={72} 
                  sx={{ height: 8, borderRadius: 4 }}
                  color="warning"
                />
                <Typography variant="caption">72%</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Top Industries */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Top Industries
              </Typography>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={analytics.topIndustries}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="industry" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Top Categories */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Top Requirement Categories
              </Typography>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={analytics.topCategories}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Key Performance Indicators */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Key Performance Indicators
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={3}>
                  <Box textAlign="center" p={2}>
                    <People sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                    <Typography variant="h6">
                      {((analytics.activeUsers / analytics.totalUsers) * 100).toFixed(1)}%
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      User Activation Rate
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={3}>
                  <Box textAlign="center" p={2}>
                    <Business sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                    <Typography variant="h6">
                      {analytics.averageTimeToMatch}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Average Time to Match
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={3}>
                  <Box textAlign="center" p={2}>
                    <TrendingUp sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
                    <Typography variant="h6">
                      {(analytics.newApplications / analytics.newRequirements).toFixed(1)}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Applications per Requirement
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={3}>
                  <Box textAlign="center" p={2}>
                    <Dashboard sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
                    <Typography variant="h6">
                      {analytics.conversionRate}%
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Overall Conversion Rate
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PlatformAnalytics;