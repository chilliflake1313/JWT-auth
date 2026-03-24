import "dotenv/config";
import express from "express";
import path from "path";
import authRoutes from "./routes/auth.routes";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

app.use(express.json());
app.use(express.static(path.resolve(process.cwd(), "public")));

app.use("/auth", authRoutes);

app.use(errorHandler);

export default app;
