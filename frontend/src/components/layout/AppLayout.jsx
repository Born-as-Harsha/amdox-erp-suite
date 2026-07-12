import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

function AppLayout({ children }) {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
        return localStorage.getItem("sidebar_collapsed") === "true";
    });

    const toggleSidebar = () => {
        setIsSidebarCollapsed((prev) => {
            const next = !prev;
            localStorage.setItem("sidebar_collapsed", String(next));
            return next;
        });
    };

    return (
        <div className="erp-wrapper">

            {/* Top Navigation */}
            <Navbar />

            {/* Main Layout */}
            <div className={`app-layout ${isSidebarCollapsed ? "sidebar-collapsed" : ""}`}>

                {/* Sidebar */}
                <Sidebar isCollapsed={isSidebarCollapsed} toggleCollapse={toggleSidebar} />

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