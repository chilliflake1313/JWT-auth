import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { generateAccessToken, generateRefreshToken } from "./token.service";
import { sendOtpEmail } from "./mail.service";

const users = new Map<string, any>();
const refreshStore = new Map<string, string>();
const pendingSignups = new Map<string, { password: string; otp: string; expiresAt: number }>();
const passwordResets = new Map<string, { otp: string; expiresAt: number }>();

const OTP_EXPIRY_MS = 10 * 60 * 1000; // 10 minutes
const createOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

export const register = async (email: string, password: string) => {
  if (users.has(email)) {
    throw new Error("Email already exists");
  }

  if (password.length < 8) {
    throw new Error("Password must be at least 8 characters");
  }

  const hashed = await bcrypt.hash(password, 10);
  const otp = createOtp();
  const expiresAt = Date.now() + OTP_EXPIRY_MS;

  pendingSignups.set(email, { password: hashed, otp, expiresAt });

  // Send OTP via email
  const emailSent = await sendOtpEmail(email, otp);
  
  if (!emailSent) {
    throw new Error("Failed to send OTP email");
  }

  return { 
    message: "OTP sent to your email. Check your inbox and spam folder.",
    email
  };
};

export const verifyEmail = (email: string, otp: string) => {
  const pending = pendingSignups.get(email);
  if (!pending) {
    throw new Error("No pending signup for this email");
  }

  if (pending.expiresAt < Date.now()) {
    pendingSignups.delete(email);
    throw new Error("OTP has expired. Please signup again.");
  }

  if (pending.otp !== otp) {
    throw new Error("Invalid OTP");
  }

  const user = {
    id: Date.now().toString(),
    email,
    password: pending.password,
  };

  pendingSignups.delete(email);
  users.set(email, user);

  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  refreshStore.set(user.id, refreshToken);

  return { user: { id: user.id, email }, accessToken, refreshToken };
};

export const login = async (email: string, password: string) => {
  const user = users.get(email);

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw new Error("Invalid credentials");
  }

  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  refreshStore.set(user.id, refreshToken);

  return { user: { id: user.id, email }, accessToken, refreshToken };
};

export const refresh = (token: string) => {
  const decoded: any = jwt.verify(token, process.env.JWT_REFRESH_SECRET!);

  const stored = refreshStore.get(decoded.id);
  if (stored !== token) {
    throw new Error("Invalid refresh token");
  }

  const accessToken = generateAccessToken(decoded.id);
  return { accessToken };
};

export const forgotPassword = async (email: string) => {
  const user = users.get(email);
  if (!user) {
    // Don't reveal if email exists for security
    return { message: "If email exists, OTP has been sent" };
  }

  const otp = createOtp();
  const expiresAt = Date.now() + OTP_EXPIRY_MS;

  passwordResets.set(email, { otp, expiresAt });

  // Send OTP via email
  const emailSent = await sendOtpEmail(
    email,
    otp,
    "Password Reset Request"
  );

  if (!emailSent) {
    throw new Error("Failed to send OTP email");
  }

  return { message: "If email exists, OTP has been sent" };
};

export const verifyPasswordResetOtp = (email: string, otp: string) => {
  const reset = passwordResets.get(email);
  if (!reset) {
    throw new Error("No password reset request for this email");
  }

  if (reset.expiresAt < Date.now()) {
    passwordResets.delete(email);
    throw new Error("OTP has expired. Request a new one.");
  }

  if (reset.otp !== otp) {
    throw new Error("Invalid OTP");
  }

  return { message: "OTP verified. You can now reset your password." };
};

export const resetPassword = async (
  email: string,
  otp: string,
  newPassword: string
) => {
  const reset = passwordResets.get(email);
  if (!reset) {
    throw new Error("No password reset request for this email");
  }

  if (reset.expiresAt < Date.now()) {
    passwordResets.delete(email);
    throw new Error("OTP has expired. Request a new one.");
  }

  if (reset.otp !== otp) {
    throw new Error("Invalid OTP");
  }

  if (newPassword.length < 8) {
    throw new Error("Password must be at least 8 characters");
  }

  const user = users.get(email);
  if (!user) {
    throw new Error("User not found");
  }

  const hashed = await bcrypt.hash(newPassword, 10);
  user.password = hashed;
  users.set(email, user);

  passwordResets.delete(email);

  return { message: "Password reset successfully. Please login with your new password." };
};

export const logout = (userId: string) => {
  refreshStore.delete(userId);
};
