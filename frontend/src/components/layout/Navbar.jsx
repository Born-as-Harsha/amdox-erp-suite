import "./Layout.css";
import { FaBell, FaSearch, FaUserCircle } from "react-icons/fa";

function Navbar() {
    let user = { name: "Guest User", role: "User" };

    try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            user = JSON.parse(storedUser);
        }
    } catch (error) {
        console.error("Invalid user data in localStorage:", error);
    }

    return (
        <header className="navbar">
            <div className="navbar-left">
                <h2 className="erp-title">
                    Enterprise AI Cloud ERP
                </h2>
            </div>

            <div className="navbar-center">
                <div className="search-box">
                    <FaSearch className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search modules..."
                    />
                </div>
            </div>

            <div className="navbar-right">
                <button className="notification-btn" type="button">
                    <FaBell />
                </button>

                <div className="profile-info">
                    <FaUserCircle className="profile-icon" />

                    <div>
                        <h4>{user?.name || "Guest User"}</h4>
                        <span>{user?.role || "User"}</span>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Navbar;