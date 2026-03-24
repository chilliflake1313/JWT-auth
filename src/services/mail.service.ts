import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.MAILTRAP_HOST || "smtp.mailtrap.io",
  port: Number(process.env.MAILTRAP_PORT || 2525),
  auth: {
    user: process.env.MAILTRAP_USER || "",
    pass: process.env.MAILTRAP_PASS || "",
  },
});

export const sendOtpEmail = async (
  email: string,
  otp: string,
  subject: string = "Email Verification"
) => {
  const mailOptions = {
    from: process.env.MAILTRAP_FROM || "noreply@jwtauth.local",
    to: email,
    subject,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0f766e;">${
          subject === "Email Verification" ? "Email Verification" : "Password Reset Request"
        }</h2>
        <p>Your OTP code is:</p>
        <div style="background: #f0fdf4; padding: 20px; border-radius: 10px; text-align: center;">
          <h1 style="color: #0f766e; font-size: 36px; letter-spacing: 6px; margin: 0;">${otp}</h1>
        </div>
        <p style="color: #666;">This code expires in <strong>10 minutes</strong>.</p>
        ${
          subject === "Email Verification"
            ? "<p>Use this OTP to verify your email and complete the signup.</p>"
            : "<p>Use this OTP to reset your password. Do not share this code with anyone.</p>"
        }
        <hr style="border: none; border-top: 1px solid #ddd;">
        <p style="color: #999; font-size: 12px;">If you didn't request this, please ignore this email.</p>
        <p style="color: #999; font-size: 12px;">© 2026 JWT Auth. All rights reserved.</p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.messageId);
    return true;
  } catch (error) {
    console.error("Failed to send email:", error);
    return false;
  }
};
