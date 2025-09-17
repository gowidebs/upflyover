import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip
} from '@mui/material';
import { Schedule, Delete, Send } from '@mui/icons-material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import api from '../utils/api';

const NotificationScheduler = () => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState('reminder');
  const [scheduledFor, setScheduledFor] = useState(new Date());
  const [scheduledNotifications, setScheduledNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState('');

  const scheduleNotification = async () => {
    if (!title || !message) {
      setAlert('Title and message are required');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/api/notifications/schedule', {
        title,
        message,
        type,
        scheduledFor: scheduledFor.toISOString()
      });

      setScheduledNotifications(prev => [...prev, response.data.notification]);
      setTitle('');
      setMessage('');
      setScheduledFor(new Date());
      setAlert('Notification scheduled successfully');
    } catch (error) {
      setAlert('Failed to schedule notification');
    } finally {
      setLoading(false);
    }
  };

  const deleteScheduled = (id) => {
    setScheduledNotifications(prev => prev.filter(n => n.id !== id));
  };

  const sendDigest = async () => {
    try {
      await api.post('/api/notifications/digest/send');
      setAlert('Email digest sent successfully');
    } catch (error) {
      setAlert('Failed to send email digest');
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box p={3}>
        <Typography variant="h5" gutterBottom>
          <Schedule sx={{ mr: 1, verticalAlign: 'middle' }} />
          Notification Scheduler
        </Typography>

        {alert && (
          <Alert 
            severity={alert.includes('success') ? 'success' : 'error'} 
            sx={{ mb: 2 }}
            onClose={() => setAlert('')}
          >
            {alert}
          </Alert>
        )}

        {/* Schedule New Notification */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Schedule New Notification
            </Typography>
            
            <TextField
              fullWidth
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              sx={{ mb: 2 }}
            />
            
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              sx={{ mb: 2 }}
            />
            
            <FormControl sx={{ mb: 2, minWidth: 200 }}>
              <InputLabel>Type</InputLabel>
              <Select
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <MenuItem value="reminder">Reminder</MenuItem>
                <MenuItem value="deadline">Deadline</MenuItem>
                <MenuItem value="follow-up">Follow-up</MenuItem>
                <MenuItem value="marketing">Marketing</MenuItem>
              </Select>
            </FormControl>
            
            <DateTimePicker
              label="Schedule For"
              value={scheduledFor}
              onChange={setScheduledFor}
              renderInput={(params) => <TextField {...params} sx={{ mb: 2 }} />}
              minDateTime={new Date()}
            />
            
            <Box>
              <Button
                variant="contained"
                onClick={scheduleNotification}
                disabled={loading}
                startIcon={<Schedule />}
              >
                {loading ? 'Scheduling...' : 'Schedule Notification'}
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Scheduled Notifications */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Scheduled Notifications
            </Typography>
            
            {scheduledNotifications.length === 0 ? (
              <Typography color="text.secondary">
                No scheduled notifications
              </Typography>
            ) : (
              <List>
                {scheduledNotifications.map((notification) => (
                  <ListItem key={notification.id}>
                    <ListItemText
                      primary={notification.title}
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            {notification.message}
                          </Typography>
                          <Box sx={{ mt: 1 }}>
                            <Chip 
                              label={notification.type} 
                              size="small" 
                              sx={{ mr: 1 }} 
                            />
                            <Chip 
                              label={new Date(notification.scheduledFor).toLocaleString()} 
                              size="small" 
                              variant="outlined"
                            />
                          </Box>
                        </Box>
                      }
                    />
                    <ListItemSecondaryAction>
                      <IconButton 
                        edge="end" 
                        onClick={() => deleteScheduled(notification.id)}
                      >
                        <Delete />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            )}
          </CardContent>
        </Card>

        {/* Email Digest */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Email Digest
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Send a summary of recent notifications via email
            </Typography>
            <Button
              variant="outlined"
              onClick={sendDigest}
              startIcon={<Send />}
            >
              Send Email Digest Now
            </Button>
          </CardContent>
        </Card>
      </Box>
    </LocalizationProvider>
  );
};

export default NotificationScheduler;