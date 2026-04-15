-- ============================================================
-- AIML Interactive Learning Prototype - Database Migration
-- Run this file to create all required tables
-- ============================================================

CREATE DATABASE IF NOT EXISTS aiml_learning_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE aiml_learning_db;

-- ─── Users ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(100) NOT NULL,
  email         VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email)
) ENGINE=InnoDB;

-- ─── Modules ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS modules (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  title         VARCHAR(200) NOT NULL,
  description   TEXT,
  content_json  LONGTEXT,          -- JSON blob: concept, explanation, example, tips
  order_index   INT DEFAULT 0,
  created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_order (order_index)
) ENGINE=InnoDB;

-- ─── Questions ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS questions (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  module_id      INT NOT NULL,
  question_text  TEXT NOT NULL,
  options_json   TEXT NOT NULL,    -- JSON array: ["A", "B", "C", "D"]
  correct_answer VARCHAR(255) NOT NULL,
  explanation    TEXT,             -- Shown after answer is submitted
  created_at     DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE CASCADE,
  INDEX idx_module (module_id)
) ENGINE=InnoDB;

-- ─── User Progress ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS user_progress (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  user_id       INT NOT NULL,
  module_id     INT NOT NULL,
  completed     TINYINT(1) DEFAULT 0,
  last_accessed DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_user_module (user_id, module_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ─── Scores ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS scores (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  user_id      INT NOT NULL,
  module_id    INT NOT NULL,
  score        INT NOT NULL DEFAULT 0,
  total        INT NOT NULL DEFAULT 0,
  percentage   INT NOT NULL DEFAULT 0,
  points       INT NOT NULL DEFAULT 0,
  attempted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE CASCADE,
  INDEX idx_user_scores (user_id),
  INDEX idx_module_scores (module_id)
) ENGINE=InnoDB;

SELECT 'Migration completed successfully!' AS status;
