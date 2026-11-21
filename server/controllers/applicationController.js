const pool = require('../config/db');
const { asyncHandler } = require('../middleware/errorHandler');

// GET /api/applications/volunteers  (admin) - pending volunteer sign-ups awaiting approval
const listVolunteerApplications = asyncHandler(async (req, res) => {
  const [rows] = await pool.query(
    `SELECT volunteer_id, name, email, phone, availability, status, joined_date
     FROM volunteers WHERE status = 'Pending' ORDER BY joined_date DESC`
  );
  res.json(rows);
});

// GET /api/applications/events  (admin) - volunteer applications to events awaiting approval
const listEventApplications = asyncHandler(async (req, res) => {
  const [rows] = await pool.query(
    `SELECT ev.event_id, e.event_name, e.event_date, ev.volunteer_id, v.name AS volunteer_name,
            v.email AS volunteer_email, ev.status, ev.registration_date
     FROM event_volunteers ev
     JOIN events e ON e.event_id = ev.event_id
     JOIN volunteers v ON v.volunteer_id = ev.volunteer_id
     WHERE ev.status = 'Applied'
     ORDER BY ev.registration_date DESC`
  );
  res.json(rows);
});

// GET /api/applications/mine  (volunteer) - own event application statuses
const myEventApplications = asyncHandler(async (req, res) => {
  const [rows] = await pool.query(
    `SELECT ev.event_id, e.event_name, e.event_date, e.status AS event_status, ev.status, ev.hours, ev.registration_date
     FROM event_volunteers ev JOIN events e ON e.event_id = ev.event_id
     WHERE ev.volunteer_id = ? ORDER BY ev.registration_date DESC`,
    [req.user.id]
  );
  res.json(rows);
});

module.exports = { listVolunteerApplications, listEventApplications, myEventApplications };
