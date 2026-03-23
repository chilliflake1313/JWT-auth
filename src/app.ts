import express from "express";
import dotenv from "dotenv";
import path from "path";
import authRoutes from "./routes/auth.routes";
import { errorHandler } from "./middleware/errorHandler";

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.static(path.resolve(process.cwd(), "public")));

app.use("/auth", authRoutes);

app.use(errorHandler);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});

export default app;
