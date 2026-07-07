import User from "../models/User.js";

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

        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;

        await user.save();

        res.json(user);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};