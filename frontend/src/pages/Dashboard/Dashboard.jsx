import Navbar from "../../components/layout/Navbar";
import Sidebar from "../../components/layout/Sidebar";
import Footer from "../../components/layout/Footer";

function Dashboard() {
    return (
        <div className="app">

            <Navbar />

            <div className="main-content">

                <Sidebar />

                <section className="content">

                    <h1>Dashboard</h1>

                    <p>
                        Welcome to the Enterprise AI-Powered Cloud ERP Suite.
                    </p>

                </section>

            </div>

            <Footer />

        </div>
    );
}

export default Dashboard;