# Telehealth Patient Intake

Vite + React 19 + React Router + Tailwind CSS v4 + Convex + Better Auth

A multi-step patient intake funnel for telehealth applications.

## Features

- 6-step patient intake funnel (Demographics, Address, Insurance, Medical History, Consent, Review)
- File upload for insurance cards
- Admin dashboard with patient management
- Role-based access control (Admin/Patient)
- Better Auth authentication

## Local Development Setup

### First Time Setup

```bash
# 1. Install dependencies
pnpm install

# 2. Start Convex (answer "No" to login prompt for local-only mode)
npx convex dev

# 3. In another terminal, set environment variables
npx convex env set BETTER_AUTH_SECRET "your-secret-key-must-be-at-least-32-characters-long"
npx convex env set SITE_URL "http://localhost:5173"

# 4. Seed all data (admin user + insurance providers + medical conditions)
npx convex run seed/admin:seedAdmin
npx convex run modules/patientIntake/seed:seedAll

# 5. Start the frontend
pnpm dev:vite
```

Admin credentials: `admin1@gmail.com` / `adminadmin`

### Running After Initial Setup

```bash
pnpm dev
```

Opens at `http://localhost:5173`

## Commands

```bash
pnpm dev          # Start Convex + Vite dev servers
pnpm dev:vite     # Start Vite only
pnpm lint         # TypeScript check + ESLint
pnpm build        # Build for production (Vercel)
pnpm build:prod   # Deploy Convex and build for production
```

## Convex CLI

```bash
npx convex dev                              # Start dev server
npx convex env set KEY val                  # Set environment variable
npx convex run seed/admin:seedAdmin         # Create admin user
npx convex run modules/patientIntake/seed:seedAll  # Seed intake reference data
npx convex logs                             # View function logs
```

## Production Deployment

### Deploy Convex Backend

```bash
npx convex deploy
```

Set production environment variables:
```bash
npx convex env set BETTER_AUTH_SECRET "your-production-secret"
npx convex env set SITE_URL "https://your-vercel-app.vercel.app"
npx convex env set RESEND_API_KEY "your-resend-api-key"  # Optional: for emails
npx convex env set AUTH_EMAIL "noreply@yourdomain.com"   # Optional: for emails
```

Seed production data:
```bash
npx convex run seed/admin:seedAdmin --prod
npx convex run modules/patientIntake/seed:seedAll --prod
```

### Deploy to Vercel

1. Push to GitHub
2. Import project in Vercel
3. Add environment variable:
   - `VITE_CONVEX_URL` = your Convex production URL
4. Deploy

## Documentation

See `CLAUDE.md` for detailed architecture and development guidelines.
