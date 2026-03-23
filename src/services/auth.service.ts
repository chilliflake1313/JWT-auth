import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { generateAccessToken, generateRefreshToken } from "./token.service";

const users = new Map<string, any>();
const refreshStore = new Map<string, string>();

export const register = async (email: string, password: string) => {
  const hashed = await bcrypt.hash(password, 10);

  const user = {
    id: Date.now().toString(),
    email,
    password: hashed,
  };

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

export const logout = (userId: string) => {
  refreshStore.delete(userId);
};
