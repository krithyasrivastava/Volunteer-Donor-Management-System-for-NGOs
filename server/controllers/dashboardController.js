const pool = require('../config/db');
const { asyncHandler } = require('../middleware/errorHandler');

// GET /api/dashboard/admin
// All KPI cards + chart data
const adminDashboard = asyncHandler(async (req, res) => {
  const [[{ total_volunteers }]] = await pool.query(
    'SELECT COUNT(*) AS total_volunteers FROM volunteers'
  );

  const [[{ active_volunteers }]] = await pool.query(
    `SELECT COUNT(*) AS active_volunteers
     FROM volunteers
     WHERE status = 'Approved'`
  );

  const [[{ total_donors }]] = await pool.query(
    'SELECT COUNT(*) AS total_donors FROM donors'
  );

  const [[{ total_donations }]] = await pool.query(
    `SELECT COALESCE(SUM(amount), 0) AS total_donations
     FROM donations
     WHERE status = 'Completed'
       AND donation_type = 'Money'`
  );

  const [[{ upcoming_events }]] = await pool.query(
    `SELECT COUNT(*) AS upcoming_events
     FROM events
     WHERE event_date >= CURDATE()
       AND status IN ('Upcoming', 'Ongoing')`
  );

  const [[{ total_hours }]] = await pool.query(
    'SELECT COALESCE(SUM(hours), 0) AS total_hours FROM event_volunteers'
  );

  // Monthly donations: group and sort using the same expression
  const [monthlyDonations] = await pool.query(
    `SELECT
        DATE_FORMAT(donation_date, '%Y-%m') AS month,
        SUM(amount) AS amount
     FROM donations
     WHERE status = 'Completed'
       AND donation_type = 'Money'
     GROUP BY DATE_FORMAT(donation_date, '%Y-%m')
     ORDER BY DATE_FORMAT(donation_date, '%Y-%m')
     LIMIT 6`
  );

  const [upcoming] = await pool.query(
    `SELECT event_id, event_name, event_date, location, status
     FROM events
     WHERE event_date >= CURDATE()
       AND status IN ('Upcoming', 'Ongoing')
     ORDER BY event_date ASC
     LIMIT 5`
  );

  const [recentDonations] = await pool.query(
    `SELECT
        don.donation_id,
        d.name AS donor_name,
        don.amount,
        don.donation_type,
        don.status,
        don.donation_date
     FROM donations don
     JOIN donors d ON d.donor_id = don.donor_id
     ORDER BY don.created_at DESC
     LIMIT 5`
  );

  const [recentVolunteers] = await pool.query(
    `SELECT volunteer_id, name, email, status, joined_date
     FROM volunteers
     ORDER BY created_at DESC
     LIMIT 5`
  );

  const [participation] = await pool.query(
    `SELECT status, COUNT(*) AS count
     FROM event_volunteers
     GROUP BY status`
  );

  res.json({
    kpis: {
      total_volunteers,
      active_volunteers,
      total_donors,
      total_donations: Number(total_donations),
      upcoming_events,
      total_hours: Number(total_hours)
    },
    monthly_donations: monthlyDonations,
    upcoming_events: upcoming,
    recent_donations: recentDonations,
    recent_volunteers: recentVolunteers,
    participation_breakdown: participation
  });
});


// GET /api/dashboard/volunteer
// Volunteer's personal dashboard
const volunteerDashboard = asyncHandler(async (req, res) => {
  const volunteerId = req.user.id;

  const [[{ total_hours }]] = await pool.query(
    `SELECT COALESCE(SUM(hours), 0) AS total_hours
     FROM event_volunteers
     WHERE volunteer_id = ?`,
    [volunteerId]
  );

  const [[{ completed_events }]] = await pool.query(
    `SELECT COUNT(*) AS completed_events
     FROM event_volunteers
     WHERE volunteer_id = ?
       AND status = 'Completed'`,
    [volunteerId]
  );

  const [[{ upcoming_events }]] = await pool.query(
    `SELECT COUNT(*) AS upcoming_events
     FROM event_volunteers ev
     JOIN events e ON e.event_id = ev.event_id
     WHERE ev.volunteer_id = ?
       AND ev.status = 'Approved'
       AND e.event_date >= CURDATE()`,
    [volunteerId]
  );

  const [[{ pending_applications }]] = await pool.query(
    `SELECT COUNT(*) AS pending_applications
     FROM event_volunteers
     WHERE volunteer_id = ?
       AND status = 'Applied'`,
    [volunteerId]
  );

  const [upcoming] = await pool.query(
    `SELECT
        e.event_id,
        e.event_name,
        e.event_date,
        e.location,
        ev.status
     FROM event_volunteers ev
     JOIN events e ON e.event_id = ev.event_id
     WHERE ev.volunteer_id = ?
       AND e.event_date >= CURDATE()
     ORDER BY e.event_date ASC
     LIMIT 5`,
    [volunteerId]
  );

  res.json({
    kpis: {
      total_hours: Number(total_hours),
      completed_events,
      upcoming_events,
      pending_applications
    },
    upcoming
  });
});


// GET /api/dashboard/donor
// Donor's personal dashboard
const donorDashboard = asyncHandler(async (req, res) => {
  const donorId = req.user.id;

  const [[{ total_donated }]] = await pool.query(
    `SELECT COALESCE(SUM(amount), 0) AS total_donated
     FROM donations
     WHERE donor_id = ?
       AND status = 'Completed'`,
    [donorId]
  );

  const [[{ donation_count }]] = await pool.query(
    `SELECT COUNT(*) AS donation_count
     FROM donations
     WHERE donor_id = ?`,
    [donorId]
  );

  const [recent] = await pool.query(
    `SELECT *
     FROM donations
     WHERE donor_id = ?
     ORDER BY donation_date DESC
     LIMIT 5`,
    [donorId]
  );

  res.json({
    kpis: {
      total_donated: Number(total_donated),
      donation_count
    },
    recent_donations: recent
  });
});


// GET /api/dashboard/reports
// Detailed report data for admin
const reports = asyncHandler(async (req, res) => {
  const [monthlyDonations] = await pool.query(
    `SELECT
        DATE_FORMAT(donation_date, '%Y-%m') AS month,
        SUM(amount) AS amount
     FROM donations
     WHERE status = 'Completed'
       AND donation_type = 'Money'
     GROUP BY DATE_FORMAT(donation_date, '%Y-%m')
     ORDER BY DATE_FORMAT(donation_date, '%Y-%m')`
  );

  const [eventParticipation] = await pool.query(
    `SELECT
        e.event_id,
        e.event_name,
        COUNT(ev.volunteer_id) AS volunteer_count,
        COALESCE(SUM(ev.hours), 0) AS total_hours
     FROM events e
     LEFT JOIN event_volunteers ev
       ON ev.event_id = e.event_id
     GROUP BY e.event_id, e.event_name
     ORDER BY MAX(e.event_date) DESC`
  );

  const [volunteerStatusBreakdown] = await pool.query(
    `SELECT status, COUNT(*) AS count
     FROM volunteers
     GROUP BY status`
  );

  const [donationTypeBreakdown] = await pool.query(
    `SELECT
        donation_type,
        COUNT(*) AS count,
        COALESCE(SUM(amount), 0) AS amount
     FROM donations
     GROUP BY donation_type`
  );

  const [topVolunteers] = await pool.query(
    `SELECT
        v.volunteer_id,
        v.name,
        COALESCE(SUM(ev.hours), 0) AS total_hours
     FROM volunteers v
     LEFT JOIN event_volunteers ev
       ON ev.volunteer_id = v.volunteer_id
     GROUP BY v.volunteer_id, v.name
     ORDER BY total_hours DESC
     LIMIT 5`
  );

  res.json({
    monthlyDonations,
    eventParticipation,
    volunteerStatusBreakdown,
    donationTypeBreakdown,
    topVolunteers
  });
});


module.exports = {
  adminDashboard,
  volunteerDashboard,
  donorDashboard,
  reports
};