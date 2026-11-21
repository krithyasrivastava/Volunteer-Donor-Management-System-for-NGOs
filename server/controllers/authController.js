const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const { asyncHandler } = require('../middleware/errorHandler');

const TABLE_BY_ROLE = {
  admin: { table: 'admins', idCol: 'admin_id' },
  volunteer: { table: 'volunteers', idCol: 'volunteer_id' },
  donor: { table: 'donors', idCol: 'donor_id' }
};

function signToken(user, role, idCol) {
  if (!process.env.JWT_SECRET) {
    const err = new Error('Authentication service is not configured.');
    err.status = 503;
    throw err;
  }
  return jwt.sign(
    { id: user[idCol], role, email: user.email, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

// POST /api/auth/register  { role: 'volunteer' | 'donor', name, email, password, ...extra }
const register = asyncHandler(async (req, res) => {
  const { role, name, email, password, phone, address, availability, donor_type } = req.body;

  if (!['volunteer', 'donor'].includes(role)) {
    return res.status(400).json({ message: 'Self-registration is only available for volunteers and donors.' });
  }
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email and password are required.' });
  }

  const { table, idCol } = TABLE_BY_ROLE[role];
  const hashed = await bcrypt.hash(password, 10);

  let sql, params;
  if (role === 'volunteer') {
    sql = `INSERT INTO volunteers (name, email, password, phone, address, availability) VALUES (?,?,?,?,?,?)`;
    params = [name, email, hashed, phone || null, address || null, availability || 'Flexible'];
  } else {
    sql = `INSERT INTO donors (name, email, password, phone, address, donor_type) VALUES (?,?,?,?,?,?)`;
    params = [name, email, hashed, phone || null, address || null, donor_type || 'Individual'];
  }

  const [result] = await pool.query(sql, params);
  const [rows] = await pool.query(`SELECT * FROM ${table} WHERE ${idCol} = ?`, [result.insertId]);
  const user = rows[0];
  delete user.password;

  const token = signToken(user, role, idCol);
  res.status(201).json({ token, role, user });
});

// POST /api/auth/login  { role, email, password }
const login = asyncHandler(async (req, res) => {
  const { role, email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }
  if (!TABLE_BY_ROLE[role]) {
    return res.status(400).json({ message: 'Invalid role specified.' });
  }
  const { table, idCol } = TABLE_BY_ROLE[role];

  const [rows] = await pool.query(`SELECT * FROM ${table} WHERE email = ?`, [email]);
  const user = rows[0];
  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password.' });
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(401).json({ message: 'Invalid email or password.' });
  }

  if (role === 'volunteer' && user.status === 'Rejected') {
    return res.status(403).json({ message: 'Your volunteer application was rejected. Contact the admin for details.' });
  }
  if (role === 'volunteer' && user.status === 'Inactive') {
    return res.status(403).json({ message: 'Your volunteer account is inactive. Contact the admin for details.' });
  }

  delete user.password;
  const token = signToken(user, role, idCol);
  res.json({ token, role, user });
});

// GET /api/auth/me
const me = asyncHandler(async (req, res) => {
  const { role, id } = req.user;
  const { table, idCol } = TABLE_BY_ROLE[role];
  const [rows] = await pool.query(`SELECT * FROM ${table} WHERE ${idCol} = ?`, [id]);
  if (!rows[0]) return res.status(404).json({ message: 'User not found.' });
  const user = rows[0];
  delete user.password;
  res.json({ role, user });
});

module.exports = { register, login, me };
