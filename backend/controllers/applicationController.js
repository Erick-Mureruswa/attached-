const { pool } = require('../config/database');

exports.apply = async (req, res) => {
  const { id: jobId } = req.params;
  const userId = req.user.id;

  try {
    const { rows: job } = await pool.query('SELECT * FROM jobs WHERE id = $1', [jobId]);
    if (!job.length) return res.status(404).json({ message: 'Job not found' });

    const { rows: existing } = await pool.query(
      'SELECT id FROM applications WHERE user_id = $1 AND job_id = $2',
      [userId, jobId]
    );
    if (existing.length) return res.status(409).json({ message: 'You have already applied for this job' });

    const cvPath = req.file ? req.file.path.replace(/\\/g, '/') : null;
    const coverLetter = req.body.cover_letter || null;

    const { rows } = await pool.query(
      'INSERT INTO applications (user_id, job_id, cv_path, cover_letter) VALUES ($1, $2, $3, $4) RETURNING id',
      [userId, jobId, cvPath, coverLetter]
    );
    res.status(201).json({ message: 'Application submitted successfully', id: rows[0].id });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getMyApplications = async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT a.*, j.title as job_title, j.location, j.type, j.salary,
              u.name as employer_name
       FROM applications a
       JOIN jobs j ON a.job_id = j.id
       JOIN users u ON j.user_id = u.id
       WHERE a.user_id = $1
       ORDER BY a.created_at DESC`,
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getJobApplications = async (req, res) => {
  const { id: jobId } = req.params;
  try {
    const { rows: job } = await pool.query('SELECT * FROM jobs WHERE id = $1', [jobId]);
    if (!job.length) return res.status(404).json({ message: 'Job not found' });
    if (job[0].user_id !== req.user.id && req.user.role !== 'admin')
      return res.status(403).json({ message: 'Not authorized' });

    const { rows } = await pool.query(
      `SELECT a.*, u.name as applicant_name, u.email as applicant_email
       FROM applications a JOIN users u ON a.user_id = u.id
       WHERE a.job_id = $1 ORDER BY a.created_at DESC`,
      [jobId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const allowed = ['Pending', 'Reviewed', 'Accepted', 'Rejected'];
  if (!allowed.includes(status)) return res.status(422).json({ message: 'Invalid status' });

  try {
    const { rows } = await pool.query(
      `SELECT a.*, j.user_id as employer_id FROM applications a JOIN jobs j ON a.job_id = j.id WHERE a.id = $1`,
      [id]
    );
    if (!rows.length) return res.status(404).json({ message: 'Application not found' });
    if (rows[0].employer_id !== req.user.id && req.user.role !== 'admin')
      return res.status(403).json({ message: 'Not authorized' });

    await pool.query('UPDATE applications SET status = $1, updated_at = NOW() WHERE id = $2', [status, id]);
    res.json({ message: 'Status updated', status });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
