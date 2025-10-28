// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connect } from "@/lib/mongoose";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";
import { signAccessToken, signRefreshToken } from "@/lib/jwt";

export const dynamic = "force-dynamic"; // ✅ ensures route is always dynamic

// ✅ Cookie names
const ACCESS_COOKIE_NAME = "access_token";
const REFRESH_COOKIE_NAME = "refresh_token";



export async function POST(req: NextRequest) {
  try {
    let email, password;
    try {
      const body = await req.json();
      email = body.email;
      password = body.password;
    } catch (e) {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    // ✅ Validate input
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    if (typeof email !== 'string' || typeof password !== 'string') {
      return NextResponse.json({ error: "Invalid email or password format" }, { status: 400 });
    }

    // Sanitize input
    email = email.trim().toLowerCase();
    if (!email.match(/^[^@]+@[^@]+\.[^@]+$/)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }

    // ✅ Connect to MongoDB
    await connect();

    const user = await User.findOne({ email }).lean();
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // ✅ Generate JWT tokens
    const accessToken = signAccessToken({ id: user._id, email: user.email });
    const refreshToken = signRefreshToken({ id: user._id, email: user.email });

    // ✅ Create response with JSON payload
    const response = NextResponse.json({
      message: "Login successful",
      user: { id: user._id, name: user.name, email: user.email }
    });

    // ✅ Set cookies on the response
    response.cookies.set(ACCESS_COOKIE_NAME, accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 15 // 15 minutes
    });

    response.cookies.set(REFRESH_COOKIE_NAME, refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });

    return response;

    // Response is returned in the cookie setting block above
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
