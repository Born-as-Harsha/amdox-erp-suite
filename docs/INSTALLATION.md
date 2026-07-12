# AMADOX ERP - Local Installation Guide

This guide details the step-by-step instructions to install, configure, and launch the AMADOX Enterprise AI Powered Cloud ERP Suite on a local environment.

---

## 🏗️ Technical Stack
* **Frontend**: React (Vite, Axios, Context Providers)
* **Backend**: Node.js (Express, JWT, Bcrypt)
* **Database**: MongoDB (Mongoose schemas)

---

## 🛠️ Step 1: Prerequisites
Ensure you have the following software utilities installed on your host system:
1. **Node.js** (v18.x or higher recommended)
2. **MongoDB Community Server** (Local instance running on `mongodb://localhost:27017`)
3. **Git** (For version control operations)

---

## 🔧 Step 2: Clone the Repository
Clone the codebase to your local workspace:
```bash
git clone https://github.com/Born-as-Harsha/amdox-erp-suite.git
cd amdox-erp-suite
```

---

## ⚙️ Step 3: Backend Setup & Seeding

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install all node module dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` configuration file in `backend/` and supply variables:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/erp_database
   JWT_SECRET=amadox_jwt_secret_token
   ```
4. Start the server (which automatically invokes database seeding for all 13 enterprise roles):
   ```bash
   npm run dev
   ```

Verify that the node logs print:
```text
Server running on port 5000
✅ MongoDB Connected
Enterprise 13 Roles Seeding Completed. ✅
```

---

## 🖥️ Step 4: Frontend Client Setup

1. Open a new terminal console and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install client dependencies:
   ```bash
   npm install
   ```
3. Verify or create a `.env` file in `frontend/` supplying:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
4. Launch the local Vite development server:
   ```bash
   npm run dev
   ```
5. Open your web browser and load:
   `http://localhost:5173`

---

## 🔑 Step 5: Demo Verification Credentials
You can log in to the portal using any of the seeded roles (OTP code will log directly to the backend node terminal screen):

* **Super Admin**: `admin@amadox.com` / Password: `Admin@123` / Phone: `7901446220`
* **HR Manager**: `hr.manager@amadox.com` / Password: `HR123@` / Phone: `7901446220`
* **Finance Manager**: `finance@amadox.com` / Password: `Finance123@` / Phone: `7901446220`
* **Standard Employee**: `employee@amadox.com` / Password: `Employee123@` / Phone: `7901446220`
