import mongoose from "mongoose";

const userSessionSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        loginTime: {
            type: Date,
            default: Date.now
        },
        lastActivity: {
            type: Date,
            default: Date.now
        },
        ipAddress: {
            type: String,
            default: ""
        },
        userAgent: {
            type: String,
            default: ""
        },
        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model("UserSession", userSessionSchema);
