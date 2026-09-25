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
