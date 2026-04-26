const { pool } = require('../config/database');

exports.getStats = async (req, res) => {
  try {
    const { rows: [{ totalusers }] } = await pool.query('SELECT COUNT(*)::int as totalUsers FROM users');
    const { rows: [{ totaljobs }] } = await pool.query('SELECT COUNT(*)::int as totalJobs FROM jobs');
    const { rows: [{ totalapplications }] } = await pool.query('SELECT COUNT(*)::int as totalApplications FROM applications');
    const { rows: [{ employers }] } = await pool.query("SELECT COUNT(*)::int as employers FROM users WHERE role='employer'");
    const { rows: [{ jobseekers }] } = await pool.query("SELECT COUNT(*)::int as jobSeekers FROM users WHERE role='job_seeker'");
    res.json({
      totalUsers: totalusers,
      totalJobs: totaljobs,
      totalApplications: totalapplications,
      employers,
      jobSeekers: jobseekers,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getUsers = async (req, res) => {
  const { page = 1, limit = 20, role } = req.query;
  const offset = (page - 1) * limit;
  const conditions = ["role != 'admin'"];
  const params = [];
  let i = 1;

  if (role) { conditions.push(`role = $${i}`); params.push(role); i++; }
  const where = `WHERE ${conditions.join(' AND ')}`;

  try {
    const { rows: [{ total }] } = await pool.query(`SELECT COUNT(*)::int as total FROM users ${where}`, params);
    const { rows: users } = await pool.query(
      `SELECT id, name, email, role, created_at FROM users ${where} ORDER BY created_at DESC LIMIT $${i} OFFSET $${i + 1}`,
      [...params, parseInt(limit), parseInt(offset)]
    );
    res.json({ users, total, page: parseInt(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT role FROM users WHERE id = $1', [req.params.id]);
    if (!rows.length) return res.status(404).json({ message: 'User not found' });
    if (rows[0].role === 'admin') return res.status(403).json({ message: 'Cannot delete admin' });
    await pool.query('DELETE FROM users WHERE id = $1', [req.params.id]);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAllJobs = async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const offset = (page - 1) * limit;
  try {
    const { rows: [{ total }] } = await pool.query('SELECT COUNT(*)::int as total FROM jobs');
    const { rows: jobs } = await pool.query(
      `SELECT j.*, u.name as employer_name,
        (SELECT COUNT(*) FROM applications a WHERE a.job_id = j.id)::int as application_count
       FROM jobs j JOIN users u ON j.user_id = u.id
       ORDER BY j.created_at DESC LIMIT $1 OFFSET $2`,
      [parseInt(limit), parseInt(offset)]
    );
    res.json({ jobs, total, page: parseInt(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteJob = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT id FROM jobs WHERE id = $1', [req.params.id]);
    if (!rows.length) return res.status(404).json({ message: 'Job not found' });
    await pool.query('DELETE FROM jobs WHERE id = $1', [req.params.id]);
    res.json({ message: 'Job deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
