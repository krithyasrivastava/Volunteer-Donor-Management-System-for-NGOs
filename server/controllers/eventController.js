const pool = require('../config/db');
const { asyncHandler } = require('../middleware/errorHandler');
const { rankVolunteersForEvent } = require('../utils/matching');

// GET /api/events?search=&status=
const listEvents = asyncHandler(async (req, res) => {
  const { search = '', status = '' } = req.query;
  let sql = `SELECT e.*,
             (SELECT COUNT(*) FROM event_volunteers ev WHERE ev.event_id = e.event_id AND ev.status IN ('Approved','Completed')) AS assigned_count
             FROM events e WHERE 1=1`;
  const params = [];
  if (search) { sql += ' AND e.event_name LIKE ?'; params.push(`%${search}%`); }
  if (status) { sql += ' AND e.status = ?'; params.push(status); }
  sql += ' ORDER BY e.event_date ASC';

  const [rows] = await pool.query(sql, params);
  res.json(rows);
});

async function buildEventDetail(eventId) {
  const [[event]] = await pool.query('SELECT * FROM events WHERE event_id = ?', [eventId]);
  if (!event) return null;

  const [requirements] = await pool.query(
    `SELECT er.requirement_id, er.skill_id, s.skill_name, er.required_count
     FROM event_requirements er JOIN skills s ON s.skill_id = er.skill_id WHERE er.event_id = ?`,
    [eventId]
  );

  const [volunteers] = await pool.query(
    `SELECT v.volunteer_id, v.name, v.email, v.phone, ev.status, ev.hours, ev.registration_date
     FROM event_volunteers ev JOIN volunteers v ON v.volunteer_id = ev.volunteer_id
     WHERE ev.event_id = ? ORDER BY ev.registration_date DESC`,
    [eventId]
  );

  return { ...event, requirements, volunteers };
}

// GET /api/events/:id
const getEvent = asyncHandler(async (req, res) => {
  const detail = await buildEventDetail(req.params.id);
  if (!detail) return res.status(404).json({ message: 'Event not found.' });
  res.json(detail);
});

// POST /api/events  (admin)  { ...fields, requirements: [{skill_id, required_count}] }
const createEvent = asyncHandler(async (req, res) => {
  const {
    event_name, description, event_date, start_time, end_time,
    location, required_volunteers, status, requirements = []
  } = req.body;

  if (!event_name || !event_date || !start_time || !end_time || !location) {
    return res.status(400).json({ message: 'event_name, event_date, start_time, end_time and location are required.' });
  }

  const [result] = await pool.query(
    `INSERT INTO events (event_name, description, event_date, start_time, end_time, location, required_volunteers, status, created_by)
     VALUES (?,?,?,?,?,?,?,?,?)`,
    [event_name, description || null, event_date, start_time, end_time, location, required_volunteers || 0, status || 'Upcoming', req.user.id]
  );

  const eventId = result.insertId;
  for (const req_ of requirements) {
    if (req_.skill_id) {
      await pool.query(
        'INSERT INTO event_requirements (event_id, skill_id, required_count) VALUES (?,?,?)',
        [eventId, req_.skill_id, req_.required_count || 1]
      );
    }
  }

  res.status(201).json({ event_id: eventId });
});

// PUT /api/events/:id  (admin)
const updateEvent = asyncHandler(async (req, res) => {
  const { event_name, description, event_date, start_time, end_time, location, required_volunteers, status } = req.body;
  const fields = [];
  const params = [];
  const map = { event_name, description, event_date, start_time, end_time, location, required_volunteers, status };
  Object.entries(map).forEach(([key, value]) => {
    if (value !== undefined) { fields.push(`${key} = ?`); params.push(value); }
  });
  if (!fields.length) return res.status(400).json({ message: 'No fields to update.' });
  params.push(req.params.id);
  await pool.query(`UPDATE events SET ${fields.join(', ')} WHERE event_id = ?`, params);
  res.json({ message: 'Event updated.' });
});

// DELETE /api/events/:id  (admin) -> soft delete via Cancelled status
const cancelEvent = asyncHandler(async (req, res) => {
  await pool.query(`UPDATE events SET status = 'Cancelled' WHERE event_id = ?`, [req.params.id]);
  res.json({ message: 'Event cancelled.' });
});

// PUT /api/events/:id/requirements  (admin)  { requirements: [{skill_id, required_count}] }
const setRequirements = asyncHandler(async (req, res) => {
  const { requirements = [] } = req.body;
  await pool.query('DELETE FROM event_requirements WHERE event_id = ?', [req.params.id]);
  for (const r of requirements) {
    if (r.skill_id) {
      await pool.query('INSERT INTO event_requirements (event_id, skill_id, required_count) VALUES (?,?,?)', [
        req.params.id,
        r.skill_id,
        r.required_count || 1
      ]);
    }
  }
  res.json({ message: 'Requirements updated.' });
});

// POST /api/events/:id/apply  (volunteer applies for an event)
const applyToEvent = asyncHandler(async (req, res) => {
  const eventId = req.params.id;
  const volunteerId = req.user.id;

  const [[volunteer]] = await pool.query('SELECT status FROM volunteers WHERE volunteer_id = ?', [volunteerId]);
  if (!volunteer || volunteer.status !== 'Approved') {
    return res.status(403).json({ message: 'Only approved volunteers can apply to events.' });
  }

  const [[existing]] = await pool.query(
    'SELECT * FROM event_volunteers WHERE event_id = ? AND volunteer_id = ?',
    [eventId, volunteerId]
  );
  if (existing) return res.status(409).json({ message: 'You have already applied to this event.' });

  await pool.query('INSERT INTO event_volunteers (event_id, volunteer_id, status) VALUES (?,?,?)', [
    eventId,
    volunteerId,
    'Applied'
  ]);
  res.status(201).json({ message: 'Application submitted.' });
});

// PATCH /api/events/:id/volunteers/:volunteerId  (admin)  { status, hours }
const updateEventVolunteer = asyncHandler(async (req, res) => {
  const { status, hours } = req.body;
  const fields = [];
  const params = [];
  if (status !== undefined) { fields.push('status = ?'); params.push(status); }
  if (hours !== undefined) { fields.push('hours = ?'); params.push(hours); }
  if (!fields.length) return res.status(400).json({ message: 'No fields to update.' });

  params.push(req.params.id, req.params.volunteerId);
  await pool.query(
    `UPDATE event_volunteers SET ${fields.join(', ')} WHERE event_id = ? AND volunteer_id = ?`,
    params
  );
  res.json({ message: 'Volunteer participation updated.' });
});

// POST /api/events/:id/assign  (admin)  { volunteer_id }
const assignVolunteer = asyncHandler(async (req, res) => {
  const { volunteer_id } = req.body;
  if (!volunteer_id) return res.status(400).json({ message: 'volunteer_id is required.' });

  await pool.query(
    `INSERT INTO event_volunteers (event_id, volunteer_id, status) VALUES (?,?, 'Approved')
     ON DUPLICATE KEY UPDATE status = 'Approved'`,
    [req.params.id, volunteer_id]
  );
  res.status(201).json({ message: 'Volunteer assigned to event.' });
});

// GET /api/events/:id/matches  (admin) - volunteer-event matching engine
const getMatches = asyncHandler(async (req, res) => {
  const eventId = req.params.id;

  const [requirements] = await pool.query('SELECT skill_id FROM event_requirements WHERE event_id = ?', [eventId]);
  const requiredSkillIds = requirements.map((r) => r.skill_id);

  const [alreadyRegistered] = await pool.query(
    'SELECT volunteer_id FROM event_volunteers WHERE event_id = ?',
    [eventId]
  );
  const excludeIds = alreadyRegistered.map((r) => r.volunteer_id);

  const [candidates] = await pool.query(
    `SELECT volunteer_id, name, email, availability FROM volunteers WHERE status = 'Approved'
     ${excludeIds.length ? `AND volunteer_id NOT IN (${excludeIds.map(() => '?').join(',')})` : ''}`,
    excludeIds
  );

  for (const c of candidates) {
    const [skills] = await pool.query(
      `SELECT s.skill_id, s.skill_name, vs.proficiency FROM volunteer_skills vs
       JOIN skills s ON s.skill_id = vs.skill_id WHERE vs.volunteer_id = ?`,
      [c.volunteer_id]
    );
    c.skills = skills;
  }

  const ranked = rankVolunteersForEvent(candidates, requiredSkillIds);
  res.json(ranked);
});

module.exports = {
  listEvents,
  getEvent,
  createEvent,
  updateEvent,
  cancelEvent,
  setRequirements,
  applyToEvent,
  updateEventVolunteer,
  assignVolunteer,
  getMatches
};
