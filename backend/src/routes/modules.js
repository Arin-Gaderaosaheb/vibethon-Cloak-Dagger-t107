const express = require('express');
const router = express.Router();
const { getAllModules, getModuleById, getModuleProgress } = require('../controllers/moduleController');
const { getQuestions, submitQuiz } = require('../controllers/quizController');
const { protect } = require('../middleware/auth');

// GET /api/modules
router.get('/', getAllModules);

// GET /api/modules/:id
router.get('/:id', getModuleById);

// GET /api/modules/:id/progress  (protected)
router.get('/:id/progress', protect, getModuleProgress);

// GET /api/modules/:id/questions
router.get('/:id/questions', getQuestions);

// POST /api/modules/:id/quiz/submit  (protected)
router.post('/:id/quiz/submit', protect, submitQuiz);

module.exports = router;
