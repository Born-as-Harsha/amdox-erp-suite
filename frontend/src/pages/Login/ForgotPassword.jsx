import "./ForgotPassword.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { forgotPassword } from "../../services/authService";
import { toast } from "react-toastify";
import { FaEnvelope, FaSpinner, FaArrowLeft, FaKey } from "react-icons/fa";

function ForgotPassword() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [recoveryToken, setRecoveryToken] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email.trim()) {
            toast.error("Please enter your registered email address.");
            return;
        }

        setLoading(true);
        try {
            const data = await forgotPassword(email);
            toast.success("Recovery token generated!");
            setRecoveryToken(data.token);
        } catch (error) {
            toast.error(error?.message || "Failed to process recovery request.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="forgot-password-page">
            <div className="forgot-password-card">
                <div className="company-logo">A</div>
                <h1 className="company-title">AMADOX TECHNOLOGIES</h1>
                <p className="company-subtitle">Enterprise AI-Powered Cloud ERP Suite</p>

                <h2>Recover Password</h2>
                <p className="forgot-description">
                    Enter your enterprise email address below. The system will generate a temporary secure recovery token to reset your password.
                </p>

                {!recoveryToken ? (
                    <form onSubmit={handleSubmit} noValidate>
                        <div className="form-group">
                            <label>Email Address</label>
                            <div className="input-box">
                                <FaEnvelope className="input-icon" />
                                <input
                                    type="email"
                                    placeholder="enter your email address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <button type="submit" className="recovery-btn" disabled={loading}>
                            {loading ? (
                                <>
                                    <FaSpinner className="spinner" /> Generating Token...
                                </>
                            ) : (
                                "Generate Recovery Token"
                            )}
                        </button>
                    </form>
                ) : (
                    <div className="recovery-success-box">
                        <div className="success-icon-wrapper">
                            <FaKey />
                        </div>
                        <h3>Recovery Token Generated</h3>
                        <p className="token-help">
                            Copy this token and proceed to the reset screen:
                        </p>
                        <div className="token-display-box">
                            <code>{recoveryToken}</code>
                        </div>
                        <button
                            type="button"
                            className="proceed-reset-btn"
                            onClick={() => navigate(`/reset-password/${recoveryToken}`)}
                        >
                            Proceed to Reset Password
                        </button>
                    </div>
                )}

                <button
                    type="button"
                    className="back-login-btn"
                    onClick={() => navigate("/")}
                >
                    <FaArrowLeft /> Back to Login
                </button>
            </div>
        </div>
    );
}

export default ForgotPassword;
