// app/api/auth/me/route.ts
import { NextRequest, NextResponse } from "next/server";
import { verifyAccessToken } from "@/lib/jwt";
import { connect } from "@/lib/mongoose";
import { User } from "@/models/User";

export const dynamic = 'force-dynamic'; // Disable caching for this route

export async function GET(req: NextRequest) {
  try {
    // Get access token using modern cookies API
    const access = req.cookies.get('access_token')?.value;
    
    if (!access) {
      console.log('No access token found in cookies');
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    let payload: any;
    try {
      payload = verifyAccessToken(access) as any;
    } catch (err) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
    }

    await connect();
    const user = await User.findById(payload.id).select("-password").lean();
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json({ user });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}