import React, { useState, useEffect } from 'react';
import {
  IconButton, Badge, Menu, MenuItem, Typography, Box, List, ListItem,
  ListItemText, ListItemAvatar, Avatar, Divider, Button, Chip
} from '@mui/material';
import {
  Notifications, NotificationsNone, Message, Business, Payment,
  CheckCircle, Cancel, Circle
} from '@mui/icons-material';
import { io } from 'socket.io-client';
import axios from 'axios';

const NotificationCenter = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [socket, setSocket] = useState(null);
  
  const token = localStorage.getItem('token');
  const open = Boolean(anchorEl);

  useEffect(() => {
    if (token) {
      loadNotifications();
      setupSocketConnection();
    }
  }, [token]);

  const setupSocketConnection = () => {
    const newSocket = io(process.env.REACT_APP_API_URL || 'http://localhost:3000', {
      auth: { token }
    });
    
    newSocket.on('new_notification', (notification) => {
      setNotifications(prev => [notification, ...prev]);
      setUnreadCount(prev => prev + 1);
    });
    
    setSocket(newSocket);
    
    return () => newSocket.close();
  };

  const loadNotifications = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/notifications`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setNotifications(response.data.notifications);
      setUnreadCount(response.data.unreadCount);
    } catch (error) {
      console.error('Failed to load notifications:', error);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/notifications/${notificationId}/read`, {}, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/notifications/read-all`, {}, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'new_message': return <Message color="primary" />;
      case 'new_requirement': return <Business color="info" />;
      case 'payment_success': return <Payment color="success" />;
      case 'kyc_approved': return <CheckCircle color="success" />;
      case 'kyc_rejected': return <Cancel color="error" />;
      default: return <Circle color="action" />;
    }
  };

  const formatTime = (date) => {
    const now = new Date();
    const notifDate = new Date(date);
    const diffMs = now - notifDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return notifDate.toLocaleDateString();
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    
    // Navigate based on notification type
    switch (notification.type) {
      case 'new_message':
        window.location.href = '/messages';
        break;
      case 'new_requirement':
        window.location.href = '/requirements';
        break;
      case 'payment_success':
        window.location.href = '/dashboard';
        break;
      default:
        break;
    }
    
    handleClose();
  };

  return (
    <>
      <IconButton
        color="inherit"
        onClick={handleClick}
        sx={{ ml: 1 }}
      >
        <Badge badgeContent={unreadCount} color="error">
          {unreadCount > 0 ? <Notifications /> : <NotificationsNone />}
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: { width: 400, maxHeight: 500 }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Notifications</Typography>
            {unreadCount > 0 && (
              <Button size="small" onClick={markAllAsRead}>
                Mark all read
              </Button>
            )}
          </Box>
        </Box>

        {notifications.length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <NotificationsNone sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
            <Typography color="text.secondary">
              No notifications yet
            </Typography>
          </Box>
        ) : (
          <List sx={{ p: 0, maxHeight: 400, overflow: 'auto' }}>
            {notifications.slice(0, 10).map((notification, index) => (
              <React.Fragment key={notification.id}>
                <ListItem
                  button
                  onClick={() => handleNotificationClick(notification)}
                  sx={{
                    bgcolor: notification.read ? 'transparent' : 'action.hover',
                    '&:hover': { bgcolor: 'action.selected' }
                  }}
                >
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'transparent' }}>
                      {getNotificationIcon(notification.type)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="subtitle2" noWrap>
                          {notification.title}
                        </Typography>
                        {!notification.read && (
                          <Circle sx={{ fontSize: 8, color: 'primary.main' }} />
                        )}
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary" noWrap>
                          {notification.message}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatTime(notification.createdAt)}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
                {index < notifications.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        )}

        {notifications.length > 10 && (
          <Box sx={{ p: 2, textAlign: 'center', borderTop: '1px solid #e0e0e0' }}>
            <Button size="small" onClick={() => window.location.href = '/notifications'}>
              View all notifications
            </Button>
          </Box>
        )}
      </Menu>
    </>
  );
};

export default NotificationCenter;