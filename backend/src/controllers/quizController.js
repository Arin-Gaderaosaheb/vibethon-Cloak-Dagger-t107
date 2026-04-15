const { pool } = require('../config/db');

// GET /api/modules/:id/questions
const getQuestions = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [moduleCheck] = await pool.query('SELECT id FROM modules WHERE id = ?', [id]);
    if (moduleCheck.length === 0) {
      return res.status(404).json({ success: false, message: 'Module not found.' });
    }

    const [questions] = await pool.query(
      'SELECT id, question_text, options_json FROM questions WHERE module_id = ? ORDER BY id ASC',
      [id]
    );

    const parsed = questions.map((q) => ({
      id: q.id,
      question: q.question_text,
      options: typeof q.options_json === 'string' ? JSON.parse(q.options_json) : q.options_json,
    }));

    res.json({ success: true, questions: parsed, total: parsed.length });
  } catch (err) {
    next(err);
  }
};

// POST /api/modules/:id/quiz/submit  (protected)
const submitQuiz = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { answers } = req.body; // [{ question_id, selected_answer }]
    const userId = req.user.id;

    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({ success: false, message: 'Answers array is required.' });
    }

    // Fetch questions with correct answers
    const questionIds = answers.map((a) => a.question_id);
    const placeholders = questionIds.map(() => '?').join(',');
    const [questions] = await pool.query(
      `SELECT id, question_text, correct_answer, options_json FROM questions WHERE id IN (${placeholders}) AND module_id = ?`,
      [...questionIds, id]
    );

    if (questions.length === 0) {
      return res.status(404).json({ success: false, message: 'No questions found for this module.' });
    }

    // Calculate score
    const questionMap = {};
    questions.forEach((q) => { questionMap[q.id] = q; });

    let score = 0;
    const feedback = answers.map((a) => {
      const q = questionMap[a.question_id];
      if (!q) return { question_id: a.question_id, correct: false, message: 'Question not found' };

      const isCorrect = String(a.selected_answer).trim().toLowerCase() ===
        String(q.correct_answer).trim().toLowerCase();
      if (isCorrect) score++;

      return {
        question_id: a.question_id,
        question: q.question_text,
        selected: a.selected_answer,
        correct_answer: q.correct_answer,
        is_correct: isCorrect,
        options: typeof q.options_json === 'string' ? JSON.parse(q.options_json) : q.options_json,
      };
    });

    const total = questions.length;
    const percentage = Math.round((score / total) * 100);
    const points = score * 10;

    // Save score to DB
    await pool.query(
      'INSERT INTO scores (user_id, module_id, score, total, percentage, points) VALUES (?, ?, ?, ?, ?, ?)',
      [userId, id, score, total, percentage, points]
    );

    // Update progress
    await pool.query(
      `INSERT INTO user_progress (user_id, module_id, completed, last_accessed)
       VALUES (?, ?, TRUE, NOW())
       ON DUPLICATE KEY UPDATE completed = TRUE, last_accessed = NOW()`,
      [userId, id]
    );

    res.json({
      success: true,
      score,
      total,
      percentage,
      points,
      message: `You scored ${score}/${total} (${percentage}%)! You earned ${points} points.`,
      feedback,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getQuestions, submitQuiz };
