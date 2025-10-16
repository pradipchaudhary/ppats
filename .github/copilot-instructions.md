Purpose
This workspace is a small Next.js (app router) TypeScript app with server-side MongoDB auth and a minimal client-side auth shim. The guidance below highlights the patterns, integration points, and quick commands an AI coding assistant should use to be productive when changing or adding features.

High-level architecture
- App router: top-level pages and API routes live in `app/` (uses Next 15 app router conventions).
- Server vs Client: components are Server Components by default. Client-only modules use `"use client"` at the top (see `context/AuthContext.tsx`).
```instructions
Purpose
This workspace is a small Next.js (app router) TypeScript app with server-side MongoDB auth and a minimal client-side auth shim. The guidance below highlights the patterns, integration points, and quick commands an AI coding assistant should use to be productive when changing or adding features.

High-level architecture
- App router: top-level pages and API routes live in `app/` (uses Next 15 app router conventions).
- Server vs Client: components are Server Components by default. Client-only modules use `"use client"` at the top (see `context/AuthContext.tsx`).
- Auth and persistence:
  - Client auth is a thin shim in `context/AuthContext.tsx` that uses `services/authService.ts` (a localStorage-based mock on the client).
  - Server auth uses `lib/auth.ts` which reads cookie `tm_auth` via `next/headers`, verifies it with `lib/jwt.ts`, and loads the user from `models/User.ts` (Mongoose). Ensure `lib/mongodb.ts` (DB connector) is awaited before DB ops.

Key files to reference
- `app/` — primary UI and API route folders (look for `app/api/auth/login/route.ts` and `app/api/auth/logout/route.ts`).
- `context/AuthContext.tsx` — client-side auth provider and usage example (`useAuth()` hook).
- `services/authService.ts` — client-side service (localStorage mock) used by `AuthContext`.
- `lib/auth.ts` — server helper to extract the current user from incoming requests. Use this from server components or server API routes.
- `lib/jwt.ts` — JWT helpers used for token verification/creation (server-side).
- `lib/mongodb.ts` — Mongoose connection helper; import/await it before model usage.
- `models/User.ts` — Mongoose `User` schema and default export; prefer `User.findById(...)` + `.lean()` for read-only server responses.
- `types/index.ts` — shared TypeScript shapes used across client and server.

Patterns & conventions (practical, code-searchable)
- Server-only code: rely on Next's server environment (no `window` or `localStorage`). Use `lib/auth.ts` to read cookies (`tm_auth`) and return a sanitized `{ id, email, name }` object.
- Client-only code: mark files with `"use client"` and use `services/*` helpers which currently use `localStorage` (see `getCurrentUser()` in `services/authService.ts`). Avoid calling these from server components.
- DB access: always `await db` (from `lib/mongodb.ts`) in server utilities before touching models. Mongoose models export default (see `models/User.ts`).
- API routes: follow app-router API route signature under `app/api/.../route.ts`. For auth flow, set the `tm_auth` cookie server-side and clear on logout.
- Tokens & cookie name: JWT flows use `tm_auth` cookie; token payload `sub` is the user id (see `lib/auth.ts`).

Developer workflows / commands
- Install deps and run dev server (PowerShell):
  npm install
  npm run dev
- Build / prod check (Turbopack flags are in `package.json`):
  npm run build
  npm start
- Linting:
  npm run lint

Important gotchas for automation
- Don't call client-only helpers (those using `localStorage`) from server components or server-side functions. Instead use `lib/auth.ts` or server logic.
- Some services are mocked on the client (`services/authService.ts`) — when adding real server-backed behavior, update both client service (for dev UX) and server API routes.
- Mongoose model names and default exports: import `User` from `models/User.ts` (default export) — do not re-declare the schema in multiple files.

When editing or adding features (concrete examples)
- Add a server-only helper to get current user in a new server component:
  import { getUserFromRequest } from 'lib/auth';
  const user = await getUserFromRequest(); // null | {id,email,name}
- Add an API auth route in `app/api/auth/verify/route.ts` using Next App Router handlers and `lib/auth.ts`.
- For UI changes that depend on auth, wrap with `AuthProvider` from `context/AuthContext.tsx` and call `useAuth()` in client components.

What I can't infer automatically
- Deployment and environment variable conventions (MongoDB URI, JWT secret) are not present in the repo files we scanned. Search for `.env` usage or ask a human for secrets/CI details when adding production integrations.

If this is helpful or you want changes
- Tell me what to emphasize (tests, CI, or more API examples). I can iterate — would you like me to add a short example for creating a new API route that sets the `tm_auth` cookie?

Files referenced: `package.json`, `app/`, `context/AuthContext.tsx`, `services/authService.ts`, `lib/auth.ts`, `lib/jwt.ts`, `lib/mongodb.ts`, `models/User.ts`, `types/index.ts`.

Styles & Tailwind
- Global styles live in `app/globals.css`. The file imports Tailwind (`@import "tailwindcss";`) and uses CSS variables and Tailwind's `@apply` for base styles. Example from this repo:
  ```css
  /* app/globals.css */
  @import "tailwindcss";

  :root { --background: #ffffff; --foreground: #171717; --font-sans: Arial, Helvetica, sans-serif; }

  body { @apply antialiased bg-white text-neutral-900 font-sans; }
  ```
- The `app/globals.css` contains an optional (commented) dark theme using `prefers-color-scheme`. If you enable a dark theme, prefer keeping colors in CSS variables so components can reference them.
- PostCSS/Tailwind are configured via devDependencies (see `package.json`) and `postcss.config.mjs`. After changing Tailwind/PostCSS config, restart the dev server (`npm run dev`).
- Conventions:
  - Prefer placing global rules in `app/globals.css` only — avoid importing global CSS from component files.
  - Use Tailwind utilities inside components, and reserve `@apply` for shared base styles.
  - Do not use client-only APIs (like `localStorage`) from CSS/Server Components — styles must be static or based on CSS variables/classes.

```
