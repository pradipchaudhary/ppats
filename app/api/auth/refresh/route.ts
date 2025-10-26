// app/api/auth/refresh/route.ts
import {  NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyRefreshToken, signAccessToken, signRefreshToken } from "@/lib/jwt";
import { connect } from "@/lib/mongoose";
import { User } from "@/models/User";

const ACCESS_COOKIE_NAME = "access_token";
const REFRESH_COOKIE_NAME = "refresh_token";

interface JWTPayload {
  id: string;
  email: string;
  iat?: number;
  exp?: number;
}

export async function POST() {
  try {
    // ✅ Get refresh token using Next.js 15 modern cookie API
    const cookieStore = await cookies();
    const refresh = cookieStore.get(REFRESH_COOKIE_NAME)?.value;

    if (!refresh) {
      return NextResponse.json({ error: "No refresh token" }, { status: 401 });
    }

    // ✅ Verify refresh token
    let payload: JWTPayload | null = null;
    try {
      payload = verifyRefreshToken(refresh) as JWTPayload;
    } catch {
      return NextResponse.json({ error: "Invalid refresh token" }, { status: 401 });
    }

    if (!payload?.id) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    await connect();
    const user = await User.findById(payload.id).lean();
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // ✅ Generate new tokens
    const newAccessToken = signAccessToken({ id: user._id, email: user.email });
    const newRefreshToken = signRefreshToken({ id: user._id, email: user.email });

    // ✅ Set new cookies safely
    cookieStore.set({
      name: ACCESS_COOKIE_NAME,
      value: newAccessToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 15, // 15 minutes
    });

    cookieStore.set({
      name: REFRESH_COOKIE_NAME,
      value: newRefreshToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return NextResponse.json({
      message: "Token refreshed",
      user: { id: user._id, email: user.email, name: user.name },
    });
  } catch (error) {
    console.error("Refresh token error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
