import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema(
    {
        productId: {
            type: String,
            required: true,
            unique: true
        },

        productName: {
            type: String,
            required: true
        },

        category: {
            type: String,
            required: true
        },

        quantity: {
            type: Number,
            required: true
        },

        price: {
            type: Number,
            required: true
        },

        supplier: {
            type: String,
            required: true
        },

        status: {
            type: String,
            enum: ["In Stock", "Low Stock", "Out of Stock"],
            default: "In Stock"
        }
    },
    {
        timestamps: true
    }
);

const Inventory = mongoose.model("Inventory", inventorySchema);

export default Inventory;