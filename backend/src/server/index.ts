import "dotenv/config";

import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import path from "path";
import authRoutes from "../routes/authRoutes";
import userRoutes from "../routes/userRoutes";
import vehicleRoutes from "../routes/vehicleRoutes";
import rentingRoutes from "../routes/rentingRoutes"; // Imported here

const app = express();
const port = Number(process.env.PORT) || 5000;
const mongoUri = process.env.MONGODB_URI;

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "../../public")));

app.use("/api/users", userRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/rentings", rentingRoutes); // Mounted here

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