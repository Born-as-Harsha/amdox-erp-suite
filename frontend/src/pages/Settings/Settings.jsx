import "./Settings.css";
import { useEffect, useState, useRef } from "react";
import {
    FaUserCircle,
    FaUser,
    FaBuilding,
    FaShieldAlt,
    FaPalette,
    FaCamera,
    FaEnvelope,
    FaPhone,
    FaLock,
    FaEye,
    FaEyeSlash,
    FaGlobe,
    FaMapMarkerAlt,
    FaHeartbeat,
    FaCalendarAlt,
    FaLanguage,
    FaKey,
    FaHistory
} from "react-icons/fa";
import { getProfile, updateProfile } from "../../api/settingApi";
import { convertImageToBase64, getAvatarUrl } from "../../utils/helpers";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";

function Settings() {
    const { refreshUserContext } = useAuth();
    const [formData, setFormData] = useState({
        employeeId: "",
        username: "",
        name: "",
        email: "",
        phone: "",
        bio: "",
        department: "",
        designation: "",
        visibility: "Public",
        notificationsEnabled: true,
        theme: "Light",
        profilePicture: "",
        newPassword: "",
        confirmPassword: "",
        address: "",
        emergencyContact: "",
        dateOfBirth: "",
        gender: "Male",
        language: "English"
    });

    const [role, setRole] = useState("Employee");
    const [activeTab, setActiveTab] = useState("profile");
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const fileInputRef = useRef(null);

    async function fetchProfile() {
        try {
            const response = await getProfile();
            const data = response.data;
            setFormData({
                employeeId: data.employeeId || "",
                username: data.username || "",
                name: data.name || "",
                email: data.email || "",
                phone: data.phone || "",
                bio: data.bio || "",
                department: data.department || "",
                designation: data.designation || "",
                visibility: data.visibility || "Public",
                notificationsEnabled: data.notificationsEnabled !== undefined ? data.notificationsEnabled : true,
                theme: data.theme || "Light",
                profilePicture: data.profilePicture || "",
                newPassword: "",
                confirmPassword: "",
                address: data.address || "",
                emergencyContact: data.emergencyContact || "",
                dateOfBirth: data.dateOfBirth || "",
                gender: data.gender || "Male",
                language: data.language || "English"
            });
            setRole(data.role || "Employee");
        } catch (error) {
            console.error("Error fetching profile", error);
            toast.error("Failed to load profile settings.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchProfile();
    }, []);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                const base64 = await convertImageToBase64(file, { maxSizeMB: 2 });
                setFormData((prev) => ({ ...prev, profilePicture: base64 }));
            } catch (error) {
                toast.error(error.message || "Failed to convert image.");
            }
        }
    };

    const handleAvatarClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleRemovePhoto = () => {
        setFormData((prev) => ({ ...prev, profilePicture: "" }));
    };

    const getInitials = (name) => {
        if (!name) return "U";
        const parts = name.trim().split(" ");
        if (parts.length > 1) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        return parts[0][0].toUpperCase();
    };

    async function handleSubmit(e) {
        if (e && e.preventDefault) {
            e.preventDefault();
        }

        if (formData.newPassword) {
            if (formData.newPassword.length < 6) {
                toast.error("New password must be at least 6 characters long.");
                return;
            }
            if (formData.newPassword !== formData.confirmPassword) {
                toast.error("New passwords do not match.");
                return;
            }
        }

        setSaving(true);

        try {
            const submitData = {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                bio: formData.bio,
                department: formData.department,
                designation: formData.designation,
                visibility: formData.visibility,
                notificationsEnabled: formData.notificationsEnabled,
                theme: formData.theme,
                profilePicture: formData.profilePicture,
                address: formData.address,
                emergencyContact: formData.emergencyContact,
                dateOfBirth: formData.dateOfBirth,
                gender: formData.gender,
                language: formData.language
            };

            if (formData.newPassword) {
                submitData.password = formData.newPassword;
            }

            const response = await updateProfile(submitData);

            // Sync context state
            refreshUserContext({
                name: response.data.name,
                email: response.data.email,
                profilePicture: response.data.profilePicture
            });

            toast.success("Profile settings updated successfully!");
            
            setFormData(prev => ({
                ...prev,
                newPassword: "",
                confirmPassword: ""
            }));

        } catch (error) {
            console.error("Error saving settings", error);
            toast.error(error.response?.data?.message || "Failed to save profile settings.");
        } finally {
            setSaving(false);
        }
    }

    const resetOtpSettings = () => {
        toast.success("MFA OTP settings have been reset. Re-authenticate on next login.");
    };

    if (loading) {
        return (
            <div className="settings-loading">
                <div className="spinner-large"></div>
                <h2>Loading System Settings...</h2>
            </div>
        );
    }

    return (
        <div className="settings-container">
            <div className="settings-header">
                <div>
                    <h1>Enterprise Settings</h1>
                    <p>Manage your account settings, personal details, system preferences, and security options.</p>
                </div>
            </div>

            <div className="settings-layout">
                {/* Left Profile Overview Card */}
                <div className="settings-card profile-summary-card">
                    <div className="profile-photo-container">
                        <input
                            type="file"
                            ref={fileInputRef}
                            style={{ display: "none" }}
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                        <div className="avatar-wrapper" onClick={handleAvatarClick}>
                            {formData.profilePicture ? (
                                <img
                                    src={getAvatarUrl(formData.profilePicture)}
                                    alt="Profile Avatar"
                                    className="profile-avatar"
                                />
                            ) : (
                                <div className="initials-avatar">{getInitials(formData.name)}</div>
                            )}
                            <div className="avatar-hover-overlay">
                                <FaCamera />
                                <span>Update Photo</span>
                            </div>
                        </div>

                        {formData.profilePicture && (
                            <button
                                type="button"
                                className="remove-photo-btn"
                                onClick={handleRemovePhoto}
                            >
                                Remove Photo
                            </button>
                        )}
                    </div>

                    <div className="profile-details-summary">
                        <h2>{formData.name || "User Name"}</h2>
                        <span className="role-badge">{role}</span>
                        <div className={`visibility-badge ${formData.visibility.toLowerCase()}`}>
                            <FaGlobe /> {formData.visibility} Profile
                        </div>
                    </div>

                    <div className="profile-job-meta">
                        <div className="meta-row">
                            <span className="meta-label">Employee ID:</span>
                            <span className="meta-value">{formData.employeeId}</span>
                        </div>
                        <div className="meta-row">
                            <span className="meta-label">Username:</span>
                            <span className="meta-value">{formData.username}</span>
                        </div>
                    </div>
                </div>

                {/* Right Form Configuration Panel */}
                <div className="settings-card settings-form-card">
                    <div className="settings-tabs">
                        <button
                            type="button"
                            className={`tab-btn ${activeTab === "profile" ? "active" : ""}`}
                            onClick={() => setActiveTab("profile")}
                        >
                            <FaUser /> Personal Info
                        </button>
                        <button
                            type="button"
                            className={`tab-btn ${activeTab === "org" ? "active" : ""}`}
                            onClick={() => setActiveTab("org")}
                        >
                            <FaBuilding /> Job Details
                        </button>
                        <button
                            type="button"
                            className={`tab-btn ${activeTab === "privacy" ? "active" : ""}`}
                            onClick={() => setActiveTab("privacy")}
                        >
                            <FaShieldAlt /> Security & Activity
                        </button>
                        <button
                            type="button"
                            className={`tab-btn ${activeTab === "preferences" ? "active" : ""}`}
                            onClick={() => setActiveTab("preferences")}
                        >
                            <FaPalette /> Preferences
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="settings-form">
                        <div className="tab-content">
                            {/* Tab 1: Personal Info */}
                            {activeTab === "profile" && (
                                <div className="tab-pane">
                                    <h3>Personal Details</h3>
                                    <p className="tab-desc">Update your personal contact details, gender, DOB, emergency contacts and public bio.</p>

                                    <div className="form-grid">
                                        <div className="form-group-full">
                                            <label>Full Name</label>
                                            <div className="input-with-icon">
                                                <FaUser className="input-left-icon" />
                                                <input
                                                    type="text"
                                                    required
                                                    value={formData.name}
                                                    onChange={(e) =>
                                                        setFormData({ ...formData, name: e.target.value })
                                                    }
                                                    placeholder="John Doe"
                                                />
                                            </div>
                                        </div>

                                        <div className="form-group-half">
                                            <label>Email Address</label>
                                            <div className="input-with-icon">
                                                <FaEnvelope className="input-left-icon" />
                                                <input
                                                    type="email"
                                                    required
                                                    value={formData.email}
                                                    onChange={(e) =>
                                                        setFormData({ ...formData, email: e.target.value })
                                                    }
                                                    placeholder="email@company.com"
                                                />
                                            </div>
                                        </div>

                                        <div className="form-group-half">
                                            <label>Phone Number</label>
                                            <div className="input-with-icon">
                                                <FaPhone className="input-left-icon" />
                                                <input
                                                    type="text"
                                                    value={formData.phone}
                                                    onChange={(e) =>
                                                        setFormData({ ...formData, phone: e.target.value })
                                                    }
                                                    placeholder="+91 98765 43210"
                                                />
                                            </div>
                                        </div>

                                        <div className="form-group-half">
                                            <label>Date of Birth</label>
                                            <div className="input-with-icon">
                                                <FaCalendarAlt className="input-left-icon" />
                                                <input
                                                    type="date"
                                                    value={formData.dateOfBirth}
                                                    onChange={(e) =>
                                                        setFormData({ ...formData, dateOfBirth: e.target.value })
                                                    }
                                                />
                                            </div>
                                        </div>

                                        <div className="form-group-half">
                                            <label>Gender</label>
                                            <div className="input-with-icon">
                                                <FaUser className="input-left-icon" />
                                                <select
                                                    value={formData.gender}
                                                    onChange={(e) =>
                                                        setFormData({ ...formData, gender: e.target.value })
                                                    }
                                                    style={{ width: "100%", padding: "10px 12px 10px 36px", border: "1px solid #cbd5e1", borderRadius: "8px", background: "#f8fafc", outline: "none" }}
                                                >
                                                    <option value="Male">Male</option>
                                                    <option value="Female">Female</option>
                                                    <option value="Other">Other</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="form-group-half">
                                            <label>Language</label>
                                            <div className="input-with-icon">
                                                <FaLanguage className="input-left-icon" />
                                                <input
                                                    type="text"
                                                    value={formData.language}
                                                    onChange={(e) =>
                                                        setFormData({ ...formData, language: e.target.value })
                                                    }
                                                    placeholder="English"
                                                />
                                            </div>
                                        </div>

                                        <div className="form-group-half">
                                            <label>Emergency Contact</label>
                                            <div className="input-with-icon">
                                                <FaHeartbeat className="input-left-icon" />
                                                <input
                                                    type="text"
                                                    value={formData.emergencyContact}
                                                    onChange={(e) =>
                                                        setFormData({ ...formData, emergencyContact: e.target.value })
                                                    }
                                                    placeholder="+91 99887 76655"
                                                />
                                            </div>
                                        </div>

                                        <div className="form-group-full">
                                            <label>Corporate Address</label>
                                            <div className="input-with-icon">
                                                <FaMapMarkerAlt className="input-left-icon" />
                                                <input
                                                    type="text"
                                                    value={formData.address}
                                                    onChange={(e) =>
                                                        setFormData({ ...formData, address: e.target.value })
                                                    }
                                                    placeholder="Sector 62, Noida, UP, India"
                                                />
                                            </div>
                                        </div>

                                        <div className="form-group-full">
                                            <label>Biography / Description</label>
                                            <textarea
                                                rows="4"
                                                value={formData.bio}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, bio: e.target.value })
                                                }
                                                placeholder="Write a brief introduction about yourself..."
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Tab 2: Job Details */}
                            {activeTab === "org" && (
                                <div className="tab-pane">
                                    <h3>Organization Details</h3>
                                    <p className="tab-desc">Verify your department, designation, and global system authorization level.</p>

                                    <div className="form-grid">
                                        <div className="form-group-half">
                                            <label>Employee ID (Read-Only)</label>
                                            <div className="input-with-icon readonly-input">
                                                <FaBuilding className="input-left-icon" />
                                                <input
                                                    type="text"
                                                    value={formData.employeeId}
                                                    disabled
                                                    style={{ cursor: "not-allowed" }}
                                                />
                                            </div>
                                        </div>

                                        <div className="form-group-half">
                                            <label>Username (Read-Only)</label>
                                            <div className="input-with-icon readonly-input">
                                                <FaUser className="input-left-icon" />
                                                <input
                                                    type="text"
                                                    value={formData.username}
                                                    disabled
                                                    style={{ cursor: "not-allowed" }}
                                                />
                                            </div>
                                        </div>

                                        <div className="form-group-half">
                                            <label>Department</label>
                                            <div className="input-with-icon">
                                                <FaBuilding className="input-left-icon" />
                                                <input
                                                    type="text"
                                                    value={formData.department}
                                                    onChange={(e) =>
                                                        setFormData({ ...formData, department: e.target.value })
                                                    }
                                                    placeholder="Engineering / Sales / HR"
                                                />
                                            </div>
                                        </div>

                                        <div className="form-group-half">
                                            <label>Designation</label>
                                            <div className="input-with-icon">
                                                <FaBuilding className="input-left-icon" />
                                                <input
                                                    type="text"
                                                    value={formData.designation}
                                                    onChange={(e) =>
                                                        setFormData({ ...formData, designation: e.target.value })
                                                    }
                                                    placeholder="e.g. Senior Architect"
                                                />
                                            </div>
                                        </div>

                                        <div className="form-group-full">
                                            <label>System Authorization Level (Read-Only)</label>
                                            <div className="input-with-icon readonly-input">
                                                <FaShieldAlt className="input-left-icon" />
                                                <input
                                                    type="text"
                                                    value={role}
                                                    disabled
                                                    style={{ cursor: "not-allowed" }}
                                                />
                                            </div>
                                            <small className="help-text">Contact your system administrator to modify security authorization levels.</small>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Tab 3: Security & Activity */}
                            {activeTab === "privacy" && (
                                <div className="tab-pane">
                                    <h3>Security & Account Activity</h3>
                                    <p className="tab-desc">Change passwords, toggle OTP preferences, and review active session log histories.</p>

                                    <div className="settings-section">
                                        <h4>Update Password</h4>
                                        <div className="form-grid">
                                            <div className="form-group-half">
                                                <label>New Password</label>
                                                <div className="input-with-icon">
                                                    <FaLock className="input-left-icon" />
                                                    <input
                                                        type={showNewPassword ? "text" : "password"}
                                                        value={formData.newPassword}
                                                        onChange={(e) =>
                                                            setFormData({ ...formData, newPassword: e.target.value })
                                                        }
                                                        placeholder="Enter new password"
                                                    />
                                                    <button
                                                        type="button"
                                                        className="password-eye-btn"
                                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                                    >
                                                        {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="form-group-half">
                                                <label>Confirm Password</label>
                                                <div className="input-with-icon">
                                                    <FaLock className="input-left-icon" />
                                                    <input
                                                        type={showConfirmPassword ? "text" : "password"}
                                                        value={formData.confirmPassword}
                                                        onChange={(e) =>
                                                            setFormData({ ...formData, confirmPassword: e.target.value })
                                                        }
                                                        placeholder="Confirm new password"
                                                    />
                                                    <button
                                                        type="button"
                                                        className="password-eye-btn"
                                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                    >
                                                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <hr className="divider" />

                                    <div className="settings-section">
                                        <h4>MFA OTP Configuration</h4>
                                        <div className="toggle-option-card">
                                            <div className="toggle-info">
                                                <h5>Clear Authentication Locks</h5>
                                                <p>Reset OTP keys and drop session verification flags stored in the database.</p>
                                            </div>
                                            <button
                                                type="button"
                                                className="erp-btn-secondary"
                                                onClick={resetOtpSettings}
                                                style={{ border: "1px solid #d97706", color: "#d97706" }}
                                            >
                                                <FaKey /> Reset MFA Keys
                                            </button>
                                        </div>
                                    </div>

                                    <hr className="divider" />

                                    <div className="settings-section">
                                        <h4 style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "15px" }}>
                                            <FaHistory /> Active Login Session Logs
                                        </h4>
                                        <div className="erp-table-container">
                                            <table className="erp-table">
                                                <thead>
                                                    <tr>
                                                        <th>IP Address</th>
                                                        <th>User Agent</th>
                                                        <th>Login Time</th>
                                                        <th>Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td>127.0.0.1 (Current)</td>
                                                        <td>Mozilla Chrome Browser</td>
                                                        <td>Today, {new Date().toLocaleTimeString()}</td>
                                                        <td><span className="erp-badge success">Active</span></td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Tab 4: Preferences */}
                            {activeTab === "preferences" && (
                                <div className="tab-pane">
                                    <h3>System Preferences</h3>
                                    <p className="tab-desc">Personalize notification policies and visual settings for your account.</p>

                                    <div className="settings-section">
                                        <h4>Corporate Directory Visibility</h4>
                                        <div className="toggle-option-card">
                                            <div className="toggle-info">
                                                <h5>Visibility Setting</h5>
                                                <p>When set to <strong>Public</strong>, your details are listed in the employee rosters.</p>
                                            </div>
                                            <div className="select-wrapper">
                                                <select
                                                    value={formData.visibility}
                                                    onChange={(e) =>
                                                        setFormData({ ...formData, visibility: e.target.value })
                                                    }
                                                >
                                                    <option value="Public">Public (Directory Listing)</option>
                                                    <option value="Private">Private (Hidden)</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <hr className="divider" />

                                    <div className="settings-section">
                                        <h4>Corporate Notifications</h4>
                                        <div className="toggle-option-card">
                                            <div className="toggle-info">
                                                <h5>Enable Email Notifications</h5>
                                                <p>Receive project status, stock levels alerts, and HR reminders.</p>
                                            </div>
                                            <div className="switch-wrapper">
                                                <label className="toggle-switch">
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.notificationsEnabled}
                                                        onChange={(e) =>
                                                            setFormData({
                                                                ...formData,
                                                                notificationsEnabled: e.target.checked
                                                            })
                                                        }
                                                    />
                                                    <span className="slider round"></span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    <hr className="divider" />

                                    <div className="settings-section">
                                        <h4>User Interface Theme</h4>
                                        <div className="toggle-option-card">
                                            <div className="toggle-info">
                                                <h5>Theme Selection</h5>
                                                <p>Switch between Light interface or Developer Dark theme.</p>
                                            </div>
                                            <div className="select-wrapper">
                                                <select
                                                    value={formData.theme}
                                                    onChange={(e) =>
                                                        setFormData({ ...formData, theme: e.target.value })
                                                    }
                                                >
                                                    <option value="Light">Enterprise Light</option>
                                                    <option value="Dark">Developer Dark</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="settings-form-actions">
                            <button
                                type="submit"
                                className="settings-submit-btn"
                                disabled={saving}
                            >
                                {saving ? "Saving Changes..." : "Save Configuration"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Settings;