const bcrypt = require('bcryptjs');
const pool = require('../config/db');
const { asyncHandler } = require('../middleware/errorHandler');

// GET /api/donors?search=  (admin)
const listDonors = asyncHandler(async (req, res) => {
  const { search = '' } = req.query;
  let sql = `SELECT d.donor_id, d.name, d.email, d.phone, d.address, d.donor_type, d.created_at,
             COALESCE(SUM(CASE WHEN don.status='Completed' THEN don.amount ELSE 0 END),0) AS total_donated
             FROM donors d LEFT JOIN donations don ON don.donor_id = d.donor_id WHERE 1=1`;
  const params = [];
  if (search) {
    sql += ' AND (d.name LIKE ? OR d.email LIKE ?)';
    params.push(`%${search}%`, `%${search}%`);
  }
  sql += ' GROUP BY d.donor_id ORDER BY d.created_at DESC';

  const [rows] = await pool.query(sql, params);
  res.json(rows);
});

async function buildDonorProfile(donorId) {
  const [[donor]] = await pool.query(
    'SELECT donor_id, name, email, phone, address, donor_type, created_at FROM donors WHERE donor_id = ?',
    [donorId]
  );
  if (!donor) return null;

  const [donations] = await pool.query(
    'SELECT * FROM donations WHERE donor_id = ? ORDER BY donation_date DESC',
    [donorId]
  );

  const total_donated = donations
    .filter((d) => d.status === 'Completed')
    .reduce((sum, d) => sum + Number(d.amount), 0);

  return { ...donor, donations, total_donated };
}

// GET /api/donors/:id  (admin)
const getDonor = asyncHandler(async (req, res) => {
  const profile = await buildDonorProfile(req.params.id);
  if (!profile) return res.status(404).json({ message: 'Donor not found.' });
  res.json(profile);
});

// GET /api/donors/me/profile  (donor)
const getMyProfile = asyncHandler(async (req, res) => {
  const profile = await buildDonorProfile(req.user.id);
  if (!profile) return res.status(404).json({ message: 'Profile not found.' });
  res.json(profile);
});

// POST /api/donors  (admin adds a donor directly)
const createDonor = asyncHandler(async (req, res) => {
  const { name, email, password, phone, address, donor_type } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email and password are required.' });
  }
  const hashed = await bcrypt.hash(password, 10);
  const [result] = await pool.query(
    `INSERT INTO donors (name, email, password, phone, address, donor_type) VALUES (?,?,?,?,?,?)`,
    [name, email, hashed, phone || null, address || null, donor_type || 'Individual']
  );
  res.status(201).json({ donor_id: result.insertId });
});

async function updateDonor(req, res, isSelf = false) {
  const id = isSelf ? req.user.id : req.params.id;
  const { name, phone, address, donor_type } = req.body;

  const fields = [];
  const params = [];
  if (name !== undefined) { fields.push('name = ?'); params.push(name); }
  if (phone !== undefined) { fields.push('phone = ?'); params.push(phone); }
  if (address !== undefined) { fields.push('address = ?'); params.push(address); }
  if (!isSelf && donor_type !== undefined) { fields.push('donor_type = ?'); params.push(donor_type); }

  if (!fields.length) return res.status(400).json({ message: 'No fields to update.' });

  params.push(id);
  await pool.query(`UPDATE donors SET ${fields.join(', ')} WHERE donor_id = ?`, params);
  res.json({ message: 'Donor updated.' });
}

const updateDonorAdmin = asyncHandler((req, res) => updateDonor(req, res, false));
const updateMyProfile = asyncHandler((req, res) => updateDonor(req, res, true));

module.exports = { listDonors, getDonor, getMyProfile, createDonor, updateDonorAdmin, updateMyProfile };
