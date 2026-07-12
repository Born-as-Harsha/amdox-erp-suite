import "./Register.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../../services/authService";
import { convertImageToBase64 } from "../../utils/helpers";
import { toast } from "react-toastify";
import { FaUser, FaEnvelope, FaLock, FaPhone, FaBuilding, FaUserTie, FaEye, FaEyeSlash, FaSpinner, FaUpload, FaTrash, FaMapMarkerAlt, FaHeartbeat, FaCalendarAlt, FaLanguage } from "react-icons/fa";

function Register() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [formData, setFormData] = useState({
        employeeId: "",
        username: "",
        name: "",
        email: "",
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
        if (!validateForm()) return;

        setLoading(true);
        try {
            await register(formData);
            toast.success("Registration Successful! Please Login.");
            navigate("/", { replace: true });
        } catch (error) {
            toast.error(error?.message || "Failed to register account.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-page">
            <div className="register-card" style={{ maxWidth: "1000px" }}>
                <div className="company-logo">A</div>
                <h1 className="company-title">AMADOX TECHNOLOGIES</h1>
                <p className="company-subtitle">Enterprise AI-Powered Cloud ERP Suite</p>
                
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
                                        placeholder="EMP102"
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
                                        placeholder="kavyanair"
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
                                        placeholder="Kavya Nair"
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
                                        placeholder="kavya@amdox.com"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                                {errors.email && <span className="error-text">{errors.email}</span>}
                            </div>

                            <div className="form-group">
                                <label>Phone Number *</label>
                                <div className="input-box">
                                    <FaPhone className="input-icon" />
                                    <input
                                        type="text"
                                        placeholder="+91 98765 09876"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                                {errors.phone && <span className="error-text">{errors.phone}</span>}
                            </div>

                            <div className="form-group">
                                <label>Gender</label>
                                <select
                                    value={formData.gender}
                                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                    style={{ padding: "10px", border: "1px solid #cbd5e1", borderRadius: "8px", background: "#f8fafc", outline: "none", fontSize: "14px" }}
                                >
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
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
                                <label>Language</label>
                                <div className="input-box">
                                    <FaLanguage className="input-icon" />
                                    <input
                                        type="text"
                                        placeholder="English"
                                        value={formData.language}
                                        onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Department *</label>
                                <div className="input-box">
                                    <FaBuilding className="input-icon" />
                                    <input
                                        type="text"
                                        placeholder="HR Operations"
                                        value={formData.department}
                                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                    />
                                </div>
                                {errors.department && <span className="error-text">{errors.department}</span>}
                            </div>

                            <div className="form-group">
                                <label>Designation *</label>
                                <div className="input-box">
                                    <FaUserTie className="input-icon" />
                                    <input
                                        type="text"
                                        placeholder="HR Recruiter"
                                        value={formData.designation}
                                        onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                                    />
                                </div>
                                {errors.designation && <span className="error-text">{errors.designation}</span>}
                            </div>

                            <div className="form-group">
                                <label>Emergency Contact</label>
                                <div className="input-box">
                                    <FaHeartbeat className="input-icon" />
                                    <input
                                        type="text"
                                        placeholder="+91 99887 76655"
                                        value={formData.emergencyContact}
                                        onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Address</label>
                                <div className="input-box">
                                    <FaMapMarkerAlt className="input-icon" />
                                    <input
                                        type="text"
                                        placeholder="Noida, India"
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Password *</label>
                                <div className="input-box">
                                    <FaLock className="input-icon" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Minimum 6 characters"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    />
                                    <button type="button" className="eye-btn" onClick={() => setShowPassword(!showPassword)}>
                                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                                {errors.password && <span className="error-text">{errors.password}</span>}
                            </div>

                            <div className="form-group">
                                <label>Confirm Password *</label>
                                <div className="input-box">
                                    <FaLock className="input-icon" />
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder="Re-type password"
                                        value={formData.confirmPassword}
                                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    />
                                    <button type="button" className="eye-btn" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                                {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
                            </div>
                        </div>

                        <div className="form-group" style={{ gridColumn: "span 2", marginTop: "12px" }}>
                            <label>Biography</label>
                            <textarea
                                placeholder="Tell us about yourself..."
                                value={formData.bio}
                                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                style={{ padding: "10px", border: "1px solid #cbd5e1", borderRadius: "8px", background: "#f8fafc", outline: "none", fontSize: "14px", minHeight: "80px", resize: "vertical" }}
                            />
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

                <p className="footer-text">© 2026 Amadox Technologies Pvt. Ltd.</p>
            </div>
        </div>
    );
}

export default Register;
