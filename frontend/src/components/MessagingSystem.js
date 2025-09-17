import React, { useState, useEffect, useRef } from 'react';
import {
  Dialog, DialogTitle, DialogContent, Box, List, ListItem, ListItemText,
  TextField, Button, Typography, Avatar, Badge, IconButton, Divider,
  Paper, Stack, Chip, LinearProgress, Alert
} from '@mui/material';
import { Send, Close, Circle, AttachFile, Download } from '@mui/icons-material';
import { io } from 'socket.io-client';
import api from '../utils/api';

const MessagingSystem = ({ open, onClose, recipientId, recipientName }) => {
  const [socket, setSocket] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  
  const token = localStorage.getItem('token');
  const currentUser = (() => {
    try {
      return JSON.parse(localStorage.getItem('user') || '{}');
    } catch {
      return {};
    }
  })();

  useEffect(() => {
    if (open && token) {
      const newSocket = io(process.env.REACT_APP_API_URL || 'http://localhost:3000', {
        auth: { token }
      });
      
      setSocket(newSocket);
      
      newSocket.on('conversations_list', setConversations);
      newSocket.on('messages_list', (messageList) => {
        setMessages(messageList);
        // Mark messages as read when viewing conversation
        if (activeConversation) {
          newSocket.emit('mark_as_read', { conversationId: activeConversation.id });
        }
      });
      newSocket.on('new_message', (message) => {
        setMessages(prev => [...prev, message]);
        // Auto-scroll to new message
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      });
      newSocket.on('online_users', setOnlineUsers);
      newSocket.on('user_typing', (data) => {
        setTypingUsers(prev => {
          const existing = prev.find(u => u.userId === data.userId && u.conversationId === data.conversationId);
          if (!existing) {
            return [...prev, data];
          }
          return prev;
        });
      });
      newSocket.on('user_stopped_typing', (data) => {
        setTypingUsers(prev => prev.filter(u => 
          !(u.userId === data.userId && u.conversationId === data.conversationId)
        ));
      });
      newSocket.on('messages_read', (data) => {
        // Update message read status
        setMessages(prev => prev.map(msg => {
          if (msg.conversationId === data.conversationId && msg.senderId === currentUser.id) {
            return { ...msg, readBy: [...(msg.readBy || []), data.readBy] };
          }
          return msg;
        }));
      });
      newSocket.on('error', (error) => {
        setError(error.message);
      });
      
      newSocket.emit('get_conversations');
      
      return () => newSocket.close();
    }
  }, [open, token, activeConversation]);

  useEffect(() => {
    if (recipientId && socket) {
      // Start conversation with specific recipient
      const existingConv = conversations.find(c => 
        c.participants.includes(recipientId)
      );
      if (existingConv) {
        setActiveConversation(existingConv);
        socket.emit('get_messages', existingConv.id);
      }
    }
  }, [recipientId, conversations, socket]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !socket) return;
    
    if (activeConversation) {
      socket.emit('send_message', {
        conversationId: activeConversation.id,
        message: newMessage,
        type: 'text'
      });
    } else if (recipientId) {
      socket.emit('start_conversation', {
        recipientId,
        message: newMessage
      });
    }
    
    setNewMessage('');
    handleStopTyping();
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file || !socket) return;

    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post('/messages/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data.success) {
        const fileMessage = `📎 ${response.data.file.originalName}`;
        
        if (activeConversation) {
          socket.emit('send_message', {
            conversationId: activeConversation.id,
            message: fileMessage,
            type: 'file',
            fileUrl: response.data.file.url
          });
        } else if (recipientId) {
          socket.emit('start_conversation', {
            recipientId,
            message: fileMessage,
            type: 'file',
            fileUrl: response.data.file.url
          });
        }
      }
    } catch (error) {
      setError('Failed to upload file. Please try again.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleTyping = () => {
    if (activeConversation && socket) {
      socket.emit('typing_start', { conversationId: activeConversation.id });
      
      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      // Set new timeout to stop typing after 3 seconds
      typingTimeoutRef.current = setTimeout(() => {
        handleStopTyping();
      }, 3000);
    }
  };

  const handleStopTyping = () => {
    if (activeConversation && socket) {
      socket.emit('typing_stop', { conversationId: activeConversation.id });
    }
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
  };

  const handleDownloadFile = (fileUrl, fileName) => {
    const link = document.createElement('a');
    link.href = `${process.env.REACT_APP_API_URL || 'http://localhost:3000'}${fileUrl}`;
    link.download = fileName;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const selectConversation = (conversation) => {
    setActiveConversation(conversation);
    socket.emit('get_messages', conversation.id);
    setError('');
    
    // Mark messages as read when selecting conversation
    setTimeout(() => {
      if (socket) {
        socket.emit('mark_as_read', { conversationId: conversation.id });
      }
    }, 500);
  };

  const isTypingInConversation = (conversationId) => {
    return typingUsers.filter(u => u.conversationId === conversationId);
  };

  const formatFileMessage = (message, fileUrl) => {
    if (message.startsWith('📎 ')) {
      const fileName = message.substring(2);
      return (
        <Box display="flex" alignItems="center" gap={1}>
          <AttachFile fontSize="small" />
          <Typography 
            variant="body2" 
            sx={{ cursor: 'pointer', textDecoration: 'underline' }}
            onClick={() => handleDownloadFile(fileUrl, fileName)}
          >
            {fileName}
          </Typography>
          <IconButton 
            size="small" 
            onClick={() => handleDownloadFile(fileUrl, fileName)}
          >
            <Download fontSize="small" />
          </IconButton>
        </Box>
      );
    }
    return message;
  };

  const isUserOnline = (userId) => {
    return onlineUsers.some(user => user.userId === userId);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Messages</Typography>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ p: 0, height: 500 }}>
        {error && (
          <Alert severity="error" sx={{ m: 1 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}
        {uploading && (
          <Box sx={{ width: '100%', p: 1 }}>
            <LinearProgress />
            <Typography variant="caption" color="text.secondary">
              Uploading file...
            </Typography>
          </Box>
        )}
        <Box display="flex" height="100%">
          {/* Conversations List */}
          <Box width="300px" borderRight="1px solid #e0e0e0">
            <Typography variant="subtitle2" sx={{ p: 2, bgcolor: '#f5f5f5' }}>
              Conversations
            </Typography>
            <List sx={{ p: 0, maxHeight: 400, overflow: 'auto' }}>
              {conversations.map((conv) => {
                const otherParticipant = conv.participants.find(p => p !== currentUser.id);
                return (
                  <ListItem
                    key={conv.id}
                    button
                    selected={activeConversation?.id === conv.id}
                    onClick={() => selectConversation(conv)}
                    sx={{ borderBottom: '1px solid #f0f0f0' }}
                  >
                    <Avatar sx={{ mr: 2 }}>
                      <Badge
                        color="success"
                        variant="dot"
                        invisible={!isUserOnline(otherParticipant)}
                      >
                        {recipientName?.charAt(0) || 'U'}
                      </Badge>
                    </Avatar>
                    <ListItemText
                      primary={recipientName || 'User'}
                      secondary={conv.lastMessage}
                      secondaryTypographyProps={{
                        noWrap: true,
                        style: { maxWidth: 150 }
                      }}
                    />
                    {conv.unreadCount > 0 && (
                      <Chip
                        label={conv.unreadCount}
                        size="small"
                        color="primary"
                      />
                    )}
                  </ListItem>
                );
              })}
            </List>
          </Box>

          {/* Messages Area */}
          <Box flex={1} display="flex" flexDirection="column">
            {activeConversation || recipientId ? (
              <>
                {/* Messages Header */}
                <Box p={2} borderBottom="1px solid #e0e0e0" bgcolor="#f9f9f9">
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Avatar>{recipientName?.charAt(0) || 'U'}</Avatar>
                    <Box>
                      <Typography variant="subtitle1">{recipientName || 'User'}</Typography>
                      <Stack direction="row" alignItems="center" spacing={0.5}>
                        <Circle 
                          sx={{ 
                            fontSize: 8, 
                            color: isUserOnline(recipientId) ? 'success.main' : 'grey.400' 
                          }} 
                        />
                        <Typography variant="caption" color="text.secondary">
                          {isUserOnline(recipientId) ? 'Online' : 'Offline'}
                        </Typography>
                      </Stack>
                    </Box>
                  </Stack>
                </Box>

                {/* Messages List */}
                <Box flex={1} p={1} overflow="auto">
                  {messages.map((message) => (
                    <Box
                      key={message.id}
                      display="flex"
                      justifyContent={message.senderId === currentUser.id ? 'flex-end' : 'flex-start'}
                      mb={1}
                    >
                      <Paper
                        elevation={1}
                        sx={{
                          p: 1.5,
                          maxWidth: '70%',
                          bgcolor: message.senderId === currentUser.id ? 'primary.main' : 'grey.100',
                          color: message.senderId === currentUser.id ? 'white' : 'text.primary'
                        }}
                      >
                        {message.type === 'file' ? (
                          formatFileMessage(message.message, message.fileUrl)
                        ) : (
                          <Typography variant="body2">{message.message}</Typography>
                        )}
                        <Box display="flex" justifyContent="space-between" alignItems="center" mt={0.5}>
                          <Typography
                            variant="caption"
                            sx={{
                              opacity: 0.7,
                              fontSize: '0.7rem'
                            }}
                          >
                            {new Date(message.timestamp).toLocaleTimeString()}
                          </Typography>
                          {message.senderId === currentUser.id && message.readBy && message.readBy.length > 1 && (
                            <Typography
                              variant="caption"
                              sx={{
                                opacity: 0.7,
                                fontSize: '0.6rem',
                                ml: 1
                              }}
                            >
                              ✓✓ Read
                            </Typography>
                          )}
                        </Box>
                      </Paper>
                    </Box>
                  ))}
                  
                  {/* Typing indicators */}
                  {isTypingInConversation(activeConversation?.id).map(typingUser => (
                    <Box key={typingUser.userId} display="flex" justifyContent="flex-start" mb={1}>
                      <Paper elevation={1} sx={{ p: 1, bgcolor: 'grey.100' }}>
                        <Typography variant="caption" color="text.secondary">
                          {typingUser.userEmail} is typing...
                        </Typography>
                      </Paper>
                    </Box>
                  ))}
                  
                  <div ref={messagesEndRef} />
                </Box>

                {/* Message Input */}
                <Box p={2} borderTop="1px solid #e0e0e0">
                  <Stack direction="row" spacing={1}>
                    <input
                      type="file"
                      ref={fileInputRef}
                      style={{ display: 'none' }}
                      onChange={handleFileUpload}
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt,.zip,.rar"
                    />
                    <IconButton
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      sx={{ color: 'text.secondary' }}
                    >
                      <AttachFile />
                    </IconButton>
                    <TextField
                      fullWidth
                      size="small"
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => {
                        setNewMessage(e.target.value);
                        handleTyping();
                      }}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      onBlur={handleStopTyping}
                    />
                    <Button
                      variant="contained"
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim() || uploading}
                      sx={{ minWidth: 'auto', px: 2 }}
                    >
                      <Send fontSize="small" />
                    </Button>
                  </Stack>
                </Box>
              </>
            ) : (
              <Box
                flex={1}
                display="flex"
                alignItems="center"
                justifyContent="center"
                color="text.secondary"
              >
                <Typography>Select a conversation to start messaging</Typography>
              </Box>
            )}
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default MessagingSystem;