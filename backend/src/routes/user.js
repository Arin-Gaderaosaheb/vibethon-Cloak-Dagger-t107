const express = require('express');
const router = express.Router();
const { getUserProgress, updateProgress, getUserScores } = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const { body } = require('express-validator');
const { validate } = require('../middleware/validate');

// GET /api/user/progress  (protected)
router.get('/progress', protect, getUserProgress);

// POST /api/user/progress  (protected)
router.post(
  '/progress',
  protect,
  [
    body('module_id').isInt({ min: 1 }).withMessage('Valid module_id is required'),
    body('completed').isBoolean().withMessage('completed must be boolean'),
  ],
  validate,
  updateProgress
);

// GET /api/user/scores  (protected)
router.get('/scores', protect, getUserScores);

module.exports = router;
