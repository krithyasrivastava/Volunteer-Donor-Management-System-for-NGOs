const pool = require('../config/db');
const { asyncHandler } = require('../middleware/errorHandler');

const listSkills = asyncHandler(async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM skills ORDER BY skill_name');
  res.json(rows);
});

const createSkill = asyncHandler(async (req, res) => {
  const { skill_name, description } = req.body;
  if (!skill_name) return res.status(400).json({ message: 'skill_name is required.' });
  const [result] = await pool.query('INSERT INTO skills (skill_name, description) VALUES (?,?)', [
    skill_name,
    description || null
  ]);
  res.status(201).json({ skill_id: result.insertId, skill_name, description });
});

// GET /api/skills/mine  (volunteer)
const myVolunteerSkills = asyncHandler(async (req, res) => {
  const [rows] = await pool.query(
    `SELECT s.skill_id, s.skill_name, s.description, vs.proficiency
     FROM volunteer_skills vs JOIN skills s ON s.skill_id = vs.skill_id
     WHERE vs.volunteer_id = ? ORDER BY s.skill_name`,
    [req.user.id]
  );
  res.json(rows);
});

// POST /api/skills/mine  { skill_id, proficiency }  (volunteer)
const addMySkill = asyncHandler(async (req, res) => {
  const { skill_id, proficiency } = req.body;
  if (!skill_id) return res.status(400).json({ message: 'skill_id is required.' });
  await pool.query(
    `INSERT INTO volunteer_skills (volunteer_id, skill_id, proficiency) VALUES (?,?,?)
     ON DUPLICATE KEY UPDATE proficiency = VALUES(proficiency)`,
    [req.user.id, skill_id, proficiency || 'Intermediate']
  );
  res.status(201).json({ message: 'Skill added.' });
});

// DELETE /api/skills/mine/:skillId (volunteer)
const removeMySkill = asyncHandler(async (req, res) => {
  await pool.query('DELETE FROM volunteer_skills WHERE volunteer_id = ? AND skill_id = ?', [
    req.user.id,
    req.params.skillId
  ]);
  res.json({ message: 'Skill removed.' });
});

module.exports = { listSkills, createSkill, myVolunteerSkills, addMySkill, removeMySkill };
