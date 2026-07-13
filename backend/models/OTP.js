import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true
        },
        otpCode: {
            type: String,
            required: true
        },
        expiresAt: {
            type: Date,
            required: true,
            index: { expires: 0 } // Document expires at specific date (expiresAt field value)
        },
        attempts: {
            type: Number,
            default: 0
        },
        lastResendTime: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model("OTP", otpSchema);
