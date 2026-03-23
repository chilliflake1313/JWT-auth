import express from "express";
import { register, login, refresh, logout } from "../services/auth.service";
import { protect } from "../middleware/auth.middleware";

const router = express.Router();

router.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  const data = await register(email, password);
  res.json(data);
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const data = await login(email, password);
  res.json(data);
});

router.post("/refresh", (req, res) => {
  const { refreshToken } = req.body;
  const data = refresh(refreshToken);
  res.json(data);
});

router.post("/logout", protect, (req: any, res) => {
  logout(req.user.id);
  res.json({ success: true });
});

router.get("/me", protect, (req: any, res) => {
  res.json({ user: req.user });
});

export default router;
