import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },

        email: {
            type: String,
            required: true,
            unique: true
        },

        password: {
            type: String,
            required: true
        },

        role: {
            type: String,
            enum: [
                "Super Admin",
                "Admin",
                "HR",
                "Finance",
                "Inventory Manager",
                "Project Manager",
                "Executive",
                "Employee"
            ],
            default: "Employee"
        },

        profilePicture: {
            type: String,
            default: ""
        },

        phone: {
            type: String,
            default: ""
        },

        bio: {
            type: String,
            default: ""
        },

        department: {
            type: String,
            default: ""
        },

        designation: {
            type: String,
            default: ""
        },

        visibility: {
            type: String,
            default: "Public"
        },

        notificationsEnabled: {
            type: Boolean,
            default: true
        },

        theme: {
            type: String,
            default: "Light"
        }
    },
    {
        timestamps: true
    }
);

const User = mongoose.model("User", userSchema);

export default User;