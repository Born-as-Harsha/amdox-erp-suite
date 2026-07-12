import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { saveBase64Image, deleteImageFile } from "../utils/imageHelper.js";
import AuditLog from "../models/AuditLog.js";

export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        res.json(user);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // Check if there is an avatar change
        if (req.body.profilePicture && req.body.profilePicture.startsWith("data:image")) {
            const oldPath = user.profilePicture;
            const newPath = saveBase64Image(req.body.profilePicture, `profile_${user._id}`);
            if (newPath) {
                user.profilePicture = newPath;
                deleteImageFile(oldPath);
            }
        }

        user.name = req.body.name !== undefined ? req.body.name : user.name;
        user.email = req.body.email !== undefined ? req.body.email : user.email;
        user.phone = req.body.phone !== undefined ? req.body.phone : user.phone;
        user.bio = req.body.bio !== undefined ? req.body.bio : user.bio;
        user.department = req.body.department !== undefined ? req.body.department : user.department;
        user.designation = req.body.designation !== undefined ? req.body.designation : user.designation;
        user.visibility = req.body.visibility !== undefined ? req.body.visibility : user.visibility;
        user.notificationsEnabled = req.body.notificationsEnabled !== undefined ? req.body.notificationsEnabled : user.notificationsEnabled;
        user.theme = req.body.theme !== undefined ? req.body.theme : user.theme;

        // Additional profile fields
        user.address = req.body.address !== undefined ? req.body.address : user.address;
        user.emergencyContact = req.body.emergencyContact !== undefined ? req.body.emergencyContact : user.emergencyContact;
        user.dateOfBirth = req.body.dateOfBirth !== undefined ? req.body.dateOfBirth : user.dateOfBirth;
        user.gender = req.body.gender !== undefined ? req.body.gender : user.gender;
        user.language = req.body.language !== undefined ? req.body.language : user.language;

        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(req.body.password, salt);
        }

        await user.save();

        // Write to Audit Log
        await AuditLog.create({
            userId: user._id,
            action: "Profile Update",
            details: `User ${user.email} updated profile parameters.`,
            ipAddress: req.ip || ""
        });

        // Return user data without password
        const updatedUser = user.toObject();
        delete updatedUser.password;

        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};