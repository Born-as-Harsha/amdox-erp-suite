import "./Dashboard.css";
import { useEffect, useState } from "react";
import {
    FaUsers,
    FaBoxes,
    FaMoneyBillWave,
    FaProjectDiagram,
    FaChartBar,
    FaArrowUp,
    FaPlus,
    FaBriefcase,
    FaSpinner,
    FaBolt
} from "react-icons/fa";
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, Legend
} from "recharts";
import AppLayout from "../../components/layout/AppLayout";
import {
    getEmployees,
    getInventory,
    getProjects,
    getReports,
    getFinanceStats
} from "../../api/dashboardApi";
import { useNavigate } from "react-router-dom";

function Dashboard() {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        employees: 0,
        products: 0,
        projects: 0,
        reports: 0,
        revenue: 0
    });
    const [loading, setLoading] = useState(true);

    async function fetchDashboardData() {
        try {
            const [
                employeeRes,
                inventoryRes,
                projectRes,
                reportRes,
                financeRes
            ] = await Promise.all([
                getEmployees(),
                getInventory(),
                getProjects(),
                getReports(),
                getFinanceStats()
            ]);

            setStats({
                employees: employeeRes?.data?.length || 0,
                products: inventoryRes?.data?.length || 0,
                projects: projectRes?.data?.length || 0,
                reports: reportRes?.data?.length || 0,
                revenue: financeRes?.data?.totalIncome || 0
            });
        } catch (err) {
            console.error("Dashboard error", err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchDashboardData();
    }, []);

    // Visual Mock datasets driven by database values
    const revenueGrowthData = [
        { month: "Jan", Revenue: stats.revenue * 0.45 || 15000 },
        { month: "Feb", Revenue: stats.revenue * 0.6 || 22000 },
        { month: "Mar", Revenue: stats.revenue * 0.72 || 31000 },
        { month: "Apr", Revenue: stats.revenue * 0.85 || 45000 },
        { month: "May", Revenue: stats.revenue * 0.95 || 58000 },
        { month: "Jun", Revenue: stats.revenue || 72000 }
    ];

    const projectAllocationData = [
        { name: "Planning", count: Math.ceil(stats.projects * 0.3) || 2 },
        { name: "In Progress", count: Math.ceil(stats.projects * 0.5) || 4 },
        { name: "Completed", count: Math.ceil(stats.projects * 0.2) || 1 }
    ];

    const recentActivities = [
        { id: 1, title: "New employee onboarded", time: "10 mins ago", type: "success" },
        { id: 2, title: "Inventory stock updated", time: "1 hour ago", type: "primary" },
        { id: 3, title: "Quarterly report compiled", time: "4 hours ago", type: "warning" },
        { id: 4, title: "Project ERP Dev completed", time: "1 day ago", type: "success" }
    ];

    if (loading) {
        return (
            <div className="dashboard-loading-container">
                <FaSpinner className="spinner" />
                <h2>Loading Enterprise Metrics...</h2>
            </div>
        );
    }

    return (
        <div className="dashboard-container-view">
            <div className="dashboard-header-block">
                <div>
                    <h1>System Dashboard</h1>
                    <p>Real-time analytics and management controls for AMADOX ERP Suite.</p>
                </div>
            </div>

            {/* KPI Cards Grid */}
            <div className="dashboard-kpi-grid">
                <div className="erp-card kpi-card">
                    <div className="kpi-card-header">
                        <FaUsers className="kpi-icon employees" />
                        <span className="erp-badge success">+12% YoY</span>
                    </div>
                    <h3>Total Employees</h3>
                    <h2>{stats.employees}</h2>
                    <small>Active staff listings</small>
                </div>

                <div className="erp-card kpi-card">
                    <div className="kpi-card-header">
                        <FaBoxes className="kpi-icon products" />
                        <span className="erp-badge warning">Low Stock Check</span>
                    </div>
                    <h3>Inventory Products</h3>
                    <h2>{stats.products}</h2>
                    <small>Categorized stock items</small>
                </div>

                <div className="erp-card kpi-card">
                    <div className="kpi-card-header">
                        <FaMoneyBillWave className="kpi-icon revenue" />
                        <span className="erp-badge success">+8% MoM</span>
                    </div>
                    <h3>Total Revenue</h3>
                    <h2>₹{stats.revenue.toLocaleString("en-IN")}</h2>
                    <small>Overall system income</small>
                </div>

                <div className="erp-card kpi-card">
                    <div className="kpi-card-header">
                        <FaProjectDiagram className="kpi-icon projects" />
                        <span className="erp-badge primary">In Progress</span>
                    </div>
                    <h3>Running Projects</h3>
                    <h2>{stats.projects}</h2>
                    <small>Active development timelines</small>
                </div>

                <div className="erp-card kpi-card">
                    <div className="kpi-card-header">
                        <FaChartBar className="kpi-icon reports" />
                        <span className="erp-badge primary">100% Verified</span>
                    </div>
                    <h3>Reports Generated</h3>
                    <h2>{stats.reports}</h2>
                    <small>Exportable analytical sheets</small>
                </div>
            </div>

            {/* Visual Charts Grid */}
            <div className="dashboard-charts-layout">
                {/* Revenue Growth Trend Chart */}
                <div className="erp-card chart-card">
                    <h3>Enterprise Revenue Trend</h3>
                    <p>Current fiscal year growth analytics based on transactions stream.</p>
                    <div className="dashboard-chart-wrapper">
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={revenueGrowthData}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                                <YAxis stroke="#94a3b8" fontSize={12} />
                                <Tooltip />
                                <Area type="monotone" dataKey="Revenue" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Project Allocation Chart */}
                <div className="erp-card chart-card">
                    <h3>Project Breakdown</h3>
                    <p>Current projects categorizations by milestones.</p>
                    <div className="dashboard-chart-wrapper">
                        <ResponsiveContainer width="100%" height={300}>
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
            </div>

            {/* Panel Row: Quick Actions & Recent Activity */}
            <div className="dashboard-panels-layout">
                {/* Recent Activities */}
                <div className="erp-card dashboard-activities-panel">
                    <h3>System Activities</h3>
                    <div className="activity-list-block">
                        {recentActivities.map((act) => (
                            <div key={act.id} className="activity-item-block">
                                <span className={`activity-dot-indicator ${act.type}`}></span>
                                <div className="activity-item-info">
                                    <h4>{act.title}</h4>
                                    <small>{act.time}</small>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="erp-card dashboard-actions-panel">
                    <h3>System Quick Actions</h3>
                    <p>Accelerate your operations with shortcuts.</p>
                    <div className="dashboard-quick-actions-grid">
                        <button type="button" onClick={() => navigate("/employees")}>
                            <FaPlus /> Add Employee
                        </button>
                        <button type="button" onClick={() => navigate("/inventory")}>
                            <FaPlus /> Add Product
                        </button>
                        <button type="button" onClick={() => navigate("/projects")}>
                            <FaPlus /> Create Project
                        </button>
                        <button type="button" onClick={() => navigate("/reports")}>
                            <FaPlus /> Compile Reports
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;