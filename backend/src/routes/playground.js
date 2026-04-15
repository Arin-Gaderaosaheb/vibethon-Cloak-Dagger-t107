const express = require('express');
const { executeCode } = require('../controllers/playgroundController');
const { protect } = require('../middleware/auth');
const rateLimit = require('express-rate-limit');

const router = express.Router();

// Stricter rate limiting for code execution to prevent abuse (e.g. 10 requests per minute)
const executionLimiter = rateLimit({
  windowMs: 60 * 1000, 
  max: 10,
  message: { status: 'error', message: 'Too many executions requested from this IP, please try again after a minute' }
});

// Using protect middleware to ONLY allow logged in users to use external compute
router.post('/execute', protect, executionLimiter, executeCode);

module.exports = router;
