const sgMail = require('@sendgrid/mail');

// Configure SendGrid
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  console.log('SendGrid email service ready');
} else {
  console.warn('SendGrid API key not configured');
}

const sendVerificationEmail = async (email, otp, companyName) => {
  const msg = {
    to: email,
    from: {
      email: process.env.FROM_EMAIL || 'noreply@upflyover.com',
      name: 'Upflyover'
    },
    subject: 'Your Upflyover Verification Code',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: rgb(30, 86, 86); margin: 0;">Upflyover</h1>
        </div>
        <h2 style="color: rgb(30, 86, 86); text-align: center;">Email Verification</h2>
        <p>Hello,</p>
        <p>Thank you for registering with Upflyover. Please use the following verification code to verify your email address:</p>
        <div style="text-align: center; margin: 30px 0;">
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; display: inline-block; border: 2px solid rgb(30, 86, 86);">
            <h1 style="color: rgb(30, 86, 86); margin: 0; font-size: 32px; letter-spacing: 5px; font-weight: bold;">${otp}</h1>
          </div>
        </div>
        <p><strong>This verification code will expire in 10 minutes.</strong></p>
        <p>If you didn't request this verification, please ignore this email.</p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #666; font-size: 12px; text-align: center;">This is an automated message from Upflyover B2B Networking Platform.<br>Please do not reply to this email.</p>
      </div>
    `
  };

  try {
    await sgMail.send(msg);
    console.log(`Email OTP sent to ${email}`);
    return { success: true };
  } catch (error) {
    console.error('SendGrid email sending failed:', error);
    return { success: false, error: error.message };
  }
};

module.exports = { sendVerificationEmail };