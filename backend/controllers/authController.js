const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const { pool } = require('../config/database');

const signToken = (user) =>
  jwt.sign({ id: user.id, email: user.email, role: user.role, name: user.name }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });

exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });

  const { name, email, password, role } = req.body;
  const allowedRoles = ['job_seeker', 'employer'];
  const userRole = allowedRoles.includes(role) ? role : 'job_seeker';

  try {
    const { rows: existing } = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.length) return res.status(409).json({ message: 'Email already registered' });

    const hash = await bcrypt.hash(password, 12);
    const { rows } = await pool.query(
      'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id',
      [name, email, hash, userRole]
    );

    const user = { id: rows[0].id, email, role: userRole, name };
    res.status(201).json({ token: signToken(user), user });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });

  const { email, password } = req.body;
  try {
    const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (!rows.length) return res.status(401).json({ message: 'Invalid credentials' });

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    const { password: _, ...safeUser } = user;
    res.json({ token: signToken(user), user: safeUser });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.me = async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT id, name, email, role, created_at FROM users WHERE id = $1',
      [req.user.id]
    );
    if (!rows.length) return res.status(404).json({ message: 'User not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
