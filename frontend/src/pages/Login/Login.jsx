import "./Login.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { login, loginWithRememberMe, verifyOtp } from "../../services/authService";
import { toast } from "react-toastify";

import {
    FaEnvelope,
    FaLock,
    FaEye,
    FaEyeSlash,
    FaSpinner,
    FaKey
} from "react-icons/fa";

function Login() {
    const navigate = useNavigate();

    const [emailOrUsername, setEmailOrUsername] = useState("");
    const [password, setPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [loading, setLoading] = useState(false);
    const [autoLoginLoading, setAutoLoginLoading] = useState(false);

    // OTP verification fields
    const [otpRequired, setOtpRequired] = useState(false);
    const [otpEmail, setOtpEmail] = useState("");
    const [otpCode, setOtpCode] = useState("");
    const [otpLoading, setOtpLoading] = useState(false);

    const [errors, setErrors] = useState({
        emailOrUsername: "",
        password: "",
        otpCode: ""
    });

    // Check rememberMeToken on mount for auto-login
    useEffect(() => {
        const checkAutoLogin = async () => {
            const token = localStorage.getItem("rememberMeToken");
            if (token) {
                setAutoLoginLoading(true);
                try {
                    const data = await loginWithRememberMe(token);
                    localStorage.setItem("token", data.token);
                    localStorage.setItem("user", JSON.stringify(data));
                    toast.success("Welcome back! Auto-login successful.");
                    navigate("/dashboard", { replace: true });
                } catch (error) {
                    localStorage.removeItem("rememberMeToken");
                } finally {
                    setAutoLoginLoading(false);
                }
            }
        };
        checkAutoLogin();
    }, [navigate]);

    const validateForm = () => {
        const newErrors = {
            emailOrUsername: "",
            password: "",
            otpCode: ""
        };

        let valid = true;

        if (!emailOrUsername.trim()) {
            newErrors.emailOrUsername = "Email or Username is required.";
            valid = false;
        }

        if (!password.trim()) {
            newErrors.password = "Password is required.";
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);

        try {
            const data = await login({
                emailOrUsername,
                password,
                rememberMe
            });

            if (data.otpRequired) {
                // Secondary OTP Verification phase is required
                setOtpEmail(data.email);
                setOtpRequired(true);
                toast.info("Authentication code has been generated. Check console log!");
            } else {
                // Direct login success
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data));

                if (rememberMe && data.rememberMeToken) {
                    localStorage.setItem("rememberMeToken", data.rememberMeToken);
                } else {
                    localStorage.removeItem("rememberMeToken");
                }

                toast.success("Login Successful!");
                navigate("/dashboard", { replace: true });
            }
        } catch (error) {
            toast.error(
                error?.message ||
                    error?.response?.data?.message ||
                    "Invalid email/username or password."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleOtpVerify = async (e) => {
        e.preventDefault();
        if (!otpCode.trim() || otpCode.length !== 6) {
            setErrors(prev => ({ ...prev, otpCode: "Please enter the 6-digit verification code." }));
            return;
        }

        setOtpLoading(true);
        try {
            const data = await verifyOtp({
                email: otpEmail,
                otp: otpCode,
                rememberMe
            });

            // Store authentication values
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data));

            if (rememberMe && data.rememberMeToken) {
                localStorage.setItem("rememberMeToken", data.rememberMeToken);
            } else {
                localStorage.removeItem("rememberMeToken");
            }

            toast.success("Identity verified! Welcome to ERP Suite.");
            navigate("/dashboard", { replace: true });
        } catch (error) {
            toast.error(error?.message || "Invalid or expired verification code.");
        } finally {
            setOtpLoading(false);
        }
    };

    if (autoLoginLoading) {
        return (
            <div className="login-page">
                <div className="login-card" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                    <FaSpinner className="spinner" style={{ fontSize: "36px", color: "#2563eb", marginBottom: "15px" }} />
                    <h2>Restoring Session...</h2>
                    <p style={{ color: "#64748b", fontSize: "13px" }}>Connecting securely to AMADOX ERP database.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="login-page">
            <div className="login-card">
                <div className="company-logo">A</div>

                <h1 className="company-title">
                    AMADOX TECHNOLOGIES
                </h1>

                <p className="company-subtitle">
                    Enterprise AI-Powered Cloud ERP Suite
                </p>

                <h2>{otpRequired ? "OTP Verification" : "Secure Login"}</h2>

                {!otpRequired ? (
                    <form onSubmit={handleLoginSubmit} noValidate>
                        <div className="form-group">
                            <label>Email Address or Username</label>

                            <div className="input-box">
                                <FaEnvelope className="input-icon" />

                                <input
                                    type="text"
                                    placeholder="Enter email or username"
                                    value={emailOrUsername}
                                    autoComplete="username"
                                    onChange={(e) =>
                                        setEmailOrUsername(e.target.value)
                                    }
                                />

                            </div>

                            {errors.emailOrUsername && (
                                <span className="error-text">
                                    {errors.emailOrUsername}
                                </span>
                            )}
                        </div>

                        <div className="form-group">
                            <label>Password</label>

                            <div className="input-box">
                                <FaLock className="input-icon" />

                                <input
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    placeholder="Enter your password"
                                    value={password}
                                    autoComplete="current-password"
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                />

                                <button
                                    type="button"
                                    className="eye-btn"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                >
                                    {showPassword ? (
                                        <FaEyeSlash />
                                    ) : (
                                        <FaEye />
                                    )}
                                </button>
                            </div>

                            {errors.password && (
                                <span className="error-text">
                                    {errors.password}
                                </span>
                            )}
                        </div>

                    <div className="login-options">
                        <label className="remember-me">
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={() =>
                                    setRememberMe(!rememberMe)
                                }
                            />
                            Remember Me
                        </label>

                        <button
                            type="button"
                            className="forgot-password"
                            onClick={() => navigate("/forgot-password")}
                        >
                            Forgot Password?
                        </button>
                    </div>

                    <button
                        type="submit"
                        className="login-btn"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <FaSpinner className="spinner" />
                                Signing In...
                            </>
                        ) : (
                            "Login"
                        )}
                    </button>
                </form>
                ) : (
                    <form onSubmit={handleOtpVerify} noValidate>
                        <p style={{ fontSize: "13px", color: "#64748b", textAlign: "center", marginBottom: "20px", lineHeight: "1.5" }}>
                            A verification code has been dispatched to <strong>{otpEmail}</strong>.<br />
                            Check the <strong>server command prompt console logs</strong> to retrieve it!
                        </p>

                        <div className="form-group">
                            <label>OTP Verification Code</label>
                            <div className="input-box">
                                <FaKey className="input-icon" />
                                <input
                                    type="text"
                                    maxLength="6"
                                    placeholder="enter 6-digit OTP code"
                                    value={otpCode}
                                    onChange={(e) => setOtpCode(e.target.value)}
                                    style={{ letterSpacing: "3px", textAlign: "center", fontSize: "18px", paddingLeft: "12px" }}
                                />
                            </div>
                            {errors.otpCode && <span className="error-text">{errors.otpCode}</span>}
                        </div>

                        <button type="submit" className="login-btn" disabled={otpLoading} style={{ marginTop: "20px" }}>
                            {otpLoading ? (
                                <>
                                    <FaSpinner className="spinner" /> Verifying...
                                </>
                            ) : (
                                "Verify & Continue"
                            )}
                        </button>

                        <button
                            type="button"
                            className="back-login-btn"
                            onClick={() => setOtpRequired(false)}
                            style={{ background: "none", border: "none", color: "#64748b", width: "100%", textAlign: "center", marginTop: "15px", cursor: "pointer", fontSize: "13px", fontWeight: "600" }}
                        >
                            Back to Credentials
                        </button>
                    </form>
                )}

                <p className="redirect-text" style={{ fontSize: "13px", color: "#64748b", textAlign: "center", marginTop: "15px" }}>
                    Don't have an account? <span style={{ color: "#2563eb", fontWeight: "600", cursor: "pointer", textDecoration: "underline" }} onClick={() => navigate("/register")}>Register here</span>
                </p>

                <p className="footer-text">
                    © 2026 Amadox Technologies Pvt. Ltd.
                </p>
            </div>
        </div>
    );
}

export default Login;