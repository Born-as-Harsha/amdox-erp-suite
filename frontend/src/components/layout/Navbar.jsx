import "./Layout.css";
import { useEffect, useState } from "react";
import {
    FaBell,
    FaSearch,
    FaUserCircle
} from "react-icons/fa";
import { useSearch } from "../../context/SearchContext";

function Navbar() {
    const [user, setUser] = useState({
        name: "Guest",
        role: "User",
        profilePicture: ""
    });

    const { searchTerm, setSearchTerm } = useSearch();

    const loadUser = () => {
        try {
            const storedUser =
                localStorage.getItem("user") ||
                sessionStorage.getItem("user");

            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
        } catch (error) {
            console.error("Invalid user data", error);
        }
    };

    useEffect(() => {
        loadUser();

        // Sync updates when settings change
        window.addEventListener("storage", loadUser);
        return () => {
            window.removeEventListener("storage", loadUser);
        };
    }, []);

    return (

        <header className="navbar">

            <div className="navbar-left">

                <h2 className="erp-title">

                    Amadox ERP

                </h2>

            </div>

            <div className="navbar-center">

                <div className="search-box">

                    <FaSearch className="search-icon" />

                    <input
                        type="text"
                        placeholder="Search employees, finance, inventory..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />

                </div>

            </div>

            <div className="navbar-right">

                <button
                    className="notification-btn"
                    type="button"
                >

                    <FaBell />

                </button>

                <div className="profile-info">

                    {user.profilePicture ? (
                        <img
                            src={user.profilePicture}
                            alt="Profile"
                            className="profile-avatar-nav"
                        />
                    ) : (
                        <FaUserCircle className="profile-icon" />
                    )}

                    <div>

                        <h4>
                            {user.name}
                        </h4>

                        <span>
                            {user.role}
                        </span>

                    </div>

                </div>

            </div>

        </header>
);
}

export default Navbar;