# Campus Coin

Smart Spending, Student Style — a student budget and expense tracker built for Techwiz7.

## Stack

- Frontend: React (Vite), React Router, Tailwind CSS, Recharts
- Backend: Node.js, Express
- Database: MySQL (via Prisma ORM)

## Project Structure

```
CampusCoin/          frontend root
├── src/
├── public/
├── backend/          Express API
│   ├── prisma/        schema and migrations
│   └── src/
└── docs/              SRS and project documentation
```

## Prerequisites

- Node.js 20+
- XAMPP (MySQL running on port 3306)

## Setup

1. Start MySQL in XAMPP Control Panel.
2. Create a database named `campus_coin` (via phpMyAdmin or the MySQL shell).
3. Install dependencies:
   ```
   npm install
   npm install --prefix backend
   ```
4. Copy `backend/.env` and adjust `DATABASE_URL` if your MySQL user/password differs from the XAMPP default (`root` with no password).
5. Run migrations:
   ```
   cd backend
   npx prisma migrate dev
   ```

## Running the app

```
npm run dev:all
```

Runs the frontend (`http://localhost:5173`) and backend (`http://localhost:5000`) together.

Or individually:

```
npm run dev            # frontend only
npm run dev:server     # backend only
```

## Deployment

Production target: frontend on **Vercel**, backend on **Render**, database on **Aiven** (MySQL).

### 1. Aiven — MySQL database

1. Create a MySQL service on Aiven and wait for it to reach `RUNNING`.
2. From the service overview, note the host, port, user, password, and default database name (or create a `campus_coin` database via the Aiven Console's Databases tab / query editor).
3. Download the service's CA certificate from the overview page.
4. Build a `DATABASE_URL` that forces TLS and points at that certificate, e.g.:
   ```
   mysql://<user>:<password>@<host>:<port>/<dbname>?sslaccept=strict&sslcert=/etc/secrets/aiven-ca.pem
   ```
   On Render (below), upload the downloaded CA file as a **Secret File** named `aiven-ca.pem` — Render mounts secret files under `/etc/secrets/`, so the path above will resolve at runtime without committing the certificate to the repo.

### 2. Render — backend API

1. New **Web Service**, pointing at this repo. Render will pick up `render.yaml` at the repo root if you use **New → Blueprint**; otherwise configure manually:
   - Root directory: `backend`
   - Build command: `npm install && npx prisma generate && npx prisma migrate deploy`
   - Start command: `npm start`
   - Health check path: `/api/health`
2. Add the Secret File from step 1, then set env vars:
   - `DATABASE_URL` — from Aiven, as built above
   - `JWT_SECRET` — a long random string
   - `CLIENT_URL` — the Vercel URL from step 3 (leave a placeholder for now, update after the first Vercel deploy)
3. Deploy. `prisma migrate deploy` runs the committed migrations against the Aiven database automatically on each build.

### 3. Vercel — frontend

1. New Project, import this repo with **root directory = repo root** (not `backend`). Vercel auto-detects the Vite framework and reads `vercel.json` for the SPA rewrite (needed for React Router's client-side routes).
2. Env var: `VITE_API_URL` = `https://<your-render-service>.onrender.com/api`
3. Deploy, then copy the resulting `https://<project>.vercel.app` URL back into Render's `CLIENT_URL` env var and redeploy the backend so CORS accepts requests from it.

Steps 2 and 3 reference each other's URL, so the first deploy of each can use a placeholder — do one more redeploy on each service once both URLs are known.

### 4. Seed data (optional)

Run once against the Aiven database (e.g. from a Render shell, with `DATABASE_URL` already set in that environment):
```
npm run db:seed --prefix backend
```
