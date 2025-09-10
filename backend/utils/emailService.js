const nodemailer = require('nodemailer');

// Email service configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASS || 'your-app-password'
  }
});

const sendVerificationEmail = async (email, otp, companyName) => {
  const mailOptions = {
    from: process.env.EMAIL_USER || 'noreply@upflyover.com',
    to: email,
    subject: 'Your Upflyover Verification Code',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: rgb(30, 86, 86); text-align: center;">Email Verification</h2>
        <p>Hello,</p>
        <p>Thank you for registering with Upflyover. Please use the following verification code to verify your email address:</p>
        <div style="text-align: center; margin: 30px 0;">
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; display: inline-block;">
            <h1 style="color: rgb(30, 86, 86); margin: 0; font-size: 32px; letter-spacing: 5px;">${otp}</h1>
          </div>
        </div>
        <p>This verification code will expire in 10 minutes.</p>
        <p>If you didn't request this verification, please ignore this email.</p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #666; font-size: 12px;">This is an automated message from Upflyover. Please do not reply to this email.</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Email sending failed:', error);
    return { success: false, error: error.message };
  }
};

module.exports = { sendVerificationEmail };