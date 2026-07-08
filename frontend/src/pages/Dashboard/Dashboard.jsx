import "./Dashboard.css";
import { useEffect, useState } from "react";
import Navbar from "../../components/layout/Navbar";
import Sidebar from "../../components/layout/Sidebar";
import Footer from "../../components/layout/Footer";
import {
    FaUsers,
    FaBoxes,
    FaMoneyBillWave,
    FaProjectDiagram,
    FaChartBar,
    FaArrowUp,
} from "react-icons/fa";
import {
    getEmployees,
    getInventory,
    getProjects,
    getReports,
    getFinanceStats,
} from "../../api/dashboardApi";
function Dashboard() {
    const [stats, setStats] = useState({
        employees: 0,
        products: 0,
        projects: 0,
        reports: 0,
        revenue: 0,
    });
    const [loading, setLoading] = useState(true);
    async function fetchDashboardData() {
        try {
            const [
                employeeRes,
                inventoryRes,
                projectRes,
                reportRes,
                financeRes,
            ] = await Promise.all([
                getEmployees(),
                getInventory(),
                getProjects(),
                getReports(),
                getFinanceStats(),
            ]);

            const employeesData = employeeRes?.data || [];
            const inventoryData = inventoryRes?.data || [];
            const projectsData = projectRes?.data || [];
            const reportsData = reportRes?.data || [];
            const financeData = financeRes?.data || {};

            setStats({
                employees: Array.isArray(employeesData) ? employeesData.length : 0,
                products: Array.isArray(inventoryData) ? inventoryData.length : 0,
                projects: Array.isArray(projectsData) ? projectsData.length : 0,
                reports: Array.isArray(reportsData) ? reportsData.length : 0,
                revenue: Number(financeData?.totalIncome || 0),
            });
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
            setStats({
                employees: 0,
                products: 0,
                projects: 0,
                reports: 0,
                revenue: 0,
            });
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        const loadDashboard = async () => {
            await fetchDashboardData();
        };
        loadDashboard();
    }, []);

    return (
        <>
            <Navbar />

            <div className="dashboard-layout">
                <Sidebar />

                <main className="dashboard-content">
                    <div className="dashboard-header">
                        <div>
                            <h1>Dashboard</h1>
                            <p>
                                Welcome to the Enterprise AI-Powered Cloud ERP Suite
                            </p>
                        </div>
                    </div>

                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="card-top">
                                <FaUsers className="stat-icon" />
                                <span className="trend positive">
                                    +8%
                                </span>
                            </div>

                            <p className="card-title">
                                Employees
                            </p>

                            <h2>
                                {loading ? "--" : stats.employees}
                            </h2>

                            <small>
                                Active Employees
                            </small>
                        </div>

                        <div className="stat-card">
                            <div className="card-top">
                                <FaBoxes className="stat-icon" />
                                <span className="trend positive">
                                    +5%
                                </span>
                            </div>

                            <p className="card-title">
                                Products
                            </p>

                            <h2>
                                {loading ? "--" : stats.products}
                            </h2>

                            <small>
                                Inventory Items
                            </small>
                        </div>

                        <div className="stat-card">
                            <div className="card-top">
                                <FaMoneyBillWave className="stat-icon" />
                                <span className="trend positive">
                                    +12%
                                </span>
                            </div>

                            <p className="card-title">
                                Revenue
                            </p>

                            <h2>
                                ₹{loading ? "--" : Number(stats.revenue || 0).toLocaleString()}
                            </h2>

                            <small>
                                Current Income
                            </small>
                        </div>

                        <div className="stat-card">
                            <div className="card-top">
                                <FaProjectDiagram className="stat-icon" />
                                <span className="trend negative">
                                    -2%
                                </span>
                            </div>

                            <p className="card-title">
                                Projects
                            </p>

                            <h2>
                                {loading ? "--" : stats.projects}
                            </h2>

                            <small>
                                Running Projects
                            </small>
                        </div>

                        <div className="stat-card">
                            <div className="card-top">
                                <FaChartBar className="stat-icon" />
                                <span className="trend positive">
                                    +3%
                                </span>
                            </div>

                            <p className="card-title">
                                Reports
                            </p>

                            <h2>
                                {loading ? "--" : stats.reports}
                            </h2>

                            <small>
                                Generated Reports
                            </small>
                        </div>
                    </div>

                    <div className="dashboard-grid">
                        <div className="dashboard-panel">
                            <h3>Business Overview</h3>

                            <p>
                                Your ERP statistics are updated in real time.
                            </p>

                            <div className="growth-box">
                                <FaArrowUp />

                                <span>
                                    Revenue Growth Stable
                                </span>
                            </div>
                        </div>

                        <div className="dashboard-panel">
                            <h3>Quick Actions</h3>

                            <div className="quick-actions">
                                <button>Add Employee</button>
                                <button>Add Product</button>
                                <button>Create Project</button>
                                <button>Generate Report</button>
                            </div>
                        </div>

                        <div className="dashboard-panel">
                            <h3>Recent Activities</h3>

                            <div className="activity-list">
                                <div className="activity-item">
                                    <span className="activity-dot success"></span>

                                    <div>
                                        <h4>Employee Added</h4>
                                        <small>2 minutes ago</small>
                                    </div>
                                </div>

                                <div className="activity-item">
                                    <span className="activity-dot warning"></span>

                                    <div>
                                        <h4>Inventory Updated</h4>
                                        <small>15 minutes ago</small>
                                    </div>
                                </div>

                                <div className="activity-item">
                                    <span className="activity-dot primary"></span>

                                    <div>
                                        <h4>Project Created</h4>
                                        <small>1 hour ago</small>
                                    </div>
                                </div>

                                <div className="activity-item">
                                    <span className="activity-dot danger"></span>

                                    <div>
                                        <h4>Finance Report Generated</h4>
                                        <small>Today</small>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="dashboard-panel">
                            <h3>System Status</h3>

                            <div className="status-grid">
                                <div className="status-card">
                                    <h4>Server</h4>
                                    <span className="online">
                                        Online
                                    </span>
                                </div>

                                <div className="status-card">
                                    <h4>Database</h4>
                                    <span className="online">
                                        Connected
                                    </span>
                                </div>

                                <div className="status-card">
                                    <h4>API</h4>
                                    <span className="online">
                                        Healthy
                                    </span>
                                </div>

                                <div className="status-card">
                                    <h4>Storage</h4>
                                    <span className="warning-status">
                                        72%
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            <Footer />
        </>
    );
}

export default Dashboard;