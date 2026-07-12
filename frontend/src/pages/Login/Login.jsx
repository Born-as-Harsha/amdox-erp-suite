import "./Login.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { login, loginWithRememberMe } from "../../services/authService";
import { toast } from "react-toastify";

import {
    FaEnvelope,
    FaLock,
    FaEye,
    FaEyeSlash,
    FaSpinner,
} from "react-icons/fa";

function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [loading, setLoading] = useState(false);
    const [autoLoginLoading, setAutoLoginLoading] = useState(false);

    const [errors, setErrors] = useState({
        email: "",
        password: "",
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
                    // Token expired or invalid, clean up
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
            email: "",
            password: "",
        };

        let valid = true;

        if (!email.trim()) {
            newErrors.email = "Email is required.";
            valid = false;
        } else if (
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)
        ) {
            newErrors.email = "Please enter a valid email.";
            valid = false;
        }

        if (!password.trim()) {
            newErrors.password = "Password is required.";
            valid = false;
        }

        setErrors(newErrors);

        return valid;
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);

        try {
            const data = await login({
                email,
                password,
                rememberMe
            });

            // Keep compatibility with ProtectedRoute
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data));

            if (rememberMe && data.rememberMeToken) {
                localStorage.setItem("rememberMeToken", data.rememberMeToken);
            } else {
                localStorage.removeItem("rememberMeToken");
            }

            toast.success("Login Successful!");
            navigate("/dashboard", { replace: true });
        } catch (error) {
            toast.error(
                error?.message ||
                    error?.response?.data?.message ||
                    "Invalid email or password."
            );
        } finally {
            setLoading(false);
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

                <h2>Secure Login</h2>

                <form onSubmit={handleLogin} noValidate>
                    <div className="form-group">
                        <label>Email Address</label>

                        <div className="input-box">
                            <FaEnvelope className="input-icon" />

                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                autoComplete="email"
                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }
                            />

                        </div>

                        {errors.email && (
                            <span className="error-text">
                                {errors.email}
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