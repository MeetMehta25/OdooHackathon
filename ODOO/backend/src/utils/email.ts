import nodemailer from "nodemailer";

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: parseInt(process.env.EMAIL_PORT || "587"),
  secure: process.env.EMAIL_SECURE === "true",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Send OTP email
export const sendOTPEmail = async (
  to: string,
  otp: string,
  userName: string
): Promise<boolean> => {
  try {
    const mailOptions = {
      from: `"${process.env.EMAIL_FROM_NAME || "ODOO Warehouse"}" <${process.env.EMAIL_USER}>`,
      to,
      subject: "Your OTP Verification Code",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #4F46E5; color: white; padding: 20px; text-align: center; }
            .content { background-color: #f9f9f9; padding: 30px; border-radius: 5px; margin: 20px 0; }
            .otp-box { background-color: white; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; margin: 20px 0; border: 2px dashed #4F46E5; }
            .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>OTP Verification</h1>
            </div>
            <div class="content">
              <h2>Hello ${userName},</h2>
              <p>You have requested an OTP for verification. Please use the code below:</p>
              <div class="otp-box">${otp}</div>
              <p><strong>This OTP will expire in 10 minutes.</strong></p>
              <p>If you did not request this code, please ignore this email.</p>
            </div>
            <div class="footer">
              <p>&copy; 2025 ODOO Warehouse Management System. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Error sending OTP email:", error);
    return false;
  }
};

// Send welcome email
export const sendWelcomeEmail = async (
  to: string,
  userName: string
): Promise<boolean> => {
  try {
    const mailOptions = {
      from: `"${process.env.EMAIL_FROM_NAME || "ODOO Warehouse"}" <${process.env.EMAIL_USER}>`,
      to,
      subject: "Welcome to ODOO Warehouse Management",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #4F46E5; color: white; padding: 20px; text-align: center; }
            .content { padding: 30px; }
            .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to ODOO!</h1>
            </div>
            <div class="content">
              <h2>Hello ${userName},</h2>
              <p>Welcome to ODOO Warehouse Management System! Your account has been successfully created.</p>
              <p>You can now start managing your inventory, warehouses, and operations efficiently.</p>
              <p>If you have any questions, feel free to reach out to our support team.</p>
            </div>
            <div class="footer">
              <p>&copy; 2025 ODOO Warehouse Management System. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Error sending welcome email:", error);
    return false;
  }
};

// Send password reset email
export const sendPasswordResetEmail = async (
  to: string,
  userName: string,
  resetToken: string
): Promise<boolean> => {
  try {
    const resetUrl = `${process.env.FRONTEND_URL || "http://localhost:3000"}/reset-password?token=${resetToken}`;

    const mailOptions = {
      from: `"${process.env.EMAIL_FROM_NAME || "ODOO Warehouse"}" <${process.env.EMAIL_USER}>`,
      to,
      subject: "Password Reset Request",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #4F46E5; color: white; padding: 20px; text-align: center; }
            .content { padding: 30px; }
            .button { display: inline-block; padding: 12px 30px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Password Reset</h1>
            </div>
            <div class="content">
              <h2>Hello ${userName},</h2>
              <p>You have requested to reset your password. Click the button below to proceed:</p>
              <a href="${resetUrl}" class="button">Reset Password</a>
              <p>Or copy and paste this link into your browser:</p>
              <p style="word-break: break-all; color: #4F46E5;">${resetUrl}</p>
              <p><strong>This link will expire in 1 hour.</strong></p>
              <p>If you did not request a password reset, please ignore this email.</p>
            </div>
            <div class="footer">
              <p>&copy; 2025 ODOO Warehouse Management System. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Error sending password reset email:", error);
    return false;
  }
};

// Verify email configuration
export const verifyEmailConfig = async (): Promise<boolean> => {
  try {
    await transporter.verify();
    console.log("✅ Email server is ready to send emails");
    return true;
  } catch (error) {
    console.error("❌ Email server configuration error:", error);
    return false;
  }
};
