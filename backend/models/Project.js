import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
{
    projectId: {
        type: String,
        required: true,
        unique: true
    },

    projectName: {
        type: String,
        required: true
    },

    client: {
        type: String,
        required: true
    },

    manager: {
        type: String,
        required: true
    },

    budget: {
        type: Number,
        required: true
    },

    status: {
        type: String,
        enum: [
            "Planning",
            "In Progress",
            "Completed"
        ],
        default: "Planning"
    },

    deadline: {
        type: Date,
        required: true
    }

},
{
    timestamps: true
});

export default mongoose.model(
    "Project",
    projectSchema
);