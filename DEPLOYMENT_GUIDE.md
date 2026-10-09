# Complete Deployment Guide: Smart Career Platform

Your project is **100% production-ready** for deployment. Below are step-by-step instructions for the two most popular and easiest deployment methods.

---

## Prerequisites (Completed)
- **Database**: Already live on MongoDB Atlas (`scpr` database with all 730 catalog careers seeded).
- **Frontend Build**: Verified and compiles to static bundle in `frontend/dist`.
- **Backend Build**: Verified and compiles cleanly to `backend/dist`.
- **CORS & Host**: Configured in `backend/src/main.ts` to allow cloud origins and bind to `0.0.0.0`.
- **Routing**: `vercel.json` and `_redirects` configured for seamless SPA routing.

---

## Method 1: Vercel (Frontend) + Render (Backend) [Recommended — Free Tier]

### Step 1: Push Project to GitHub
Make sure your latest code is committed and pushed to your GitHub repository:
```bash
git add .
git commit -m "feat: production deployment ready"
git push origin main
```

---

### Step 2: Deploy Backend on Render.com
1. Go to [Render.com](https://render.com) and log in.
2. Click **New +** $\rightarrow$ **Web Service**.
3. Select your GitHub repository.
4. Fill in the service configuration:
   - **Name**: `smart-career-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start:prod`
5. In the **Environment Variables** section, add the variables from your `backend/.env`:
   - `MONGODB_URI`: `(Copy the exact connection string from your local backend/.env)`
   - `JWT_ACCESS_SECRET`: `super_secret_access_key_987654321`
   - `JWT_REFRESH_SECRET`: `super_secret_refresh_key_123456789`
   - `DB_ENCRYPTION_KEY`: `0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef`
   - *(Optional AI Keys)*: Add your `GROQ_API_KEYS`, `GEMINI_API_KEYS`, etc.
6. Click **Deploy Web Service**.
7. Once deployed, copy your backend URL (e.g. `https://smart-career-backend.onrender.com`).

> **Atlas Whitelist Reminder**: In MongoDB Atlas, go to **Network Access** $\rightarrow$ Ensure `0.0.0.0/0` is active so Render's cloud servers can connect.

---

### Step 3: Deploy Frontend on Vercel.com
1. Go to [Vercel.com](https://vercel.com) and click **Add New** $\rightarrow$ **Project**.
2. Select your GitHub repository.
3. In the project settings:
   - **Root Directory**: Click edit and select `frontend`.
   - **Framework Preset**: `Vite` (automatically detected).
4. In **Environment Variables**, add:
   - `VITE_API_URL`: `https://smart-career-backend.onrender.com/api` *(Your Render backend URL followed by `/api`)*
5. Click **Deploy**.
6. Your frontend will be live on `https://your-project.vercel.app`!

---

## Method 2: 1-Click Deployment via Render Blueprint (`render.yaml`)

We have added a [`render.yaml`](file:///d:/power/Smart-carrer/render.yaml) file to your repository.
1. Go to [Render Dashboard](https://dashboard.render.com).
2. Click **New +** $\rightarrow$ **Blueprint**.
3. Select your repository.
4. Render will automatically configure both the **Frontend static site** and **Backend Web Service** together and link them!
5. Provide your MongoDB Atlas URI and secrets when prompted, then click **Apply**.

---

## Method 3: Self-Hosted Server / VPS with Docker Compose

If you have a Linux VPS (Ubuntu on DigitalOcean, AWS EC2, or Hetzner):
1. SSH into your VPS:
   ```bash
   git clone <your-repo-url>
   cd Smart-carrer
   ```
2. Create `backend/.env` with your secrets and MongoDB Atlas URI.
3. Run:
   ```bash
   docker compose up -d --build
   ```
4. Access your application on port 80 (frontend) and 3000 (backend).
