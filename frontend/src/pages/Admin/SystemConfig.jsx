import { useState } from "react";
import { FaCog, FaLock, FaKey, FaShieldAlt } from "react-icons/fa";
import { toast } from "react-toastify";

function SystemConfig() {
    const [config, setConfig] = useState({
        otpActive: true,
        captchaActive: false,
        sessionTimeout: 30,
        passwordComplexity: "Medium",
        apiRateLimit: 100
    });
    const [saving, setSaving] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSaving(true);
        setTimeout(() => {
            setSaving(false);
            toast.success("Enterprise System Configurations updated successfully!");
        }, 800);
    };

    return (
        <div className="settings-container">
            <div className="settings-header" style={{ marginBottom: "24px" }}>
                <div>
                    <h1><FaCog /> System Configuration</h1>
                    <p>Modify global ERP configurations, authentication gates, MFA policies, and rate limits.</p>
                </div>
            </div>

            <div className="settings-layout" style={{ gridTemplateColumns: "1fr" }}>
                <div className="settings-card settings-form-card" style={{ padding: "30px" }}>
                    <form onSubmit={handleSubmit} className="settings-form">
                        <div className="tab-pane">
                            <h3>ERP Global Configuration Parameters</h3>
                            <p className="tab-desc">Configure security checks and timeouts applied to all active user credentials sessions.</p>

                            <div className="form-grid">
                                <div className="form-group-full">
                                    <div className="toggle-option-card">
                                        <div className="toggle-info">
                                            <h5>Enable Multi-Level OTP MFA</h5>
                                            <p>When enabled, Managers, Admins, and Super Admins require secondary login codes.</p>
                                        </div>
                                        <div className="switch-wrapper">
                                            <label className="toggle-switch">
                                                <input
                                                    type="checkbox"
                                                    checked={config.otpActive}
                                                    onChange={(e) => setConfig({ ...config, otpActive: e.target.checked })}
                                                />
                                                <span className="slider round"></span>
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div className="form-group-full">
                                    <div className="toggle-option-card">
                                        <div className="toggle-info">
                                            <h5>Enable Login Captcha Verification</h5>
                                            <p>Prevent database logins from automated bot networks or brute-force scripts.</p>
                                        </div>
                                        <div className="switch-wrapper">
                                            <label className="toggle-switch">
                                                <input
                                                    type="checkbox"
                                                    checked={config.captchaActive}
                                                    onChange={(e) => setConfig({ ...config, captchaActive: e.target.checked })}
                                                />
                                                <span className="slider round"></span>
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div className="form-group-half">
                                    <label>Session Timeout Threshold (Minutes)</label>
                                    <div className="input-with-icon">
                                        <FaKey className="input-left-icon" />
                                        <input
                                            type="number"
                                            value={config.sessionTimeout}
                                            onChange={(e) => setConfig({ ...config, sessionTimeout: Number(e.target.value) })}
                                            placeholder="30"
                                        />
                                    </div>
                                </div>

                                <div className="form-group-half">
                                    <label>Password Complexity Filter</label>
                                    <div className="input-with-icon">
                                        <FaLock className="input-left-icon" />
                                        <select
                                            value={config.passwordComplexity}
                                            onChange={(e) => setConfig({ ...config, passwordComplexity: e.target.value })}
                                            style={{ width: "100%", padding: "10px 12px 10px 36px", border: "1px solid #cbd5e1", borderRadius: "8px", background: "#f8fafc", outline: "none" }}
                                        >
                                            <option value="Low">Low (Min 6 Characters)</option>
                                            <option value="Medium">Medium (Alphanumeric)</option>
                                            <option value="High">High (Special Char + Case Checked)</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="form-group-half">
                                    <label>API Rate Limit (Requests/Min)</label>
                                    <div className="input-with-icon">
                                        <FaShieldAlt className="input-left-icon" />
                                        <input
                                            type="number"
                                            value={config.apiRateLimit}
                                            onChange={(e) => setConfig({ ...config, apiRateLimit: Number(e.target.value) })}
                                            placeholder="100"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="settings-form-actions" style={{ marginTop: "24px" }}>
                            <button type="submit" className="settings-submit-btn" disabled={saving}>
                                {saving ? "Saving Configurations..." : "Save System Config"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default SystemConfig;
