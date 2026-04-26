const router = require('express').Router();
const { authenticate, authorize } = require('../middleware/auth');
const { saveJob, getSavedJobs } = require('../controllers/savedJobController');

router.post('/save-job/:id', authenticate, authorize('job_seeker'), saveJob);
router.get('/saved-jobs', authenticate, authorize('job_seeker'), getSavedJobs);

module.exports = router;
