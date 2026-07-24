# AMADOX ERP - Enterprise AI-Powered Cloud ERP Suite

[![Deployment Status](https://img.shields.io/badge/Deployment-Production%20Live-brightgreen.svg)](https://amdox-erp-suite-gold.vercel.app)
[![Vite Build](https://img.shields.io/badge/Vite-v8.1.0-blue.svg)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-v18%2B-green.svg)](https://nodejs.org/)
[![Database](https://img.shields.io/badge/MongoDB-Atlas-emerald.svg)](https://www.mongodb.com/cloud/atlas)

**AMADOX ERP** is a production-ready, full-featured Enterprise Resource Planning (ERP) Suite built using **React (Vite)**, **Node.js (Express)**, and **MongoDB (Mongoose)**. It features granular **Role-Based Access Control (RBAC)** across 13 enterprise roles, Multi-Factor Authentication (MFA OTP) via SMS & Email, real-time Server-Sent Events (SSE) notification streaming, interactive task Kanban boards, global command palette search (`Ctrl + K`), and automated PDF/CSV report generation.

---

## 🌐 Production URLs

* **Frontend Web Application (Vercel)**: [https://amdox-erp-suite-gold.vercel.app](https://amdox-erp-suite-gold.vercel.app)
* **Backend Web Service (Render)**: [https://amdox-erp-suite.onrender.com](https://amdox-erp-suite.onrender.com)

---

## 🚀 Key Platform Features

### 🔐 Multi-Credential Authentication & MFA OTP Flow
* **Unified Login Credentials**: Supports sign-in using **Email**, **Username**, **Employee ID**, or **Mobile Phone Number**.
* **Dual-Channel OTP Delivery**: Generates 6-digit MFA verification codes dispatched simultaneously via **Twilio SMS** (`+917901446220`) and **Nodemailer SMTP Email**.
* **Master QA Testing Bypass**: For instant QA testing without SMS delay, enter Master OTP code **`123456`** for target phone `7901446220` or offline staging.
* **Security Standards**: Password & OTP tokens encrypted using **Bcrypt** (10 salt rounds). Mongoose **TTL Indexing (`expiresAt: 5 min`)** automatically purges expired OTPs from the database.

### 🔔 Real-Time Event Streaming & Notifications
* **Server-Sent Events (SSE)**: Persistent EventSource stream connection (`/api/notifications/stream`) delivering real-time announcements.
* **Synthesized Audio Alerts**: Utilizes browser **Web Audio API** to generate sound alerts upon receiving broadcasts.
* **Targeted Filtering**: Broadcast notifications by User ID, Department, Role type, or Company-wide.

### 📇 Digital Employee ID Badge & QR Verification
* **Visual ID Card**: Interactive digital identity badge rendering employee designation, department, and ID.
* **Secured QR Verification**: Integrates real-time QR code generation. Scanning the QR code validates employee credentials.
* **Print / Save PDF**: One-click printable layout to save or print official corporate ID cards.

### 📊 Comprehensive Business Modules
* **Dashboard**: Role-tailored KPI metric cards, revenue trends, inventory alerts, and project progress charts.
* **User Directory (`/users`)**: Search, filter, edit, status toggling, CSV download, and printable PDF table reports.
* **Finance (`/finance`)**: Income/Expense ledgers, balance calculations, transaction filters.
* **Inventory (`/inventory`)**: SKU management, low stock alert badges, supplier delivery categorizations.
* **Projects & Tasks (`/projects`, `/tasks`)**: Deliverable Kanban task boards, milestone progress bars, automated task assignment alerts.
* **Audit Logs (`/audit-logs`)**: Date-specific filtering, Excel CSV export, printable PDF audit sheets.
* **Command Palette (`Ctrl + K` or `/`)**: Instant keyboard search overlay querying Employees, Products, Invoices, Projects, and Tasks.

---

## 🔒 13 Enterprise Roles & Demo Accounts

All 13 accounts are seeded in the database with mobile number **`7901446220`** for testing:

| Employee ID | Name | Role | Username | Corporate Email | Password | Primary Phone |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **EMP001** | Super Admin | **Super Admin** | `superadmin` | `admin@amadox.com` | `Admin@123` | **7901446220** |
| **EMP002** | Harsha Admin | **Admin** | `admin` | `operations@amadox.com` | `Admin123@` | **7901446220** |
| **EMP003** | HR Manager | **HR Manager** | `hrmanager` | `hr.manager@amadox.com` | `HR123@` | **7901446220** |
| **EMP004** | HR Executive | **HR Executive** | `hrexecutive` | `hr.executive@amadox.com` | `HRExec123@` | **7901446220** |
| **EMP005** | Finance Manager | **Finance Manager** | `financemanager` | `finance@amadox.com` | `Finance123@` | **7901446220** |
| **EMP006** | Accountant | **Accountant** | `accountant` | `accounts@amadox.com` | `Accounts123@` | **7901446220** |
| **EMP007** | Inventory Manager | **Inventory Manager** | `inventorymanager` | `inventory@amadox.com` | `Inventory123@` | **7901446220** |
| **EMP008** | Store Keeper | **Store Keeper** | `storekeeper` | `store@amadox.com` | `Store123@` | **7901446220** |
| **EMP009** | Project Manager | **Project Manager** | `projectmanager` | `pm@amadox.com` | `Project123@` | **7901446220** |
| **EMP010** | Project Lead | **Project Lead** | `projectlead` | `lead@amadox.com` | `Lead123@` | **7901446220** |
| **EMP011** | Standard Employee | **Employee** | `employee` | `employee@amadox.com` | `Employee123@` | **7901446220** |
| **EMP012** | CEO Executive | **Executive** | `executive` | `executive@amadox.com` | `Executive123@` | **7901446220** |
| **EMP013** | General Viewer | **Viewer** | `viewer` | `viewer@amadox.com` | `Viewer123@` | **7901446220** |

---

## 🏗️ System Architecture

```text
Amdox-ERP-Internship/
├── backend/
│   ├── config/              # Database connection & automated user seeds
│   ├── controllers/         # Auth, User, Employee, Inventory, Finance, Task controllers
│   ├── middleware/          # JWT authorization & RBAC permission guards
│   ├── models/              # Mongoose schemas (User, Role, OTP, AuditLog, Task, etc.)
│   ├── routes/              # Express API endpoint declarations
│   └── server.js            # Express application entrypoint
└── frontend/
    ├── public/              # Static assets & web manifest
    ├── src/
    │   ├── api/             # Centralized module API wrappers
    │   ├── components/      # UI components (Header, Sidebar, NotificationCenter, CommandPalette)
    │   ├── context/         # AuthContext and SearchContext state providers
    │   ├── pages/           # Module Views (Dashboard, Users, HR, Inventory, Finance, Projects, Settings)
    │   ├── services/        # Axios HTTP client with 30s timeout & token interceptors
    │   ├── utils/           # Helper libraries & image resolution
    │   ├── App.jsx          # Protected route registration & layout mounting
    │   └── main.jsx         # React application bootstrapping
    └── vercel.json          # Vercel SPA routing rewrites configuration
```

---

## 🔧 Installation & Local Setup

### 1. Prerequisites
* Node.js (v18.x or higher)
* MongoDB (Local instance or MongoDB Atlas cluster)

### 2. Backend Setup
Create a `.env` file in `backend/`:
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/erp_database?retryWrites=true&w=majority
JWT_SECRET=amdox_erp_super_secret_key_2026

# Optional: Twilio SMS Integration
TWILIO_ACCOUNT_SID=ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
TWILIO_AUTH_TOKEN=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
TWILIO_PHONE_NUMBER=+1855XXXXXXX
```

Run backend in development mode:
```bash
cd backend
npm install
npm run dev
```

### 3. Frontend Setup
Create a `.env` file in `frontend/`:
```env
VITE_API_URL=http://localhost:5000/api
```

Run frontend development server:
```bash
cd frontend
npm install
npm run dev
```

---

## 📈 Deployment & Build Verification

To compile the production-ready client bundle:
```bash
cd frontend
npm run build
```

Vite compiles optimized production assets into `frontend/dist/`. Vercel automatically deploys updates pushed to the `main` GitHub branch.

---

## 📄 License & Credits
Developed for **AMADOX Technologies Pvt. Ltd.** Enterprise ERP Suite. All rights reserved.
