const router = require('express').Router();
const { body } = require('express-validator');
const { register, login, me } = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');

router.post('/register', [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').optional().isIn(['job_seeker', 'employer']).withMessage('Invalid role'),
], register);

router.post('/login', [
  body('email').isEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password required'),
], login);

router.get('/me', authenticate, me);

module.exports = router;
