const pool = require('../config/db');
const { asyncHandler } = require('../middleware/errorHandler');

function genTransactionId() {
  return 'TXN' + Date.now().toString().slice(-8) + Math.floor(Math.random() * 90 + 10);
}

// GET /api/donations?search=&type=&status=  (admin)
const listDonations = asyncHandler(async (req, res) => {
  const { search = '', type = '', status = '' } = req.query;
  let sql = `SELECT don.*, d.name AS donor_name, d.email AS donor_email
             FROM donations don JOIN donors d ON d.donor_id = don.donor_id WHERE 1=1`;
  const params = [];
  if (search) {
    sql += ' AND (d.name LIKE ? OR don.transaction_id LIKE ? OR don.purpose LIKE ?)';
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }
  if (type) { sql += ' AND don.donation_type = ?'; params.push(type); }
  if (status) { sql += ' AND don.status = ?'; params.push(status); }
  sql += ' ORDER BY don.donation_date DESC';

  const [rows] = await pool.query(sql, params);
  res.json(rows);
});

// GET /api/donations/mine  (donor)
const myDonations = asyncHandler(async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM donations WHERE donor_id = ? ORDER BY donation_date DESC', [
    req.user.id
  ]);
  res.json(rows);
});

async function fetchDonationWithDonor(donationId) {
  const [[row]] = await pool.query(
    `SELECT don.*, d.name AS donor_name, d.email AS donor_email, d.phone AS donor_phone
     FROM donations don JOIN donors d ON d.donor_id = don.donor_id WHERE don.donation_id = ?`,
    [donationId]
  );
  return row;
}

// GET /api/donations/:id  (admin, or the owning donor)
const getDonation = asyncHandler(async (req, res) => {
  const row = await fetchDonationWithDonor(req.params.id);
  if (!row) return res.status(404).json({ message: 'Donation not found.' });
  if (req.user.role === 'donor' && row.donor_id !== req.user.id) {
    return res.status(403).json({ message: 'You cannot view this donation.' });
  }
  res.json(row);
});

// GET /api/donations/:id/receipt  (admin, or the owning donor)
const getReceipt = asyncHandler(async (req, res) => {
  const row = await fetchDonationWithDonor(req.params.id);
  if (!row) return res.status(404).json({ message: 'Donation not found.' });
  if (req.user.role === 'donor' && row.donor_id !== req.user.id) {
    return res.status(403).json({ message: 'You cannot view this receipt.' });
  }
  res.json({
    receipt_id: `RCPT-${String(row.donation_id).padStart(5, '0')}`,
    ngo_name: 'Greenhands Community Foundation',
    donor_id: row.donor_id,
    donor_name: row.donor_name,
    date: row.donation_date,
    purpose: row.purpose,
    donation_type: row.donation_type,
    amount: row.amount,
    payment_method: row.payment_method,
    status: row.status,
    thank_you_message:
      'Thank you for your generous contribution. Your support helps us bring real change to the communities we serve.'
  });
});

// POST /api/donations  (admin, or donor creating their own record)
const createDonation = asyncHandler(async (req, res) => {
  const { donor_id, amount, donation_type, purpose, donation_date, payment_method, status } = req.body;
  const effectiveDonorId = req.user.role === 'donor' ? req.user.id : donor_id;

  if (!effectiveDonorId || !donation_date) {
    return res.status(400).json({ message: 'donor_id and donation_date are required.' });
  }

  const [result] = await pool.query(
    `INSERT INTO donations (donor_id, amount, donation_type, purpose, donation_date, payment_method, transaction_id, status)
     VALUES (?,?,?,?,?,?,?,?)`,
    [
      effectiveDonorId,
      amount || 0,
      donation_type || 'Money',
      purpose || null,
      donation_date,
      payment_method || 'N/A',
      genTransactionId(),
      status || 'Pending'
    ]
  );
  res.status(201).json({ donation_id: result.insertId });
});

// PUT /api/donations/:id  (admin)
const updateDonation = asyncHandler(async (req, res) => {
  const { amount, donation_type, purpose, donation_date, payment_method, status } = req.body;
  const fields = [];
  const params = [];
  const map = { amount, donation_type, purpose, donation_date, payment_method, status };
  Object.entries(map).forEach(([key, value]) => {
    if (value !== undefined) { fields.push(`${key} = ?`); params.push(value); }
  });
  if (!fields.length) return res.status(400).json({ message: 'No fields to update.' });
  params.push(req.params.id);
  await pool.query(`UPDATE donations SET ${fields.join(', ')} WHERE donation_id = ?`, params);
  res.json({ message: 'Donation updated.' });
});

module.exports = { listDonations, myDonations, getDonation, getReceipt, createDonation, updateDonation };
