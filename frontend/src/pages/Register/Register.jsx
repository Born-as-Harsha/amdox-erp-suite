import "./Register.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { register, verifyOtp, forgotPassword } from "../../services/authService";
import { convertImageToBase64 } from "../../utils/helpers";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { FaUser, FaEnvelope, FaLock, FaPhone, FaBuilding, FaUserTie, FaEye, FaEyeSlash, FaSpinner, FaUpload, FaTrash, FaMapMarkerAlt, FaHeartbeat, FaCalendarAlt, FaLanguage, FaKey } from "react-icons/fa";

function Register() {
    const navigate = useNavigate();
    const { loginUserContext } = useAuth();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // OTP Verification Flow states
    const [otpRequired, setOtpRequired] = useState(false);
    const [otpCode, setOtpCode] = useState("");
    const [otpTimer, setOtpTimer] = useState(30);
    const [resendDisabled, setResendDisabled] = useState(true);

    const [formData, setFormData] = useState({
        employeeId: "",
        username: "",
        name: "",
        email: "",
        personalEmail: "",
        phone: "",
        password: "",
        confirmPassword: "",
        department: "Engineering",
        designation: "Software Engineer",
        role: "Employee", 
        profilePicture: "",
        gender: "Male",
        dateOfBirth: "",
        address: "",
        emergencyContact: "",
        language: "English",
        bio: "",
        agreeTerms: false
    });

    const [errors, setErrors] = useState({});

    // Resend OTP timer logic
    useEffect(() => {
        let timer;
        if (otpRequired && otpTimer > 0) {
            timer = setTimeout(() => setOtpTimer(otpTimer - 1), 1000);
        } else if (otpRequired && otpTimer === 0) {
            setResendDisabled(false);
        }
        return () => clearTimeout(timer);
    }, [otpRequired, otpTimer]);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                const base64 = await convertImageToBase64(file, { maxSizeMB: 2 });
                setFormData((prev) => ({ ...prev, profilePicture: base64 }));
            } catch (err) {
                toast.error(err.message || "Failed to convert image.");
            }
        }
    };

    const removeAvatar = () => {
        setFormData(prev => ({ ...prev, profilePicture: "" }));
    };

    const validateForm = () => {
        const errs = {};
        if (!formData.employeeId.trim()) errs.employeeId = "Employee ID is required.";
        if (!formData.username.trim()) errs.username = "Username is required.";
        if (!formData.name.trim()) errs.name = "Full Name is required.";
        if (!formData.email.trim()) {
            errs.email = "Email is required.";
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
            errs.email = "Please enter a valid email.";
        }
        if (!formData.phone.trim()) errs.phone = "Phone number is required.";
        if (!formData.password) {
            errs.password = "Password is required.";
        } else if (formData.password.length < 6) {
            errs.password = "Password must be at least 6 characters.";
        }
        if (formData.password !== formData.confirmPassword) {
            errs.confirmPassword = "Passwords do not match.";
        }
        if (!formData.department.trim()) errs.department = "Department is required.";
        if (!formData.designation.trim()) errs.designation = "Designation is required.";
        if (!formData.agreeTerms) errs.agreeTerms = "You must agree to the Terms & Conditions.";

        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        
        if (otpRequired) {
            if (!otpCode || otpCode.length !== 6) {
                toast.error("Please enter the 6-digit OTP code.");
                return;
            }
            setLoading(true);
            try {
                const data = await verifyOtp({
                    email: formData.email,
                    otp: otpCode,
                    rememberMe: false
                });

                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data));
                loginUserContext(data);

                toast.success(data.message || "Registration is successful");
                navigate("/dashboard", { replace: true });
            } catch (err) {
                toast.error(err.message || "Invalid or expired OTP code.");
            } finally {
                setLoading(false);
            }
            return;
        }

        if (!validateForm()) return;

        setLoading(true);
        try {
            const data = await register(formData);
            if (data.otpRequired) {
                setOtpRequired(true);
                setOtpTimer(30);
                setResendDisabled(true);
                toast.success("MFA verification code sent to your registered email and phone.");
            } else {
                toast.success("Registration Successful! Please Login.");
                navigate("/", { replace: true });
            }
        } catch (error) {
            toast.error(error?.message || "Failed to register account.");
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        try {
            await forgotPassword(formData.email);
            setOtpTimer(30);
            setResendDisabled(true);
            toast.success("A new verification code has been dispatched.");
        } catch (err) {
            toast.error("Failed to resend verification code.");
        }
    };

    return (
        <div className="register-page">
            <div className="register-card" style={{ maxWidth: "1000px" }}>
                <div className="company-logo">A</div>
                <h1 className="company-title">AMADOX TECHNOLOGIES</h1>
                <p className="company-subtitle">Enterprise AI-Powered Cloud ERP Suite</p>
                
                {otpRequired ? (
                    <div className="otp-verification-section" style={{ maxWidth: "400px", margin: "30px auto 10px auto", textAlign: "center" }}>
                        <div className="company-logo" style={{ margin: "0 auto 16px auto", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <FaKey style={{ color: "#ffffff", fontSize: "20px" }} />
                        </div>
                        <h2>Verify Your Identity</h2>
                        <p style={{ fontSize: "14px", color: "#64748b", marginBottom: "24px", lineHeight: "1.5" }}>
                            We have sent a secure 6-digit verification code to your registered mobile number <b>{formData.phone || "7901446220"}</b> and email <b>{formData.email}</b>.
                        </p>

                        <form onSubmit={handleRegister} className="login-form">
                            <div className="form-group" style={{ marginBottom: "20px" }}>
                                <label style={{ textAlign: "left", display: "block", marginBottom: "6px" }}>Verification Code</label>
                                <div className="input-box">
                                    <FaKey className="input-icon" />
                                    <input
                                        type="text"
                                        maxLength="6"
                                        required
                                        placeholder="6-Digit OTP"
                                        value={otpCode}
                                        onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                                        style={{ letterSpacing: "4px", textAlign: "center", fontSize: "18px", fontWeight: "700" }}
                                    />
                                </div>
                            </div>

                            <button type="submit" className="register-submit-btn" disabled={loading} style={{ width: "100%", padding: "12px" }}>
                                {loading ? <FaSpinner className="spinner" /> : "Verify & Activate Account"}
                            </button>

                            <div style={{ marginTop: "20px", fontSize: "13px", color: "#64748b" }}>
                                {resendDisabled ? (
                                    <span>Resend OTP in <b>{otpTimer}s</b></span>
                                ) : (
                                    <button 
                                        type="button" 
                                        onClick={handleResendOtp}
                                        style={{ background: "none", border: "none", color: "#2563eb", fontWeight: "600", cursor: "pointer", outline: "none" }}
                                    >
                                        Resend Code
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                ) : (
                    <>
                        <h2>Create Account</h2>

                        <form onSubmit={handleRegister} noValidate className="register-form-grid" style={{ gridTemplateColumns: "220px 1fr" }}>
                            {/* Left Column: Avatar & File upload */}
                            <div className="avatar-upload-column">
                                <div className="profile-avatar-wrapper" style={{ width: "120px", height: "120px" }}>
                                    {formData.profilePicture ? (
                                        <img src={formData.profilePicture} alt="Avatar Preview" className="avatar-preview-img" />
                                    ) : (
                                        <div className="avatar-placeholder">
                                            <span>Upload Photo</span>
                                        </div>
                                    )}
                                    <div className="avatar-hover-overlay">
                                        <label htmlFor="avatar-file-input">
                                            <FaUpload />
                                        </label>
                                        <input
                                            id="avatar-file-input"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            style={{ display: "none" }}
                                        />
                                    </div>
                                </div>
                                {formData.profilePicture && (
                                    <button type="button" className="remove-avatar-btn" onClick={removeAvatar}>
                                        <FaTrash /> Remove
                                    </button>
                                )}
                                <small className="upload-help-text">JPG, JPEG, PNG or WEBP (Max 2MB)</small>
                            </div>

                            {/* Right Column: Text inputs */}
                            <div className="inputs-column">
                                <div className="register-fields-grid">
                                    <div className="form-group">
                                        <label>Employee ID *</label>
                                        <div className="input-box">
                                            <FaUserTie className="input-icon" />
                                            <input
                                                type="text"
                                                placeholder="EMP001"
                                                value={formData.employeeId}
                                                onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                                            />
                                        </div>
                                        {errors.employeeId && <span className="error-text">{errors.employeeId}</span>}
                                    </div>

                                    <div className="form-group">
                                        <label>Username *</label>
                                        <div className="input-box">
                                            <FaUser className="input-icon" />
                                            <input
                                                type="text"
                                                placeholder="johndoe"
                                                value={formData.username}
                                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                            />
                                        </div>
                                        {errors.username && <span className="error-text">{errors.username}</span>}
                                    </div>

                                    <div className="form-group">
                                        <label>Full Name *</label>
                                        <div className="input-box">
                                            <FaUser className="input-icon" />
                                            <input
                                                type="text"
                                                placeholder="John Doe"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            />
                                        </div>
                                        {errors.name && <span className="error-text">{errors.name}</span>}
                                    </div>

                                    <div className="form-group">
                                        <label>Email Address *</label>
                                        <div className="input-box">
                                            <FaEnvelope className="input-icon" />
                                            <input
                                                type="email"
                                                placeholder="john.doe@company.com"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            />
                                        </div>
                                        {errors.email && <span className="error-text">{errors.email}</span>}
                                    </div>

                                    <div className="form-group">
                                        <label>Personal Email Address</label>
                                        <div className="input-box">
                                            <FaEnvelope className="input-icon" />
                                            <input
                                                type="email"
                                                placeholder="john.doe@personal.com"
                                                value={formData.personalEmail || ""}
                                                onChange={(e) => setFormData({ ...formData, personalEmail: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label>Mobile Number *</label>
                                        <div className="input-box">
                                            <FaPhone className="input-icon" />
                                            <input
                                                type="tel"
                                                placeholder="7901446220"
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            />
                                        </div>
                                        {errors.phone && <span className="error-text">{errors.phone}</span>}
                                    </div>

                                    <div className="form-group">
                                        <label>Gender</label>
                                        <div className="input-box">
                                            <FaUser className="input-icon" />
                                            <select
                                                value={formData.gender}
                                                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                                style={{ width: "100%", padding: "10px 12px 10px 36px", border: "1px solid #cbd5e1", borderRadius: "8px", outline: "none", background: "#f8fafc", fontSize: "14px" }}
                                            >
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label>Date of Birth</label>
                                        <div className="input-box">
                                            <FaCalendarAlt className="input-icon" />
                                            <input
                                                type="date"
                                                value={formData.dateOfBirth}
                                                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label>Emergency Contact</label>
                                        <div className="input-box">
                                            <FaPhone className="input-icon" />
                                            <input
                                                type="text"
                                                placeholder="Name / Relationship / Phone"
                                                value={formData.emergencyContact}
                                                onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label>Department *</label>
                                        <div className="input-box">
                                            <FaBuilding className="input-icon" />
                                            <select
                                                value={formData.department}
                                                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                                style={{ width: "100%", padding: "10px 12px 10px 36px", border: "1px solid #cbd5e1", borderRadius: "8px", outline: "none", background: "#f8fafc", fontSize: "14px" }}
                                            >
                                                <option value="Engineering">Engineering</option>
                                                <option value="Human Resources">Human Resources</option>
                                                <option value="Finance">Finance</option>
                                                <option value="Inventory">Inventory</option>
                                                <option value="Executive Office">Executive Office</option>
                                            </select>
                                        </div>
                                        {errors.department && <span className="error-text">{errors.department}</span>}
                                    </div>

                                    <div className="form-group">
                                        <label>Designation *</label>
                                        <div className="input-box">
                                            <FaUserTie className="input-icon" />
                                            <input
                                                type="text"
                                                placeholder="Software Engineer"
                                                value={formData.designation}
                                                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                                            />
                                        </div>
                                        {errors.designation && <span className="error-text">{errors.designation}</span>}
                                    </div>

                                    <div className="form-group">
                                        <label>Assign Role *</label>
                                        <div className="input-box">
                                            <FaUser className="input-icon" />
                                            <select
                                                value={formData.role}
                                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                                style={{ width: "100%", padding: "10px 12px 10px 36px", border: "1px solid #cbd5e1", borderRadius: "8px", outline: "none", background: "#f8fafc", fontSize: "14px" }}
                                            >
                                                <option value="Employee">Employee</option>
                                                <option value="Project Lead">Project Lead</option>
                                                <option value="HR Executive">HR Executive</option>
                                                <option value="Accountant">Accountant</option>
                                                <option value="Store Keeper">Store Keeper</option>
                                                <option value="Viewer">Viewer</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label>Preferred Language</label>
                                        <div className="input-box">
                                            <FaLanguage className="input-icon" />
                                            <select
                                                value={formData.language}
                                                onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                                                style={{ width: "100%", padding: "10px 12px 10px 36px", border: "1px solid #cbd5e1", borderRadius: "8px", outline: "none", background: "#f8fafc", fontSize: "14px" }}
                                            >
                                                <option value="English">English</option>
                                                <option value="Hindi">Hindi</option>
                                                <option value="Telugu">Telugu</option>
                                                <option value="Spanish">Spanish</option>
                                                <option value="French">French</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="form-group" style={{ gridColumn: "span 2" }}>
                                        <label>Office Address</label>
                                        <div className="input-box">
                                            <FaMapMarkerAlt className="input-icon" />
                                            <input
                                                type="text"
                                                placeholder="123 Corporate Blvd, Suite 400"
                                                value={formData.address}
                                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="form-group" style={{ gridColumn: "span 2" }}>
                                        <label>Biography</label>
                                        <textarea
                                            placeholder="Tell us about yourself..."
                                            value={formData.bio}
                                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                            style={{ padding: "10px", border: "1px solid #cbd5e1", borderRadius: "8px", background: "#f8fafc", outline: "none", fontSize: "14px", minHeight: "80px", resize: "vertical" }}
                                        />
                                    </div>
                                </div>

                                <div className="terms-checkbox-wrapper">
                                    <label className="checkbox-container">
                                        <input
                                            type="checkbox"
                                            checked={formData.agreeTerms}
                                            onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
                                        />
                                        <span className="checkmark"></span>
                                        I agree to the Terms & Conditions of AMADOX ERP Suite
                                    </label>
                                    {errors.agreeTerms && <span className="error-text block">{errors.agreeTerms}</span>}
                                </div>

                                <button type="submit" className="register-submit-btn" disabled={loading}>
                                    {loading ? (
                                        <>
                                            <FaSpinner className="spinner" /> Creating Profile...
                                        </>
                                    ) : (
                                        "Register Account"
                                    )}
                                </button>

                                <p className="redirect-text">
                                    Already registered? <span onClick={() => navigate("/")}>Secure Login</span>
                                </p>
                            </div>
                        </form>
                    </>
                )}

                <p className="footer-text">© 2026 Amadox Technologies Pvt. Ltd.</p>
            </div>
        </div>
    );
}

export default Register;
