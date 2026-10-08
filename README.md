# TaskFlow

TaskFlow is a comprehensive project and task management system built with a focus on editorial design, spatial navigation, and distraction-free productivity. It features a full-stack architecture with a React Web frontend, a React Native Mobile app, and a robust Node.js/Express backend powered by PostgreSQL and Prisma.

## 1. TaskFlow Overview
TaskFlow provides users with an intuitive interface to create, track, and manage projects and their associated tasks. Users can search and filter their tasks by priority and status, maintaining focus without unnecessary noise.

## 2. Features
- **User Authentication**: Secure registration, login, and JWT-based session management.
- **Projects**: Create, read, update, and delete projects. Only view your own projects.
- **Tasks**: Granular task management (CRUD) linked directly to projects. Toggle task priorities (LOW, MEDIUM, HIGH) and statuses.
- **Dashboard**: Quick overview of metrics including total projects, active tasks, and completion metrics.
- **Real-Time Sync**: Using TanStack Query for smart cache invalidation.
- **Responsive Web UI & Native Mobile App**: Identical functionality provided seamlessly across all screen sizes.

## 3. Technology Stack
- **Frontend (Web)**: React 18, Vite, React Router, TanStack Query, Framer Motion
- **Frontend (Mobile)**: React Native (Expo), React Navigation, TanStack Query, LayoutAnimation
- **Backend**: Node.js, Express, JSON Web Tokens (JWT)
- **Database**: PostgreSQL, Prisma ORM
- **Styling**: Custom CSS and React Native StyleSheets (Ink / Pollen / Persimmon Theme)

## 4. Architecture
```
React Web (Client)  <---->  Node.js + Express (API)  <----> PostgreSQL (Database)
                                     ^
                                     |
React Native (Mobile Client) <-------+
```
A single, centralized backend handles business logic and security for both the web and mobile interfaces.

## 5. Repository Structure
```
TaskFlow/
├── web/          # React Web Application
├── mobile/       # React Native Expo Mobile Application
├── backend/      # Node.js Express API Server
├── docs/         # API Docs, ER Diagrams, Submission Checklists
├── README.md
├── .env.example
└── .gitignore
```

## 6. Prerequisites
- Node.js (v18+)
- PostgreSQL installed and running locally, or a remote Postgres URL (e.g., Neon).
- Android Studio / Emulator (Optional for mobile development)
- Expo Go App (For physical device testing)

## 7. Backend Setup
```bash
cd backend
npm install
```

## 8. PostgreSQL Setup
Ensure you have a PostgreSQL database running. Create an empty database (e.g. `taskflow_db`).

## 9. Prisma Setup
```bash
# Push the schema to your database
npx prisma db push
# Generate the Prisma Client
npx prisma generate
```

## 10. Environment Variables
Copy the `.env.example` file located at the root (or inside the backend) to `.env` in the `backend/` directory:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/taskflow_db"
JWT_SECRET="your-super-secret-key"
PORT=3000
NODE_ENV="development"
```

## 11. Web Setup
```bash
cd web
npm install
# Start the Vite development server
npm run dev
```

## 12. Mobile Setup
```bash
cd mobile
npm install
# Start the Expo bundler
npm start
```
*Note: Ensure `EXPO_PUBLIC_API_URL` is configured if testing on a physical device.*

## 13. API Documentation
Detailed API documentation and payload examples can be found in `docs/API_DOCUMENTATION.md` or `docs/submission/API_DOCUMENTATION.md`.

## 14. Running Everything Locally
1. Start the backend: `cd backend && npm run dev`
2. Start the web frontend: `cd web && npm run dev`
3. Start the mobile app: `cd mobile && npm start`

## 15. Production Configuration
- **Web**: Run `npm run build` to generate static files.
- **Backend**: Set `NODE_ENV=production` and ensure CORS allows the deployed web URL.
- **Mobile**: Build using EAS `eas build -p android --profile preview`.

## 16. Deployed Web URL
**Status:** [BLOCKED] Requires user to set up a Vercel/Netlify project.

## 17. Deployed Backend URL
**Status:** [BLOCKED] Requires user to set up a Render/Heroku app.

## 18. Android APK/Distribution
**Status:** [BLOCKED] Requires user to trigger an EAS build.

## 19. Mobile → Deployed Backend Setup
Once the backend is deployed, create a `.env` in the `mobile/` directory:
```env
EXPO_PUBLIC_API_URL="https://your-deployed-backend-url.com/api"
```

## 20. Test Account / Test Data
- **Email:** `test@example.com`
- **Password:** `password123`
*(Note: Create this account using the Registration screen if the database is fresh).*

## 21. Troubleshooting
- **Network Error on Mobile:** If running on a physical device, `localhost` points to the phone. Change `EXPO_PUBLIC_API_URL` to your computer's local IP (e.g., `192.168.1.5:3000`).
- **Prisma Errors:** Ensure `DATABASE_URL` is correctly formatted and the database server is running.

## 22. Security Notes
- Passwords are cryptographically hashed using `bcrypt`.
- Authentication uses secure JSON Web Tokens (JWT).
- All protected API routes verify ownership. Users cannot query, edit, or delete data belonging to other users.
- Raw SQL is entirely avoided via Prisma ORM to prevent SQL Injection.

## 23. Project Submission Checklist
Check out `docs/submission/SUBMISSION_CHECKLIST.md` and `docs/submission/TEST_REPORT.md` for a comprehensive verification of all features.
