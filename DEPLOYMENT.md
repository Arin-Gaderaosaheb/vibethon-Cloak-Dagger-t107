# 🚀 Production Deployment Guide (Option A)

This guide provides step-by-step instructions to deploy the AIML Interactive Learning Prototype to **Vercel** (Frontend) and **Render** (Backend).

---

## 🏗️ 1. Backend Migration (Render.com)

Render is recommended for hosting the backend because it provides easy Docker support and managed MySQL databases.

### A. Setup MySQL Database
1. Sign in to [Render](https://dashboard.render.com).
2. Click **New +** > **Database**.
3. Select **MySQL**.
4. Once created, copy the **Internal Database URL** and **External Database URL**.

### B. Setup Backend Web Service
1. Click **New +** > **Web Service**.
2. Connect your GitHub repository.
3. Select the `backend/` directory as the Root Directory.
4. **Runtime:** Select `Docker`. (Render will automatically use the `Dockerfile` I updated for you).
5. **Environment Variables:** Add the following:
   - `PORT`: `5000`
   - `NODE_ENV`: `production`
   - `DATABASE_URL`: (Paste your External MySQL URL)
   - `JWT_SECRET`: (Generate a long random string)
   - `FRONTEND_URL`: `https://your-app-name.vercel.app`
6. Click **Create Web Service**.

---

## 🎨 2. Frontend Deployment (Vercel)

Vercel is the gold standard for Next.js applications.

1. Sign in to [Vercel](https://vercel.com).
2. Click **Add New** > **Project**.
3. Connect your GitHub repository.
4. In the Project configuration:
   - **Root Directory:** Select `frontend/`.
   - **Framework Preset:** Next.js.
5. **Environment Variables:**
   - `NEXT_PUBLIC_API_URL`: `https://your-backend-render-url.onrender.com/api`
6. Click **Deploy**.

---

## 💾 3. Database Migration (Schema)

Once your production MySQL is alive, you need to import the data:

1. Connect to your database using a client like **MySQL Workbench** or **TablePlus** using the External URL.
2. Run the SQL script found in: `backend/migrations/001_create_tables.sql`
3. Run the seed script found in: `backend/seeds/001_seed_modules.sql`

---

## ✅ 4. Final Verification

1. Visit your Vercel URL.
2. Attempt to register a new user.
3. Verify that the **Mini Games** load correctly.
4. Open the **Playground**, select a script, and click "Run Code" to confirm the remote Python environment is working.

---

> [!CAUTION]
> **Security Reminder:** Never share your `.env` files or commit them to GitHub. Always use the hosting provider's "Environment Variables" dashboard to store secrets.
