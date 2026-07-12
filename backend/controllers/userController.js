import User from "../models/User.js";
import Role from "../models/Role.js";
import bcrypt from "bcryptjs";
import AuditLog from "../models/AuditLog.js";

// Get All Users
export const getUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password").sort({ createdAt: -1 });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create User (by Admin)
export const createUser = async (req, res) => {
    try {
        const { employeeId, name, email, phone, password, role, department, designation } = req.body;

        const emailExists = await User.findOne({ email });
        if (emailExists) {
            return res.status(400).json({ message: "Email already registered." });
        }

        const employeeExists = await User.findOne({ employeeId });
        if (employeeExists) {
            return res.status(400).json({ message: "Employee ID already exists." });
        }

        const roleDoc = await Role.findOne({ roleName: role });
        const roleId = roleDoc ? roleDoc._id : null;

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password || "Amdox@123", salt);

        const newUser = await User.create({
            employeeId,
            name,
            email,
            phone: phone || "",
            password: hashedPassword,
            role: role || "Employee",
            roleId,
            department: department || "",
            designation: designation || "",
            status: "Active"
        });

        // Write Audit Log
        await AuditLog.create({
            userId: req.user?.id || null,
            action: "Admin Create User",
            details: `Admin created user account: ${email}`,
            ipAddress: req.ip || ""
        });

        const userObj = newUser.toObject();
        delete userObj.password;

        res.status(201).json(userObj);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update User (by Admin)
export const updateUser = async (req, res) => {
    try {
        const { name, email, phone, role, department, designation, status } = req.body;

        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // Check duplicates if email changed
        if (email && email !== user.email) {
            const emailExists = await User.findOne({ email });
            if (emailExists) {
                return res.status(400).json({ message: "Email already registered." });
            }
            user.email = email;
        }

        const roleDoc = await Role.findOne({ roleName: role });
        if (roleDoc) {
            user.roleId = roleDoc._id;
            user.role = role;
        }

        user.name = name !== undefined ? name : user.name;
        user.phone = phone !== undefined ? phone : user.phone;
        user.department = department !== undefined ? department : user.department;
        user.designation = designation !== undefined ? designation : user.designation;
        user.status = status !== undefined ? status : user.status;

        await user.save();

        // Write Audit Log
        await AuditLog.create({
            userId: req.user?.id || null,
            action: "Admin Update User",
            details: `Admin modified details for user: ${user.email}`,
            ipAddress: req.ip || ""
        });

        const userObj = user.toObject();
        delete userObj.password;

        res.status(200).json(userObj);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete User (by Admin)
export const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // Write Audit Log
        await AuditLog.create({
            userId: req.user?.id || null,
            action: "Admin Delete User",
            details: `Admin deleted user account: ${user.email}`,
            ipAddress: req.ip || ""
        });

        res.status(200).json({ message: "User deleted successfully." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Reset Password (by Admin)
export const resetUserPassword = async (req, res) => {
    try {
        const { newPassword } = req.body;
        if (!newPassword) {
            return res.status(400).json({ message: "Password is required." });
        }

        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        // Write Audit Log
        await AuditLog.create({
            userId: req.user?.id || null,
            action: "Admin Reset Password",
            details: `Admin reset password for user: ${user.email}`,
            ipAddress: req.ip || ""
        });

        res.status(200).json({ message: "User password reset successfully." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Audit Logs (Super Admin only)
export const getAuditLogs = async (req, res) => {
    try {
        const logs = await AuditLog.find()
            .populate("userId", "email")
            .sort({ createdAt: -1 });
        res.status(200).json(logs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
