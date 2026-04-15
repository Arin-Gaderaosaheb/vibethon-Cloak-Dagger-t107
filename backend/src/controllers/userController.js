const { pool } = require('../config/db');

// GET /api/user/progress  (protected)
const getUserProgress = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const [rows] = await pool.query(
      `SELECT up.id, up.module_id, m.title AS module_title, up.completed, up.last_accessed
       FROM user_progress up
       JOIN modules m ON m.id = up.module_id
       WHERE up.user_id = ?
       ORDER BY up.last_accessed DESC`,
      [userId]
    );

    const total = rows.length;
    const completed = rows.filter((r) => r.completed).length;

    res.json({
      success: true,
      progress: rows,
      summary: { total, completed, percentage: total ? Math.round((completed / total) * 100) : 0 },
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/user/progress  (protected)
const updateProgress = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { module_id, completed } = req.body;

    if (!module_id) {
      return res.status(400).json({ success: false, message: 'module_id is required.' });
    }

    await pool.query(
      `INSERT INTO user_progress (user_id, module_id, completed, last_accessed)
       VALUES (?, ?, ?, NOW())
       ON DUPLICATE KEY UPDATE completed = VALUES(completed), last_accessed = NOW()`,
      [userId, module_id, completed || false]
    );

    res.json({ success: true, message: 'Progress updated.' });
  } catch (err) {
    next(err);
  }
};

// GET /api/user/scores  (protected)
const getUserScores = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const [rows] = await pool.query(
      `SELECT s.id, s.module_id, m.title AS module_title, s.score, s.total,
              s.percentage, s.points, s.attempted_at
       FROM scores s
       JOIN modules m ON m.id = s.module_id
       WHERE s.user_id = ?
       ORDER BY s.attempted_at DESC`,
      [userId]
    );

    const totalPoints = rows.reduce((sum, r) => sum + (r.points || 0), 0);

    res.json({ success: true, scores: rows, totalPoints });
  } catch (err) {
    next(err);
  }
};

module.exports = { getUserProgress, updateProgress, getUserScores };
