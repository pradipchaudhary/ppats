# Passport Profile Automation Tools - AI Agent Instructions

This is a Next.js 15 application for automating Nepali passport data extraction, profile creation, and FEIMS integration. Below are key guidelines for AI agents working in this codebase.

## Core Architecture & Data Flow

- **App Structure**: Uses Next.js 15 App Router (`app/` directory) with TypeScript and Tailwind 4
- **Authentication**: Custom JWT-based auth with MongoDB persistence:
  - Server: JWT in HttpOnly cookies (`access_token`/`refresh_token`) verified by `lib/jwt.ts`
  - Client: Protected routes in `middleware.ts`, client-side auth state via React context
  - DB: Mongoose models with connection pooling (`lib/mongoose.ts`)

## Key Integration Points

1. **Passport OCR Flow**:
   - Upload handling in `app/api/passport/upload/route.ts`
   - Tesseract.js integration for OCR (planned)
   - Generated email pattern: `firstNameLastName@something.com`

2. **FEIMS Integration**:
   - Target: `https://feims.dofe.gov.np/Common-Login.aspx`
   - Passport-based login flow
   - OTP verification handling 

## Core Files & Patterns

### Authentication & Users
- **API Routes** (`app/api/auth/*`): 
  - `login/route.ts`: Issues JWTs in HttpOnly cookies
  - `register/route.ts`: User creation with bcrypt password hashing
  - `refresh/route.ts`: Token refresh with rotation
  - `me/route.ts`: Current user endpoint
- **Models** (`models/User.ts`): Mongoose schema with TypeScript types
- **JWT Helpers** (`lib/jwt.ts`): Token signing/verification
- **DB Connection** (`lib/mongoose.ts`): Pooled Mongoose connection

### UI Components & Styling
- Components are Server Components by default
- Client components marked with `"use client"`
- Tailwind utilities in components, CSS variables in `styles/globals.css`
- Dark mode support via CSS variables and `prefers-color-scheme`

## Common Operations & Patterns

### MongoDB Operations
```typescript
// Always await connection before DB ops
import { connect } from "@/lib/mongoose";
await connect();

// Use .lean() for read-only queries
const user = await User.findById(id).lean();
```

### Protected Routes
```typescript
// Server component auth check
import { verifyAccessToken } from "@/lib/jwt";
const token = cookies().get("access_token");
const payload = token ? verifyAccessToken(token) : null;
```

### Error Handling
- API routes use consistent error response format
- Client-side error boundaries planned
- Validation errors returned as `{error: string}`

## Environment & Dependencies

Required ENV variables (see `.env.example`):
```
MONGODB_URI=mongodb://...
JWT_ACCESS_SECRET=strong_random_string
JWT_REFRESH_SECRET=different_strong_random_string
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Key commands (PowerShell):
```powershell
npm install        # Install dependencies
npm run dev       # Start dev server (uses Turbopack)
npm run build     # Production build
npm run lint      # Run ESLint
```

## Common Gotchas & Best Practices

1. **Server/Client Separation**:
   - Never use `localStorage` or browser APIs in Server Components
   - Use `"use client"` directive for client-side components
   - Keep auth token handling server-side via cookies

2. **Database Access**:
   - Always `await connect()` before DB operations
   - Use `.lean()` for read-only queries
   - Don't re-declare Mongoose models - import from `models/`

3. **Auth Flow**:
   - Use middleware for route protection
   - HttpOnly cookies for tokens
   - Token refresh handled server-side
   - FEIMS login requires passport data validation first

4. **OCR & Data Processing**:
   - Passport image validation before OCR
   - Email generation follows firstNameLastName pattern
   - Structured data extraction from OCR results

## Styles & Tailwind CSS

Global styles live in `styles/globals.css`:
- CSS variables for theming (light/dark mode)
- Tailwind utilities in components
- Base styles and colors in CSS variables
- Dark mode via `prefers-color-scheme`

Example style patterns:
```css
/* styles/globals.css */
:root {
  --color-bg: #ffffff;
  --color-text: #0a0a0a;
}

@media (prefers-color-scheme: dark) {
  :root {
    --color-bg: #0d0d0d;
    --color-text: #fafafa;
  }
}
```

## Further Resources & Tools
- JWT Debugger: https://jwt.io
- Tesseract.js Docs: https://tesseract.projectnaptha.com/
- Next.js App Router: https://nextjs.org/docs/app

```
