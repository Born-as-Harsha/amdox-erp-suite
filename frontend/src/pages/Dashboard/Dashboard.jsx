import "./Dashboard.css";
import { useEffect, useState } from "react";

import {
    FaUsers,
    FaBoxes,
    FaMoneyBillWave,
    FaProjectDiagram,
    FaChartBar,
    FaArrowUp,
    FaPlus
} from "react-icons/fa";

import {
    getEmployees,
    getInventory,
    getProjects,
    getReports,
    getFinanceStats
} from "../../api/dashboardApi";

function Dashboard() {

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

        }

        catch (err) {

            console.error(err);

        }

        finally {

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

            <div className="dashboard-content">

                <div className="dashboard-header">

                    <div>

                        <h1>Dashboard</h1>

                        <p>

                            Welcome to the Enterprise AI Powered Cloud ERP Suite

                        </p>

                    </div>

                </div>

                <div className="stats-grid">

                    <div className="stat-card">

                        <FaUsers className="stat-icon"/>

                        <h3>Employees</h3>

                        <h2>

                            {loading ? "--" : stats.employees}

                        </h2>

                        <small>Active Employees</small>

                    </div>

                    <div className="stat-card">

                        <FaBoxes className="stat-icon"/>

                        <h3>Products</h3>

                        <h2>

                            {loading ? "--" : stats.products}

                        </h2>

                        <small>Inventory Items</small>

                    </div>

                    <div className="stat-card">

                        <FaMoneyBillWave className="stat-icon"/>

                        <h3>Revenue</h3>

                        <h2>

                            ₹{loading ? "--" : stats.revenue.toLocaleString()}

                        </h2>

                        <small>Current Income</small>

                    </div>

                    <div className="stat-card">

                        <FaProjectDiagram className="stat-icon"/>

                        <h3>Projects</h3>

                        <h2>

                            {loading ? "--" : stats.projects}

                        </h2>

                        <small>Running Projects</small>

                    </div>

                    <div className="stat-card">

                        <FaChartBar className="stat-icon"/>

                        <h3>Reports</h3>

                        <h2>

                            {loading ? "--" : stats.reports}

                        </h2>

                        <small>Generated Reports</small>

                    </div>

                </div>

                <div className="dashboard-grid">

                    <div className="dashboard-panel">

                        <h3>

                            Business Overview

                        </h3>

                        <p>

                            Real-time enterprise statistics for your organization.

                        </p>

                        <div className="growth-box">

                            <FaArrowUp/>

                            Revenue Growth Stable

                        </div>

                    </div>

                    <div className="dashboard-panel">

                        <h3>

                            Quick Actions

                        </h3>

                        <div className="quick-actions">

                            <button>

                                <FaPlus/>

                                Add Employee

                            </button>

                            <button>

                                <FaPlus/>

                                Add Product

                            </button>

                            <button>

                                <FaPlus/>

                                Create Project

                            </button>

                            <button>

                                <FaPlus/>

                                Generate Report

                            </button>

                        </div>

                    </div>

                </div>

            </div>

    );

}

export default Dashboard;