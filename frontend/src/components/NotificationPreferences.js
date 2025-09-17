import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Switch,
  FormControlLabel,
  FormGroup,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Alert,
  Divider,
  Chip
} from '@mui/material';
import { Notifications, Sms, Email, PhoneAndroid } from '@mui/icons-material';
import api from '../utils/api';

const NotificationPreferences = () => {
  const [preferences, setPreferences] = useState({
    email: { kyc: true, messages: true, applications: true, marketing: false },
    sms: { critical: true, kyc: false, messages: false },
    push: { messages: true, applications: true, updates: true },
    digest: { enabled: false, frequency: 'weekly', day: 'monday' }
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [pushSupported, setPushSupported] = useState(false);

  useEffect(() => {
    loadPreferences();
    checkPushSupport();
  }, []);

  const loadPreferences = async () => {
    try {
      const response = await api.get('/api/notifications/preferences');
      setPreferences(response.data.preferences);
    } catch (error) {
      console.error('Failed to load preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkPushSupport = () => {
    setPushSupported('serviceWorker' in navigator && 'PushManager' in window);
  };

  const handlePreferenceChange = (category, type, value) => {
    setPreferences(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [type]: value
      }
    }));
  };

  const savePreferences = async () => {
    setSaving(true);
    try {
      await api.put('/api/notifications/preferences', { preferences });
      setMessage('Preferences saved successfully');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Failed to save preferences');
    } finally {
      setSaving(false);
    }
  };

  const enablePushNotifications = async () => {
    if (!pushSupported) return;

    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: process.env.REACT_APP_VAPID_PUBLIC_KEY
        });

        await api.post('/api/notifications/push/subscribe', { subscription });
        setMessage('Push notifications enabled successfully');
      }
    } catch (error) {
      console.error('Push notification error:', error);
      setMessage('Failed to enable push notifications');
    }
  };

  if (loading) {
    return <Box p={3}>Loading preferences...</Box>;
  }

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>
        <Notifications sx={{ mr: 1, verticalAlign: 'middle' }} />
        Notification Preferences
      </Typography>

      {message && (
        <Alert severity={message.includes('success') ? 'success' : 'error'} sx={{ mb: 2 }}>
          {message}
        </Alert>
      )}

      {/* Email Notifications */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            <Email sx={{ mr: 1, verticalAlign: 'middle' }} />
            Email Notifications
          </Typography>
          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  checked={preferences.email.kyc}
                  onChange={(e) => handlePreferenceChange('email', 'kyc', e.target.checked)}
                />
              }
              label="KYC Updates"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={preferences.email.messages}
                  onChange={(e) => handlePreferenceChange('email', 'messages', e.target.checked)}
                />
              }
              label="New Messages"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={preferences.email.applications}
                  onChange={(e) => handlePreferenceChange('email', 'applications', e.target.checked)}
                />
              }
              label="Application Updates"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={preferences.email.marketing}
                  onChange={(e) => handlePreferenceChange('email', 'marketing', e.target.checked)}
                />
              }
              label="Marketing & Promotions"
            />
          </FormGroup>
        </CardContent>
      </Card>

      {/* SMS Notifications */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            <Sms sx={{ mr: 1, verticalAlign: 'middle' }} />
            SMS Notifications
            <Chip label="Critical Only" size="small" sx={{ ml: 1 }} />
          </Typography>
          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  checked={preferences.sms.critical}
                  onChange={(e) => handlePreferenceChange('sms', 'critical', e.target.checked)}
                />
              }
              label="Critical Security Updates"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={preferences.sms.kyc}
                  onChange={(e) => handlePreferenceChange('sms', 'kyc', e.target.checked)}
                />
              }
              label="KYC Status Changes"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={preferences.sms.messages}
                  onChange={(e) => handlePreferenceChange('sms', 'messages', e.target.checked)}
                />
              }
              label="Urgent Messages"
            />
          </FormGroup>
        </CardContent>
      </Card>

      {/* Push Notifications */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            <PhoneAndroid sx={{ mr: 1, verticalAlign: 'middle' }} />
            Push Notifications
            {!pushSupported && <Chip label="Not Supported" size="small" color="error" sx={{ ml: 1 }} />}
          </Typography>
          
          {pushSupported ? (
            <>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Switch
                      checked={preferences.push.messages}
                      onChange={(e) => handlePreferenceChange('push', 'messages', e.target.checked)}
                    />
                  }
                  label="New Messages"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={preferences.push.applications}
                      onChange={(e) => handlePreferenceChange('push', 'applications', e.target.checked)}
                    />
                  }
                  label="Application Updates"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={preferences.push.updates}
                      onChange={(e) => handlePreferenceChange('push', 'updates', e.target.checked)}
                    />
                  }
                  label="Platform Updates"
                />
              </FormGroup>
              <Button
                variant="outlined"
                onClick={enablePushNotifications}
                sx={{ mt: 2 }}
              >
                Enable Push Notifications
              </Button>
            </>
          ) : (
            <Typography color="text.secondary">
              Push notifications are not supported in your browser
            </Typography>
          )}
        </CardContent>
      </Card>

      {/* Email Digest */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Email Digest
          </Typography>
          <FormControlLabel
            control={
              <Switch
                checked={preferences.digest.enabled}
                onChange={(e) => handlePreferenceChange('digest', 'enabled', e.target.checked)}
              />
            }
            label="Enable Email Digest"
          />
          
          {preferences.digest.enabled && (
            <Box sx={{ mt: 2 }}>
              <FormControl sx={{ mr: 2, minWidth: 120 }}>
                <InputLabel>Frequency</InputLabel>
                <Select
                  value={preferences.digest.frequency}
                  onChange={(e) => handlePreferenceChange('digest', 'frequency', e.target.value)}
                >
                  <MenuItem value="daily">Daily</MenuItem>
                  <MenuItem value="weekly">Weekly</MenuItem>
                </Select>
              </FormControl>
              
              {preferences.digest.frequency === 'weekly' && (
                <FormControl sx={{ minWidth: 120 }}>
                  <InputLabel>Day</InputLabel>
                  <Select
                    value={preferences.digest.day}
                    onChange={(e) => handlePreferenceChange('digest', 'day', e.target.value)}
                  >
                    <MenuItem value="monday">Monday</MenuItem>
                    <MenuItem value="tuesday">Tuesday</MenuItem>
                    <MenuItem value="wednesday">Wednesday</MenuItem>
                    <MenuItem value="thursday">Thursday</MenuItem>
                    <MenuItem value="friday">Friday</MenuItem>
                    <MenuItem value="saturday">Saturday</MenuItem>
                    <MenuItem value="sunday">Sunday</MenuItem>
                  </Select>
                </FormControl>
              )}
            </Box>
          )}
        </CardContent>
      </Card>

      <Divider sx={{ my: 3 }} />

      <Button
        variant="contained"
        onClick={savePreferences}
        disabled={saving}
        size="large"
      >
        {saving ? 'Saving...' : 'Save Preferences'}
      </Button>
    </Box>
  );
};

export default NotificationPreferences;