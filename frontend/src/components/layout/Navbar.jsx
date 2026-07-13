import "./Layout.css";
import { FaBell, FaSearch, FaUserCircle } from "react-icons/fa";
import { useSearch } from "../../context/SearchContext";
import { useAuth } from "../../context/AuthContext";
import { getAvatarUrl } from "../../utils/helpers";
import NotificationCenter from "./NotificationCenter";

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

            <div className="navbar-center" onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { ctrlKey: true, key: 'k' }))}>
                <div className="search-box" style={{ cursor: "pointer", position: "relative" }}>
                    <FaSearch className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search or run commands... (Ctrl+K)"
                        readOnly
                        style={{ cursor: "pointer", paddingRight: "70px" }}
                    />
                    <span style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", fontSize: "10px", fontWeight: "700", background: "#f1f5f9", padding: "3px 6px", borderRadius: "4px", color: "#64748b", border: "1px solid #e2e8f0" }}>Ctrl K</span>
                </div>
            </div>

            <div className="navbar-right">
                <NotificationCenter />

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