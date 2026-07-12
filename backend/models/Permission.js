import mongoose from "mongoose";

const permissionSchema = new mongoose.Schema(
    {
        permissionName: {
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

export default mongoose.model("Permission", permissionSchema);
