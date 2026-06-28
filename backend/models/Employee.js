import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema(
    {
        employeeId: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        name: {
            type: String,
            required: true,
            trim: true
        },

        department: {
            type: String,
            required: true
        },

        designation: {
            type: String,
            required: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true
        },

        phone: {
            type: String,
            required: true
        },

        status: {
            type: String,
            enum: ["Active", "Leave"],
            default: "Active"
        }
    },
    {
        timestamps: true
    }
);

const Employee = mongoose.model("Employee", employeeSchema);

export default Employee;