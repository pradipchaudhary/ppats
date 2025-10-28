// lib/jwt.ts
import jwt, { SignOptions, JwtPayload } from "jsonwebtoken";

/**
 * ✅ Safely load environment variables.
 * These are only evaluated at runtime to prevent build-time errors.
 */

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET!;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;



const getAccessSecret = (): string => {
  const secret = process.env.JWT_ACCESS_SECRET;
  if (!secret) throw new Error("Missing JWT_ACCESS_SECRET in environment variables");
  return secret;
};

const getRefreshSecret = (): string => {
  const secret = process.env.JWT_REFRESH_SECRET;
  if (!secret) throw new Error("Missing JWT_REFRESH_SECRET in environment variables");
  return secret;
};

/**
 * ✅ Common JWT payload type (optional for your project)
 */
export interface TokenPayload extends JwtPayload {
  id: string;
  email: string;
}

/**
 * ✅ Sign Access Token (default: 15 minutes)
 */
export function signAccessToken(payload: object, options?: SignOptions): string {
  return jwt.sign(payload, getAccessSecret(), {
    expiresIn: "15m",
    ...(options || {}),
  });
}

/**
 * ✅ Sign Refresh Token (default: 7 days)
 */
export function signRefreshToken(payload: object, options?: SignOptions): string {
  return jwt.sign(payload, getRefreshSecret(), {
    expiresIn: "7d",
    ...(options || {}),
  });
}

/**
 * ✅ Verify Access Token
 */
export function verifyAccessToken<T = TokenPayload>(token: string): T {
  return jwt.verify(token, getAccessSecret()) as T;
}

/**
 * ✅ Verify Refresh Token
 */
export function verifyRefreshToken<T = TokenPayload>(token: string): T {
  return jwt.verify(token, getRefreshSecret()) as T;
}
