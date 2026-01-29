import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";

dotenv.config();

const app = express();

// 1. 🛡️ FIXED CORS: Explicitly allow your frontend port
app.use(cors({
  origin: "http://localhost:5173", // Vite's default port
  credentials: true
}));

app.use(express.json());

// 2. 🛣️ Routes
app.use("/auth", authRoutes);
app.use("/tasks", taskRoutes);

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/taskmanager";

// 3. 🔌 DATABASE: Added configuration to prevent "Buffering Timeout"
mongoose
  .connect(MONGO_URI, {
    serverSelectionTimeoutMS: 5000, // Fail fast if DB is down
    autoIndex: true,
  })
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1); // Stop server if DB fails
  });

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));