require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

const allowedOrigins = process.env.CLIENT_URL
  ? [process.env.CLIENT_URL, 'http://localhost:5173']
  : ['http://localhost:5173'];

app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    cb(null, true); // allow all in prod (same-domain Vercel deployment)
  },
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/jobs', require('./routes/jobs'));
app.use('/api', require('./routes/applications'));
app.use('/api', require('./routes/savedJobs'));
app.use('/api/admin', require('./routes/admin'));

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.use((err, req, res, next) => {
  if (err.code === 'LIMIT_FILE_SIZE') return res.status(413).json({ message: 'File too large. Max 5MB.' });
  res.status(500).json({ message: err.message || 'Internal server error' });
});

module.exports = app;
