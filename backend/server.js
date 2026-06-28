import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import employeeRoutes from "./routes/employeeRoutes.js";

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/employees", employeeRoutes);

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
    res.json({
        message: "Enterprise AI-Powered Cloud ERP Backend Running Successfully 🚀"
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});