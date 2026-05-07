# KinderCare Management System

A production-ready, full-stack Kindergarten Management System built with React, Node.js, Prisma ORM, and Supabase.

---

## Table of Contents

1. [Overview](#overview)
2. [Tech Stack](#tech-stack)
3. [Application Features](#application-features)
4. [Project Structure](#project-structure)
5. [Prerequisites](#prerequisites)
6. [Supabase Setup](#supabase-setup)
7. [Local Development Setup](#local-development-setup)
8. [Database Setup](#database-setup)
9. [Environment Variables](#environment-variables)
10. [Running the Application](#running-the-application)
11. [PWA Icon Generation](#pwa-icon-generation)
12. [Deployment](#deployment)
13. [Default Credentials](#default-credentials)
14. [API Reference](#api-reference)
15. [Architecture Decisions](#architecture-decisions)

---

## Overview

KinderCare is a multi-role SaaS web application designed for kindergartens and early education centers. It supports three user roles — **Admin**, **Staff**, and **Student** — each with a dedicated dashboard and feature set. The app is installable as a Progressive Web App (PWA) with offline support.

---

## Tech Stack

| Layer      | Technology                                  |
|------------|---------------------------------------------|
| Frontend   | React 18, Vite, Tailwind CSS, React Router  |
| State      | Context API + Supabase Auth                 |
| Charts     | Recharts                                    |
| Icons      | Lucide React                                |
| HTTP       | Axios                                       |
| PWA        | vite-plugin-pwa + Workbox                   |
| Backend    | Node.js, Express.js                         |
| ORM        | Prisma 5                                    |
| Database   | Supabase PostgreSQL                         |
| Auth       | Supabase Authentication                     |
| Validation | express-validator                           |
| Security   | Helmet, CORS, express-rate-limit            |
| Logging    | Morgan                                      |
| Deployment | Vercel (frontend) + Render (backend)        |

---

## Application Features

### Admin Dashboard
- Full user management (create, activate, deactivate users)
- Mark and view staff attendance by month
- Salary management with deductions and bonuses
- Send targeted notifications (All / Staff / Students)
- Analytics dashboard with charts (attendance trends, breakdowns)

### Staff Dashboard
- View and manage assigned classes
- Create subjects for classes
- Mark student attendance
- Create, publish, and manage quizzes
- View notifications

### Student Dashboard
- View personal attendance with monthly summary
- View enrolled subjects and teachers
- Take quizzes (auto-scored multiple choice)
- View notifications
- Edit personal profile

---

## Project Structure

```
lv/
├── frontend/
│   ├── public/
│   │   ├── icons/             # PWA icons (192x192, 512x512)
│   │   └── offline.html       # PWA offline fallback
│   ├── src/
│   │   ├── api/               # Axios API layer (auth, admin, staff, student)
│   │   ├── components/
│   │   │   ├── common/        # Button, Card, Modal, Table, Badge, etc.
│   │   │   └── layout/        # Sidebar, Header, DashboardLayout
│   │   ├── context/           # AuthContext (Supabase session management)
│   │   ├── hooks/             # useAuth
│   │   ├── pages/
│   │   │   ├── auth/          # Login page
│   │   │   ├── admin/         # Dashboard, Users, Attendance, Salary, etc.
│   │   │   ├── staff/         # Dashboard, Classes, Attendance, Quizzes
│   │   │   └── student/       # Dashboard, Attendance, Subjects, Quizzes, Profile
│   │   ├── routes/            # ProtectedRoute, RoleRoute
│   │   ├── utils/             # Date formatters, helpers
│   │   ├── App.jsx            # Route definitions
│   │   └── main.jsx           # React entry point
│   ├── vite.config.js         # Vite + PWA config
│   ├── tailwind.config.js
│   └── package.json
│
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma      # Full database schema
│   │   └── seed.js            # Demo user seed
│   ├── src/
│   │   ├── controllers/       # Request handlers
│   │   ├── middleware/        # auth, authorize, errorHandler
│   │   ├── routes/            # auth, admin, staff, student
│   │   ├── services/          # Business logic layer
│   │   └── utils/             # Prisma client, Supabase admin client
│   ├── server.js              # Express app entry
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## Prerequisites

Install these before proceeding:

1. **Node.js 18+** — https://nodejs.org/
2. **npm 9+** — comes with Node.js
3. **Git** — https://git-scm.com/
4. **Supabase account** — https://supabase.com/ (free tier is sufficient)

---

## Supabase Setup

### Step 1 — Create a Supabase Project

1. Go to https://supabase.com/ and sign up / log in
2. Click **New Project**
3. Set a project name (e.g., `kindercare`)
4. Set a strong database password — **save this**
5. Choose a region close to you
6. Click **Create new project** and wait ~2 minutes

### Step 2 — Get Your Keys

In your Supabase project dashboard:

1. Go to **Settings** → **API**
2. Copy:
   - `Project URL` → this is your `SUPABASE_URL`
   - `anon / public` key → this is your `VITE_SUPABASE_ANON_KEY`
   - `service_role` key → this is your `SUPABASE_SERVICE_ROLE_KEY` (**keep this secret!**)

### Step 3 — Get Database URL

1. Go to **Settings** → **Database**
2. Find **Connection string** → choose **URI** tab
3. Copy the connection string — replace `[YOUR-PASSWORD]` with your database password
4. This is your `DATABASE_URL`

### Step 4 — Configure Auth Settings

1. Go to **Authentication** → **Settings**
2. Under **Email Auth**, ensure **Enable email confirmations** is set to your preference
   - For development: **disable** email confirmations (simplifies testing)
3. Under **JWT Settings**, note the JWT expiry (default 3600s is fine)

---

## Local Development Setup

### Step 1 — Clone and Navigate

```bash
# If using git:
git clone <your-repo-url>
cd lv

# Or just navigate to the project folder:
cd C:\Users\CICT\Desktop\lv
```

### Step 2 — Install Backend Dependencies

```bash
cd backend
npm install
```

### Step 3 — Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

---

## Database Setup

### Step 1 — Create Backend .env

In the `backend/` folder, create a `.env` file:

```bash
# Windows PowerShell:
cd C:\Users\CICT\Desktop\lv\backend
copy .env.example .env
```

Edit `backend/.env` with your actual values:

```env
DATABASE_URL="postgresql://postgres:[YOUR-DB-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"
SUPABASE_URL="https://[YOUR-PROJECT-REF].supabase.co"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
JWT_SECRET="any-random-long-string-minimum-32-characters"
PORT=5000
NODE_ENV=development
FRONTEND_URL="http://localhost:5173"
```

### Step 2 — Run Prisma Migration

```bash
cd C:\Users\CICT\Desktop\lv\backend
npx prisma migrate dev --name init
```

This creates all database tables in your Supabase PostgreSQL database.

### Step 3 — Generate Prisma Client

```bash
npx prisma generate
```

### Step 4 — Seed Demo Users (Optional)

```bash
node prisma/seed.js
```

This creates three demo accounts:
- `admin@kindercare.com` / `Admin@1234`
- `staff@kindercare.com` / `Staff@1234`
- `student@kindercare.com` / `Student@1234`

> **Note:** The seed script creates users in both Supabase Auth AND your database. It requires valid Supabase credentials in `.env`.

---

## Environment Variables

### Frontend (`frontend/.env`)

Create `frontend/.env`:

```bash
cd C:\Users\CICT\Desktop\lv\frontend
copy .env.example .env
```

Edit `frontend/.env`:

```env
VITE_SUPABASE_URL=https://[YOUR-PROJECT-REF].supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
VITE_API_URL=http://localhost:5000/api
```

### Backend (`backend/.env`)

Already covered in the Database Setup section above.

---

## Running the Application

### Start Backend (Terminal 1)

```bash
cd C:\Users\CICT\Desktop\lv\backend
npm run dev
```

You should see:
```
KinderCare API running on port 5000 [development]
```

Test it: open http://localhost:5000/health in your browser.

### Start Frontend (Terminal 2)

```bash
cd C:\Users\CICT\Desktop\lv\frontend
npm run dev
```

You should see:
```
  VITE v5.x.x  ready in 300ms
  ➜  Local:   http://localhost:5173/
```

Open http://localhost:5173 in your browser.

---

## PWA Icon Generation

The PWA requires icon files at:
- `frontend/public/icons/icon-192x192.png`
- `frontend/public/icons/icon-512x512.png`

**To generate them:**

1. Open `frontend/public/generate-icons.html` in a browser
2. Right-click the first canvas → **Save image as** → `icon-192x192.png`
3. Right-click the second canvas → **Save image as** → `icon-512x512.png`
4. Move both files to `frontend/public/icons/`

Or use any 192×192 and 512×512 PNG images of your choice.

---

## Deployment

### Frontend → Vercel

1. Push your project to GitHub
2. Go to https://vercel.com/ → **New Project**
3. Import your repository
4. Set **Root Directory** to `frontend`
5. Set **Build Command** to `npm run build`
6. Set **Output Directory** to `dist`
7. Add Environment Variables:
   - `VITE_SUPABASE_URL` = your Supabase URL
   - `VITE_SUPABASE_ANON_KEY` = your anon key
   - `VITE_API_URL` = your backend URL (from Render, e.g., `https://kindercare-api.onrender.com/api`)
8. Click **Deploy**

### Backend → Render

1. Go to https://render.com/ → **New Web Service**
2. Connect your GitHub repository
3. Set **Root Directory** to `backend`
4. Set **Build Command** to:
   ```
   npm install && npx prisma generate && npx prisma migrate deploy
   ```
5. Set **Start Command** to:
   ```
   node server.js
   ```
6. Add Environment Variables (copy from your `.env`):
   - `DATABASE_URL`
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `JWT_SECRET`
   - `NODE_ENV` = `production`
   - `FRONTEND_URL` = your Vercel deployment URL
7. Click **Create Web Service**

> **Free tier note:** Render free services spin down after 15 minutes of inactivity. The first request after sleep takes ~30 seconds.

---

## Default Credentials

After running the seed script:

| Role    | Email                      | Password      |
|---------|----------------------------|---------------|
| Admin   | admin@kindercare.com       | Admin@1234    |
| Staff   | staff@kindercare.com       | Staff@1234    |
| Student | student@kindercare.com     | Student@1234  |

The Login page also has quick-fill demo buttons for these credentials.

---

## API Reference

All endpoints require `Authorization: Bearer <supabase-access-token>` except the health check.

### Auth
| Method | Endpoint       | Description           |
|--------|----------------|-----------------------|
| GET    | /api/auth/me   | Get current user data |

### Admin (requires ADMIN role)
| Method | Endpoint                        | Description              |
|--------|---------------------------------|--------------------------|
| GET    | /api/admin/users                | List all users           |
| POST   | /api/admin/users                | Create new user          |
| PATCH  | /api/admin/users/:id/deactivate | Deactivate user          |
| PATCH  | /api/admin/users/:id/reactivate | Reactivate user          |
| GET    | /api/admin/analytics            | Get analytics data       |
| GET    | /api/admin/attendance           | Get staff attendance     |
| POST   | /api/admin/attendance           | Mark staff attendance    |
| GET    | /api/admin/salary               | Get salary records       |
| POST   | /api/admin/salary               | Create/update salary     |
| POST   | /api/admin/notifications        | Send notification        |

### Staff (requires STAFF role)
| Method | Endpoint                              | Description             |
|--------|---------------------------------------|-------------------------|
| GET    | /api/staff/classes                    | Get assigned classes    |
| POST   | /api/staff/classes                    | Create class            |
| PATCH  | /api/staff/classes/:id                | Update class            |
| POST   | /api/staff/classes/:id/students       | Add student to class    |
| DELETE | /api/staff/classes/:id/students/:sid  | Remove student          |
| GET    | /api/staff/subjects                   | Get assigned subjects   |
| POST   | /api/staff/subjects                   | Create subject          |
| POST   | /api/staff/attendance                 | Mark attendance         |
| GET    | /api/staff/attendance                 | Get class attendance    |
| GET    | /api/staff/quizzes                    | Get quizzes             |
| POST   | /api/staff/quizzes                    | Create quiz             |
| PATCH  | /api/staff/quizzes/:id                | Update/publish quiz     |
| GET    | /api/staff/quizzes/:id/submissions    | Get submissions         |
| GET    | /api/staff/notifications              | Get notifications       |
| PATCH  | /api/staff/notifications/:id/read     | Mark as read            |

### Student (requires STUDENT role)
| Method | Endpoint                             | Description             |
|--------|--------------------------------------|-------------------------|
| GET    | /api/student/profile                 | Get profile             |
| PATCH  | /api/student/profile                 | Update profile          |
| GET    | /api/student/attendance              | Get attendance          |
| GET    | /api/student/subjects                | Get subjects            |
| GET    | /api/student/quizzes                 | Get available quizzes   |
| GET    | /api/student/quizzes/:id             | Get quiz questions      |
| POST   | /api/student/quizzes/:id/submit      | Submit quiz answers     |
| GET    | /api/student/notifications           | Get notifications       |
| PATCH  | /api/student/notifications/:id/read  | Mark as read            |

---

## Architecture Decisions

### Why Supabase Auth instead of custom JWT?
Supabase Auth handles token refresh, session persistence, and security best practices out of the box. The backend validates Supabase JWT tokens using the Admin SDK, so no custom JWT signing is needed.

### Why Prisma over raw SQL or Supabase client?
Prisma provides type-safe queries, migration management, and a clean schema definition. For a multi-table system with complex relations (classes, subjects, attendance, quizzes), Prisma's relational queries are far more maintainable.

### Why Context API over Redux?
The app state is primarily auth state + per-page local state. Context API with `useEffect` data fetching per page is simpler, has zero boilerplate, and is sufficient for this scale.

### Database Schema Design
- `User` maps 1:1 to either `StudentProfile` or `StaffProfile`
- `Class` → `Subject` → `Quiz` forms the academic hierarchy
- `Attendance` and `StaffAttendance` are separate models with unique constraints on `(studentId, classId, date)` and `(staffId, date)` respectively, preventing duplicate records
- `Notification` → `UserNotification` is a junction table enabling targeted delivery to specific roles with per-user read status

### PWA Strategy
- Uses `vite-plugin-pwa` with Workbox for automatic service worker generation
- `autoUpdate` register type ensures users always get the latest version
- API calls use `NetworkFirst` caching — fresh data preferred, falls back to cache offline

---

## Troubleshooting

**"User not found or deactivated"** on login:
- Make sure you ran `node prisma/seed.js` OR manually created a user via the Admin panel
- Ensure the user's `id` in the `users` table matches their Supabase Auth UID

**Prisma migration fails:**
- Check your `DATABASE_URL` is correct
- Ensure your Supabase project is not paused (free tier pauses after 1 week of inactivity)

**CORS errors:**
- Verify `FRONTEND_URL` in your backend `.env` matches exactly where your frontend is running

**PWA not installing:**
- Ensure icon files exist at `frontend/public/icons/`
- The app must be served over HTTPS in production (Vercel handles this automatically)

---

## License

MIT — free to use, modify, and deploy for personal or commercial projects.
