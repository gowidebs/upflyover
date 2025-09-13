const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { sendNotification, NOTIFICATION_TYPES } = require('./notificationService');

const JWT_SECRET = process.env.JWT_SECRET || 'upflyover-jwt-secret-key-2024';

// In-memory storage for messages and conversations
let conversations = [];
let messages = [];
let onlineUsers = new Map(); // socketId -> userId

// Socket authentication middleware
const socketAuth = (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication error'));
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    socket.userId = decoded.id;
    socket.userEmail = decoded.email;
    socket.userType = decoded.userType;
    next();
  } catch (err) {
    next(new Error('Authentication error'));
  }
};

// Handle socket connection
const handleConnection = (io, socket) => {
  console.log(`User ${socket.userId} connected`);
  
  // Add user to online users
  onlineUsers.set(socket.id, {
    userId: socket.userId,
    email: socket.userEmail,
    userType: socket.userType,
    socketId: socket.id
  });

  // Broadcast online users update
  io.emit('online_users', Array.from(onlineUsers.values()));

  // Join user to their personal room
  socket.join(`user_${socket.userId}`);

  // Get conversations for user
  socket.on('get_conversations', () => {
    const userConversations = conversations.filter(conv => 
      conv.participants.includes(socket.userId)
    ).map(conv => {
      const lastMessage = messages
        .filter(msg => msg.conversationId === conv.id)
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0];
      
      const unreadCount = messages.filter(msg => 
        msg.conversationId === conv.id && 
        msg.senderId !== socket.userId && 
        !msg.readBy.includes(socket.userId)
      ).length;

      return {
        ...conv,
        lastMessage: lastMessage?.message || '',
        lastMessageTime: lastMessage?.timestamp,
        unreadCount
      };
    });

    socket.emit('conversations_list', userConversations);
  });

  // Get messages for conversation
  socket.on('get_messages', (conversationId) => {
    const conversationMessages = messages
      .filter(msg => msg.conversationId === conversationId)
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    // Mark messages as read
    messages.forEach(msg => {
      if (msg.conversationId === conversationId && msg.senderId !== socket.userId) {
        if (!msg.readBy.includes(socket.userId)) {
          msg.readBy.push(socket.userId);
        }
      }
    });

    socket.emit('messages_list', conversationMessages);
  });

  // Start new conversation
  socket.on('start_conversation', (data) => {
    const { recipientId, message } = data;
    
    // Check if conversation already exists
    let conversation = conversations.find(conv => 
      conv.participants.includes(socket.userId) && 
      conv.participants.includes(recipientId)
    );

    if (!conversation) {
      conversation = {
        id: uuidv4(),
        participants: [socket.userId, recipientId],
        createdAt: new Date(),
        type: 'direct'
      };
      conversations.push(conversation);
    }

    // Send message
    const newMessage = {
      id: uuidv4(),
      conversationId: conversation.id,
      senderId: socket.userId,
      senderEmail: socket.userEmail,
      message,
      timestamp: new Date(),
      readBy: [socket.userId],
      type: 'text'
    };

    messages.push(newMessage);

    // Emit to all participants
    conversation.participants.forEach(participantId => {
      io.to(`user_${participantId}`).emit('new_message', newMessage);
      io.to(`user_${participantId}`).emit('conversation_updated', conversation);
    });

    // Send notification to recipient
    sendNotification(
      recipientId,
      NOTIFICATION_TYPES.NEW_MESSAGE,
      'New Message',
      `You have a new message from ${socket.userEmail}`,
      { conversationId: conversation.id }
    );
  });

  // Send message to existing conversation
  socket.on('send_message', (data) => {
    const { conversationId, message, type = 'text', fileUrl = null } = data;
    
    const conversation = conversations.find(conv => conv.id === conversationId);
    if (!conversation || !conversation.participants.includes(socket.userId)) {
      socket.emit('error', { message: 'Conversation not found or access denied' });
      return;
    }

    const newMessage = {
      id: uuidv4(),
      conversationId,
      senderId: socket.userId,
      senderEmail: socket.userEmail,
      message,
      timestamp: new Date(),
      readBy: [socket.userId],
      type,
      fileUrl
    };

    messages.push(newMessage);

    // Emit to all participants
    conversation.participants.forEach(participantId => {
      io.to(`user_${participantId}`).emit('new_message', newMessage);
    });

    // Send notification to other participants
    conversation.participants.forEach(participantId => {
      if (participantId !== socket.userId) {
        sendNotification(
          participantId,
          NOTIFICATION_TYPES.NEW_MESSAGE,
          'New Message',
          `You have a new message from ${socket.userEmail}`,
          { conversationId }
        );
      }
    });
  });

  // Mark messages as read
  socket.on('mark_as_read', (data) => {
    const { conversationId } = data;
    
    messages.forEach(msg => {
      if (msg.conversationId === conversationId && msg.senderId !== socket.userId) {
        if (!msg.readBy.includes(socket.userId)) {
          msg.readBy.push(socket.userId);
        }
      }
    });

    // Notify other participants about read status
    const conversation = conversations.find(conv => conv.id === conversationId);
    if (conversation) {
      conversation.participants.forEach(participantId => {
        if (participantId !== socket.userId) {
          io.to(`user_${participantId}`).emit('messages_read', {
            conversationId,
            readBy: socket.userId
          });
        }
      });
    }
  });

  // Handle typing indicators
  socket.on('typing_start', (data) => {
    const { conversationId } = data;
    const conversation = conversations.find(conv => conv.id === conversationId);
    
    if (conversation && conversation.participants.includes(socket.userId)) {
      conversation.participants.forEach(participantId => {
        if (participantId !== socket.userId) {
          io.to(`user_${participantId}`).emit('user_typing', {
            conversationId,
            userId: socket.userId,
            userEmail: socket.userEmail
          });
        }
      });
    }
  });

  socket.on('typing_stop', (data) => {
    const { conversationId } = data;
    const conversation = conversations.find(conv => conv.id === conversationId);
    
    if (conversation && conversation.participants.includes(socket.userId)) {
      conversation.participants.forEach(participantId => {
        if (participantId !== socket.userId) {
          io.to(`user_${participantId}`).emit('user_stopped_typing', {
            conversationId,
            userId: socket.userId
          });
        }
      });
    }
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log(`User ${socket.userId} disconnected`);
    onlineUsers.delete(socket.id);
    
    // Broadcast updated online users
    io.emit('online_users', Array.from(onlineUsers.values()));
  });
};

// Get conversation history (for API endpoints)
const getConversationHistory = (userId, conversationId) => {
  const conversation = conversations.find(conv => 
    conv.id === conversationId && conv.participants.includes(userId)
  );
  
  if (!conversation) return null;

  const conversationMessages = messages
    .filter(msg => msg.conversationId === conversationId)
    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

  return {
    conversation,
    messages: conversationMessages
  };
};

// Get user conversations (for API endpoints)
const getUserConversations = (userId) => {
  return conversations.filter(conv => 
    conv.participants.includes(userId)
  ).map(conv => {
    const lastMessage = messages
      .filter(msg => msg.conversationId === conv.id)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0];
    
    const unreadCount = messages.filter(msg => 
      msg.conversationId === conv.id && 
      msg.senderId !== userId && 
      !msg.readBy.includes(userId)
    ).length;

    return {
      ...conv,
      lastMessage: lastMessage?.message || '',
      lastMessageTime: lastMessage?.timestamp,
      unreadCount
    };
  });
};

module.exports = {
  socketAuth,
  handleConnection,
  getConversationHistory,
  getUserConversations,
  conversations,
  messages,
  onlineUsers
};