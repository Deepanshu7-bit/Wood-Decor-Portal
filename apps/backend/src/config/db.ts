import mongoose from "mongoose";
import { ENV } from "./env.js";

/**
 * Connect to MongoDB with connection pooling
 */
export async function connectDB(): Promise<void> {
  try {
    const conn = await mongoose.connect(ENV.MONGODB_URI, {
      maxPoolSize: 10,
      minPoolSize: 2,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log(`🍃 MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
    process.exit(1);
  }
}

mongoose.connection.on("disconnected", () => {
  console.warn("⚠️  MongoDB disconnected. Attempting to reconnect...");
});

mongoose.connection.on("error", (err) => {
  console.error("❌ MongoDB connection error:", err);
});
