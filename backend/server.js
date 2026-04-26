const app = require('./app');
const { initDB } = require('./config/database');

const PORT = process.env.PORT || 5000;

initDB()
  .then(() => app.listen(PORT, () => console.log(`Server running on port ${PORT}`)))
  .catch((err) => { console.error('DB init failed:', err); process.exit(1); });
