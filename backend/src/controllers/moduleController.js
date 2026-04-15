const { pool } = require('../config/db');

// GET /api/modules
const getAllModules = async (req, res, next) => {
  try {
    const userId = req.user?.id || null;

    const [modules] = await pool.query(
      'SELECT id, title, description, order_index, created_at FROM modules ORDER BY order_index ASC'
    );

    if (userId) {
      const [progress] = await pool.query(
        'SELECT module_id, completed, last_accessed FROM user_progress WHERE user_id = ?',
        [userId]
      );
      const progressMap = {};
      progress.forEach((p) => { progressMap[p.module_id] = p; });

      const modulesWithProgress = modules.map((m) => ({
        ...m,
        completed: progressMap[m.id]?.completed || false,
        last_accessed: progressMap[m.id]?.last_accessed || null,
      }));
      return res.json({ success: true, modules: modulesWithProgress });
    }

    res.json({ success: true, modules });
  } catch (err) {
    next(err);
  }
};

// GET /api/modules/:id
const getModuleById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT * FROM modules WHERE id = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Module not found.' });
    }

    const module = rows[0];
    if (module.content_json && typeof module.content_json === 'string') {
      module.content = JSON.parse(module.content_json);
      delete module.content_json;
    }

    res.json({ success: true, module });
  } catch (err) {
    next(err);
  }
};

// GET /api/modules/:id/progress  (protected)
const getModuleProgress = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const [rows] = await pool.query(
      'SELECT * FROM user_progress WHERE user_id = ? AND module_id = ?',
      [userId, id]
    );

    const progress = rows[0] || { completed: false, last_accessed: null };
    res.json({ success: true, progress });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllModules, getModuleById, getModuleProgress };
