// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers"; // ✅ latest cookie API
import { connect } from "@/lib/mongoose";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";
import { signAccessToken, signRefreshToken } from "@/lib/jwt";

export const dynamic = "force-dynamic"; // ✅ ensures always runs fresh (not cached)

const ACCESS_COOKIE_NAME = "access_token";
const REFRESH_COOKIE_NAME = "refresh_token";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    await connect();
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // ✅ Generate JWTs
    const accessToken = signAccessToken({ id: user._id, email: user.email });
    const refreshToken = signRefreshToken({ id: user._id, email: user.email });

    // ✅ Use the modern cookies() API
    const cookieStore = await cookies();

    cookieStore.set({
      name: ACCESS_COOKIE_NAME,
      value: accessToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 15, // 15 minutes
    });

    cookieStore.set({
      name: REFRESH_COOKIE_NAME,
      value: refreshToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return NextResponse.json({
      message: "Login successful",
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
