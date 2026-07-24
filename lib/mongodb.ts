import mongoose from "mongoose";

// Disable buffering globally — operations fail immediately instead of timing out
mongoose.set("bufferCommands", false);

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;
const NO_DB =
  !MONGO_URI || MONGO_URI === "paste_my_mongodb_connection_string_here";

let cached = (global as any).__mongoose;
if (!cached) cached = (global as any).__mongoose = { conn: null, promise: null };

export async function connectDB(): Promise<typeof mongoose | null> {
  if (NO_DB) return null;

  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGO_URI!, { bufferCommands: false })
      .then((m) => m)
      .catch((err) => {
        cached.promise = null;
        throw err;
      });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (err) {
    cached.promise = null;
    console.error("[MongoDB] Connection failed:", err);
    return null;
  }
}
