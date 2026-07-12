import "./ResetPassword.css";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { resetPassword } from "../../services/authService";
import { toast } from "react-toastify";
import { FaLock, FaEye, FaEyeSlash, FaSpinner, FaCheckCircle, FaArrowLeft } from "react-icons/fa";

function ResetPassword() {
    const navigate = useNavigate();
    const { token } = useParams();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!password.trim()) {
            toast.error("Please enter a new password.");
            return;
        }

        if (password.length < 6) {
            toast.error("Password must be at least 6 characters.");
            return;
        }

        if (password !== confirmPassword) {
            toast.error("Passwords do not match.");
            return;
        }

        setLoading(true);
        try {
            await resetPassword(token, password);
            toast.success("Password reset successfully!");
            setSuccess(true);
        } catch (error) {
            toast.error(error?.message || "Reset token has expired or is invalid.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="reset-password-page">
            <div className="reset-password-card">
                <div className="company-logo">A</div>
                <h1 className="company-title">AMADOX TECHNOLOGIES</h1>
                <p className="company-subtitle">Enterprise AI-Powered Cloud ERP Suite</p>

                <h2>Reset Your Password</h2>

                {!success ? (
                    <form onSubmit={handleSubmit} noValidate>
                        <div className="form-group">
                            <label>New Password</label>
                            <div className="input-box">
                                <FaLock className="input-icon" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Minimum 6 characters"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    className="eye-btn"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Confirm Password</label>
                            <div className="input-box">
                                <FaLock className="input-icon" />
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Re-type password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    className="eye-btn"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                        </div>

                        <button type="submit" className="reset-btn" disabled={loading}>
                            {loading ? (
                                <>
                                    <FaSpinner className="spinner" /> Resetting...
                                </>
                            ) : (
                                "Update Password"
                            )}
                        </button>
                    </form>
                ) : (
                    <div className="reset-success-box">
                        <div className="success-icon-wrapper">
                            <FaCheckCircle />
                        </div>
                        <h3>Password Updated</h3>
                        <p className="success-help">
                            Your password has been changed successfully. You can now login with your new credentials.
                        </p>
                        <button
                            type="button"
                            className="login-redirect-btn"
                            onClick={() => navigate("/")}
                        >
                            Return to Secure Login
                        </button>
                    </div>
                )}

                {!success && (
                    <button
                        type="button"
                        className="back-login-btn"
                        onClick={() => navigate("/")}
                    >
                        <FaArrowLeft /> Cancel
                    </button>
                )}
            </div>
        </div>
    );
}

export default ResetPassword;
