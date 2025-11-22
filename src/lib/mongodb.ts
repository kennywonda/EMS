import mongoose from "mongoose";

// Get MongoDB URI from environment variables
const MONGODB_URI = process.env.MONGODB_URI!;

// Check if MONGODB_URI exists
if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

// TypeScript interface for caching the connection
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Extend global type to include mongoose cache
declare global {
  var mongoose: MongooseCache;
}

// Initialize cached connection
// This prevents multiple connections in development due to hot reloading
let cached: MongooseCache = global.mongoose || {
  conn: null,
  promise: null,
};

// Set global mongoose cache if it doesn't exist
if (!global.mongoose) {
  global.mongoose = cached;
}

/**
 * Connect to MongoDB
 * This function reuses existing connection if available
 * to prevent connection pool exhaustion
 */
async function connectDB(): Promise<typeof mongoose> {
  // If connection already exists, return it
  if (cached.conn) {
    console.log("✅ Using cached MongoDB connection");
    return cached.conn;
  }

  // If no connection promise exists, create one
  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // Disable mongoose buffering
    };

    console.log("🔄 Connecting to MongoDB...");
    
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log("✅ MongoDB connected successfully");
      if (mongoose.connection.db) {
        console.log(`📊 Database: ${mongoose.connection.db.databaseName}`);
      } else {
        console.warn("⚠️  Database connection is established, but 'db' is undefined.");
      }
      return mongoose;
    });
  }

  try {
    // Wait for the connection promise to resolve
    cached.conn = await cached.promise;
  } catch (e) {
    // If connection fails, reset promise and throw error
    cached.promise = null;
    console.error("❌ MongoDB connection error:", e);
    throw e;
  }

  return cached.conn;
}

export default connectDB;

