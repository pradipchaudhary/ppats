// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/lib/mongoose";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";
import { signAccessToken, signRefreshToken } from "@/lib/jwt";
import { serialize } from "cookie";

const ACCESS_COOKIE_NAME = "access_token";
const REFRESH_COOKIE_NAME = "refresh_token";

function cookieOptions({ httpOnly = true, secure = process.env.NODE_ENV === "production", maxAge }: any) {
  return {
    httpOnly,
    secure,
    sameSite: "lax",
    path: "/",
    maxAge
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;
    if (!email || !password) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    await connect();
    const user = await User.findOne({ email });
    if (!user) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

    const accessToken = signAccessToken({ id: user._id, email: user.email });
    const refreshToken = signRefreshToken({ id: user._id, email: user.email });

    const res = NextResponse.json({ user: { id: user._id, email: user.email, name: user.name } });

    // set cookies via header with cookie serialize
    res.headers.set("Set-Cookie", [
      serialize(ACCESS_COOKIE_NAME, accessToken, cookieOptions({ maxAge: 60 * 15 })), // 15m
      serialize(REFRESH_COOKIE_NAME, refreshToken, cookieOptions({ maxAge: 60 * 60 * 24 * 7 })) // 7d
    ].join(", "));

    return res;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}