# Greenhands — Volunteer & Donor Management System

A full-stack Community Service Project: React + Tailwind frontend, Node.js/Express REST API,
and a MySQL relational database. Built for a B.Tech CSE community service demonstration.

---

## 1. Architecture

```
React (Vite + Tailwind) --[REST / JSON]--> Express API --[mysql2]--> MySQL
```

- **Frontend**: `client/` — Vite + React 18 + Tailwind CSS + React Router + Recharts
- **Backend**: `server/` — Node.js + Express + JWT auth + bcrypt password hashing
- **Database**: MySQL — schema in `server/database/schema.sql`, demo data in `server/database/seed.sql`

## 2. Folder structure

```
volunteer-donor-management/
├── server/
│   ├── config/db.js
│   ├── middleware/{auth.js, errorHandler.js}
│   ├── utils/matching.js              # volunteer-event matching engine
│   ├── controllers/                   # business logic per resource
│   ├── routes/                        # REST endpoints per resource
│   ├── database/{schema.sql, seed.sql}
│   ├── .env.example
│   ├── index.js
│   └── package.json
└── client/
    ├── src/
    │   ├── components/                # Sidebar, Navbar, KpiCard, Modal, Toast, etc.
    │   ├── layouts/DashboardLayout.jsx
    │   ├── pages/{public, admin, volunteer, donor}/
    │   ├── context/AuthContext.jsx
    │   └── services/{api.js, resources.js}
    ├── tailwind.config.js
    └── package.json
```

## 3. Prerequisites

- Node.js 18+
- MySQL 8+ (or MariaDB 10.5+)
- npm

## 4. Database setup

```bash
mysql -u root -p < server/database/schema.sql
mysql -u root -p < server/database/seed.sql
```

This creates the `volunteer_donor_management` database with all 9 tables and loads realistic
demo data (1 admin, 12 volunteers, 8 skills, 6 events, 8 donors, 16 donations).

## 5. Backend setup

```bash
cd server
npm install
cp .env.example .env
# edit .env with your MySQL credentials and a random JWT_SECRET
npm run dev
```

The API runs at `http://localhost:5000`. Health check: `GET /api/health`.

## 6. Frontend setup

```bash
cd client
npm install
npm run dev
```

The app runs at `http://localhost:5173` and talks to the API at `http://localhost:5000/api`
(override with a `VITE_API_URL` env var if needed).

## 7. Test login credentials

All seeded accounts use the password: **`password123`**

| Role      | Email                     |
|-----------|---------------------------|
| Admin     | admin@ngo.org             |
| Volunteer | priya.sharma@mail.com     |
| Donor     | suresh.agarwal@mail.com   |

New volunteers/donors can also self-register from the Register page. New volunteers start
with `status = Pending` and must be approved by the admin before applying to events.

## 8. Volunteer–event matching logic (explainable, not black-box ML)

For a given event, the system:

1. Reads the event's required skills (`event_requirements`).
2. Fetches all **Approved** volunteers who are **not already registered** for that event.
3. Scores each candidate out of 100:
   - **Up to 70 points** — the proportion of the event's required skills the volunteer holds.
   - **20 or 12 points** — 20 if availability is "Flexible", 12 otherwise (kept simple/transparent).
   - **Up to 10 points** — average proficiency (Beginner/Intermediate/Expert) across matched skills.
4. Sorts candidates by score, descending, and shows which specific skills matched — so the
   recommendation is always explainable, not a black box.
5. The admin can assign any recommended volunteer to the event with one click.

See `server/utils/matching.js` for the full implementation.

## 9. API overview

All endpoints are under `/api`. JWT bearer token required except `/auth/login` and `/auth/register`.

| Resource      | Endpoints |
|---------------|-----------|
| Auth          | `POST /auth/register`, `POST /auth/login`, `GET /auth/me` |
| Volunteers    | `GET/POST /volunteers`, `GET/PUT /volunteers/:id`, `PATCH /volunteers/:id/status`, `DELETE /volunteers/:id`, `GET/PUT /volunteers/me/profile` |
| Donors        | `GET/POST /donors`, `GET/PUT /donors/:id`, `GET/PUT /donors/me/profile` |
| Events        | `GET/POST /events`, `GET/PUT/DELETE /events/:id`, `PUT /events/:id/requirements`, `GET /events/:id/matches`, `POST /events/:id/assign`, `POST /events/:id/apply`, `PATCH /events/:id/volunteers/:volunteerId` |
| Donations     | `GET/POST /donations`, `GET /donations/mine`, `GET/PUT /donations/:id`, `GET /donations/:id/receipt` |
| Skills        | `GET/POST /skills`, `GET/POST /skills/mine`, `DELETE /skills/mine/:skillId` |
| Applications  | `GET /applications/volunteers`, `GET /applications/events`, `GET /applications/mine` |
| Dashboard     | `GET /dashboard/admin`, `GET /dashboard/volunteer`, `GET /dashboard/donor`, `GET /dashboard/reports` |

All dashboard numbers are computed live with SQL aggregates (`COUNT`, `SUM`) — nothing is hard-coded.

## 10. Demonstrable workflows

- **Admin**: log in → Dashboard → Volunteers (approve a Pending one) → Events → Create Event
  (set required skills) → open the event → "Find matching volunteers" → Assign → mark
  participation Completed + log hours → Reports updates automatically.
- **Volunteer**: register → (wait for/receive approval) → Skills (add a few) → Events → apply
  → My Events shows status → once approved & completed, My Hours shows logged hours.
- **Donor**: register or log in → record a donation → My Donations → open a receipt → print/save as PDF.

## 11. Notes for viva/demo

- Passwords are hashed with bcrypt; JWTs are signed server-side and verified on every protected route.
- Role-based authorization is enforced in Express middleware (`requireRole`), not just hidden in the UI.
- The database enforces referential integrity via foreign keys with `ON DELETE`/`ON UPDATE` rules,
  and many-to-many relationships (`volunteer_skills`, `event_requirements`, `event_volunteers`) use
  proper junction tables as specified in the project brief.
