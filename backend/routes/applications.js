const router = require('express').Router();
const { authenticate, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
  apply, getMyApplications, getJobApplications, updateStatus,
} = require('../controllers/applicationController');

router.post('/jobs/:id/apply', authenticate, authorize('job_seeker'), upload.single('cv'), apply);
router.get('/applications', authenticate, getMyApplications);
router.get('/jobs/:id/applications', authenticate, authorize('employer', 'admin'), getJobApplications);
router.put('/applications/:id/status', authenticate, authorize('employer', 'admin'), updateStatus);

module.exports = router;
