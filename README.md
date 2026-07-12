# AMADOX ERP - Enterprise AI Powered Cloud ERP Suite

AMADOX ERP is a full-featured, production-ready Enterprise Resource Planning (ERP) Suite built using React, Vite, Node.js, Express, and MongoDB (Mongoose). It provides corporate modules to track employees, manage inventory, audit financials, analyze projects, compile reports, and configure advanced user preferences.

---

## 🛠️ Technology Stack

- **Frontend**: React, React Router v7, Recharts (Data Visualizations), React Icons, Vanilla CSS
- **Backend**: Node.js, Express.js, JWT Authentication, Bcrypt Password Hashing, Cors
- **Database**: MongoDB & Mongoose Object Data Modeling
- **Development Tooling**: Vite, Rollup, Git/GitHub

---

## 🚀 Key Features

1. **Enterprise Layout Grid**:
   - Collapsible sticky sidebar with smooth CSS grid transition animations.
   - Sticky navbar containing notification counters, global user avatar synchronization, and global search.
   - Fixed, relative sticky layout footer with version control branding.
2. **Global Real-Time Search**:
   - Integrated `SearchContext` allowing typing in the central Navbar search input to filter active data grids on the Employees, Inventory, Finance, Projects, and Reports modules.
3. **Data Visualization Dashboard**:
   - KPI cards for staff counts, SKU items, finance balance, and project states.
   - Financial cashflow charts (AreaChart) and category breakdown analytics (BarChart) powered by Recharts.
4. **Employees Directory**:
   - Full CRUD operations synced with database backend.
   - Numerical pagination, sorting on tables column headers, and department/status filtering.
5. **Inventory Ledger**:
   - CRUD management for SKUs, stock status, category filters, and supplier information.
   - Stock valuation distribution visual metrics using Recharts.
6. **Finance & Treasury**:
   - Record ledger transactions (income receipts vs expense payments).
   - CSV export utilities and browser print stylesheet overrides.
7. **Projects Milestones Tracker**:
   - Direct database API CRUD bindings.
   - Dynamic progress bars calculated from status phases.
8. **Reports Compilation**:
   - Compile reports with author tracking.
   - Export spreadsheets as CSV and print clean PDF summaries.
9. **User Preferences & Security**:
   - Dynamic Settings page to upload Base64 profile pictures, change passwords, and configure visibility status.

---

## 🏗️ System Architecture

```text
Amdox-ERP-Internship/
├── backend/
│   ├── config/              # Database connection setups
│   ├── controllers/         # Request handling logic (Auth, Employee, Finance, Projects, etc)
│   ├── middleware/          # JWT auth guard verifies tokens
│   ├── models/              # MongoDB Schemas (User, Employee, Finance, Project, etc)
│   ├── routes/              # Express API endpoint declarations
│   └── server.js            # Express server initialization & body parsers
└── frontend/
    ├── src/
    │   ├── api/             # Central Axios API bindings
    │   ├── components/      # UI Shell structures (Navbar, Sidebar, Footer, ProtectedRoute)
    │   ├── context/         # AuthContext and SearchContext
    │   ├── pages/           # Module views (Dashboard, Employees, Inventory, Finance, Projects, Reports, Settings)
    │   ├── utils/           # Helper libraries (Base64 converter)
    │   ├── App.jsx          # Route registry
    │   └── main.jsx         # App bootstrapping
```

---

## 🔧 Installation & Setup

### 1. Prerequisite Environments
Ensure Node.js and MongoDB are installed on your environment.

### 2. Backend Configuration
Create a `.env` configuration file in `backend/` directory:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/amadox_erp
JWT_SECRET=your_jwt_secret_phrase
```

Install backend dependencies and run development server:
```bash
cd backend
npm install
npm run dev
```

### 3. Frontend Configuration
Install dependencies, compile, and launch the dev environment:
```bash
cd frontend
npm install
npm run dev
```

---

## 📈 Deployment

### Local Production Builds
To test Vite build production compilation:
```bash
cd frontend
npm run build
```
The optimized HTML, CSS, and JS assets will compile into `frontend/dist/` directory, ready to serve via Nginx, Apache, or Node static mounts.

---

## 🧑‍💻 Author

**Yelleti Harshavardhan**
- GitHub: [Born-as-Harsha](https://github.com/Born-as-Harsha)
