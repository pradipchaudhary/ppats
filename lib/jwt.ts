// lib/jwt.ts
import jwt from "jsonwebtoken";

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET!;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;

if (!ACCESS_SECRET || !REFRESH_SECRET) {
  throw new Error("JWT secrets not set in env.");
}

export function signAccessToken(payload: object, options?: jwt.SignOptions) {
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: "15m", ...(options || {}) });
}

export function signRefreshToken(payload: object, options?: jwt.SignOptions) {
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: "7d", ...(options || {}) });
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, ACCESS_SECRET);
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, REFRESH_SECRET);
}