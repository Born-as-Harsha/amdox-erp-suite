import "./Layout.css";

import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

import { Outlet } from "react-router-dom";

function AppLayout({ children }) {
    return (
        <div className="erp-wrapper">

            {/* Top Navigation */}
            <Navbar />

            {/* Main Layout */}
            <div className="app-layout">

                {/* Sidebar */}
                <Sidebar />

                {/* Main Content Container */}
                <div className="main-container">
                    <main className="app-content">
                        {children || <Outlet />}
                    </main>

                    {/* Footer */}
                    <Footer />
                </div>

            </div>

        </div>
    );
}

export default AppLayout;