import React, { useState } from 'react';
import { Button, Badge } from '@mui/material';
import { Message } from '@mui/icons-material';
import MessagingSystem from './MessagingSystem';

const MessageButton = ({ recipientId, recipientName, variant = 'contained', size = 'small', ...props }) => {
  const [messagingOpen, setMessagingOpen] = useState(false);
  
  const handleClick = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login to send messages');
      return;
    }
    setMessagingOpen(true);
  };

  return (
    <>
      <Button
        variant={variant}
        size={size}
        startIcon={<Message />}
        onClick={handleClick}
        {...props}
      >
        Connect
      </Button>
      
      <MessagingSystem
        open={messagingOpen}
        onClose={() => setMessagingOpen(false)}
        recipientId={recipientId}
        recipientName={recipientName}
      />
    </>
  );
};

export default MessageButton;