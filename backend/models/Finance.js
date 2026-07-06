import mongoose from "mongoose";

const financeSchema = new mongoose.Schema(
    {
        transactionId: {
            type: String,
            required: true,
            unique: true
        },

        title: {
            type: String,
            required: true
        },

        type: {
            type: String,
            enum: ["Income", "Expense"],
            required: true
        },

        amount: {
            type: Number,
            required: true
        },

        category: {
            type: String,
            required: true
        },

        date: {
            type: Date,
            default: Date.now
        },

        description: {
            type: String
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model("Finance", financeSchema);