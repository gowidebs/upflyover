const nodemailer = require('nodemailer');

// Email transporter setup
const createTransporter = () => {
  if (process.env.SENDGRID_API_KEY) {
    return nodemailer.createTransporter({
      service: 'SendGrid',
      auth: {
        user: 'apikey',
        pass: process.env.SENDGRID_API_KEY
      }
    });
  }
  
  // Fallback to Gmail for development
  return nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// In-memory notification storage
let notifications = [];

// Notification types
const NOTIFICATION_TYPES = {
  NEW_MESSAGE: 'new_message',
  NEW_REQUIREMENT: 'new_requirement',
  APPLICATION_RECEIVED: 'application_received',
  KYC_APPROVED: 'kyc_approved',
  KYC_REJECTED: 'kyc_rejected',
  PAYMENT_SUCCESS: 'payment_success',
  ACCOUNT_VERIFIED: 'account_verified'
};

// Create notification
const createNotification = (userId, type, title, message, data = {}) => {
  const notification = {
    id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    userId,
    type,
    title,
    message,
    data,
    read: false,
    createdAt: new Date()
  };
  
  notifications.push(notification);
  return notification;
};

// Send email notification
const sendEmailNotification = async (email, subject, htmlContent) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.FROM_EMAIL || 'noreply@upflyover.com',
      to: email,
      subject,
      html: htmlContent
    };
    
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Email notification error:', error);
    return { success: false, error: error.message };
  }
};

// Email templates
const getEmailTemplate = (type, data) => {
  const baseTemplate = (title, content) => `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
        .container { max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; }
        .header { background: #1e5656; color: white; padding: 20px; text-align: center; border-radius: 5px; margin-bottom: 20px; }
        .content { line-height: 1.6; color: #333; }
        .button { display: inline-block; background: #1e5656; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🚀 Upflyover</h1>
          <h2>${title}</h2>
        </div>
        <div class="content">
          ${content}
        </div>
        <div class="footer">
          <p>This email was sent by Upflyover. If you no longer wish to receive these emails, you can unsubscribe in your account settings.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  switch (type) {
    case NOTIFICATION_TYPES.NEW_MESSAGE:
      return baseTemplate('New Message Received', `
        <p>Hi ${data.recipientName},</p>
        <p>You have received a new message from <strong>${data.senderName}</strong>:</p>
        <blockquote style="background: #f8f9fa; padding: 15px; border-left: 4px solid #1e5656; margin: 20px 0;">
          "${data.message}"
        </blockquote>
        <a href="${process.env.FRONTEND_URL}/messages" class="button">View Message</a>
      `);
      
    case NOTIFICATION_TYPES.NEW_REQUIREMENT:
      return baseTemplate('New Business Requirement Posted', `
        <p>Hi ${data.userName},</p>
        <p>A new requirement has been posted that matches your interests:</p>
        <h3>${data.title}</h3>
        <p>${data.description}</p>
        <p><strong>Budget:</strong> ${data.budget}</p>
        <p><strong>Timeline:</strong> ${data.timeline}</p>
        <a href="${process.env.FRONTEND_URL}/requirements" class="button">View Requirement</a>
      `);
      
    case NOTIFICATION_TYPES.KYC_APPROVED:
      return baseTemplate('KYC Verification Approved', `
        <p>Hi ${data.userName},</p>
        <p>🎉 Congratulations! Your KYC verification has been approved.</p>
        <p>You can now access all premium features of Upflyover:</p>
        <ul>
          <li>Browse unlimited company profiles</li>
          <li>Post unlimited requirements</li>
          <li>Connect with verified businesses</li>
          <li>Access advanced messaging features</li>
        </ul>
        <a href="${process.env.FRONTEND_URL}/dashboard" class="button">Access Dashboard</a>
      `);
      
    case NOTIFICATION_TYPES.PAYMENT_SUCCESS:
      return baseTemplate('Payment Successful', `
        <p>Hi ${data.userName},</p>
        <p>Your payment for the <strong>${data.planName}</strong> plan has been processed successfully.</p>
        <p><strong>Amount:</strong> $${data.amount}</p>
        <p><strong>Next billing date:</strong> ${data.nextBilling}</p>
        <p>You now have access to all premium features. Thank you for choosing Upflyover!</p>
        <a href="${process.env.FRONTEND_URL}/dashboard" class="button">Access Premium Features</a>
      `);
      
    default:
      return baseTemplate('Notification', `
        <p>Hi ${data.userName},</p>
        <p>${data.message}</p>
        <a href="${process.env.FRONTEND_URL}" class="button">Visit Upflyover</a>
      `);
  }
};

// Send notification (both in-app and email)
const sendNotification = async (userId, type, title, message, data = {}, sendEmail = true) => {
  try {
    // Create in-app notification
    const notification = createNotification(userId, type, title, message, data);
    
    // Send email if enabled and email provided
    if (sendEmail && data.email) {
      const emailTemplate = getEmailTemplate(type, data);
      await sendEmailNotification(data.email, title, emailTemplate);
    }
    
    // Emit real-time notification via Socket.IO
    if (global.io) {
      global.io.to(userId).emit('new_notification', notification);
    }
    
    return { success: true, notification };
  } catch (error) {
    console.error('Send notification error:', error);
    return { success: false, error: error.message };
  }
};

// Get user notifications
const getUserNotifications = (userId, limit = 20, offset = 0) => {
  return notifications
    .filter(n => n.userId === userId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(offset, offset + limit);
};

// Mark notification as read
const markAsRead = (notificationId, userId) => {
  const notification = notifications.find(n => n.id === notificationId && n.userId === userId);
  if (notification) {
    notification.read = true;
    return true;
  }
  return false;
};

// Mark all notifications as read
const markAllAsRead = (userId) => {
  notifications.forEach(n => {
    if (n.userId === userId) {
      n.read = true;
    }
  });
  return true;
};

// Get unread count
const getUnreadCount = (userId) => {
  return notifications.filter(n => n.userId === userId && !n.read).length;
};

module.exports = {
  NOTIFICATION_TYPES,
  sendNotification,
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  getUnreadCount,
  createNotification
};