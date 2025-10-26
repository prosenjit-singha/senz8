import "server-only";
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

// Cache the connection (important for hot reloads & serverless)
let isConnected = false;

/**
 * Ensures a MongoDB connection is established before any queries.
 * Prevents buffering errors in serverless environments.
 */
export const connectDB = async (): Promise<typeof mongoose> => {
  if (isConnected) return mongoose;

  if (!MONGODB_URI) {
    throw new Error("❌ MONGODB_URI is not defined in environment variables");
  }

  try {
    const db = await mongoose.connect(MONGODB_URI, {
      // Use the unified topology engine
      serverSelectionTimeoutMS: 5000,
      maxPoolSize: 10,
    });

    isConnected = db.connections[0].readyState === 1;
    console.log("✅ MongoDB connected");
    return db;
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    throw err;
  }
};
