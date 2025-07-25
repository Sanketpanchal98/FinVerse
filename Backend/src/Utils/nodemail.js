import nodemailer from 'nodemailer'
import path from 'path'
import fs from 'fs'

// Email configuration
const emailConfig = {
  service: 'gmail',
  port : 465,
  secure : true,
  auth: {
    user: process.env.NODEMAILER_USER, // your email
    pass: process.env.NODEMAILER_PASS // your app password
  }
};

// Create transporter
const transporter = nodemailer.createTransport(emailConfig)

// Function to generate OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Function to send OTP email
async function sendOTPEmail(userEmail, otpCode) {
  try {
    // Read the HTML template
    const htmlTemplate = fs.readFileSync(
      path.join('public', 'otp-email-template.html'), 
      'utf8'
    );
    
    // Replace placeholders with actual values
    const personalizedHTML = htmlTemplate
      .replace(/{{userName}}/g, 'User')
      .replace(/{{otpCode}}/g, otpCode);
    
    // Email options
    const mailOptions = {
      from: {
        name: 'FinVerse',
        address: process.env.NODEMAILER_USER
      },
      to: userEmail,
      subject: 'FinVerse - Verify Your Account | OTP Code',
      html: personalizedHTML,
      // Plain text fallback
      text: `
        Hello User,
        
        Thank you for joining FinVerse! 
        
        Your verification code is: ${otpCode}
        
        This code will expire in 10 minutes.
        
        If you didn't request this code, please ignore this email.
        
        Best regards,
        FinVerse Team
      `
    };
    
    // Send email
    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId };
    
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Express.js route example
async function handleOTPRequest(req, res) {
  try {
    const { email } = req.body;
    
    // Generate OTP
    const otpCode = generateOTP();
    // console.log(otpCode);
    
    // Store OTP in database/cache with expiration (10 minutes)
    // Example with Redis:
    // await redisClient.setex(`otp:${email}`, 600, otpCode);
    
    // Or with in-memory storage for demo:
    global.otpStore = global.otpStore || {};
    global.otpStore[email] = {
      code: otpCode,
      expires: Date.now() + 10 * 60 * 1000 // 10 minutes
    };
    
    // Send OTP email
    const result = await sendOTPEmail(email, otpCode);
    // console.log(result);
    
    if (result.success) {
      res.status(200).json({
        success: true,
        message: 'OTP sent successfully to your email'
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to send OTP email'
      });
    }
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

// Function to verify OTP
function verifyOTP(email, providedOTP) {
  const storedOTP = global.otpStore?.[email];
  
  if (!storedOTP) {
    return { valid: false, message: 'OTP not found or expired' };
  }
  
  if (Date.now() > storedOTP.expires) {
    delete global.otpStore[email];
    return { valid: false, message: 'OTP has expired' };
  }
  
  if (storedOTP.code !== providedOTP) {
    return { valid: false, message: 'Invalid OTP' };
  }
  
  // OTP is valid, remove it
  delete global.otpStore[email];
  return { valid: true, message: 'OTP verified successfully' };
}

async function handleOTPVerification(email, otp) {
  try {
    const verification = verifyOTP(email, otp);
    
    if (verification.valid) {
      return true
    } else {
      return false
    }
    
  } catch (error) {
    return error;
  }
}
export {
  sendOTPEmail,
  generateOTP,
  verifyOTP,
  handleOTPRequest,
  handleOTPVerification,
};
