import Finance from "../models/Finance.js";

// Get All Transactions
export const getTransactions = async (req, res) => {
    try {
        const transactions = await Finance.find().sort({ createdAt: -1 });
        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Add Transaction
export const addTransaction = async (req, res) => {
    try {
        const transaction = await Finance.create(req.body);
        res.status(201).json(transaction);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update Transaction
export const updateTransaction = async (req, res) => {
    try {
        const transaction = await Finance.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                returnDocument: "after",
                runValidators: true
            }
        );

        if (!transaction) {
            return res.status(404).json({
                message: "Transaction not found"
            });
        }

        res.json(transaction);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// Delete Transaction
export const deleteTransaction = async (req, res) => {

    try {

        const transaction = await Finance.findByIdAndDelete(req.params.id);

        if (!transaction) {

            return res.status(404).json({
                message: "Transaction not found"
            });

        }

        res.json({
            message: "Transaction deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

// Finance Statistics
export const getFinanceStats = async (req, res) => {

    try {

        const income = await Finance.aggregate([
            { $match: { type: "Income" } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);

        const expense = await Finance.aggregate([
            { $match: { type: "Expense" } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);

        res.json({
            totalIncome: income[0]?.total || 0,
            totalExpense: expense[0]?.total || 0,
            balance:
                (income[0]?.total || 0) -
                (expense[0]?.total || 0)
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};