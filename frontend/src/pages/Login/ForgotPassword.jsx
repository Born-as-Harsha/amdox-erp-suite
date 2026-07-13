import "./ForgotPassword.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { forgotPassword, verifyResetOtp } from "../../services/authService";
import { toast } from "react-toastify";
import { FaEnvelope, FaSpinner, FaArrowLeft, FaKey } from "react-icons/fa";

function ForgotPassword() {
    const navigate = useNavigate();
    const [emailOrPhone, setEmailOrPhone] = useState("");
    const [otpCode, setOtpCode] = useState("");
    const [otpRequired, setOtpRequired] = useState(false);
    const [verifiedEmail, setVerifiedEmail] = useState("");
    const [otpTimer, setOtpTimer] = useState(30);
    const [resendDisabled, setResendDisabled] = useState(true);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let timer;
        if (otpRequired && otpTimer > 0) {
            timer = setTimeout(() => setOtpTimer(otpTimer - 1), 1000);
        } else if (otpRequired && otpTimer === 0) {
            setResendDisabled(false);
        }
        return () => clearTimeout(timer);
    }, [otpRequired, otpTimer]);

    const handleSendOtp = async (e) => {
        e.preventDefault();
        if (!emailOrPhone.trim()) {
            toast.error("Email or Phone Number is required.");
            return;
        }

        setLoading(true);
        try {
            const data = await forgotPassword(emailOrPhone);
            toast.success("MFA password recovery code sent successfully.");
            setVerifiedEmail(data.email);
            setOtpRequired(true);
            setOtpTimer(30);
            setResendDisabled(true);
        } catch (error) {
            toast.error(error?.message || "Failed to process recovery request.");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        if (!otpCode || otpCode.length !== 6) {
            toast.error("Please enter the 6-digit verification code.");
            return;
        }

        setLoading(true);
        try {
            const data = await verifyResetOtp(verifiedEmail, otpCode);
            toast.success("Code verified successfully!");
            navigate(`/reset-password/${data.token}`);
        } catch (error) {
            toast.error(error?.message || "Invalid or expired verification code.");
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        try {
            await forgotPassword(verifiedEmail);
            setOtpTimer(30);
            setResendDisabled(true);
            toast.success("A new verification code has been dispatched.");
        } catch (err) {
            toast.error("Failed to resend verification code.");
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
                    {otpRequired 
                        ? `We have dispatched a 6-digit password recovery code to your phone and email. Enter it below to proceed.`
                        : `Enter your enterprise email address or registered mobile number below to retrieve a secure verification code.`
                    }
                </p>

                {!otpRequired ? (
                    <form onSubmit={handleSendOtp} noValidate>
                        <div className="form-group">
                            <label>Email Address or Mobile Number</label>
                            <div className="input-box">
                                <FaEnvelope className="input-icon" />
                                <input
                                    type="text"
                                    placeholder="Enter your registered email or phone"
                                    value={emailOrPhone}
                                    onChange={(e) => setEmailOrPhone(e.target.value)}
                                />
                            </div>
                        </div>

                        <button type="submit" className="recovery-btn" disabled={loading}>
                            {loading ? (
                                <>
                                    <FaSpinner className="spinner" /> Generating Code...
                                </>
                            ) : (
                                "Send Recovery Code"
                            )}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleVerifyOtp} noValidate>
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

                        <button type="submit" className="recovery-btn" disabled={loading}>
                            {loading ? (
                                <>
                                    <FaSpinner className="spinner" /> Verifying Code...
                                </>
                            ) : (
                                "Verify & Proceed"
                            )}
                        </button>

                        <div style={{ marginTop: "20px", fontSize: "13px", color: "#64748b", textAlign: "center" }}>
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
                )}

                <button
                    type="button"
                    className="back-login-btn"
                    onClick={() => navigate("/")}
                    style={{ marginTop: "15px" }}
                >
                    <FaArrowLeft /> Back to Login
                </button>
            </div>
        </div>
    );
}

export default ForgotPassword;
