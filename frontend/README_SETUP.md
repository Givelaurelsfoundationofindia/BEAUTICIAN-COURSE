# Give Laurels Foundation – Beautician Registration Website

## Included
- Existing React + Vite public website and registration form
- Node.js/Express backend
- One Excel file: `backend/Beautician_Registrations.xlsx`
- Admin login at `/admin/login` and dashboard at `/admin`
- Search, state filter, view details, delete registration, and Excel download

## Local setup (Windows)

### 1. Install frontend packages
Open a terminal in this project folder and run:
```bash
npm install
```

### 2. Install backend packages
Open another terminal in this project folder and run:
```bash
cd backend
npm install
```

### 3. Start backend
In the backend terminal:
```bash
npm start
```
Keep this terminal open. It creates `Beautician_Registrations.xlsx` automatically with one worksheet named `Registrations` and all column headings.

### 4. Start website
Open a new terminal in the project root (the folder containing the root `package.json`):
```bash
npm run dev
```
Open the local URL printed by Vite (normally `http://localhost:5173`).

### 5. Admin dashboard
Open:
`http://localhost:5173/admin/login`

Admin username: `glf_admin`
Admin password: `GLF@Beauty2026!0T6WiEwOZ8I`

Change these credentials in `backend/.env` before putting the website online.

## Excel file
The output is an `.xlsx` Excel file. Excel's technical file format calls the file a *workbook*, and the tab inside it is a *worksheet*. This project creates exactly one worksheet called `Registrations`. Open `backend/Beautician_Registrations.xlsx` using Microsoft Excel. Do not open or edit the `.xlsx` file inside VS Code.

Close the Excel file before submitting, deleting, or editing registrations, because Windows may lock an open file.

## Important deployment note
This project is currently configured for local development. For a public website, deploy the backend to a server with persistent disk storage and configure `FRONTEND_ORIGINS`, HTTPS session cookies, and `VITE_API_URL`. Do not use temporary/ephemeral server storage for the Excel file. Back up the Excel file regularly. A single Excel file is suitable for modest registration volume, not high-concurrency production workloads.
