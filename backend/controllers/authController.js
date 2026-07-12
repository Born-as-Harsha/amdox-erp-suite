import User from "../models/User.js";
import Role from "../models/Role.js";
import UserSession from "../models/UserSession.js";
import AuditLog from "../models/AuditLog.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";
import { saveBase64Image } from "../utils/imageHelper.js";

// =====================================
// REGISTER USER
// =====================================
export const registerUser = async (req, res) => {
    try {
        const { employeeId, username, name, email, phone, password, confirmPassword, department, designation, role, profilePicture, gender, dateOfBirth, address, emergencyContact, language, bio } = req.body;

        if (!employeeId || !username || !name || !email || !password) {
            return res.status(400).json({ message: "Mandatory fields are missing." });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match." });
        }

        // Check duplicates
        const emailExists = await User.findOne({ email });
        if (emailExists) {
            return res.status(400).json({ message: "User with this email already exists." });
        }

        const usernameExists = await User.findOne({ username });
        if (usernameExists) {
            return res.status(400).json({ message: "Username is already taken." });
        }

        const employeeExists = await User.findOne({ employeeId });
        if (employeeExists) {
            return res.status(400).json({ message: "Employee ID is already registered." });
        }

        // Role assignment
        const userRole = role || "Employee";
        const roleDoc = await Role.findOne({ roleName: userRole });
        const roleId = roleDoc ? roleDoc._id : null;

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({
            employeeId,
            username,
            name,
            email,
            phone: phone || "",
            password: hashedPassword,
            role: userRole,
            roleId,
            department: department || "",
            designation: designation || "",
            gender: gender || "Male",
            dateOfBirth: dateOfBirth || "",
            address: address || "",
            emergencyContact: emergencyContact || "",
            language: language || "English",
            bio: bio || "",
            status: "Active",
            emailVerified: true,
            otpVerified: true
        });

        // Save profile picture to uploads/profile
        if (profilePicture && profilePicture.startsWith("data:image")) {
            const staticPath = saveBase64Image(profilePicture, `profile_${user.employeeId}`);
            if (staticPath) {
                user.profilePicture = staticPath;
            }
        }

        await user.save();

        // Write Audit Log
        await AuditLog.create({
            userId: user._id,
            action: "User Registration",
            details: `User ${user.email} registered.`,
            ipAddress: req.ip || ""
        });

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            employeeId: user.employeeId,
            profilePicture: user.profilePicture,
            token: generateToken(user._id)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// =====================================
// LOGIN USER (Email OR Username)
// =====================================
export const loginUser = async (req, res) => {
    try {
        const { emailOrUsername, password, rememberMe } = req.body;

        // Find user by email OR username OR phone
        const user = await User.findOne({
            $or: [
                { email: emailOrUsername },
                { username: emailOrUsername },
                { phone: emailOrUsername }
            ]
        });

        if (!user) {
            return res.status(401).json({ message: "Invalid email/username/mobile or password." });
        }

        if (user.status === "Inactive") {
            return res.status(403).json({ message: "Your account is deactivated." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email/username/mobile or password." });
        }

        // Determine OTP Requirement Level
        const level1Roles = ["Employee", "Viewer"];
        const needsOtp = !level1Roles.includes(user.role);

        if (needsOtp) {
            // Generate 6 digit OTP
            const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
            user.otpCode = otpCode;
            user.otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes validation
            user.otpVerified = false;
            await user.save();

            // Print OTP to Node Console for simulated email/SMS dispatch
            console.log(`\n======================================\n[SIMULATED SMS & EMAIL DISPATCH]\nTO: ${user.email}\nSMS PHONE: ${user.phone || "7901446220"}\nSUBJECT: AMADOX ERP OTP VERIFICATION CODE\nOTP CODE: ${otpCode}\n======================================\n`);

            return res.status(200).json({
                otpRequired: true,
                email: user.email,
                message: "OTP Code sent successfully. Please verify to log in."
            });
        }

        // Direct Login for Level 1
        user.lastLogin = new Date();
        user.otpVerified = true;
        
        const accessToken = generateToken(user._id);
        const refreshToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        user.refreshToken = refreshToken;

        let rememberMeToken = "";
        if (rememberMe) {
            rememberMeToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
            user.rememberMeToken = rememberMeToken;
        } else {
            user.rememberMeToken = "";
        }

        await user.save();

        const roleDoc = await Role.findOne({ roleName: user.role });
        const permissions = roleDoc ? roleDoc.permissions : [];

        await UserSession.create({
            userId: user._id,
            ipAddress: req.ip || "",
            userAgent: req.headers["user-agent"] || "",
            isActive: true
        });

        await AuditLog.create({
            userId: user._id,
            action: "User Login",
            details: `User ${user.email} logged in.`,
            ipAddress: req.ip || ""
        });

        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            employeeId: user.employeeId,
            profilePicture: user.profilePicture,
            department: user.department,
            designation: user.designation,
            permissions,
            token: accessToken,
            refreshToken,
            rememberMeToken
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// =====================================
// VERIFY OTP ENDPOINT
// =====================================
export const verifyOtp = async (req, res) => {
    try {
        const { email, otp, rememberMe } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        if (!user.otpCode || user.otpCode !== otp || user.otpExpires < Date.now()) {
            return res.status(400).json({ message: "Invalid or expired OTP code." });
        }

        // OTP Verified, clear code
        user.otpCode = "";
        user.otpExpires = undefined;
        user.otpVerified = true;
        user.lastLogin = new Date();

        const accessToken = generateToken(user._id);
        const refreshToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        user.refreshToken = refreshToken;

        let rememberMeToken = "";
        if (rememberMe) {
            rememberMeToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
            user.rememberMeToken = rememberMeToken;
        } else {
            user.rememberMeToken = "";
        }

        await user.save();

        const roleDoc = await Role.findOne({ roleName: user.role });
        const permissions = roleDoc ? roleDoc.permissions : [];

        await UserSession.create({
            userId: user._id,
            ipAddress: req.ip || "",
            userAgent: req.headers["user-agent"] || "",
            isActive: true
        });

        await AuditLog.create({
            userId: user._id,
            action: "OTP Login Verified",
            details: `OTP Verified for user ${user.email}.`,
            ipAddress: req.ip || ""
        });

        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            employeeId: user.employeeId,
            profilePicture: user.profilePicture,
            department: user.department,
            designation: user.designation,
            permissions,
            token: accessToken,
            refreshToken,
            rememberMeToken
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// =====================================
// LOGOUT USER
// =====================================
export const logoutUser = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        
        if (user) {
            user.refreshToken = "";
            user.rememberMeToken = "";
            user.lastLogout = new Date();
            await user.save();

            // Deactivate all user sessions
            await UserSession.updateMany({ userId: user._id, isActive: true }, { isActive: false });

            // Audit log
            await AuditLog.create({
                userId: user._id,
                action: "User Logout",
                details: `User ${user.email} logged out successfully.`,
                ipAddress: req.ip || ""
            });
        }

        res.status(200).json({ message: "Logout successful." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// =====================================
// FORGOT PASSWORD
// =====================================
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "No account found with this email." });
        }

        // Generate simple token string
        const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour expiration
        await user.save();

        // Write Audit Log
        await AuditLog.create({
            userId: user._id,
            action: "Forgot Password Request",
            details: `Recovery request registered for ${user.email}.`,
            ipAddress: req.ip || ""
        });

        // Return token directly in the API response payload
        res.status(200).json({
            message: "Password reset token generated successfully.",
            token
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// =====================================
// RESET PASSWORD
// =====================================
export const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: "Password reset token is invalid or has expired." });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        user.password = hashedPassword;
        user.resetPasswordToken = "";
        user.resetPasswordExpires = undefined;
        await user.save();

        // Write Audit Log
        await AuditLog.create({
            userId: user._id,
            action: "Password Reset Completed",
            details: `Password reset verified for user: ${user.email}.`,
            ipAddress: req.ip || ""
        });

        res.status(200).json({ message: "Password reset successful. You can now login with your new credentials." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// =====================================
// REMEMBER ME AUTO-LOGIN
// =====================================
export const verifyRememberMe = async (req, res) => {
    try {
        const { token } = req.body;
        if (!token) {
            return res.status(400).json({ message: "Remember me token is required." });
        }

        const user = await User.findOne({ rememberMeToken: token });
        if (!user) {
            return res.status(401).json({ message: "Remember me session has expired or is invalid." });
        }

        if (user.status === "Inactive") {
            return res.status(403).json({ message: "Your account is deactivated." });
        }

        // Refresh login details
        user.lastLogin = new Date();
        const accessToken = generateToken(user._id);
        await user.save();

        const roleDoc = await Role.findOne({ roleName: user.role });
        const permissions = roleDoc ? roleDoc.permissions : [];

        // Log Active Session
        await UserSession.create({
            userId: user._id,
            ipAddress: req.ip || "",
            userAgent: req.headers["user-agent"] || "",
            isActive: true
        });

        // Write Audit Log
        await AuditLog.create({
            userId: user._id,
            action: "Remember Me Login",
            details: `Session restored dynamically for: ${user.email}.`,
            ipAddress: req.ip || ""
        });

        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            employeeId: user.employeeId,
            profilePicture: user.profilePicture,
            department: user.department,
            designation: user.designation,
            permissions,
            token: accessToken
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};