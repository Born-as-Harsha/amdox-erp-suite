import "./Dashboard.css";
import { useEffect, useState, useMemo } from "react";
import {
    FaUsers,
    FaBoxes,
    FaMoneyBillWave,
    FaProjectDiagram,
    FaChartBar,
    FaPlus,
    FaSpinner,
    FaUserClock,
    FaPlaneDeparture,
    FaCalendarCheck,
    FaFileInvoiceDollar,
    FaExclamationTriangle,
    FaWarehouse,
    FaCalendarAlt,
    FaCheckCircle,
    FaArrowUp,
    FaArrowDown
} from "react-icons/fa";
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar
} from "recharts";
import { useNavigate } from "react-router-dom";
import {
    getEmployees,
    getInventory,
    getProjects,
    getReports,
    getFinanceStats
} from "../../api/dashboardApi";

function Dashboard() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [stats, setStats] = useState({
        employees: 0,
        products: 0,
        projects: 0,
        reports: 0,
        revenue: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        try {
            const storedUser = localStorage.getItem("user") || sessionStorage.getItem("user");
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
        } catch (e) {
            console.error(e);
        }
        fetchDashboardData();
    }, []);

    async function fetchDashboardData() {
        try {
            const [
                employeeRes,
                inventoryRes,
                projectRes,
                reportRes,
                financeRes
            ] = await Promise.all([
                getEmployees().catch(() => ({ data: [] })),
                getInventory().catch(() => ({ data: [] })),
                getProjects().catch(() => ({ data: [] })),
                getReports().catch(() => ({ data: [] })),
                getFinanceStats().catch(() => ({ data: { totalIncome: 0 } }))
            ]);

            setStats({
                employees: employeeRes?.data?.length || 0,
                products: inventoryRes?.data?.length || 0,
                projects: projectRes?.data?.length || 0,
                reports: reportRes?.data?.length || 0,
                revenue: financeRes?.data?.totalIncome || 0
            });
        } catch (err) {
            console.error("Dashboard statistics loading failure", err);
        } finally {
            setLoading(false);
        }
    }

    // Role verification
    const role = user?.role || "Employee";

    // Visual datasets mapping database parameters
    const revenueData = [
        { month: "Jan", Revenue: stats.revenue * 0.45 || 15000, Profit: (stats.revenue * 0.45 || 15000) * 0.3 },
        { month: "Feb", Revenue: stats.revenue * 0.6 || 22000, Profit: (stats.revenue * 0.6 || 22000) * 0.35 },
        { month: "Mar", Revenue: stats.revenue * 0.72 || 31000, Profit: (stats.revenue * 0.72 || 31000) * 0.42 },
        { month: "Apr", Revenue: stats.revenue * 0.85 || 45000, Profit: (stats.revenue * 0.85 || 45000) * 0.4 },
        { month: "May", Revenue: stats.revenue * 0.95 || 58000, Profit: (stats.revenue * 0.95 || 58000) * 0.45 },
        { month: "Jun", Revenue: stats.revenue || 72000, Profit: (stats.revenue || 72000) * 0.48 }
    ];

    const projectAllocationData = [
        { name: "Planning", count: Math.ceil(stats.projects * 0.3) || 2 },
        { name: "In Progress", count: Math.ceil(stats.projects * 0.5) || 4 },
        { name: "Completed", count: Math.ceil(stats.projects * 0.2) || 1 }
    ];

    if (loading) {
        return (
            <div className="dashboard-loading-container">
                <FaSpinner className="spinner" />
                <h2>Assembling Tailored Dashboard Panel...</h2>
            </div>
        );
    }

    // ==========================================
    // RENDER: SUPER ADMIN / ADMIN DASHBOARD
    // ==========================================
    const renderAdminDashboard = () => (
        <>
            <div className="dashboard-kpi-grid">
                <div className="erp-card kpi-card">
                    <div className="kpi-card-header">
                        <FaUsers className="kpi-icon employees" />
                        <span className="erp-badge success">+12%</span>
                    </div>
                    <h3>Total Employees</h3>
                    <h2>{stats.employees}</h2>
                    <small>Headcount registry</small>
                </div>
                <div className="erp-card kpi-card">
                    <div className="kpi-card-header">
                        <FaBoxes className="kpi-icon products" />
                        <span className="erp-badge warning">Low Stock</span>
                    </div>
                    <h3>Inventory SKUs</h3>
                    <h2>{stats.products}</h2>
                    <small>Categorized stock</small>
                </div>
                <div className="erp-card kpi-card">
                    <div className="kpi-card-header">
                        <FaMoneyBillWave className="kpi-icon revenue" />
                        <span className="erp-badge success">+8% MoM</span>
                    </div>
                    <h3>Fiscal Revenue</h3>
                    <h2>₹{stats.revenue.toLocaleString("en-IN")}</h2>
                    <small>Treasury income</small>
                </div>
                <div className="erp-card kpi-card">
                    <div className="kpi-card-header">
                        <FaProjectDiagram className="kpi-icon projects" />
                        <span className="erp-badge primary">In Progress</span>
                    </div>
                    <h3>Active Projects</h3>
                    <h2>{stats.projects}</h2>
                    <small>Milestone grids</small>
                </div>
            </div>

            <div className="dashboard-charts-layout">
                <div className="erp-card chart-card">
                    <h3>Enterprise Revenue Trend</h3>
                    <p>Current fiscal year growth analytics based on transactions stream.</p>
                    <ResponsiveContainer width="100%" height={260}>
                        <AreaChart data={revenueData}>
                            <defs>
                                <linearGradient id="colorAdminRev" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                            <YAxis stroke="#94a3b8" fontSize={12} />
                            <Tooltip />
                            <Area type="monotone" dataKey="Revenue" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorAdminRev)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
                <div className="erp-card chart-card">
                    <h3>Project Breakdown</h3>
                    <p>Current active campaigns categorized by milestones.</p>
                    <ResponsiveContainer width="100%" height={260}>
                        <BarChart data={projectAllocationData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                            <YAxis stroke="#94a3b8" fontSize={12} />
                            <Tooltip />
                            <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={40} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="dashboard-panels-layout">
                <div className="erp-card dashboard-activities-panel">
                    <h3>Recent System Activities</h3>
                    <div className="activity-list-block">
                        <div className="activity-item-block"><span className="activity-dot-indicator success"></span><div className="activity-item-info"><h4>Database backup completed</h4><small>15 mins ago</small></div></div>
                        <div className="activity-item-block"><span className="activity-dot-indicator primary"></span><div className="activity-item-info"><h4>Seed accounts verified</h4><small>1 hour ago</small></div></div>
                        <div className="activity-item-block"><span className="activity-dot-indicator warning"></span><div className="activity-item-info"><h4>High-volume request processed</h4><small>3 hours ago</small></div></div>
                    </div>
                </div>
                <div className="erp-card dashboard-actions-panel">
                    <h3>Super Admin Actions</h3>
                    <div className="dashboard-quick-actions-grid">
                        <button type="button" onClick={() => navigate("/employees")}><FaPlus /> Add Employee</button>
                        <button type="button" onClick={() => navigate("/inventory")}><FaPlus /> Add SKU</button>
                        <button type="button" onClick={() => navigate("/projects")}><FaPlus /> Add Project</button>
                        <button type="button" onClick={() => navigate("/settings")}><FaPlus /> Settings</button>
                    </div>
                </div>
            </div>
        </>
    );

    // ==========================================
    // RENDER: HR DASHBOARD
    // ==========================================
    const renderHRDashboard = () => (
        <>
            <div className="dashboard-kpi-grid">
                <div className="erp-card kpi-card">
                    <div className="kpi-card-header">
                        <FaUsers className="kpi-icon employees" />
                    </div>
                    <h3>Total Headcount</h3>
                    <h2>{stats.employees}</h2>
                    <small>System headcount</small>
                </div>
                <div className="erp-card kpi-card">
                    <div className="kpi-card-header">
                        <FaCalendarCheck className="kpi-icon projects" />
                    </div>
                    <h3>Present Today</h3>
                    <h2>{Math.ceil(stats.employees * 0.85) || 5}</h2>
                    <small>Clocked in</small>
                </div>
                <div className="erp-card kpi-card">
                    <div className="kpi-card-header">
                        <FaPlaneDeparture className="kpi-icon revenue" />
                    </div>
                    <h3>On Leave</h3>
                    <h2>2</h2>
                    <small>Approved leaves</small>
                </div>
                <div className="erp-card kpi-card">
                    <div className="kpi-card-header">
                        <FaUserClock className="kpi-icon reports" />
                    </div>
                    <h3>Active Departments</h3>
                    <h2>4</h2>
                    <small>Personnel categories</small>
                </div>
            </div>

            <div className="dashboard-panels-layout">
                <div className="erp-card">
                    <h3>Recent Joiners</h3>
                    <div className="activity-list-block">
                        <div className="activity-item-block"><div className="activity-item-info"><h4>Vikram Sen</h4><small>Joined Engineering - 2 days ago</small></div></div>
                        <div className="activity-item-block"><div className="activity-item-info"><h4>Priya Nair</h4><small>Joined Sales - 5 days ago</small></div></div>
                        <div className="activity-item-block"><div className="activity-item-info"><h4>Rohan Mehta</h4><small>Joined Finance - 1 week ago</small></div></div>
                    </div>
                </div>
                <div className="erp-card">
                    <h3>HR Quick Access</h3>
                    <div className="dashboard-quick-actions-grid">
                        <button type="button" onClick={() => navigate("/employees")}><FaPlus /> Onboard Staff</button>
                        <button type="button" onClick={() => navigate("/payroll")}><FaFileInvoiceDollar /> Run Payroll</button>
                        <button type="button" onClick={() => navigate("/attendance")}><FaCalendarCheck /> Attendance Logs</button>
                        <button type="button" onClick={() => navigate("/leave")}><FaPlaneDeparture /> Leave List</button>
                    </div>
                </div>
            </div>
        </>
    );

    // ==========================================
    // RENDER: FINANCE DASHBOARD
    // ==========================================
    const renderFinanceDashboard = () => (
        <>
            <div className="dashboard-kpi-grid">
                <div className="erp-card kpi-card">
                    <div className="kpi-card-header">
                        <FaMoneyBillWave className="kpi-icon revenue" />
                    </div>
                    <h3>Total Income</h3>
                    <h2>₹{stats.revenue.toLocaleString("en-IN")}</h2>
                    <small>Fiscal earnings</small>
                </div>
                <div className="erp-card kpi-card">
                    <div className="kpi-card-header">
                        <FaFileInvoiceDollar className="kpi-icon employees" />
                    </div>
                    <h3>Outflow Budget</h3>
                    <h2>₹{(stats.revenue * 0.45).toLocaleString("en-IN")}</h2>
                    <small>Operational expenses</small>
                </div>
                <div className="erp-card kpi-card">
                    <div className="kpi-card-header">
                        <FaMoneyBillWave className="kpi-icon products" />
                    </div>
                    <h3>Net Surplus</h3>
                    <h2 style={{ color: "#16a34a" }}>₹{(stats.revenue * 0.55).toLocaleString("en-IN")}</h2>
                    <small>Available liquidity</small>
                </div>
            </div>

            <div className="dashboard-charts-layout">
                <div className="erp-card chart-card" style={{ gridColumn: "span 2" }}>
                    <h3>Treasury Flows Chart</h3>
                    <p>Earnings vs operating costs distributions for the fiscal period.</p>
                    <ResponsiveContainer width="100%" height={260}>
                        <AreaChart data={revenueData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                            <YAxis stroke="#94a3b8" fontSize={12} />
                            <Tooltip />
                            <Area type="monotone" dataKey="Revenue" stroke="#16a34a" fill="#16a34a" fillOpacity={0.1} strokeWidth={2} name="Income" />
                            <Area type="monotone" dataKey="Profit" stroke="#ef4444" fill="#ef4444" fillOpacity={0.1} strokeWidth={2} name="Expense" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </>
    );

    // ==========================================
    // RENDER: INVENTORY DASHBOARD
    // ==========================================
    const renderInventoryDashboard = () => (
        <>
            <div className="dashboard-kpi-grid">
                <div className="erp-card kpi-card">
                    <div className="kpi-card-header">
                        <FaBoxes className="kpi-icon products" />
                    </div>
                    <h3>SKU Catalog</h3>
                    <h2>{stats.products}</h2>
                    <small>Total unique products</small>
                </div>
                <div className="erp-card kpi-card">
                    <div className="kpi-card-header">
                        <FaWarehouse className="kpi-icon projects" />
                    </div>
                    <h3>Warehouse capacity</h3>
                    <h2>84%</h2>
                    <small>Active footprint</small>
                </div>
                <div className="erp-card kpi-card">
                    <div className="kpi-card-header">
                        <FaExclamationTriangle className="kpi-icon revenue" />
                    </div>
                    <h3>Low Stock SKU Check</h3>
                    <h2 style={{ color: "#ef4444" }}>1</h2>
                    <small>Items below safety margin</small>
                </div>
            </div>

            <div className="dashboard-panels-layout">
                <div className="erp-card">
                    <h3>Low Stock Alerts</h3>
                    <div className="activity-list-block">
                        <div className="activity-item-block" style={{ padding: "10px", background: "#fef2f2", borderRadius: "8px", borderLeft: "4px solid #ef4444" }}>
                            <div className="activity-item-info">
                                <h4 style={{ color: "#ef4444" }}>SKU102: Mechanical Keyboards</h4>
                                <small>Quantity: 5 left (Threshold: 10)</small>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="erp-card">
                    <h3>Logistics Shortcuts</h3>
                    <div className="dashboard-quick-actions-grid">
                        <button type="button" onClick={() => navigate("/inventory")}><FaPlus /> Add SKU Item</button>
                        <button type="button" onClick={() => navigate("/suppliers")}><FaPlus /> Supplier Directory</button>
                    </div>
                </div>
            </div>
        </>
    );

    // ==========================================
    // RENDER: PROJECT MANAGER DASHBOARD
    // ==========================================
    const renderProjectDashboard = () => (
        <>
            <div className="dashboard-kpi-grid">
                <div className="erp-card kpi-card">
                    <div className="kpi-card-header">
                        <FaProjectDiagram className="kpi-icon projects" />
                    </div>
                    <h3>Total Campaigns</h3>
                    <h2>{stats.projects}</h2>
                    <small>Assigned projects</small>
                </div>
                <div className="erp-card kpi-card">
                    <div className="kpi-card-header">
                        <FaCalendarAlt className="kpi-icon reports" />
                    </div>
                    <h3>Active Milestones</h3>
                    <h2>5</h2>
                    <small>Milestone deadlines</small>
                </div>
                <div className="erp-card kpi-card">
                    <div className="kpi-card-header">
                        <FaCheckCircle className="kpi-icon employees" />
                    </div>
                    <h3>Completed</h3>
                    <h2>2</h2>
                    <small>Archived campaigns</small>
                </div>
            </div>

            <div className="dashboard-panels-layout">
                <div className="erp-card">
                    <h3>Milestones Timeline</h3>
                    <div className="activity-list-block">
                        <div className="activity-item-block"><div className="activity-item-info"><h4>ERP Database Deployment</h4><small>Deadline: 2026-07-20</small></div></div>
                        <div className="activity-item-block"><div className="activity-item-info"><h4>React Routing Guards</h4><small>Deadline: 2026-07-25</small></div></div>
                    </div>
                </div>
                <div className="erp-card">
                    <h3>Campaign Actions</h3>
                    <div className="dashboard-quick-actions-grid">
                        <button type="button" onClick={() => navigate("/projects")}><FaPlus /> Add Project</button>
                        <button type="button" onClick={() => navigate("/tasks")}><FaPlus /> Add Deliverable</button>
                    </div>
                </div>
            </div>
        </>
    );

    // ==========================================
    // RENDER: EXECUTIVE DASHBOARD
    // ==========================================
    const renderExecutiveDashboard = () => (
        <>
            <div className="dashboard-kpi-grid">
                <div className="erp-card kpi-card">
                    <h3 style={{ fontSize: "13px", fontWeight: 600, color: "#64748b", marginBottom: "8px" }}>EBIT Margin</h3>
                    <h2 style={{ fontSize: "26px", fontWeight: 700, color: "#0f172a" }}>32.4%</h2>
                    <small style={{ fontSize: "12px", color: "#16a34a", display: "flex", alignItems: "center", gap: "4px" }}>
                        <FaArrowUp /> +1.8% vs last Qtr
                    </small>
                </div>
                <div className="erp-card kpi-card">
                    <h3 style={{ fontSize: "13px", fontWeight: 600, color: "#64748b", marginBottom: "8px" }}>Net Margin %</h3>
                    <h2 style={{ fontSize: "26px", fontWeight: 700, color: "#0f172a" }}>18.5%</h2>
                    <small style={{ fontSize: "12px", color: "#16a34a", display: "flex", alignItems: "center", gap: "4px" }}>
                        <FaArrowUp /> +0.5% MoM
                    </small>
                </div>
                <div className="erp-card kpi-card">
                    <h3 style={{ fontSize: "13px", fontWeight: 600, color: "#64748b", marginBottom: "8px" }}>Revenue Growth</h3>
                    <h2 style={{ fontSize: "26px", fontWeight: 700, color: "#2563eb" }}>+24.1%</h2>
                    <small style={{ fontSize: "12px", color: "#16a34a", display: "flex", alignItems: "center", gap: "4px" }}>
                        <FaArrowUp /> YoY expansion
                    </small>
                </div>
                <div className="erp-card kpi-card">
                    <h3 style={{ fontSize: "13px", fontWeight: 600, color: "#64748b", marginBottom: "8px" }}>ROI Return</h3>
                    <h2 style={{ fontSize: "26px", fontWeight: 700, color: "#0f172a" }}>14.2x</h2>
                    <small style={{ fontSize: "12px", color: "#ef4444", display: "flex", alignItems: "center", gap: "4px" }}>
                        <FaArrowDown /> -0.2x vs forecast
                    </small>
                </div>
            </div>

            <div className="dashboard-charts-layout" style={{ gridTemplateColumns: "1fr" }}>
                <div className="erp-card chart-card">
                    <h3>Enterprise Revenue Trend (Read Only)</h3>
                    <p>Current fiscal year growth analytics.</p>
                    <ResponsiveContainer width="100%" height={260}>
                        <AreaChart data={revenueData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                            <YAxis stroke="#94a3b8" fontSize={12} />
                            <Tooltip />
                            <Area type="monotone" dataKey="Revenue" stroke="#2563eb" strokeWidth={3} fill="#2563eb" fillOpacity={0.1} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </>
    );

    return (
        <div className="dashboard-container-view">
            <div className="dashboard-header-block" style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                {user?.profilePicture && (
                    <img
                        src={user.profilePicture.startsWith("/uploads/") ? `${import.meta.env.VITE_API_URL || "http://localhost:5000"}${user.profilePicture}` : user.profilePicture}
                        alt="Profile avatar"
                        style={{ width: "50px", height: "50px", borderRadius: "50%", objectFit: "cover", border: "2px solid #2563eb" }}
                    />
                )}
                <div>
                    <h1>Welcome, {user?.name || "Guest"}</h1>
                    <p>Logged in as: <strong>{role}</strong></p>
                </div>
            </div>

            {/* Render Tailored Dashboard based on active role */}
            {role === "Super Admin" || role === "Admin" ? renderAdminDashboard() : null}
            {role === "HR" ? renderHRDashboard() : null}
            {(role === "Finance" || role === "Finance Manager") ? renderFinanceDashboard() : null}
            {role === "Inventory Manager" ? renderInventoryDashboard() : null}
            {role === "Project Manager" ? renderProjectDashboard() : null}
            {role === "Executive" ? renderExecutiveDashboard() : null}
            {role === "Employee" ? (
                <div className="erp-card" style={{ padding: "30px", textAlign: "center" }}>
                    <h3>Standard Employee Dashboard</h3>
                    <p>You have standard access to reports. Use the sidebar to navigate settings and audit sheets.</p>
                </div>
            ) : null}
        </div>
    );
}

export default Dashboard;