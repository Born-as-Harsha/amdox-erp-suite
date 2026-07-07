import "../../App.css";
import { useEffect, useState } from "react";

import Navbar from "../../components/layout/Navbar";
import Sidebar from "../../components/layout/Sidebar";
import Footer from "../../components/layout/Footer";

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

                employees: employeeRes.data.length,

                products: inventoryRes.data.length,

                projects: projectRes.data.length,

                reports: reportRes.data.length,

                revenue: financeRes.data.totalIncome || 0

            });

        }

        catch (error) {

            console.error(error);

        }

    }

    useEffect(() => {

        const loadDashboard = async () => {

            await fetchDashboardData();

        };

        loadDashboard();

    }, []);

    return (

        <div className="app">

            <Navbar />

            <div className="main-content">

                <Sidebar />

                <main className="content">

                    <h1>Dashboard</h1>

                    <p>
                        Welcome to the Enterprise AI-Powered Cloud ERP Suite.
                    </p>

                    <div className="dashboard-cards">

                        <div className="card">

                            <h3>Total Employees</h3>

                            <p>{stats.employees}</p>

                        </div>

                        <div className="card">

                            <h3>Products</h3>

                            <p>{stats.products}</p>

                        </div>

                        <div className="card">

                            <h3>Revenue</h3>

                            <p>₹{stats.revenue.toLocaleString()}</p>

                        </div>

                        <div className="card">

                            <h3>Projects</h3>

                            <p>{stats.projects}</p>

                        </div>

                        <div className="card">

                            <h3>Reports</h3>

                            <p>{stats.reports}</p>

                        </div>

                    </div>

                </main>

            </div>

            <Footer />

        </div>

    );

}

export default Dashboard;