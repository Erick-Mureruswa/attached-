const { validationResult } = require('express-validator');
const { pool } = require('../config/database');

exports.getJobs = async (req, res) => {
  const { search, location, category, page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;
  const conditions = [];
  const params = [];
  let i = 1;

  if (search) {
    conditions.push(`(j.title ILIKE $${i} OR j.description ILIKE $${i + 1})`);
    params.push(`%${search}%`, `%${search}%`);
    i += 2;
  }
  if (location) {
    conditions.push(`j.location ILIKE $${i}`);
    params.push(`%${location}%`);
    i++;
  }
  if (category) {
    conditions.push(`j.category = $${i}`);
    params.push(category);
    i++;
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  try {
    const { rows: countRows } = await pool.query(
      `SELECT COUNT(*) as total FROM jobs j ${where}`, params
    );
    const total = parseInt(countRows[0].total);

    const { rows: jobs } = await pool.query(
      `SELECT j.*, u.name as employer_name, u.email as employer_email,
        (SELECT COUNT(*) FROM applications a WHERE a.job_id = j.id)::int as application_count
       FROM jobs j JOIN users u ON j.user_id = u.id
       ${where} ORDER BY j.created_at DESC LIMIT $${i} OFFSET $${i + 1}`,
      [...params, parseInt(limit), parseInt(offset)]
    );

    res.json({ jobs, total, page: parseInt(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getJob = async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT j.*, u.name as employer_name, u.email as employer_email,
        (SELECT COUNT(*) FROM applications a WHERE a.job_id = j.id)::int as application_count
       FROM jobs j JOIN users u ON j.user_id = u.id WHERE j.id = $1`,
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ message: 'Job not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createJob = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });

  const { title, description, salary, location, category, type } = req.body;
  try {
    const { rows } = await pool.query(
      `INSERT INTO jobs (title, description, salary, location, category, type, user_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [title, description, salary || null, location, category || null, type || 'Full-time', req.user.id]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.updateJob = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });

  try {
    const { rows } = await pool.query('SELECT * FROM jobs WHERE id = $1', [req.params.id]);
    if (!rows.length) return res.status(404).json({ message: 'Job not found' });
    if (rows[0].user_id !== req.user.id && req.user.role !== 'admin')
      return res.status(403).json({ message: 'Not authorized' });

    const { title, description, salary, location, category, type } = req.body;
    const { rows: updated } = await pool.query(
      `UPDATE jobs SET title=$1, description=$2, salary=$3, location=$4, category=$5, type=$6,
       updated_at=NOW() WHERE id=$7 RETURNING *`,
      [title, description, salary || null, location, category || null, type || 'Full-time', req.params.id]
    );
    res.json(updated[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteJob = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM jobs WHERE id = $1', [req.params.id]);
    if (!rows.length) return res.status(404).json({ message: 'Job not found' });
    if (rows[0].user_id !== req.user.id && req.user.role !== 'admin')
      return res.status(403).json({ message: 'Not authorized' });

    await pool.query('DELETE FROM jobs WHERE id = $1', [req.params.id]);
    res.json({ message: 'Job deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getMyJobs = async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT j.*,
        (SELECT COUNT(*) FROM applications a WHERE a.job_id = j.id)::int as application_count
       FROM jobs j WHERE j.user_id = $1 ORDER BY j.created_at DESC`,
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
