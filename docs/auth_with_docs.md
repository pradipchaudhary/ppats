Great — below is a **fully documented** authentication system (code + explanations) for **Next.js 15 + TypeScript + TailwindCSS + MongoDB (Mongoose)** using the **App Router**.
I explain **step-by-step what happens in the background** and document the code inline so you (or another developer) can read and maintain it easily.

---

# Project snapshot (what you'll get)

* Clean file structure
* Fully commented TypeScript code for server and client
* JWT auth using **HttpOnly cookies**
* Register, Login, Me, Refresh, Logout API routes
* Middleware to protect pages
* Client pages: register, login, dashboard
* Notes about deployment, scaling, and security

---

# 1) Folder structure (recommended)

```
my-auth-app/
├── app/
│   ├── api/
│   │   └── auth/
│   │       ├── register/route.ts
│   │       ├── login/route.ts
│   │       ├── refresh/route.ts
│   │       ├── logout/route.ts
│   │       └── me/route.ts
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── dashboard/page.tsx
│   ├── layout.tsx
│   └── page.tsx
├── lib/
│   ├── db.ts
│   ├── jwt.ts
│   └── cookies.ts
├── models/
│   └── User.ts
├── middleware.ts
├── components/
│   ├── AuthForm.tsx
│   └── Navbar.tsx
├── styles/
│   └── globals.css
├── .env.local
├── package.json
└── tsconfig.json
```

---

# 2) Environment variables

Create `.env.local` (DO NOT commit to git):

```
MONGODB_URI=<your mongo connection string>
JWT_ACCESS_SECRET=<strong random secret for access tokens>
JWT_REFRESH_SECRET=<strong random secret for refresh tokens>
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

---

# 3) Install dependencies

```bash
npm install next@15 react react-dom mongoose bcryptjs jsonwebtoken cookie
npm install -D typescript tailwindcss postcss autoprefixer
```

---

# 4) Database connection — `lib/db.ts`

**Purpose:** Reuse a single Mongoose connection across hot reloads (prevents multiple connections in dev).

```ts
// lib/db.ts
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;
if (!MONGODB_URI) throw new Error("MONGODB_URI is not set in env.");

declare global {
  // for dev: attach cache to global so HMR doesn't open many connections
  // eslint-disable-next-line no-var
  var _mongoose: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null } | undefined;
}

const cached = global._mongoose || (global._mongoose = { conn: null, promise: null });

export async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((m) => m);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
```

**Explanation (background):**

* When the server starts and when route handlers run, `connectDB()` ensures mongoose connects once and reuses the connection in dev and prod. This avoids connection exhaustion.

---

# 5) User model — `models/User.ts`

**Purpose:** Mongoose schema + TypeScript types for users.

```ts
// models/User.ts
import mongoose, { Document, Model } from "mongoose";

export interface IUser extends Document {
  name?: string;
  email: string;
  password: string; // hashed password
  role?: string;
}

const UserSchema = new mongoose.Schema<IUser>({
  name: { type: String, default: "" },
  email: { type: String, required: true, unique: true, index: true },
  password: { type: String, required: true },
  role: { type: String, default: "user" }
}, { timestamps: true });

export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
export default User;
```

**Explanation (background):**

* Passwords stored here must be hashed. The schema includes index on `email` for fast lookup.

---

# 6) JWT helpers — `lib/jwt.ts`

**Purpose:** Create and verify Access / Refresh tokens.

```ts
// lib/jwt.ts
import jwt from "jsonwebtoken";

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET!;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;

if (!ACCESS_SECRET || !REFRESH_SECRET) {
  throw new Error("JWT secrets are not set in env.");
}

/**
 * Short-lived access token (used for API access).
 * Payload should be minimal (id, role, etc.).
 */
export function signAccessToken(payload: object) {
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: "15m" });
}

/**
 * Longer-lived refresh token (used to mint new access tokens).
 * Typically persisted in HttpOnly cookie.
 */
export function signRefreshToken(payload: object) {
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: "7d" });
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, ACCESS_SECRET);
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, REFRESH_SECRET);
}
```

**Explanation (background):**

* Separation of secrets reduces attack surface. Access tokens short-lived; refresh tokens used for session continuity.

---

# 7) Cookie helpers — `lib/cookies.ts`

**Purpose:** Create strongly-configured cookies for tokens.

```ts
// lib/cookies.ts
import { serialize } from "cookie";

const isProd = process.env.NODE_ENV === "production";

/**
 * Create a Set-Cookie header value for the given name and value.
 * HttpOnly cookie to reduce XSS risk.
 */
export function createCookie(name: string, value: string, maxAgeSeconds: number) {
  return serialize(name, value, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: maxAgeSeconds
  });
}

/**
 * Expire cookie immediately (used during logout).
 */
export function expireCookie(name: string) {
  return serialize(name, "", {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    expires: new Date(0)
  });
}
```

---

# 8) API routes — `app/api/auth/*`

> Each route runs server-side. The flow is:
>
> * `register` hashes password and saves user
> * `login` verifies password and issues access + refresh cookies
> * `refresh` reads refresh cookie, validates, issues new tokens
> * `me` reads access token and returns user data
> * `logout` clears cookies

---

## `app/api/auth/register/route.ts`

```ts
// app/api/auth/register/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

/**
 * POST /api/auth/register
 * Body: { name, email, password }
 * - Validate input
 * - Hash password
 * - Save user
 */
export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    await connectDB();

    // ensure unique email
    const existing = await User.findOne({ email }).lean();
    if (existing) {
      return NextResponse.json({ error: "User already exists" }, { status: 409 });
    }

    // hash password (bcrypt)
    const hashed = await bcrypt.hash(password, 12);

    const user = await User.create({ name, email, password: hashed });

    // return minimal user info
    return NextResponse.json({ user: { id: user._id, email: user.email, name: user.name } }, { status: 201 });
  } catch (err) {
    console.error("Register error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
```

**Background:** hashing with bcrypt ensures the plain password never lands in the DB.

---

## `app/api/auth/login/route.ts`

```ts
// app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { signAccessToken, signRefreshToken } from "@/lib/jwt";
import { createCookie } from "@/lib/cookies";

/**
 * POST /api/auth/login
 * Body: { email, password }
 * - Validate credentials
 * - Issue access (15m) and refresh (7d) tokens as HttpOnly cookies
 */
export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    await connectDB();

    const user = await User.findOne({ email });
    if (!user) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

    // create tokens
    const accessToken = signAccessToken({ id: user._id, email: user.email, role: user.role });
    const refreshToken = signRefreshToken({ id: user._id });

    // set cookies via headers (two cookies separated by comma)
    const res = NextResponse.json({ user: { id: user._id, email: user.email, name: user.name } });
    res.headers.set("Set-Cookie", [
      createCookie("access_token", accessToken, 15 * 60),         // 15 minutes
      createCookie("refresh_token", refreshToken, 7 * 24 * 3600) // 7 days
    ].join(", "));

    return res;
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
```

**Background:**

* Access token used to authenticate API calls.
* Refresh token used to obtain new access tokens without re-login.

---

## `app/api/auth/refresh/route.ts`

```ts
// app/api/auth/refresh/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { verifyRefreshToken, signAccessToken, signRefreshToken } from "@/lib/jwt";
import { createCookie } from "@/lib/cookies";

/**
 * POST /api/auth/refresh
 * - Read refresh_token cookie
 * - Verify it, ensure user exists
 * - Issue new access and refresh tokens (rotation)
 */
export async function POST(req: Request) {
  try {
    const cookieHeader = (req.headers.get("cookie") || "");
    const cookies = Object.fromEntries(cookieHeader.split(";").map(s => {
      const [k, ...v] = s.split("=");
      return [k?.trim(), decodeURIComponent(v?.join("="))];
    }));
    const refresh = cookies["refresh_token"];
    if (!refresh) return NextResponse.json({ error: "No refresh token" }, { status: 401 });

    let payload: any;
    try {
      payload = verifyRefreshToken(refresh) as any;
    } catch (e) {
      return NextResponse.json({ error: "Invalid refresh token" }, { status: 401 });
    }

    await connectDB();
    const user = await User.findById(payload.id).lean();
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    // rotate tokens
    const newAccess = signAccessToken({ id: user._id, email: user.email, role: user.role });
    const newRefresh = signRefreshToken({ id: user._id });

    const res = NextResponse.json({ user: { id: user._id, email: user.email, name: user.name } });
    res.headers.set("Set-Cookie", [
      createCookie("access_token", newAccess, 15 * 60),
      createCookie("refresh_token", newRefresh, 7 * 24 * 3600)
    ].join(", "));
    return res;
  } catch (err) {
    console.error("Refresh error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
```

**Background:** token rotation replaces old refresh tokens with new ones to limit replay risk.

---

## `app/api/auth/me/route.ts`

```ts
// app/api/auth/me/route.ts
import { NextResponse } from "next/server";
import { verifyAccessToken } from "@/lib/jwt";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

/**
 * GET /api/auth/me
 * - Reads access_token cookie
 * - Verifies it and returns user (without password)
 */
export async function GET(req: Request) {
  try {
    const cookieHeader = (req.headers.get("cookie") || "");
    const cookies = Object.fromEntries(cookieHeader.split(";").map(s => {
      const [k, ...v] = s.split("=");
      return [k?.trim(), decodeURIComponent(v?.join("="))];
    }));
    const access = cookies["access_token"];
    if (!access) return NextResponse.json({ authenticated: false }, { status: 401 });

    let payload: any;
    try {
      payload = verifyAccessToken(access) as any;
    } catch (e) {
      return NextResponse.json({ authenticated: false, error: "Invalid or expired token" }, { status: 401 });
    }

    await connectDB();
    const user = await User.findById(payload.id).select("-password").lean();
    if (!user) return NextResponse.json({ authenticated: false, error: "User not found" }, { status: 404 });

    return NextResponse.json({ authenticated: true, user }, { status: 200 });
  } catch (err) {
    console.error("Me error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
```

---

## `app/api/auth/logout/route.ts`

```ts
// app/api/auth/logout/route.ts
import { NextResponse } from "next/server";
import { expireCookie } from "@/lib/cookies";

/**
 * POST /api/auth/logout
 * - Expires auth cookies to log user out
 */
export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.headers.set("Set-Cookie", [
    expireCookie("access_token"),
    expireCookie("refresh_token")
  ].join(", "));
  return res;
}
```

---

refreshsecretkey456# 9) Middleware — `middleware.ts`

**Purpose:** Protect UI routes server-side (redirect to `/login` if no valid access token).

```ts
// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { verifyAccessToken } from "./lib/jwt";

const PUBLIC_PATHS = ["/", "/login", "/register", "/api/auth/login", "/api/auth/register", "/api/auth/refresh"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow public paths and static assets
  if (PUBLIC_PATHS.some(p => pathname.startsWith(p)) || pathname.startsWith("/_next") || pathname.includes(".")) {
    return NextResponse.next();
  }

  // Read cookie and extract access_token
  const cookieHeader = req.headers.get("cookie") || "";
  const cookies = Object.fromEntries(cookieHeader.split(";").map(s => {
    const [k, ...v] = s.split("=");
    return [k?.trim(), decodeURIComponent(v?.join("="))];
  }));
  const access = cookies["access_token"];
  if (!access) {
    // Redirect to login page
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  try {
    verifyAccessToken(access);
    return NextResponse.next();
  } catch (err) {
    // token invalid or expired -> redirect to login (client can call refresh flow if you implement it)
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*", "/settings/:path*"]
};
```

**Background:** This runs at the edge before rendering pages, providing early protection of UI routes.

---

# 10) Client pages & components (short, documented)

### `app/layout.tsx` (root layout)

```tsx
// app/layout.tsx
import "./globals.css";
import type { ReactNode } from "react";

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

---

### `app/(auth)/register/page.tsx` (client)

```tsx
// app/(auth)/register/page.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

/**
 * Simple register form which calls /api/auth/register
 */
export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
      });
      if (!res.ok) {
        const d = await res.json();
        setErr(d.error || "Registration failed");
        return;
      }
      router.push("/login");
    } catch (e) {
      setErr("Server error");
    }
  }

  return (
    <div className="max-w-md mx-auto mt-20">
      <form onSubmit={onSubmit} className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Register</h2>
        <input placeholder="Name (optional)" value={name} onChange={e => setName(e.target.value)} className="w-full p-2 mb-2 border rounded" />
        <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-2 mb-2 border rounded" />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="w-full p-2 mb-2 border rounded" />
        {err && <div className="text-red-600 mb-2">{err}</div>}
        <button className="w-full bg-blue-600 text-white py-2 rounded">Register</button>
      </form>
    </div>
  );
}
```

---

### `app/(auth)/login/page.tsx`

```tsx
// app/(auth)/login/page.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

/**
 * Call /api/auth/login to receive cookies for access/refresh tokens.
 */
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      if (!res.ok) {
        const d = await res.json();
        setErr(d.error || "Login failed");
        return;
      }
      // login success -> redirect to protected dashboard
      router.push("/dashboard");
    } catch (e) {
      setErr("Server error");
    }
  }

  return (
    <div className="max-w-md mx-auto mt-20">
      <form onSubmit={onSubmit} className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Login</h2>
        <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-2 mb-2 border rounded" />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="w-full p-2 mb-2 border rounded" />
        {err && <div className="text-red-600 mb-2">{err}</div>}
        <button className="w-full bg-blue-600 text-white py-2 rounded">Login</button>
      </form>
    </div>
  );
}
```

---

### `app/dashboard/page.tsx` (server component example)

```tsx
// app/dashboard/page.tsx
import Link from "next/link";

/**
 * Server component that fetches /api/auth/me with credentials (cookie).
 * If unauthorized, shows message (middleware would usually redirect).
 */
export default async function DashboardPage() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || ""}/api/auth/me`, {
    method: "GET",
    credentials: "include",
    cache: "no-store",
    headers: { "Content-Type": "application/json" }
  });

  if (!res.ok) {
    return (
      <div className="max-w-xl mx-auto mt-20">
        <h2 className="text-2xl font-semibold">Unauthorized</h2>
        <p>Please <Link href="/login" className="text-blue-600">login</Link></p>
      </div>
    );
  }

  const data = await res.json();
  const user = data.user;

  return (
    <div className="max-w-xl mx-auto mt-12">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <form action="/api/auth/logout" method="post">
          <button type="submit" className="px-3 py-1 border rounded">Logout</button>
        </form>
      </div>
      <p className="mt-4">Welcome, <strong>{user.name || user.email}</strong></p>
      <pre className="mt-4 bg-gray-100 p-3 rounded text-sm">{JSON.stringify(user, null, 2)}</pre>
    </div>
  );
}
```

---

# 11) Step-by-step flow explanation (what happens when a user registers / logs in / accesses dashboard)

## Registration (user clicks Register)

1. **Client**: POST `/api/auth/register` with `{name, email, password}`.
2. **Server** (register route):

   * Calls `connectDB()` to ensure DB is connected.
   * Checks whether `email` already exists.
   * Hashes the password with `bcrypt.hash(password, 12)`.
   * Creates `User` document and returns a limited user object.
3. **Client**: On 201 response, redirect to login.

**Security note:** password never stored in plain text.

---

## Login (user submits credentials)

1. **Client**: POST `/api/auth/login` with `{email, password}`.
2. **Server** (login route):

   * `connectDB()`, find user by email.
   * `bcrypt.compare(password, user.password)` verifies password.
   * Creates `access_token` (15m) and `refresh_token` (7d) using `lib/jwt.ts`.
   * Sets both tokens as **HttpOnly cookies** via `Set-Cookie` header.
   * Returns minimal user details in JSON body.
3. **Client**: Browser stores cookies (not accessible to JS because HttpOnly). Client redirects to `/dashboard`.

**Why cookies?** They are sent automatically with requests and HttpOnly reduces XSS exposure.

---

## Accessing Protected Routes

* When user hits `/dashboard`, Next middleware runs:

  * It reads `access_token` from cookies and calls `verifyAccessToken()`.
  * If valid: `NextResponse.next()` and the page loads.
  * If missing/expired: redirect to `/login`.
* If page makes server-side fetch to `/api/auth/me`, the `me` endpoint reads `access_token` and returns user data.

**Background:** middleware protects UI routes before handler/page rendering.

---

## Token refresh (when access token expired)

* Client can call `/api/auth/refresh` to exchange a valid `refresh_token` cookie for new tokens.
* Server verifies `refresh_token`, ensures user still exists, and issues new `access_token` + rotated `refresh_token`.

**Best practice:** implement refresh token rotation + server-side revocation list (Redis) for high security.

---

## Logout

* Client calls `/api/auth/logout` (POST).
* Server returns response and sets cookie expiry to the past for access & refresh cookies.
* Browser removes cookies and user is logged out.

---

# 12) Security hardening tips (practical)

* Use **HTTPS** in production (secure cookie flag).
* Use **strong, random JWT secrets** (at least 32 chars).
* Limit login attempts via rate-limiter (Redis / API gateway).
* For very sensitive apps: store refresh tokens server-side with versioning (can revoke).
* Use Content Security Policy (CSP), X-Frame-Options, HSTS.
* Use `SameSite=Strict` for cookies if safe for your UX; `Lax` is a reasonable default.
* Consider rotating refresh tokens (current code issues fresh refresh tokens on refresh).
* Add email verification & password reset flows.

---

# 13) Scalability & production notes

* Use a **central token revocation store** (Redis) if you need to blacklist tokens (logout across devices).
* Scale Node servers behind a load balancer — cookies work fine if you use the same domain. For sticky sessions, avoid relying on server memory.
* Use connection pooling for MongoDB (handled by Mongoose).
* Add structured logging (Pino/Winston) and alerting.
* Use horizontal scaling and ensure refresh token revocation is centrally stored.

---

# 14) Commands to run locally

1. Create `.env.local` with required variables.
2. `npm install`
3. `npm run dev`
4. Open `http://localhost:3000` → register → login → dashboard

---

# 15) Next enhancements I can add (pick any)

* Password reset (email + one-time token)
* Email verification on register
* Refresh-token rotation with server-side store + revocation
* Role-based access control (RBAC)
* Replace Mongoose with Prisma (typed + migrations)
* Example unit/integration tests (Jest + Supertest)

---

If you want, I’ll:

* generate a **downloadable repo zip** containing exactly these files and working `package.json` (ready to run), **or**
* add **Forgot Password** + **Email Verification** flows next with full code and docs.

Which would you like me to do next?
