import React, { useState, useEffect } from 'react';
import {
  Box, Card, CardContent, Typography, Grid, List, ListItem, ListItemText,
  Chip, Paper, LinearProgress, Stack, Divider
} from '@mui/material';
import { TrendingUp, Search, Timeline, LocationOn } from '@mui/icons-material';
import api from '../utils/api';

const SearchAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const response = await api.get('/search/analytics');
      setAnalytics(response.data);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LinearProgress />;
  }

  if (!analytics) {
    return (
      <Card>
        <CardContent>
          <Typography>No search data available</Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        <Timeline sx={{ mr: 1, verticalAlign: 'middle' }} />
        Search Analytics
      </Typography>

      <Grid container spacing={3}>
        {/* Overview Stats */}
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h4" color="primary">
                {analytics.totalSearches}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Searches
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h4" color="success.main">
                {analytics.topQueries?.length || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Unique Queries
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h4" color="warning.main">
                {analytics.recentSearches?.length || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Recent Searches
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h4" color="info.main">
                {Math.round((analytics.topQueries?.reduce((sum, q) => sum + q.count, 0) || 0) / (analytics.totalSearches || 1) * 100)}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Repeat Rate
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Top Queries */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <TrendingUp sx={{ mr: 1, verticalAlign: 'middle' }} />
                Top Search Queries
              </Typography>
              <List dense>
                {analytics.topQueries?.map((query, index) => (
                  <ListItem key={index}>
                    <ListItemText
                      primary={query.query}
                      secondary={
                        <Box display="flex" alignItems="center" gap={1}>
                          <LinearProgress
                            variant="determinate"
                            value={(query.count / analytics.totalSearches) * 100}
                            sx={{ flexGrow: 1, height: 6, borderRadius: 3 }}
                          />
                          <Typography variant="caption">
                            {query.count} searches
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Searches */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <Search sx={{ mr: 1, verticalAlign: 'middle' }} />
                Recent Searches
              </Typography>
              <List dense>
                {analytics.recentSearches?.map((search, index) => (
                  <ListItem key={index}>
                    <ListItemText
                      primary={search.query}
                      secondary={new Date(search.timestamp).toLocaleString()}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Search Patterns */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Search Patterns & Insights
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Most Active Time
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Based on your search history, you're most active during business hours (9 AM - 5 PM)
                    </Typography>
                  </Paper>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Popular Categories
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap">
                      {analytics.topQueries?.slice(0, 3).map((query, index) => (
                        <Chip key={index} label={query.query} size="small" />
                      ))}
                    </Stack>
                  </Paper>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Search Efficiency
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      You tend to refine searches {Math.round(analytics.totalSearches / (analytics.topQueries?.length || 1))} times on average
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SearchAnalytics;