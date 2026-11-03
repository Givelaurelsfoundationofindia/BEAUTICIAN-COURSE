# Beautician Training Website

## Project structure

- `frontend/` — React + Vite website
  - `frontend/src/admin-dashboard/` — Admin login and dashboard components
  - `frontend/src/pages/` — Student-facing pages
  - `frontend/src/components/` — Shared UI components
- `backend/` — Node.js + Express API and Excel registration storage

## Run the backend

Open a terminal in the project root:

```bash
cd backend
npm install
npm start
```

The API runs at http://localhost:5000.

## Run the frontend

Open a second terminal in the project root:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL printed by Vite (normally http://localhost:5173).

## Admin pages

- Login: http://localhost:5173/admin/login
- Dashboard: http://localhost:5173/admin

Use the admin username and password configured in `backend/.env`.
Do not publish or share the `.env` file.

## Excel registrations

The backend stores registrations in `backend/Beautician_Registrations.xlsx`.
Keep this file closed in Excel/WPS while registrations are being added or deleted.

## Important

This project is configured for local development. Before public deployment, configure
the frontend API URL, CORS allowed origins, secure admin sessions, and persistent
server-side storage. An Excel file on a local computer will not receive public website
registrations unless the backend and its storage are hosted on a persistent server.
