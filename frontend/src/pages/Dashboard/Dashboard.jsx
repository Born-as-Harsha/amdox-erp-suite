import "../../App.css";

import Navbar from "../../components/layout/Navbar";
import Sidebar from "../../components/layout/Sidebar";
import Footer from "../../components/layout/Footer";

function Dashboard() {
    return (
        <div className="app">

            <Navbar />

            <div className="main-content">

                <Sidebar />

                <main className="content">

                    <h1>Dashboard</h1>

                    <p>Welcome to the Enterprise AI-Powered Cloud ERP Suite.</p>

                    <div className="dashboard-cards">

                        <div className="card">
                            <h3>Total Employees</h3>
                            <p>125</p>
                        </div>

                        <div className="card">
                            <h3>Products</h3>
                            <p>842</p>
                        </div>

                        <div className="card">
                            <h3>Revenue</h3>
                            <p>₹18,50,000</p>
                        </div>

                        <div className="card">
                            <h3>Projects</h3>
                            <p>16</p>
                        </div>

                    </div>

                </main>

            </div>

            <Footer />

        </div>
    );
}

export default Dashboard;