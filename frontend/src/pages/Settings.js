import React, { useState } from 'react';
import {
  Container, Typography, Box, Grid, Card, CardContent,
  Switch, FormControlLabel, Button, TextField, Divider,
  List, ListItem, ListItemText, ListItemSecondaryAction,
  Chip, Stack, Alert
} from '@mui/material';
import { 
  Notifications, Security, Language, Palette,
  Download, Delete, Visibility 
} from '@mui/icons-material';

const Settings = () => {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    marketingEmails: false,
    twoFactorAuth: false,
    profileVisibility: 'public',
    language: 'English'
  });

  const handleSettingChange = (setting) => (event) => {
    setSettings({ ...settings, [setting]: event.target.checked });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" gutterBottom sx={{ fontWeight: 700, color: 'rgb(30, 86, 86)' }}>
        Account Settings
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Manage your account preferences and privacy settings
      </Typography>

      <Grid container spacing={4}>
        {/* Notifications */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                <Notifications color="primary" />
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  Notifications
                </Typography>
              </Stack>
              
              <Stack spacing={2}>
                <FormControlLabel
                  control={
                    <Switch 
                      checked={settings.emailNotifications}
                      onChange={handleSettingChange('emailNotifications')}
                      color="primary"
                    />
                  }
                  label="Email Notifications"
                />
                <FormControlLabel
                  control={
                    <Switch 
                      checked={settings.pushNotifications}
                      onChange={handleSettingChange('pushNotifications')}
                      color="primary"
                    />
                  }
                  label="Push Notifications"
                />
                <FormControlLabel
                  control={
                    <Switch 
                      checked={settings.marketingEmails}
                      onChange={handleSettingChange('marketingEmails')}
                      color="primary"
                    />
                  }
                  label="Marketing Emails"
                />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Security */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                <Security color="primary" />
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  Security
                </Typography>
              </Stack>
              
              <Stack spacing={3}>
                <FormControlLabel
                  control={
                    <Switch 
                      checked={settings.twoFactorAuth}
                      onChange={handleSettingChange('twoFactorAuth')}
                      color="primary"
                    />
                  }
                  label="Two-Factor Authentication"
                />
                <Button variant="outlined" fullWidth>
                  Change Password
                </Button>
                <Button variant="outlined" fullWidth>
                  Download Account Data
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Privacy */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                <Visibility color="primary" />
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  Privacy
                </Typography>
              </Stack>
              
              <Stack spacing={3}>
                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    Profile Visibility
                  </Typography>
                  <Stack direction="row" spacing={1}>
                    <Chip 
                      label="Public" 
                      color={settings.profileVisibility === 'public' ? 'primary' : 'default'}
                      onClick={() => setSettings({...settings, profileVisibility: 'public'})}
                    />
                    <Chip 
                      label="Private" 
                      color={settings.profileVisibility === 'private' ? 'primary' : 'default'}
                      onClick={() => setSettings({...settings, profileVisibility: 'private'})}
                    />
                  </Stack>
                </Box>
                <Button variant="outlined" fullWidth>
                  Manage Data Sharing
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Preferences */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                <Language color="primary" />
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  Preferences
                </Typography>
              </Stack>
              
              <Stack spacing={3}>
                <TextField
                  select
                  fullWidth
                  label="Language"
                  value={settings.language}
                  SelectProps={{ native: true }}
                >
                  <option value="English">English</option>
                  <option value="Arabic">العربية</option>
                  <option value="French">Français</option>
                </TextField>
                <TextField
                  select
                  fullWidth
                  label="Timezone"
                  defaultValue="GMT+4"
                  SelectProps={{ native: true }}
                >
                  <option value="GMT+4">GMT+4 (Dubai)</option>
                  <option value="GMT+0">GMT+0 (London)</option>
                  <option value="GMT-5">GMT-5 (New York)</option>
                </TextField>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Subscription */}
        <Grid item xs={12}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                Subscription Management
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                  <Box sx={{ p: 3, bgcolor: '#f8f9fa', borderRadius: 2 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          Professional Plan
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Next billing: January 15, 2024
                        </Typography>
                      </Box>
                      <Chip label="Active" color="success" />
                    </Stack>
                  </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Stack spacing={2}>
                    <Button variant="outlined" fullWidth>
                      Change Plan
                    </Button>
                    <Button variant="outlined" fullWidth>
                      Billing History
                    </Button>
                  </Stack>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Danger Zone */}
        <Grid item xs={12}>
          <Card sx={{ border: '1px solid #f44336' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: '#f44336' }}>
                Danger Zone
              </Typography>
              <Alert severity="warning" sx={{ mb: 3 }}>
                These actions are irreversible. Please proceed with caution.
              </Alert>
              
              <Stack direction="row" spacing={2}>
                <Button 
                  variant="outlined" 
                  color="error"
                  startIcon={<Download />}
                >
                  Export All Data
                </Button>
                <Button 
                  variant="contained" 
                  color="error"
                  startIcon={<Delete />}
                >
                  Delete Account
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Save Button */}
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Button
          variant="contained"
          size="large"
          sx={{
            bgcolor: 'rgb(30, 86, 86)',
            px: 6,
            '&:hover': { bgcolor: 'rgb(20, 66, 66)' }
          }}
        >
          Save All Changes
        </Button>
      </Box>
    </Container>
  );
};

export default Settings;