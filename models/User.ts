// models/User.ts
import mongoose, { Document, Model } from "mongoose";

export interface IUser extends Document {
  name?: string;
  email: string;
  password: string; // hashed
  role?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new mongoose.Schema<IUser>({
  name: { type: String },
  email: { type: String, required: true, unique: true, index: true },
  password: { type: String, required: true },
  role: { type: String, default: "user" }
}, { timestamps: true });

export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);