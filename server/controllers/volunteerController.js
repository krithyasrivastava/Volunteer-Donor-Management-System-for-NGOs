const bcrypt = require('bcryptjs');
const pool = require('../config/db');
const { asyncHandler } = require('../middleware/errorHandler');

// GET /api/volunteers?search=&status=   (admin)
const listVolunteers = asyncHandler(async (req, res) => {
  const { search = '', status = '' } = req.query;
  let sql = 'SELECT volunteer_id, name, email, phone, address, availability, status, joined_date FROM volunteers WHERE 1=1';
  const params = [];

  if (search) {
    sql += ' AND (name LIKE ? OR email LIKE ?)';
    params.push(`%${search}%`, `%${search}%`);
  }
  if (status) {
    sql += ' AND status = ?';
    params.push(status);
  }
  sql += ' ORDER BY joined_date DESC';

  const [rows] = await pool.query(sql, params);
  res.json(rows);
});

async function buildVolunteerProfile(volunteerId) {
  const [[volunteer]] = await pool.query(
    'SELECT volunteer_id, name, email, phone, address, availability, status, joined_date, created_at FROM volunteers WHERE volunteer_id = ?',
    [volunteerId]
  );
  if (!volunteer) return null;

  const [skills] = await pool.query(
    `SELECT s.skill_id, s.skill_name, vs.proficiency
     FROM volunteer_skills vs JOIN skills s ON s.skill_id = vs.skill_id
     WHERE vs.volunteer_id = ?`,
    [volunteerId]
  );

  const [events] = await pool.query(
    `SELECT e.event_id, e.event_name, e.event_date, e.status AS event_status, ev.status AS participation_status, ev.hours
     FROM event_volunteers ev JOIN events e ON e.event_id = ev.event_id
     WHERE ev.volunteer_id = ? ORDER BY e.event_date DESC`,
    [volunteerId]
  );

  const [[{ total_hours }]] = await pool.query(
    'SELECT COALESCE(SUM(hours),0) AS total_hours FROM event_volunteers WHERE volunteer_id = ?',
    [volunteerId]
  );

  const completedActivities = events.filter((e) => e.participation_status === 'Completed').length;

  return { ...volunteer, skills, events, total_hours: Number(total_hours), completed_activities: completedActivities };
}

// GET /api/volunteers/:id  (admin)
const getVolunteer = asyncHandler(async (req, res) => {
  const profile = await buildVolunteerProfile(req.params.id);
  if (!profile) return res.status(404).json({ message: 'Volunteer not found.' });
  res.json(profile);
});

// GET /api/volunteers/me/profile  (volunteer)
const getMyProfile = asyncHandler(async (req, res) => {
  const profile = await buildVolunteerProfile(req.user.id);
  if (!profile) return res.status(404).json({ message: 'Profile not found.' });
  res.json(profile);
});

// POST /api/volunteers  (admin adds a volunteer directly)
const createVolunteer = asyncHandler(async (req, res) => {
  const { name, email, password, phone, address, availability, status } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email and password are required.' });
  }
  const hashed = await bcrypt.hash(password, 10);
  const [result] = await pool.query(
    `INSERT INTO volunteers (name, email, password, phone, address, availability, status) VALUES (?,?,?,?,?,?,?)`,
    [name, email, hashed, phone || null, address || null, availability || 'Flexible', status || 'Pending']
  );
  res.status(201).json({ volunteer_id: result.insertId });
});

// PUT /api/volunteers/:id  (admin) or /api/volunteers/me/profile (volunteer self-update)
async function updateVolunteer(req, res, isSelf = false) {
  const id = isSelf ? req.user.id : req.params.id;
  const { name, phone, address, availability, status } = req.body;

  const fields = [];
  const params = [];
  if (name !== undefined) { fields.push('name = ?'); params.push(name); }
  if (phone !== undefined) { fields.push('phone = ?'); params.push(phone); }
  if (address !== undefined) { fields.push('address = ?'); params.push(address); }
  if (availability !== undefined) { fields.push('availability = ?'); params.push(availability); }
  if (!isSelf && status !== undefined) { fields.push('status = ?'); params.push(status); }

  if (!fields.length) return res.status(400).json({ message: 'No fields to update.' });

  params.push(id);
  await pool.query(`UPDATE volunteers SET ${fields.join(', ')} WHERE volunteer_id = ?`, params);
  res.json({ message: 'Volunteer updated.' });
}

const updateVolunteerAdmin = asyncHandler((req, res) => updateVolunteer(req, res, false));
const updateMyProfile = asyncHandler((req, res) => updateVolunteer(req, res, true));

// PATCH /api/volunteers/:id/status  { status }  (admin approve/reject/deactivate)
const setVolunteerStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const valid = ['Pending', 'Approved', 'Rejected', 'Inactive'];
  if (!valid.includes(status)) return res.status(400).json({ message: 'Invalid status.' });
  await pool.query('UPDATE volunteers SET status = ? WHERE volunteer_id = ?', [status, req.params.id]);
  res.json({ message: `Volunteer marked as ${status}.` });
});

// DELETE /api/volunteers/:id  (admin)
const deleteVolunteer = asyncHandler(async (req, res) => {
  await pool.query('DELETE FROM volunteers WHERE volunteer_id = ?', [req.params.id]);
  res.json({ message: 'Volunteer deleted.' });
});

module.exports = {
  listVolunteers,
  getVolunteer,
  getMyProfile,
  createVolunteer,
  updateVolunteerAdmin,
  updateMyProfile,
  setVolunteerStatus,
  deleteVolunteer
};
