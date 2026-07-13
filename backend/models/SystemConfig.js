import mongoose from "mongoose";

const systemConfigSchema = new mongoose.Schema(
    {
        otpActive: { type: Boolean, default: true },
        captchaActive: { type: Boolean, default: false },
        sessionTimeout: { type: Number, default: 30 },
        passwordComplexity: { type: String, default: "Medium" },
        apiRateLimit: { type: Number, default: 100 }
    },
    {
        timestamps: true
    }
);

export default mongoose.model("SystemConfig", systemConfigSchema);
