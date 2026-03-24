import express from "express";
import {
  register,
  verifyEmail,
  login,
  refresh,
  logout,
  forgotPassword,
  verifyPasswordResetOtp,
  resetPassword,
} from "../services/auth.service";
import { protect } from "../middleware/auth.middleware";

const router = express.Router();

router.post("/signup", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const data = await register(email, password);
    res.json(data);
  } catch (err) {
    next(err);
  }
});

router.post("/verify-email", (req, res, next) => {
  try {
    const { email, otp } = req.body;
    const data = verifyEmail(email, otp);
    res.json(data);
  } catch (err) {
    next(err);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const data = await login(email, password);
    res.json(data);
  } catch (err) {
    next(err);
  }
});

router.post("/forgot-password", async (req, res, next) => {
  try {
    const { email } = req.body;
    const data = await forgotPassword(email);
    res.json(data);
  } catch (err) {
    next(err);
  }
});

router.post("/verify-reset-otp", (req, res, next) => {
  try {
    const { email, otp } = req.body;
    const data = verifyPasswordResetOtp(email, otp);
    res.json(data);
  } catch (err) {
    next(err);
  }
});

router.post("/reset-password", async (req, res, next) => {
  try {
    const { email, otp, newPassword } = req.body;
    const data = await resetPassword(email, otp, newPassword);
    res.json(data);
  } catch (err) {
    next(err);
  }
});

router.post("/refresh", (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    const data = refresh(refreshToken);
    res.json(data);
  } catch (err) {
    next(err);
  }
});

router.post("/logout", protect, (req: any, res) => {
  logout(req.user.id);
  res.json({ success: true });
});

router.get("/me", protect, (req: any, res) => {
  res.json({ user: req.user });
});

export default router;
