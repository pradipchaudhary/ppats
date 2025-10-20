Nice — below is a complete, production-minded authentication system you can drop into a **Next.js 15** project using **TypeScript**, **TailwindCSS**, and **MongoDB (Mongoose)** with the **App Router**.
It implements **registration, login, access/refresh JWTs (HttpOnly cookies), logout, a `/api/auth/me` endpoint**, and **middleware** to protect app routes. I also include notes on scaling, security, and where to extend.

> ⚠️ Before running: create a `.env` with `MONGODB_URI`, `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, and `NODE_ENV=development` (or production). See the `.env.example` below.

---

## Project overview (what you get)

* `app/api/auth/*` route handlers: `register`, `login`, `refresh`, `logout`, `me`
* `lib/mongoose.ts` — robust DB connect (reuses global in dev)
* `models/User.ts` — Mongoose + TypeScript
* `lib/jwt.ts` — helpers for access/refresh JWTs
* `middleware.ts` — protects pages (redirects to `/login`)
* Client pages: `app/register`, `app/login`, `app/dashboard` (dashboard is protected)
* Tailwind + global layout files
* Security & scale notes

---

## .env.example

```env
MONGODB_URI=mongodb+srv://USER:PASS@cluster0.mongodb.net/mydb?retryWrites=true&w=majority
JWT_ACCESS_SECRET=replace_with_strong_random_string_access
JWT_REFRESH_SECRET=replace_with_strong_random_string_refresh
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## package.json (dependencies)

```json
{
  "name": "nextjs-auth-example",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "bcryptjs": "^2.4.3",
    "cookie": "^0.5.0",
    "jsonwebtoken": "^9.0.0",
    "mongoose": "^7.0.0",
    "next": "15.0.0",
    "react": "18.2.0",
    "react-dom": "18.2.0"
  },
  "devDependencies": {
    "autoprefixer": "^10.4.14",
    "postcss": "^8.4.23",
    "tailwindcss": "^4.0.0",
    "typescript": "^5.1.3"
  }
}
```

---

## next.config.js

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true
  }
};

module.exports = nextConfig;
```

---

## tailwind.config.js

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx,js,jsx}", "./components/**/*.{ts,tsx,js,jsx}"],
  theme: { extend: {} },
  plugins: []
};
```

`./styles/globals.css` (add Tailwind base)

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

html, body, #__next { height: 100%; }
```

---

## lib/mongoose.ts — reliable DB connection (avoid duplicate connections in dev)

```ts
// lib/mongoose.ts
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;
if (!MONGODB_URI) throw new Error("Please define the MONGODB_URI env var.");

declare global {
  // eslint-disable-next-line no-var
  var mongooseGlobal: { conn?: typeof mongoose | null; promise?: Promise<typeof mongoose> | null } | undefined;
}

const cached = global.mongooseGlobal || (global.mongooseGlobal = { conn: null, promise: null });

export async function connect() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((m) => m);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
```

---

## models/User.ts

```ts
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
```

---

## lib/jwt.ts — token helpers

```ts
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
```

---

## app/api/auth/register/route.ts

```ts
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
```

---

## app/api/auth/login/route.ts

```ts
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
```

---

## app/api/auth/refresh/route.ts

```ts
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
```

---

## app/api/auth/logout/route.ts

```ts
// app/api/auth/logout/route.ts
import { NextRequest, NextResponse } from "next/server";
import { serialize } from "cookie";

const ACCESS_COOKIE_NAME = "access_token";
const REFRESH_COOKIE_NAME = "refresh_token";

export async function POST() {
  const expiredCookie = (name: string) =>
    serialize(name, "", { path: "/", httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", expires: new Date(0) });

  const res = NextResponse.json({ ok: true });
  res.headers.set("Set-Cookie", [expiredCookie(ACCESS_COOKIE_NAME), expiredCookie(REFRESH_COOKIE_NAME)].join(", "));
  return res;
}
```

---

## app/api/auth/me/route.ts

```ts
// app/api/auth/me/route.ts
import { NextRequest, NextResponse } from "next/server";
import { verifyAccessToken } from "@/lib/jwt";
import { connect } from "@/lib/mongoose";
import { User } from "@/models/User";

export async function GET(req: NextRequest) {
  try {
    const cookie = req.headers.get("cookie") || "";
    const cookies = Object.fromEntries(cookie.split(";").map(c => {
      const [k, ...v] = c.split("=");
      return [k?.trim(), decodeURIComponent(v?.join("="))];
    }));
    const access = cookies["access_token"];
    if (!access) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

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
```

---

## middleware.ts — protect client-facing routes

Place at project root `middleware.ts`:

```ts
// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { verifyAccessToken } from "./lib/jwt";

const PUBLIC_PATHS = ["/", "/login", "/register", "/api/auth/login", "/api/auth/register", "/api/auth/refresh"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  // allow public paths and static
  if (PUBLIC_PATHS.some(p => pathname.startsWith(p)) || pathname.startsWith("/_next") || pathname.includes(".")) {
    return NextResponse.next();
  }

  const cookie = req.headers.get("cookie") || "";
  const cookies = Object.fromEntries(cookie.split(";").map(c => {
    const [k, ...v] = c.split("=");
    return [k?.trim(), decodeURIComponent(v?.join("="))];
  }));
  const access = cookies["access_token"];

  if (!access) {
    // redirect to login
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  try {
    verifyAccessToken(access);
    return NextResponse.next();
  } catch (err) {
    // token expired or invalid - redirect to login (or call refresh route from client)
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*", "/settings/:path*", "/(protected|app)/:path*"] // adjust per your app
};
```

> Note: middleware runs **before** route handlers and can redirect users to `/login` if no valid access token. You can change the config matcher to include pages you want protected.

---

## Client pages (app router)

### app/layout.tsx

```tsx
// app/layout.tsx
import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Next Auth Example",
  description: "Auth example with Next.js 15 + TypeScript + MongoDB"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        <main className="container mx-auto p-6">{children}</main>
      </body>
    </html>
  );
}
```

### app/page.tsx (home)

```tsx
// app/page.tsx
import Link from "next/link";

export default function Home() {
  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Next.js Auth Example</h1>
      <p className="mb-4">Register, login, and navigate to a protected dashboard.</p>
      <div className="flex gap-3">
        <Link href="/register" className="px-4 py-2 bg-blue-600 text-white rounded">Register</Link>
        <Link href="/login" className="px-4 py-2 border rounded">Login</Link>
      </div>
    </div>
  );
}
```

### app/register/page.tsx

```tsx
// app/register/page.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();
      if (!res.ok) return setErr(data.error || "Registration failed");
      // optional: auto login by calling login endpoint, but we'll redirect to login
      router.push("/login");
    } catch (error) {
      setErr("Server error");
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Register</h2>
      <form onSubmit={submit} className="space-y-3">
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Name (optional)" className="w-full p-2 border rounded" />
        <input required value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="w-full p-2 border rounded" />
        <input required value={password} type="password" onChange={e => setPassword(e.target.value)} placeholder="Password" className="w-full p-2 border rounded" />
        {err && <div className="text-red-600">{err}</div>}
        <button className="px-4 py-2 bg-blue-600 text-white rounded">Register</button>
      </form>
    </div>
  );
}
```

### app/login/page.tsx

```tsx
// app/login/page.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      if (!res.ok) {
        const data = await res.json();
        return setErr(data.error || "Login failed");
      }
      // if login ok, redirect to dashboard
      router.push("/dashboard");
    } catch {
      setErr("Server error");
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Login</h2>
      <form onSubmit={submit} className="space-y-3">
        <input required value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="w-full p-2 border rounded" />
        <input required value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" className="w-full p-2 border rounded" type="password" />
        {err && <div className="text-red-600">{err}</div>}
        <button className="px-4 py-2 bg-blue-600 text-white rounded">Login</button>
      </form>
    </div>
  );
}
```

### app/dashboard/page.tsx (protected server + client interactions)

```tsx
// app/dashboard/page.tsx
import Link from "next/link";

export default async function DashboardPage() {
  // server-side fetch to /api/auth/me to get user
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || ""}/api/auth/me`, {
    method: "GET",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    // important: force cache: 'no-store' to always validate cookie
    cache: "no-store"
  });

  if (!res.ok) {
    // If middleware didn't redirect (i.e. direct fetch failed), show a fallback message.
    return (
      <div className="max-w-xl mx-auto">
        <h2 className="text-2xl font-semibold">Unauthorized</h2>
        <p>Please <Link href="/login" className="text-blue-600">login</Link>.</p>
      </div>
    );
  }

  const data = await res.json();
  const user = data.user;

  return (
    <div className="max-w-xl mx-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Dashboard</h2>
        <form action="/api/auth/logout" method="post">
          <button type="submit" className="px-3 py-1 border rounded">Logout</button>
        </form>
      </div>

      <div className="mt-4">
        <p className="text-gray-700">Welcome, <strong>{user.name || user.email}</strong></p>
        <pre className="mt-4 bg-gray-100 p-3 rounded text-sm">{JSON.stringify(user, null, 2)}</pre>
      </div>
    </div>
  );
}
```

> Note: `fetch` to `/api/auth/me` is server-side in the app router page. If you prefer client-side, you can fetch from client and handle refresh flows.

---

## Extra: Logout button client-side (optional)

If you want a client-side logout using `fetch`:

```ts
async function logout() {
  await fetch("/api/auth/logout", { method: "POST" });
  window.location.href = "/login";
}
```

---

## Security & Scalability Notes (short & actionable)

### Security

* **HttpOnly cookies** for tokens prevent most XSS token theft.
* Use `SameSite=Lax` or `Strict` to reduce CSRF risk. For highly-sensitive apps, implement CSRF tokens in addition.
* **Short access token** lifetime (15m) + longer refresh token (7d) reduces risk.
* Use **bcrypt** with cost 12+.
* Always run under **HTTPS** in production.
* Rate-limit login attempts to prevent brute force (use Redis or API gateway).
* Consider rotating refresh tokens and storing them server-side (refresh token revocation/rotation) for higher security.

### Scalability & reliability

* **Mongoose connection pooling** is automatic; reuse connections (we used a global cache).
* For many API instances use **centralized token revocation store** (Redis) and blacklists for logout/revoked refresh tokens.
* Use **indexes** on `email` and other frequently queried fields.
* Use **logging** (e.g. winston/pino) and central logs for monitoring.
* Add **health-check** endpoints.
* Use a **CDN + edge** for static files, and optionally run auth refresh on client when token expires.

### Further improvements

* Add **2FA** / email verification.
* Add **role-based access control (RBAC)**.
* Implement refresh token rotation with server-side storage (more secure).
* Add **helmet**, **secure headers**, CSP, HSTS for production.
* Use **OWASP** checklists.

---

## How to run

1. `npm install`
2. create `.env` file with `MONGODB_URI`, `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, and `NEXT_PUBLIC_APP_URL=http://localhost:3000`
3. `npm run dev`
4. Visit `http://localhost:3000` — register → login → dashboard.

---

If you want, I can:

* generate this as a ready-to-download repo (zipped) you can `git clone`/run, or
* replace Mongoose with Prisma + MongoDB (if you prefer Prisma typing + migrations),
* add refresh-token rotation (server-side store + revoke list),
* implement rate-limiting + login blocking,
* or create a sequence diagram / PNG of the auth flow for docs.

Which of those would you like next?
