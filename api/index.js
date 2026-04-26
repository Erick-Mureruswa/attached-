const { initDB } = require('../backend/config/database');
const app = require('../backend/app');

let ready = false;

module.exports = async (req, res) => {
  if (!ready) {
    await initDB();
    ready = true;
  }
  return app(req, res);
};
