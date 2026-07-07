import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
    {
        reportId: {
            type: String,
            required: true,
            unique: true
        },

        reportName: {
            type: String,
            required: true
        },

        category: {
            type: String,
            required: true
        },

        generatedBy: {
            type: String,
            required: true
        },

        createdDate: {
            type: Date,
            default: Date.now
        },

        status: {
            type: String,
            enum: [
                "Generated",
                "Pending",
                "Archived"
            ],
            default: "Generated"
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model("Report", reportSchema);