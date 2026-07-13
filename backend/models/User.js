import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        employeeId: {
            type: String,
            required: true,
            unique: true
        },
        username: {
            type: String,
            required: true,
            unique: true
        },
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        personalEmail: {
            type: String,
            default: ""
        },
        password: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            default: ""
        },
        roleId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Role"
        },
        role: {
            type: String,
            default: "Employee"
        },
        department: {
            type: String,
            default: ""
        },
        designation: {
            type: String,
            default: ""
        },
        profilePicture: {
            type: String,
            default: ""
        },
        status: {
            type: String,
            enum: ["Active", "Inactive"],
            default: "Active"
        },
        emailVerified: {
            type: Boolean,
            default: false
        },
        otpVerified: {
            type: Boolean,
            default: false
        },
        otpCode: {
            type: String,
            default: ""
        },
        otpExpires: {
            type: Date
        },
        lastLogin: {
            type: Date
        },
        lastLogout: {
            type: Date
        },
        rememberMeToken: {
            type: String,
            default: ""
        },
        refreshToken: {
            type: String,
            default: ""
        },
        resetPasswordToken: {
            type: String,
            default: ""
        },
        resetPasswordExpires: {
            type: Date
        },
        createdBy: {
            type: String,
            default: "System"
        },
        updatedBy: {
            type: String,
            default: "System"
        },
        loginAttempts: {
            type: Number,
            default: 0
        },
        accountLocked: {
            type: Boolean,
            default: false
        },
        // Profile Settings preferences
        address: {
            type: String,
            default: ""
        },
        bio: {
            type: String,
            default: ""
        },
        emergencyContact: {
            type: String,
            default: ""
        },
        dateOfBirth: {
            type: String,
            default: ""
        },
        gender: {
            type: String,
            default: "Male"
        },
        language: {
            type: String,
            default: "English"
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