import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema(
    {
        deptName: {
            type: String,
            required: true,
            unique: true
        },
        description: {
            type: String,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model("Department", departmentSchema);
