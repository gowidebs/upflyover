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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip
} from '@mui/material';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { Business, TrendingUp, GetApp } from '@mui/icons-material';
import api from '../utils/api';

const CompanyMetrics = ({ companyId }) => {
  const [metrics, setMetrics] = useState(null);
  const [period, setPeriod] = useState('30d');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (companyId) {
      loadMetrics();
    }
  }, [companyId, period]);

  const loadMetrics = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/api/analytics/company/${companyId}?period=${period}`);
      setMetrics(response.data.metrics);
    } catch (error) {
      console.error('Failed to load company metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !metrics) {
    return <Box p={3}>Loading company metrics...</Box>;
  }

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5">
          <Business sx={{ mr: 1, verticalAlign: 'middle' }} />
          Company Performance Metrics
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
        {/* Key Performance Indicators */}
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Success Rate
              </Typography>
              <Typography variant="h4" color="primary">
                {metrics.successRate}%
              </Typography>
              <Typography variant="body2">
                {metrics.acceptedApplications}/{metrics.totalApplications} accepted
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
                {metrics.profileViews.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="success.main">
                <TrendingUp sx={{ fontSize: 16, mr: 0.5 }} />
                +15% this period
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Average Rating
              </Typography>
              <Typography variant="h4">
                {metrics.rating.toFixed(1)}
              </Typography>
              <Typography variant="body2">
                Based on {metrics.totalReviews} reviews
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Monthly Revenue
              </Typography>
              <Typography variant="h4" color="success.main">
                ${metrics.monthlyRevenue.toLocaleString()}
              </Typography>
              <Typography variant="body2">
                ROI: {metrics.roi}%
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
                <LineChart data={metrics.applicationTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="count" stroke="#8884d8" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Top Categories */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Top Requirement Categories
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={metrics.topRequirementCategories}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Application Status Breakdown */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Application Status Breakdown
              </Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Status</TableCell>
                      <TableCell align="right">Count</TableCell>
                      <TableCell align="right">Percentage</TableCell>
                      <TableCell align="right">Trend</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        <Chip label="Accepted" color="success" size="small" />
                      </TableCell>
                      <TableCell align="right">{metrics.acceptedApplications}</TableCell>
                      <TableCell align="right">{metrics.successRate}%</TableCell>
                      <TableCell align="right">
                        <Typography color="success.main">+5%</Typography>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <Chip label="Rejected" color="error" size="small" />
                      </TableCell>
                      <TableCell align="right">{metrics.rejectedApplications}</TableCell>
                      <TableCell align="right">
                        {((metrics.rejectedApplications / metrics.totalApplications) * 100).toFixed(1)}%
                      </TableCell>
                      <TableCell align="right">
                        <Typography color="error.main">-2%</Typography>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <Chip label="Pending" color="warning" size="small" />
                      </TableCell>
                      <TableCell align="right">{metrics.pendingApplications}</TableCell>
                      <TableCell align="right">
                        {((metrics.pendingApplications / metrics.totalApplications) * 100).toFixed(1)}%
                      </TableCell>
                      <TableCell align="right">
                        <Typography color="warning.main">-3%</Typography>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Performance Insights */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Performance Insights
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Box p={2} bgcolor="primary.light" borderRadius={1}>
                    <Typography variant="subtitle2" color="primary.contrastText">
                      Average Response Time
                    </Typography>
                    <Typography variant="h6" color="primary.contrastText">
                      {metrics.averageResponseTime}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box p={2} bgcolor="success.light" borderRadius={1}>
                    <Typography variant="subtitle2" color="success.contrastText">
                      Client Satisfaction
                    </Typography>
                    <Typography variant="h6" color="success.contrastText">
                      {(metrics.rating * 20).toFixed(0)}%
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box p={2} bgcolor="info.light" borderRadius={1}>
                    <Typography variant="subtitle2" color="info.contrastText">
                      Market Position
                    </Typography>
                    <Typography variant="h6" color="info.contrastText">
                      Top 15%
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

export default CompanyMetrics;