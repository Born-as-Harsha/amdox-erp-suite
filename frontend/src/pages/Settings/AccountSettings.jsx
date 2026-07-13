import { useState, useEffect } from "react";
import { FaCog, FaPalette, FaBell, FaGlobe, FaShieldAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import api from "../../services/api";

function AccountSettings() {
    const [preferences, setPreferences] = useState({
        theme: "Light",
        language: "English",
        notificationsEnabled: true,
        visibility: "Public"
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const loadPreferences = async () => {
            try {
                const res = await api.get("/users/profile").catch(() => null);
                if (res && res.data) {
                    setPreferences({
                        theme: res.data.theme || "Light",
                        language: res.data.language || "English",
                        notificationsEnabled: res.data.notificationsEnabled !== undefined ? res.data.notificationsEnabled : true,
                        visibility: res.data.visibility || "Public"
                    });
                }
            } catch (err) {
                console.error("Failed to load account settings:", err);
            }
        };
        loadPreferences();
    }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await api.put("/users/profile", preferences);
            toast.success("Account preferences updated successfully.");
        } catch (err) {
            toast.error("Failed to save settings preferences.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div style={{ padding: "30px", background: "#f8fafc", minHeight: "calc(100vh - 140px)" }}>
            <div style={{ marginBottom: "25px" }}>
                <h1 style={{ fontSize: "28px", fontWeight: 700, color: "#0f172a", marginBottom: "6px" }}>
                    <FaCog style={{ color: "#3b82f6", marginRight: "10px" }} /> General Settings
                </h1>
                <p style={{ color: "#64748b", fontSize: "15px" }}>Manage your global application display settings, language toggles, and privacy preferences.</p>
            </div>

            <div className="erp-card" style={{ maxWidth: "600px", padding: "24px" }}>
                <form onSubmit={handleSave} className="settings-form">
                    <div className="form-group" style={{ marginBottom: "20px" }}>
                        <label style={{ display: "flex", alignItems: "center", gap: "8px" }}><FaPalette style={{ color: "#3b82f6" }} /> Application Theme</label>
                        <select
                            value={preferences.theme}
                            onChange={(e) => setPreferences({ ...preferences, theme: e.target.value })}
                            style={{ padding: "10px", border: "1px solid #cbd5e1", borderRadius: "8px", background: "#ffffff", width: "100%" }}
                        >
                            <option value="Light">Light Mode</option>
                            <option value="Dark">Dark Mode</option>
                            <option value="System">System Default</option>
                        </select>
                    </div>

                    <div className="form-group" style={{ marginBottom: "20px" }}>
                        <label style={{ display: "flex", alignItems: "center", gap: "8px" }}><FaGlobe style={{ color: "#10b981" }} /> System Language</label>
                        <select
                            value={preferences.language}
                            onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
                            style={{ padding: "10px", border: "1px solid #cbd5e1", borderRadius: "8px", background: "#ffffff", width: "100%" }}
                        >
                            <option value="English">English</option>
                            <option value="Spanish">Spanish</option>
                            <option value="French">French</option>
                            <option value="German">German</option>
                        </select>
                    </div>

                    <div className="form-group" style={{ marginBottom: "20px" }}>
                        <label style={{ display: "flex", alignItems: "center", gap: "8px" }}><FaShieldAlt style={{ color: "#f59e0b" }} /> Profile Visibility</label>
                        <select
                            value={preferences.visibility}
                            onChange={(e) => setPreferences({ ...preferences, visibility: e.target.value })}
                            style={{ padding: "10px", border: "1px solid #cbd5e1", borderRadius: "8px", background: "#ffffff", width: "100%" }}
                        >
                            <option value="Public">Public Directory</option>
                            <option value="Private">Private / Internal Only</option>
                        </select>
                    </div>

                    <div className="form-group" style={{ marginBottom: "25px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <input
                                type="checkbox"
                                id="notifs-enabled"
                                checked={preferences.notificationsEnabled}
                                onChange={(e) => setPreferences({ ...preferences, notificationsEnabled: e.target.checked })}
                                style={{ width: "18px", height: "18px", cursor: "pointer" }}
                            />
                            <label htmlFor="notifs-enabled" style={{ cursor: "pointer", fontSize: "14px", fontWeight: "600", color: "#334155" }}>
                                <FaBell style={{ color: "#6366f1", marginRight: "4px" }} /> Enable Real-Time Email & Push Notifications
                            </label>
                        </div>
                    </div>

                    <button type="submit" className="settings-submit-btn" disabled={saving} style={{ padding: "12px", width: "120px" }}>
                        {saving ? "Saving..." : "Save Preferences"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default AccountSettings;
