const { pool } = require('../config/database');

exports.saveJob = async (req, res) => {
  const { id: jobId } = req.params;
  const userId = req.user.id;

  try {
    const { rows: job } = await pool.query('SELECT id FROM jobs WHERE id = $1', [jobId]);
    if (!job.length) return res.status(404).json({ message: 'Job not found' });

    const { rows: existing } = await pool.query(
      'SELECT id FROM saved_jobs WHERE user_id = $1 AND job_id = $2',
      [userId, jobId]
    );
    if (existing.length) {
      await pool.query('DELETE FROM saved_jobs WHERE user_id = $1 AND job_id = $2', [userId, jobId]);
      return res.json({ saved: false, message: 'Job unsaved' });
    }

    await pool.query('INSERT INTO saved_jobs (user_id, job_id) VALUES ($1, $2)', [userId, jobId]);
    res.status(201).json({ saved: true, message: 'Job saved' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getSavedJobs = async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT j.*, u.name as employer_name, sj.created_at as saved_at
       FROM saved_jobs sj
       JOIN jobs j ON sj.job_id = j.id
       JOIN users u ON j.user_id = u.id
       WHERE sj.user_id = $1
       ORDER BY sj.created_at DESC`,
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
