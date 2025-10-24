// lib/mongoose.ts
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;
if (!MONGODB_URI) throw new Error("Please define the MONGODB_URI env var.");

declare global {
  // eslint-disable-next-line no-var
  var mongooseGlobal: { conn?: typeof mongoose | null; promise?: Promise<typeof mongoose> | null } | undefined;
}

const cached = global.mongooseGlobal || (global.mongooseGlobal = { conn: null, promise: null });

export async function connect() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((m) => m);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}