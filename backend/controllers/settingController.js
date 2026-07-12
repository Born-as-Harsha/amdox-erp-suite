import User from "../models/User.js";
import bcrypt from "bcryptjs";

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

        user.name = req.body.name !== undefined ? req.body.name : user.name;
        user.email = req.body.email !== undefined ? req.body.email : user.email;
        user.profilePicture = req.body.profilePicture !== undefined ? req.body.profilePicture : user.profilePicture;
        user.phone = req.body.phone !== undefined ? req.body.phone : user.phone;
        user.bio = req.body.bio !== undefined ? req.body.bio : user.bio;
        user.department = req.body.department !== undefined ? req.body.department : user.department;
        user.designation = req.body.designation !== undefined ? req.body.designation : user.designation;
        user.visibility = req.body.visibility !== undefined ? req.body.visibility : user.visibility;
        user.notificationsEnabled = req.body.notificationsEnabled !== undefined ? req.body.notificationsEnabled : user.notificationsEnabled;
        user.theme = req.body.theme !== undefined ? req.body.theme : user.theme;

        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(req.body.password, salt);
        }

        await user.save();

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