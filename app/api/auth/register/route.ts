// app/api/auth/register/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/lib/mongoose";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password } = body;
    if (!email || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    await connect();
    // check existing
    const existing = await User.findOne({ email }).lean();
    if (existing) return NextResponse.json({ error: "User exists" }, { status: 409 });

    const hashed = await bcrypt.hash(password, 12);
    const user = new User({ name, email, password: hashed });
    await user.save();

    // Don't send password back
    const output = { id: user._id, email: user.email, name: user.name };
    return NextResponse.json({ user: output }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}