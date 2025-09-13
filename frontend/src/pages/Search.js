import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  Button,
  Tabs,
  Tab,
  Stack,
  Rating,
  IconButton,
  Paper,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField
} from '@mui/material';
import {
  Search as SearchIcon,
  Business,
  Assignment,
  LocationOn,
  AttachMoney,
  AccessTime,
  Verified,
  Message,
  FilterList
} from '@mui/icons-material';
import { useSearchParams, useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import MessagingSystem from '../components/MessagingSystem';
import axios from 'axios';

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [companies, setCompanies] = useState([]);
  const [requirements, setRequirements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    industry: '',
    category: '',
    location: '',
    budget: ''
  });
  const [availableFilters, setAvailableFilters] = useState({
    industries: [],
    categories: [],
    locations: [],
    budgetRanges: []
  });
  const [messagingOpen, setMessagingOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);

  useEffect(() => {
    const query = searchParams.get('q');
    if (query) {
      setSearchQuery(query);
      performSearch(query);
    }
    loadFilters();
  }, [searchParams]);

  const loadFilters = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/search/filters`);
      setAvailableFilters(response.data);
    } catch (error) {
      console.error('Error loading filters:', error);
    }
  };

  const performSearch = async (query, type = 'all') => {
    if (!query.trim()) return;
    
    setLoading(true);
    try {
      const params = new URLSearchParams({ q: query, type });
      
      // Add filters
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });

      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/search?${params}`
      );
      
      setCompanies(response.data.companies || []);
      setRequirements(response.data.requirements || []);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim()) {
      setSearchParams({ q: query });
      performSearch(query, activeTab === 0 ? 'all' : activeTab === 1 ? 'companies' : 'requirements');
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    if (searchQuery.trim()) {
      const type = newValue === 0 ? 'all' : newValue === 1 ? 'companies' : 'requirements';
      performSearch(searchQuery, type);
    }
  };

  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...filters, [filterType]: value };
    setFilters(newFilters);
    
    if (searchQuery.trim()) {
      performSearch(searchQuery, activeTab === 0 ? 'all' : activeTab === 1 ? 'companies' : 'requirements');
    }
  };

  const clearFilters = () => {
    setFilters({
      industry: '',
      category: '',
      location: '',
      budget: ''
    });
    
    if (searchQuery.trim()) {
      performSearch(searchQuery, activeTab === 0 ? 'all' : activeTab === 1 ? 'companies' : 'requirements');
    }
  };

  const handleConnect = (company) => {
    setSelectedCompany(company);
    setMessagingOpen(true);
  };

  const CompanyCard = ({ company }) => (
    <Card elevation={2} sx={{ height: '100%' }}>
      <CardContent>
        <Stack direction="row" spacing={2} alignItems="flex-start" sx={{ mb: 2 }}>
          <Avatar sx={{ bgcolor: 'primary.main', width: 48, height: 48 }}>
            {company.logo}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {company.name}
              </Typography>
              {company.verified && (
                <Verified color="success" fontSize="small" />
              )}
            </Stack>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 0.5 }}>
              <LocationOn fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary">
                {company.country || 'Location not specified'}
              </Typography>
            </Stack>
          </Box>
        </Stack>

        <Chip 
          label={company.industry} 
          size="small" 
          color="primary" 
          variant="outlined"
          sx={{ mb: 2 }}
        />

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {company.description || 'No description available'}
        </Typography>

        <Stack direction="row" spacing={1}>
          <Button 
            variant="contained" 
            size="small" 
            startIcon={<Message />}
            onClick={() => handleConnect(company)}
            sx={{ flex: 1 }}
          >
            Connect
          </Button>
          <Button 
            variant="outlined" 
            size="small"
            onClick={() => navigate(`/companies/${company.id || company._id}`)}
            sx={{ flex: 1 }}
          >
            View Profile
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );

  const RequirementCard = ({ requirement }) => (
    <Card elevation={2} sx={{ height: '100%' }}>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, flex: 1 }}>
            {requirement.title}
          </Typography>
          <Chip 
            label={requirement.status || 'Open'} 
            size="small" 
            color="success" 
            variant="outlined"
          />
        </Stack>

        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
          <Chip label={requirement.category} size="small" color="primary" variant="outlined" />
          <Chip label={requirement.posterType} size="small" variant="outlined" />
        </Stack>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {requirement.description}
        </Typography>

        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          {requirement.budget && (
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <AttachMoney fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary">
                {requirement.budget}
              </Typography>
            </Stack>
          )}
          {requirement.timeline && (
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <AccessTime fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary">
                {requirement.timeline}
              </Typography>
            </Stack>
          )}
        </Stack>

        <Typography variant="caption" color="text.secondary" sx={{ mb: 2 }}>
          Posted by: {requirement.posterName}
        </Typography>

        <Button 
          variant="contained" 
          size="small" 
          fullWidth
          startIcon={<Assignment />}
          onClick={() => navigate(`/requirements/${requirement.id}`)}
        >
          View Details
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" gutterBottom>
          Search Results
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Find companies and requirements that match your needs
        </Typography>
      </Box>

      {/* Search Bar */}
      <Box sx={{ mb: 4 }}>
        <SearchBar
          placeholder="Search companies and requirements..."
          onSearch={handleSearch}
          value={searchQuery}
        />
      </Box>

      {/* Filters */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Filters
        </Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={2.5}>
            <FormControl fullWidth size="small">
              <InputLabel>Industry</InputLabel>
              <Select
                value={filters.industry}
                label="Industry"
                onChange={(e) => handleFilterChange('industry', e.target.value)}
              >
                <MenuItem value="">All Industries</MenuItem>
                {availableFilters.industries.map((industry) => (
                  <MenuItem key={industry} value={industry}>
                    {industry}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={2.5}>
            <FormControl fullWidth size="small">
              <InputLabel>Category</InputLabel>
              <Select
                value={filters.category}
                label="Category"
                onChange={(e) => handleFilterChange('category', e.target.value)}
              >
                <MenuItem value="">All Categories</MenuItem>
                {availableFilters.categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={2.5}>
            <TextField
              fullWidth
              size="small"
              label="Location"
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
              placeholder="Enter location..."
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2.5}>
            <FormControl fullWidth size="small">
              <InputLabel>Budget</InputLabel>
              <Select
                value={filters.budget}
                label="Budget"
                onChange={(e) => handleFilterChange('budget', e.target.value)}
              >
                <MenuItem value="">Any Budget</MenuItem>
                {availableFilters.budgetRanges.map((range) => (
                  <MenuItem key={range.value} value={range.value}>
                    {range.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={12} md={2}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<FilterList />}
              onClick={clearFilters}
              size="small"
              sx={{ height: 40 }}
            >
              Clear
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab 
            label={`All Results (${companies.length + requirements.length})`} 
            icon={<SearchIcon />} 
            iconPosition="start"
          />
          <Tab 
            label={`Companies (${companies.length})`} 
            icon={<Business />} 
            iconPosition="start"
          />
          <Tab 
            label={`Requirements (${requirements.length})`} 
            icon={<Assignment />} 
            iconPosition="start"
          />
        </Tabs>
      </Box>

      {/* Loading State */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* No Results */}
      {!loading && searchQuery && companies.length === 0 && requirements.length === 0 && (
        <Alert severity="info" sx={{ mb: 3 }}>
          No results found for "{searchQuery}". Try adjusting your search terms or filters.
        </Alert>
      )}

      {/* Results */}
      {!loading && (
        <>
          {/* All Results Tab */}
          {activeTab === 0 && (
            <>
              {companies.length > 0 && (
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h5" gutterBottom>
                    Companies ({companies.length})
                  </Typography>
                  <Grid container spacing={3}>
                    {companies.slice(0, 6).map((company) => (
                      <Grid item xs={12} md={6} lg={4} key={company.id || company._id}>
                        <CompanyCard company={company} />
                      </Grid>
                    ))}
                  </Grid>
                  {companies.length > 6 && (
                    <Box sx={{ textAlign: 'center', mt: 2 }}>
                      <Button 
                        variant="outlined" 
                        onClick={() => setActiveTab(1)}
                      >
                        View All Companies
                      </Button>
                    </Box>
                  )}
                </Box>
              )}

              {requirements.length > 0 && (
                <Box>
                  <Typography variant="h5" gutterBottom>
                    Requirements ({requirements.length})
                  </Typography>
                  <Grid container spacing={3}>
                    {requirements.slice(0, 6).map((requirement) => (
                      <Grid item xs={12} md={6} lg={4} key={requirement.id}>
                        <RequirementCard requirement={requirement} />
                      </Grid>
                    ))}
                  </Grid>
                  {requirements.length > 6 && (
                    <Box sx={{ textAlign: 'center', mt: 2 }}>
                      <Button 
                        variant="outlined" 
                        onClick={() => setActiveTab(2)}
                      >
                        View All Requirements
                      </Button>
                    </Box>
                  )}
                </Box>
              )}
            </>
          )}

          {/* Companies Tab */}
          {activeTab === 1 && (
            <Grid container spacing={3}>
              {companies.map((company) => (
                <Grid item xs={12} md={6} lg={4} key={company.id || company._id}>
                  <CompanyCard company={company} />
                </Grid>
              ))}
            </Grid>
          )}

          {/* Requirements Tab */}
          {activeTab === 2 && (
            <Grid container spacing={3}>
              {requirements.map((requirement) => (
                <Grid item xs={12} md={6} lg={4} key={requirement.id}>
                  <RequirementCard requirement={requirement} />
                </Grid>
              ))}
            </Grid>
          )}
        </>
      )}

      {/* Messaging System */}
      <MessagingSystem
        open={messagingOpen}
        onClose={() => setMessagingOpen(false)}
        recipientId={selectedCompany?.id}
        recipientName={selectedCompany?.name}
      />
    </Container>
  );
};

export default Search;