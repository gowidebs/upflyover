const twilio = require('twilio');

// Initialize Twilio client
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const sendSMSOTP = async (phone) => {
  try {
    const verification = await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SERVICE_SID)
      .verifications
      .create({
        to: phone,
        channel: 'sms'
      });

    console.log(`SMS OTP sent to ${phone}: ${verification.sid}`);
    return { success: true, sid: verification.sid };
  } catch (error) {
    console.error('SMS sending failed:', error);
    return { success: false, error: error.message };
  }
};

const sendEmailOTP = async (email) => {
  try {
    const verification = await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SERVICE_SID)
      .verifications
      .create({
        to: email,
        channel: 'email'
      });

    console.log(`Email OTP sent to ${email}: ${verification.sid}`);
    return { success: true, sid: verification.sid };
  } catch (error) {
    console.error('Email sending failed:', error);
    return { success: false, error: error.message };
  }
};

const verifyOTP = async (to, otp) => {
  try {
    const verificationCheck = await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SERVICE_SID)
      .verificationChecks
      .create({
        to: to,
        code: otp
      });

    return {
      success: verificationCheck.status === 'approved',
      status: verificationCheck.status
    };
  } catch (error) {
    console.error('OTP verification failed:', error);
    return { success: false, error: error.message };
  }
};

module.exports = { sendSMSOTP, sendEmailOTP, verifyOTP };