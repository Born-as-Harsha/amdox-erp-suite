import Inventory from "../models/Inventory.js";

// ==============================
// GET ALL PRODUCTS
// ==============================

export const getInventory = async (req, res) => {

    try {

        const products = await Inventory.find();

        res.status(200).json(products);

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};

// ==============================
// ADD PRODUCT
// ==============================

export const addProduct = async (req, res) => {

    try {

        const product = new Inventory(req.body);

        const savedProduct = await product.save();

        res.status(201).json(savedProduct);

    }

    catch (error) {

        res.status(400).json({

            message: error.message

        });

    }

};

// ==============================
// UPDATE PRODUCT
// ==============================

export const updateProduct = async (req, res) => {

    try {

        const product = await Inventory.findByIdAndUpdate(

            req.params.id,

            req.body,

            {

                 returnDocument: "after",

                runValidators: true
            }

        );

        if (!product) {

            return res.status(404).json({

                message: "Product not found"

            });

        }

        res.status(200).json(product);

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};

// ==============================
// DELETE PRODUCT
// ==============================

export const deleteProduct = async (req, res) => {

    try {

        console.log("Delete ID:", req.params.id);

        const allProducts = await Inventory.find();

        console.log("All Products:", allProducts);

        const product = await Inventory.findById(req.params.id);

        console.log("Found Product:", product);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        await Inventory.findByIdAndDelete(req.params.id);

        res.status(200).json({
            message: "Product deleted successfully"
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: error.message
        });

    }

};  
// ==============================
// INVENTORY STATISTICS
// ==============================

export const getInventoryStats = async (req, res) => {

    try {

        const totalProducts = await Inventory.countDocuments();

        const inStock = await Inventory.countDocuments({

            status: "In Stock"

        });

        const lowStock = await Inventory.countDocuments({

            status: "Low Stock"

        });

        const outOfStock = await Inventory.countDocuments({

            status: "Out of Stock"

        });

        res.status(200).json({

            totalProducts,

            inStock,

            lowStock,

            outOfStock

        });

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};