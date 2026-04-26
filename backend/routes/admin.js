const router = require('express').Router();
const { authenticate, authorize } = require('../middleware/auth');
const {
  getStats, getUsers, deleteUser, getAllJobs, deleteJob,
} = require('../controllers/adminController');

router.use(authenticate, authorize('admin'));

router.get('/stats', getStats);
router.get('/users', getUsers);
router.delete('/users/:id', deleteUser);
router.get('/jobs', getAllJobs);
router.delete('/jobs/:id', deleteJob);

module.exports = router;
