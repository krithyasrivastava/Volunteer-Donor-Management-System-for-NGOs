# Greenhands — Volunteer & Donor Management System

A React + Tailwind community service demonstration with built-in mock authentication and
browser-local demo data. The optional Node.js/Express API remains available for a MySQL-backed
deployment, but the default frontend does not call it.

## Architecture

```text
React (Vite + Tailwind) --> mock services --> browser localStorage

Optional legacy API: React --[REST / JSON]--> Express API --[mysql2]--> MySQL
```

- **Frontend**: `client/` — Vite + React 18 + Tailwind CSS + React Router + Recharts
- **Demo records and mock services**: `client/src/services/mockData.js` and
  `client/src/services/resources.js`
- **Optional backend**: `server/` — Node.js + Express + JWT auth + bcrypt password hashing
- **Optional database**: MySQL schema and demo seed in `server/database/`

## Run the frontend demo

Requirements: Node.js 18+ and npm. No API server or database is needed.

```bash
cd client
npm install
npm run dev
```

The app runs at `http://localhost:5173`. Its demo data and mock authentication run in the
browser; data edits are saved in that browser's `localStorage`.

## Demo login credentials

All seeded demo accounts use the password **`password123`**:

| Role | Email |
|---|---|
| Admin | `admin@ngo.org` |
| Volunteer | `priya.sharma@mail.com` |
| Donor | `suresh.agarwal@mail.com` |

The browser store is seeded with the demo volunteers, donors, skills, events, applications,
donations, and dashboard/report data. New volunteers and donors can register in the UI;
volunteer registrations start with `Pending` status and require admin approval before applying
to events.

## Mock data and authentication limitations

Mock records are stored in the visitor's browser, not in a shared database. Changes are not
shared with other visitors or devices. Clearing browser site data resets the demo. To reset it
manually, remove `gh_mock_data_v1`, `gh_token`, and `gh_role` from local storage and reload.

This mode is for demonstrations only. Mock credentials and records are visible to the browser
and are not secure authentication or suitable for private, shared, or production data.

## Demo workflows

- **Admin**: review pending volunteers, manage donors and donations, create events, review event
  applications, assign matching volunteers, and record completed hours.
- **Volunteer**: manage a profile and skills, browse and apply to events, and view event status
  and logged hours.
- **Donor**: manage a profile, record donations, and view donation history and receipts.

Dashboard statistics and reports are calculated from the browser-local mock records.
Volunteer/event matching uses explainable skill, availability, and proficiency scores.

## Deploy the frontend to Vercel without a database

Set `client/` as the Vercel project root, `npm run build` as the build command, and `dist` as
the output directory. No `VITE_API_URL`, Render service, or database environment variables are
needed. `client/vercel.json` already rewrites client-side routes to `index.html`.

## Optional MySQL-backed API

The API in `server/` is separate from the default frontend mock mode and still requires MySQL.
To run it locally:

```bash
mysql -u root -p < server/database/schema.sql
mysql -u root -p < server/database/seed.sql
cd server
npm install
cp .env.example .env
# Configure MySQL credentials and JWT_SECRET in .env
npm run dev
```

The API listens at `http://localhost:5000`; its health check is `GET /api/health`. Its routes
are under `/api` and include authentication, volunteers, donors, events, donations, skills,
applications, and dashboards. The default mock frontend does not call those routes.

The existing backend cannot provide a working API on Render without a configured MySQL
database. Deploy it only if you intend to use a database and reconfigure the frontend services
to call the API.
