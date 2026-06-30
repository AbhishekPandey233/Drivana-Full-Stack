import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import authRoutes from "../routes/authRoutes";
import userRoutes from "../routes/userRoutes";

dotenv.config();

const app = express();
const port = Number(process.env.PORT) || 5000;
const mongoUri = process.env.MONGODB_URI;

// Middleware
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));
app.use(express.json());
app.use("/api/users", userRoutes);

// Health Check Route
app.get("/health", (_req, res) => {
  res.status(200).json({ ok: true, service: "backend", timestamp: new Date().toISOString() });
});

// Authentication API Entrypoint
app.use("/api/auth", authRoutes);

const startServer = async () => {
  if (mongoUri) {
    await mongoose.connect(mongoUri);
    console.log("MongoDB connected smoothly to Drivana");
  } else {
    console.warn("MONGODB_URI is not set; server started without database connection");
  }

  app.listen(port, () => {
    console.log(`Backend listening on http://localhost:${port}`);
  });
};



startServer().catch((error: unknown) => {
  console.error("Failed to start backend", error);
  process.exit(1);
});