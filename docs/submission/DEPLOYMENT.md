# Deployment Configuration

## Web Application
- **Hosting Provider:** BLOCKED (e.g. Vercel)
- **Deployment URL:** BLOCKED - Requires User Setup
- **Build Command:** `npm run build`
- **Environment Variables:**
  - `VITE_API_URL` (URL of the backend)
- **Routing Configuration:** Single Page Application (SPA) routing handling required if not hosted on Vercel natively.

## Backend
- **Hosting Provider:** BLOCKED (e.g. Render / Heroku)
- **Deployment URL:** BLOCKED - Requires User Setup
- **Build Command:** `npm run build`
- **Startup Command:** `npm start`
- **Environment Variables:**
  - `DATABASE_URL`
  - `JWT_SECRET`
  - `JWT_EXPIRES_IN`
  - `CLIENT_ORIGIN` (The URL of the Web Application)
  - `PORT`
  - `NODE_ENV` (Set to "production")
- **CORS Origin:** Needs to be explicitly set to the Web Application URL for production.

## Database
- **PostgreSQL Provider:** Neon / Supabase / Render
- **Prisma Migration Procedure:** During deployment build step, run `npx prisma generate` and `npx prisma migrate deploy` to safely apply migrations to the production database.

## Mobile
- **Production API URL:** Requires the backend URL in `EXPO_PUBLIC_API_URL`
- **Android Build Command:** `eas build -p android --profile preview` (Requires EAS CLI setup and Expo account)
- **APK/Distribution Method:** Output APK can be sideloaded, or distributed via Firebase App Distribution. BLOCKED - Requires user execution.
