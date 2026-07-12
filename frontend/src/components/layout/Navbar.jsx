import "./Layout.css";
import { FaBell, FaSearch, FaUserCircle } from "react-icons/fa";
import { useSearch } from "../../context/SearchContext";
import { useAuth } from "../../context/AuthContext";
import { getAvatarUrl } from "../../utils/helpers";

function Navbar() {
    const { user } = useAuth();
    const { searchTerm, setSearchTerm } = useSearch();

    const name = user?.name || "Guest";
    const role = user?.role || "User";
    const profilePicture = user?.profilePicture || "";

    return (
        <header className="navbar">
            <div className="navbar-left">
                <h2 className="erp-title">Amadox ERP</h2>
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
                    {profilePicture ? (
                        <img
                            src={getAvatarUrl(profilePicture)}
                            alt="Profile"
                            className="profile-avatar-nav"
                        />
                    ) : (
                        <FaUserCircle className="profile-icon" />
                    )}

                    <div>
                        <h4>{name}</h4>
                        <span>{role}</span>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Navbar;