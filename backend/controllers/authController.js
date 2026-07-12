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
        const { employeeId, name, email, phone, password, confirmPassword, department, designation, role, profilePicture } = req.body;

        if (!employeeId || !name || !email || !password) {
            return res.status(400).json({ message: "Mandatory fields are missing." });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match." });
        }

        // Check if email or employee ID exists
        const emailExists = await User.findOne({ email });
        if (emailExists) {
            return res.status(400).json({ message: "User with this email already exists." });
        }

        const employeeExists = await User.findOne({ employeeId });
        if (employeeExists) {
            return res.status(400).json({ message: "Employee ID is already registered." });
        }

        // Determine user role and roleId
        const userRole = role || "Employee";
        const roleDoc = await Role.findOne({ roleName: userRole });
        const roleId = roleDoc ? roleDoc._id : null;

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create User first to get _id
        const user = new User({
            employeeId,
            name,
            email,
            phone: phone || "",
            password: hashedPassword,
            role: userRole,
            roleId,
            department: department || "",
            designation: designation || "",
            status: "Active"
        });

        // Save profile picture to server if provided
        if (profilePicture && profilePicture.startsWith("data:image")) {
            const staticPath = saveBase64Image(profilePicture, `profile_${user._id}`);
            if (staticPath) {
                user.profilePicture = staticPath;
            }
        }

        await user.save();

        // Write Audit Log
        await AuditLog.create({
            userId: user._id,
            action: "User Registration",
            details: `User ${user.email} successfully registered under Employee ID ${user.employeeId}.`,
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
// LOGIN USER
// =====================================
export const loginUser = async (req, res) => {
    try {
        const { email, password, rememberMe } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password." });
        }

        if (user.status === "Inactive") {
            return res.status(403).json({ message: "Your account is deactivated. Please contact your administrator." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password." });
        }

        // Update last login
        user.lastLogin = new Date();
        
        // Generate tokens
        const accessToken = generateToken(user._id);
        const refreshToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        user.refreshToken = refreshToken;

        // Remember Me session support
        let rememberMeToken = "";
        if (rememberMe) {
            rememberMeToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
            user.rememberMeToken = rememberMeToken;
        } else {
            user.rememberMeToken = "";
        }

        await user.save();

        // Load permissions list dynamically from database Role collection
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
// LOGOUT USER
// =====================================
export const logoutUser = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        
        if (user) {
            user.refreshToken = "";
            user.rememberMeToken = "";
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