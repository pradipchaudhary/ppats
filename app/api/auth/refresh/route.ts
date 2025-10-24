// app/api/auth/refresh/route.ts
import { NextRequest, NextResponse } from "next/server";
import { verifyRefreshToken, signAccessToken, signRefreshToken } from "@/lib/jwt";
import { serialize } from "cookie";
import { connect } from "@/lib/mongoose";
import { User } from "@/models/User";

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
    const cookie = req.headers.get("cookie") || "";
    const cookies = Object.fromEntries(cookie.split(";").map(c => {
      const [k, ...v] = c.split("=");
      return [k?.trim(), decodeURIComponent(v?.join("="))];
    }));
    const refresh = cookies[REFRESH_COOKIE_NAME];
    if (!refresh) return NextResponse.json({ error: "No refresh token" }, { status: 401 });

    // verify refresh token
    let payload: any;
    try {
      payload = verifyRefreshToken(refresh) as any;
    } catch (err) {
      return NextResponse.json({ error: "Invalid refresh token" }, { status: 401 });
    }

    await connect();
    const user = await User.findById(payload.id).lean();
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const newAccess = signAccessToken({ id: user._id, email: user.email });
    const newRefresh = signRefreshToken({ id: user._id, email: user.email });

    const res = NextResponse.json({ user: { id: user._id, email: user.email, name: user.name } });
    res.headers.set("Set-Cookie", [
      serialize(ACCESS_COOKIE_NAME, newAccess, cookieOptions({ maxAge: 60 * 15 })),
      serialize(REFRESH_COOKIE_NAME, newRefresh, cookieOptions({ maxAge: 60 * 60 * 24 * 7 }))
    ].join(", "));
    return res;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}