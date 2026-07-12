# AMADOX ERP - Enterprise AI Powered Cloud ERP Suite

AMADOX ERP is a full-featured, production-ready Enterprise Resource Planning (ERP) Suite built using React, Vite, Node.js, Express, and MongoDB (Mongoose). It provides granular Role-Based Access Control (RBAC) to support HR, Finance, Inventory, Project Management, and Executive analytics.

---

## 🏗️ System Architecture

The project follows a decoupled client-server architecture model:

```text
Amdox-ERP-Internship/
├── backend/
│   ├── config/              # Database seeds & connections
│   ├── controllers/         # Model logic (Auth, Employee, Finance, Projects, etc)
│   ├── middleware/          # JWT check & validation guards
│   ├── models/              # MongoDB Mongoose Schemas (User, Employee, Finance, Project, etc)
│   ├── routes/              # Express API endpoint declarations
│   └── server.js            # Express server configuration
└── frontend/
    ├── src/
    │   ├── api/             # Centralized Axios API bindings
    │   ├── components/      # layout grids (Navbar, Sidebar, ProtectedRoute)
    │   ├── context/         # AuthContext and SearchContext Providers
    │   ├── pages/           # Pages (Dashboard, Employees, HR, Inventory, Finance, Projects, Executive, Settings)
    │   ├── utils/           # Base64 helper libraries
    │   ├── App.jsx          # Route registration
    │   └── main.jsx         # App bootstrapping
```

---

## 🔒 Role-Based Access Control (RBAC) Matrix

| Route | Role | Description |
|---|---|---|
| `/dashboard` | All Roles | Renders dynamic cards and analytics charts customized to the active role |
| `/employees` | HR, Super Admin | List, onboard, edit, and delete employee files |
| `/payroll` | HR, Super Admin | Review payroll summaries, slips lists, and CSV downloads |
| `/attendance` | HR, Super Admin | Daily check-in lists, clocks, and tardiness reports |
| `/leave` | HR, Super Admin | Approve/Reject leave requests with status decisions |
| `/inventory` | Inventory Manager, Super Admin | Stock quantities, categorizations, and suppliers deliveries charts |
| `/suppliers` | Inventory Manager, Super Admin | Vendor phone indices and category supply channels |
| `/finance` | Finance, Super Admin | Cash inflow vs outflow trackers, ledger rows, and exports |
| `/projects` | Project Manager, Super Admin | Milestones progress bars, budgets, and managers lists |
| `/tasks` | Project Manager, Super Admin | Deliverables Kanban to-do boards |
| `/analytics` | Executive, Super Admin | EBIT margins, ROI returns, net margins, and read-only growth trend charts |
| `/reports` | All Roles | General compiled report lists, print layout, and Excel exports |
| `/settings` | All Roles | Profile uploader, pass updates, visual theme select |

---

## 🧑‍💻 Seeding official demo credentials
To simplify evaluations, the backend automatically seeds and synchronizes these accounts on start:

- **Super Admin**: `admin@amdox.com` / `Admin@123`
- **HR**: `hr@amdox.com` / `HR@123`
- **Finance**: `finance@amdox.com` / `Finance@123`
- **Inventory Manager**: `inventory@amdox.com` / `Inventory@123`
- **Project Manager**: `project@amdox.com` / `Project@123`
- **Executive**: `executive@amdox.com` / `Executive@123`

---

## 🔧 Installation & Setup

### 1. Prerequisites
Ensure you have Node.js and MongoDB running.

### 2. Backend Config
Create a `.env` in `backend/`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/amadox_erp
JWT_SECRET=amadox_jwt_secret_token
```
Install and run in dev:
```bash
cd backend
npm install
npm run dev
```

### 3. Frontend Config
Install and run:
```bash
cd frontend
npm install
npm run dev
```

---

## 📈 Deployment
To compile the Vite production-ready client bundle:
```bash
cd frontend
npm run build
```
Optimized assets will compile into `frontend/dist/` for production server mount.
