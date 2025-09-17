import React, { useState, useEffect } from 'react';
import {
  Card, CardContent, Typography, List, ListItem, ListItemText,
  ListItemAvatar, Avatar, Badge, Button, Box, Chip
} from '@mui/material';
import { Message, Circle } from '@mui/icons-material';
import { io } from 'socket.io-client';
import MessagingSystem from './MessagingSystem';

const MessagesWidget = () => {
  const [conversations, setConversations] = useState([]);
  const [messagingOpen, setMessagingOpen] = useState(false);
  const [socket, setSocket] = useState(null);
  
  const token = localStorage.getItem('token');
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    if (token) {
      const newSocket = io(process.env.REACT_APP_API_URL || 'http://localhost:3000', {
        auth: { token }
      });
      
      setSocket(newSocket);
      
      newSocket.on('conversations_list', (convs) => {
        setConversations(convs.slice(0, 3)); // Show only recent 3
      });
      
      newSocket.emit('get_conversations');
      
      return () => newSocket.close();
    }
  }, [token]);

  const totalUnread = conversations.reduce((sum, conv) => sum + (conv.unreadCount || 0), 0);

  return (
    <>
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6">
              Recent Messages
            </Typography>
            <Badge badgeContent={totalUnread} color="error">
              <Message />
            </Badge>
          </Box>
          
          {conversations.length === 0 ? (
            <Typography variant="body2" color="text.secondary" textAlign="center" py={2}>
              No messages yet
            </Typography>
          ) : (
            <List sx={{ p: 0 }}>
              {conversations.map((conv, index) => (
                <ListItem
                  key={conv.id}
                  sx={{ 
                    px: 0,
                    borderBottom: index < conversations.length - 1 ? '1px solid #f0f0f0' : 'none'
                  }}
                >
                  <ListItemAvatar>
                    <Avatar sx={{ width: 32, height: 32 }}>
                      U
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" noWrap>
                          Contact
                        </Typography>
                        {conv.unreadCount > 0 && (
                          <Chip
                            label={conv.unreadCount}
                            size="small"
                            color="primary"
                            sx={{ height: 16, fontSize: '0.7rem' }}
                          />
                        )}
                      </Box>
                    }
                    secondary={
                      <Typography variant="caption" color="text.secondary" noWrap>
                        {conv.lastMessage}
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
            </List>
          )}
          
          <Button
            fullWidth
            variant="outlined"
            size="small"
            onClick={() => setMessagingOpen(true)}
            sx={{ mt: 2 }}
          >
            View All Messages
          </Button>
        </CardContent>
      </Card>
      
      <MessagingSystem
        open={messagingOpen}
        onClose={() => setMessagingOpen(false)}
      />
    </>
  );
};

export default MessagesWidget;