import "./Login.css";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { login, loginWithRememberMe, verifyOtp } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";

import {
    FaEnvelope,
    FaLock,
    FaEye,
    FaEyeSlash,
    FaSpinner,
    FaKey,
    FaSyncAlt,
    FaShieldAlt,
    FaCogs,
    FaLockOpen,
    FaGlobe,
    FaCircle,
    FaInfoCircle
} from "react-icons/fa";

function Login() {
    const navigate = useNavigate();
    const { loginUserContext } = useAuth();

    const [emailOrUsername, setEmailOrUsername] = useState("");
    const [password, setPassword] = useState("");
    const [otpCode, setOtpCode] = useState("");
    const [captchaInput, setCaptchaInput] = useState("");
    const [language, setLanguage] = useState("en");

    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [loading, setLoading] = useState(false);
    const [autoLoginLoading, setAutoLoginLoading] = useState(false);

    // OTP verification parameters
    const [otpRequired, setOtpRequired] = useState(false);
    const [otpEmail, setOtpEmail] = useState("");

    // Interactive Captcha Parameters
    const [captchaText, setCaptchaText] = useState("");
    const canvasRef = useRef(null);

    // Carousel feature rotation index
    const [featureIndex, setFeatureIndex] = useState(0);

    const features = [
        {
            title: "Enterprise AI Security",
            description: "Equipped with state-of-the-art multi-level OTP verification and granular role protection filters.",
            icon: <FaShieldAlt />
        },
        {
            title: "Unified Cloud ERP Controls",
            description: "Seamlessly manage inventory, payroll ledger updates, project tracking, and employee directories.",
            icon: <FaCogs />
        },
        {
            title: "Secured Credentials Gate",
            description: "Mitigates brute-force attacks with intelligent lockouts, login history logs, and visual captchas.",
            icon: <FaLockOpen />
        }
    ];

    const [errors, setErrors] = useState({
        emailOrUsername: "",
        password: "",
        captchaInput: "",
        otpCode: ""
    });

    // Rotate carousel features every 4 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setFeatureIndex((prev) => (prev + 1) % features.length);
        }, 4000);
        return () => clearInterval(interval);
    }, [features.length]);

    // Generate random 5-character Captcha string
    const generateCaptchaText = () => {
        const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
        let text = "";
        for (let i = 0; i < 5; i++) {
            text += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setCaptchaText(text);
        setCaptchaInput("");
    };

    // Draw Captcha on Canvas with styling
    useEffect(() => {
        if (!captchaText) {
            generateCaptchaText();
            return;
        }

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw textured background
        ctx.fillStyle = "#f1f5f9";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw random noise lines
        for (let i = 0; i < 5; i++) {
            ctx.strokeStyle = `rgba(${Math.floor(Math.random() * 150)}, ${Math.floor(Math.random() * 150)}, ${Math.floor(Math.random() * 255)}, 0.3)`;
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
            ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
            ctx.stroke();
        }

        // Draw random dots (noise)
        for (let i = 0; i < 30; i++) {
            ctx.fillStyle = `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.4)`;
            ctx.beginPath();
            ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, Math.random() * 2 + 1, 0, Math.PI * 2);
            ctx.fill();
        }

        // Draw stylized characters with offsets
        ctx.font = "bold 20px 'Courier New', monospace";
        ctx.textBaseline = "middle";

        for (let i = 0; i < captchaText.length; i++) {
            const char = captchaText[i];
            const x = 10 + i * 16;
            const y = canvas.height / 2 + (Math.random() * 8 - 4);
            const angle = (Math.random() * 24 - 12) * Math.PI / 180;

            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(angle);
            ctx.fillStyle = `rgba(${Math.floor(Math.random() * 100)}, ${Math.floor(Math.random() * 100)}, ${Math.floor(Math.random() * 180)}, 0.95)`;
            ctx.fillText(char, 0, 0);
            ctx.restore();
        }
    }, [captchaText]);

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
                    
                    // Populate Auth Context
                    loginUserContext(data);

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
    }, [navigate, loginUserContext]);

    const validateForm = () => {
        const newErrors = {
            emailOrUsername: "",
            password: "",
            captchaInput: "",
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

        // Validate Captcha only if not already verified via OTP
        if (!otpRequired) {
            if (!captchaInput.trim()) {
                newErrors.captchaInput = "Captcha code is required.";
                valid = false;
            } else if (captchaInput.toUpperCase() !== captchaText) {
                newErrors.captchaInput = "Incorrect captcha code.";
                generateCaptchaText();
                valid = false;
            }
        }

        if (otpRequired && (!otpCode.trim() || otpCode.length !== 6)) {
            newErrors.otpCode = "Please enter the 6-digit OTP code.";
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);

        try {
            if (!otpRequired) {
                // Step 1: Submit email/username, password and verified captcha
                const data = await login({
                    emailOrUsername,
                    password,
                    rememberMe
                });

                if (data.otpRequired) {
                    // Role requires OTP. Enable OTP field.
                    setOtpEmail(data.email);
                    setOtpRequired(true);
                    toast.info("MFA Code required for your role. Check server console!");
                } else {
                    // Level 1 role. Direct login success.
                    localStorage.setItem("token", data.token);
                    localStorage.setItem("user", JSON.stringify(data));

                    if (rememberMe && data.rememberMeToken) {
                        localStorage.setItem("rememberMeToken", data.rememberMeToken);
                    } else {
                        localStorage.removeItem("rememberMeToken");
                    }

                    loginUserContext(data);
                    toast.success("Login Successful!");
                    navigate("/dashboard", { replace: true });
                }
            } else {
                // Step 2: Submit OTP code along with the verified session
                const data = await verifyOtp({
                    email: otpEmail,
                    otp: otpCode,
                    rememberMe
                });

                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data));

                if (rememberMe && data.rememberMeToken) {
                    localStorage.setItem("rememberMeToken", data.rememberMeToken);
                } else {
                    localStorage.removeItem("rememberMeToken");
                }

                loginUserContext(data);
                toast.success("Identity verified! Welcome to ERP Suite.");
                navigate("/dashboard", { replace: true });
            }
        } catch (error) {
            toast.error(
                error?.message ||
                    error?.response?.data?.message ||
                    "Authentication failed. Please verify credentials."
            );
            if (!otpRequired) {
                generateCaptchaText();
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page-split">
            {/* Left Panel: Hero Graphics Carousel Banner (Desktop only) */}
            <div className="login-left-banner">
                <div className="banner-overlay-grad"></div>
                {/* Tech grid mesh backdrop pattern */}
                <div className="banner-mesh-pattern"></div>
                
                <div className="banner-content">
                    <div className="banner-top-meta">
                        <div className="banner-logo">AMADOX</div>
                        <div className="banner-badge-status">
                            <FaCircle className="pulse-green-dot" /> SYSTEM ONLINE
                        </div>
                    </div>
                    
                    <div className="carousel-feature">
                        <div className="feature-icon-circle">
                            {features[featureIndex].icon}
                        </div>
                        <h2 className="feature-headline-text">
                            {features[featureIndex].title}
                        </h2>
                        <p className="feature-description-text">
                            {features[featureIndex].description}
                        </p>
                    </div>

                    <div className="banner-bottom-info">
                        <div className="carousel-indicator-dots" style={{ marginBottom: "25px" }}>
                            {features.map((_, i) => (
                                <span 
                                    key={i} 
                                    className={`indicator-dot ${i === featureIndex ? "active" : ""}`}
                                    onClick={() => setFeatureIndex(i)}
                                />
                            ))}
                        </div>

                        <div className="banner-metrics-row">
                            <div className="metric-box">
                                <span className="metric-label">SECURE SHELL</span>
                                <span className="metric-value">AES-256</span>
                            </div>
                            <div className="metric-box">
                                <span className="metric-label">COMPLIANCE</span>
                                <span className="metric-value">ISO 27001</span>
                            </div>
                            <div className="metric-box">
                                <span className="metric-label">MFA AUTH</span>
                                <span className="metric-value">ENFORCED</span>
                            </div>
                        </div>

                        <div className="banner-footer-text" style={{ marginTop: "20px" }}>
                            AMADOX TECHNOLOGIES Enterprise AI Cloud ERP Suite. Version 1.0.0
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Panel: Clean Professional Login Form */}
            <div className="login-right-form">
                {/* Top Lang Selector */}
                <div className="form-lang-switcher">
                    <FaGlobe className="lang-globe-icon" />
                    <select value={language} onChange={(e) => setLanguage(e.target.value)}>
                        <option value="en">English (US)</option>
                        <option value="es">Español</option>
                        <option value="fr">Français</option>
                    </select>
                </div>

                <div className="login-form-wrapper">
                    <div className="form-header-badge">AMADOX ERP GATEWAY</div>
                    <h2>Secure Sign In</h2>
                    <p className="gateway-desc">Enter your enterprise credentials and pass verification to enter the ERP portal.</p>

                    <form onSubmit={handleFormSubmit} noValidate>
                        {/* Field 1: Email, Username, or Mobile Number */}
                        <div className="form-group">
                            <label>Email, Username, or Mobile Number</label>
                            <div className="input-box">
                                <FaEnvelope className="input-icon" />
                                <input
                                    type="text"
                                    placeholder="Enter email, username, or mobile number"
                                    value={emailOrUsername}
                                    autoComplete="username"
                                    disabled={otpRequired}
                                    onChange={(e) => setEmailOrUsername(e.target.value)}
                                />
                            </div>
                            {errors.emailOrUsername && (
                                <span className="error-text">{errors.emailOrUsername}</span>
                            )}
                        </div>

                        {/* Field 2: Password */}
                        <div className="form-group">
                            <label>Password</label>
                            <div className="input-box">
                                <FaLock className="input-icon" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    value={password}
                                    autoComplete="current-password"
                                    disabled={otpRequired}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    className="eye-btn"
                                    disabled={otpRequired}
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                            {errors.password && (
                                <span className="error-text">{errors.password}</span>
                            )}
                        </div>

                        {/* Field 3: Visual Text Captcha Verification (Required only before OTP step) */}
                        {!otpRequired && (
                            <div className="form-group captcha-group-block">
                                <label>Verification Code (Captcha)</label>
                                <div className="captcha-layout-row">
                                    <div className="captcha-image-wrapper">
                                        <canvas 
                                            ref={canvasRef} 
                                            width="100" 
                                            height="38" 
                                            title="Click to refresh captcha"
                                            onClick={generateCaptchaText}
                                            style={{ borderRadius: "8px", border: "1px solid #e2e8f0", cursor: "pointer" }}
                                        />
                                        <button 
                                            type="button" 
                                            className="refresh-captcha-btn"
                                            onClick={generateCaptchaText}
                                            title="Refresh verification image"
                                        >
                                            <FaSyncAlt />
                                        </button>
                                    </div>
                                    <input
                                        type="text"
                                        maxLength="5"
                                        placeholder="Enter code"
                                        value={captchaInput}
                                        onChange={(e) => setCaptchaInput(e.target.value)}
                                    />
                                </div>
                                {errors.captchaInput && (
                                    <span className="error-text">{errors.captchaInput}</span>
                                )}
                            </div>
                        )}

                        {/* Field 4: Dynamic OTP Code (Always visible, highlighted when active) */}
                        <div className={`form-group ${otpRequired ? "otp-active-highlight" : "otp-inactive-dim"}`} style={{ marginTop: "15px" }}>
                            <label style={{ display: "flex", justifyContent: "space-between" }}>
                                <span>MFA OTP Verification Code</span>
                                {otpRequired && <span style={{ color: "#d97706", fontWeight: "600", fontSize: "11px" }}>Required *</span>}
                            </label>
                            <div className="input-box">
                                <FaKey className="input-icon" />
                                <input
                                    type="text"
                                    maxLength="6"
                                    placeholder={otpRequired ? "Enter 6-digit OTP code" : "Optional (MFA roles only)"}
                                    value={otpCode}
                                    disabled={!otpRequired}
                                    onChange={(e) => setOtpCode(e.target.value)}
                                    style={{
                                        letterSpacing: otpRequired ? "3px" : "normal",
                                        textAlign: otpRequired ? "center" : "left",
                                        fontSize: otpRequired ? "16px" : "14px",
                                        background: !otpRequired ? "#f1f5f9" : "#ffffff",
                                        cursor: !otpRequired ? "not-allowed" : "text"
                                    }}
                                />
                            </div>
                            {otpRequired ? (
                                <span style={{ fontSize: "12px", color: "#d97706", marginTop: "4px", display: "block" }}>
                                    Code sent to your console. Check your server logs!
                                </span>
                            ) : (
                                <span style={{ fontSize: "11px", color: "#94a3b8", marginTop: "4px", display: "block" }}>
                                    Only required for Managers, Admins, and Super Admin.
                                </span>
                            )}
                            {errors.otpCode && (
                                <span className="error-text">{errors.otpCode}</span>
                            )}
                        </div>

                        <div className="login-options">
                            <label className="remember-me">
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    disabled={otpRequired}
                                    onChange={() => setRememberMe(!rememberMe)}
                                />
                                Remember Me
                            </label>

                            {!otpRequired && (
                                <button
                                    type="button"
                                    className="forgot-password"
                                    onClick={() => navigate("/forgot-password")}
                                >
                                    Forgot Password?
                                </button>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="login-btn"
                            disabled={loading}
                            style={{ background: otpRequired ? "#d97706" : "#2563eb" }}
                        >
                            {loading ? (
                                <>
                                    <FaSpinner className="spinner" />
                                    {otpRequired ? "Verifying OTP..." : "Signing In..."}
                                </>
                            ) : (
                                otpRequired ? "Verify & Sign In" : "Request OTP / Sign In"
                            )}
                        </button>

                        {otpRequired && (
                            <button
                                type="button"
                                className="back-login-btn"
                                onClick={() => {
                                    setOtpRequired(false);
                                    setOtpCode("");
                                }}
                                style={{ background: "none", border: "none", color: "#64748b", width: "100%", textAlign: "center", marginTop: "15px", cursor: "pointer", fontSize: "13px", fontWeight: "600" }}
                            >
                                Reset & Change Credentials
                            </button>
                        )}
                    </form>

                    <p className="redirect-text" style={{ fontSize: "13px", color: "#64748b", textAlign: "center", marginTop: "24px" }}>
                        Don't have an account? <span style={{ color: "#2563eb", fontWeight: "600", cursor: "pointer", textDecoration: "underline" }} onClick={() => navigate("/register")}>Register here</span>
                    </p>

                    <div className="form-footer-note">
                        <FaInfoCircle style={{ marginRight: "4px", position: "relative", top: "1px" }} /> Need help? Contact the IT helpdesk or Administrator.
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;