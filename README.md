# AIML Interactive Learning Prototype

A full-stack interactive web platform for learning core AI/ML concepts through simulations and quizzes.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 + TypeScript + Tailwind CSS |
| Backend | Node.js + Express |
| Database | MySQL 8.0 |
| Auth | JWT (jsonwebtoken + bcryptjs) |
| DevOps | Docker + Docker Compose |

## Project Structure

```
vibethon-Cloak-Dagger-t107/
├── backend/           # Node.js + Express API
│   ├── src/
│   │   ├── config/    # DB connection
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   └── server.js
│   ├── migrations/    # SQL migration scripts
│   ├── seeds/         # SQL seed data
│   ├── .env
│   └── Dockerfile
├── frontend/          # Next.js app
│   └── Dockerfile
├── docker-compose.yml
└── README.md
```

## Quick Start (Docker)

```bash
# Start all services (MySQL + Backend + Frontend)
docker-compose up --build

# API available at: http://localhost:5000/api
# Frontend at:      http://localhost:3000
```

## Manual Setup

### Backend

```bash
cd backend
cp .env.example .env      # Fill in your MySQL credentials
npm install
npm run dev               # Runs with nodemon on port 5000
```

### Database

```bash
# Run migrations and seeds against your MySQL instance
mysql -u root -p < backend/migrations/001_create_tables.sql
mysql -u root -p aiml_learning_db < backend/seeds/001_seed_modules.sql
```

### Frontend

```bash
cd frontend
cp .env.local.example .env.local
npm install
npm run dev               # Runs on port 3000
```

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/health` | — | Health check |
| POST | `/api/auth/register` | — | Register user |
| POST | `/api/auth/login` | — | Login + JWT |
| GET | `/api/auth/me` | ✅ | Get current user |
| GET | `/api/modules` | — | List all modules |
| GET | `/api/modules/:id` | — | Get module detail |
| GET | `/api/modules/:id/questions` | — | Get quiz questions |
| GET | `/api/modules/:id/progress` | ✅ | Get module progress |
| POST | `/api/modules/:id/quiz/submit` | ✅ | Submit quiz |
| GET | `/api/user/progress` | ✅ | Get all user progress |
| POST | `/api/user/progress` | ✅ | Update progress |
| GET | `/api/user/scores` | ✅ | Get score history |

## Learning Modules

- **Module 1**: Decision Trees (Gini, Information Gain, Pruning, 5 quiz questions)
- **Module 2**: Linear Regression (MSE, Gradient Descent, R², 5 quiz questions)