# AMADOX ERP - Deployment Guide

This guide details instructions on how to compile, package, configure environment variables, and deploy the AMADOX Enterprise AI Powered Cloud ERP Suite on cloud hosting environments.

---

## 🚀 Live Production Targets
* **Frontend UI (Vercel)**: [https://amdox-erp-suite-gold.vercel.app](https://amdox-erp-suite-gold.vercel.app)
* **Backend Node Web Service (Render)**: [https://amdox-erp-suite-prod.onrender.com](https://amdox-erp-suite-prod.onrender.com) (or similar connected web endpoint)

---

## 📦 Part A: Backend Deployment on Render

Render handles Node.js Express server compilation and deployment:
1. Log in to [Render](https://render.com/) with GitHub.
2. Select **New** > **Web Service**.
3. Link the repository `Born-as-Harsha/amdox-erp-suite`.
4. Configure variables in the wizard:
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
5. Click **Advanced** and add the following Environment variables:
   - `PORT` = `5000`
   - `MONGO_URI` = `mongodb+srv://<db_user>:<db_pass>@cluster0.xpkeafv.mongodb.net/erp_database?retryWrites=true&w=majority`
   - `JWT_SECRET` = `<your_jwt_secret_token>`
6. Deploy the web service. Note the allocated Render URL (e.g. `https://amdox-erp-suite.onrender.com`).

---

## 🎨 Part B: Frontend Deployment on Vercel

Vite compiles optimized production assets into the static `dist/` folder:
1. Log in to [Vercel](https://vercel.com/) with GitHub.
2. Click **Add New** > **Project** and select your repository.
3. Configure the following project parameters:
   - **Framework Preset**: `Vite` (automatic)
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add the following **Environment Variables**:
   - `VITE_API_URL` = `https://<your-backend-render-url>.onrender.com/api`
5. Click **Deploy**. Vercel will trigger automated git-push builds whenever you push to your `main` branch.
