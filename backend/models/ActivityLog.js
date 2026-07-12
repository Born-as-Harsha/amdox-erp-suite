import mongoose from "mongoose";

const activityLogSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        },
        action: {
            type: String,
            required: true
        },
        details: {
            type: String,
            default: ""
        },
        ipAddress: {
            type: String,
            default: ""
        },
        timestamp: {
            type: Date,
            default: Date.now
        }
    }
);

export default mongoose.model("ActivityLog", activityLogSchema);
