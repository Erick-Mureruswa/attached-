const router = require('express').Router();
const { body } = require('express-validator');
const { authenticate, authorize } = require('../middleware/auth');
const {
  getJobs, getJob, createJob, updateJob, deleteJob, getMyJobs,
} = require('../controllers/jobController');

const jobValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('location').trim().notEmpty().withMessage('Location is required'),
];

router.get('/', getJobs);
router.get('/my', authenticate, authorize('employer', 'admin'), getMyJobs);
router.get('/:id', getJob);
router.post('/', authenticate, authorize('employer'), jobValidation, createJob);
router.put('/:id', authenticate, authorize('employer', 'admin'), jobValidation, updateJob);
router.delete('/:id', authenticate, authorize('employer', 'admin'), deleteJob);

module.exports = router;
