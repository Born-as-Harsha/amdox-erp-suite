import "./Finance.css";
import { useEffect, useMemo, useState } from "react";

import {
    getTransactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    getFinanceStats
} from "../../api/financeApi";

import Modal from "../../components/common/Modal";

import FinanceTable from "./FinanceTable";
import FinanceStats from "./FinanceStats";
import SearchBar from "./SearchBar";
import FinanceModal from "./FinanceModal";

function Finance() {
    const initialFormState = {
        transactionId: "",
        title: "",
        type: "Expense",
        amount: "",
        category: "",
        date: "",
        description: "",
        status: "Pending"
    };

    const [transactions, setTransactions] = useState([]);
    const [stats, setStats] = useState({});
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [formData, setFormData] = useState(initialFormState);
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState(null);

    useEffect(() => {
        loadFinanceData();
    }, []);

    async function loadFinanceData() {
        setLoading(true);
        setError("");

        try {
            await Promise.all([fetchTransactions(), fetchStats()]);
        } catch (err) {
            console.error("Error loading finance data:", err);
            setError("Failed to load finance data.");
        } finally {
            setLoading(false);
        }
    }

    async function fetchTransactions() {
        try {
            const res = await getTransactions();
            const data = res?.data || res || [];
            setTransactions(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error fetching transactions:", error);
            setTransactions([]);
            throw error;
        }
    }

    const fetchStats = async () => {
        try {
            const res = await getFinanceStats();
            const data = res?.data || res || {};
            setStats(data && typeof data === "object" ? data : {});
        } catch (error) {
            console.error("Error fetching stats:", error);
            setStats({});
            throw error;
        }
    };

    const resetForm = () => {
        setFormData(initialFormState);
        setEditingId(null);
        setSelectedTransaction(null);
    };

    const handleOpenAddModal = () => {
        resetForm();
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        resetForm();
    };

    const handleSave = async () => {
        setError("");
        setSubmitting(true);

        try {
            if (editingId) {
                await updateTransaction(editingId, formData);
                alert("Transaction Updated Successfully");
            } else {
                await addTransaction(formData);
                alert("Transaction Added Successfully");
            }

            setShowModal(false);
            resetForm();
            await Promise.all([fetchTransactions(), fetchStats()]);
        } catch (error) {
            console.error("Error saving transaction:", error);
            alert(error?.response?.data?.message || error.message);
            setError("Failed to save transaction.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = (item) => {
        setEditingId(item?._id || item?.id || null);
        setSelectedTransaction(item || null);

        setFormData({
            transactionId: item?.transactionId || "",
            title: item?.title || "",
            type: item?.type || "Expense",
            amount: item?.amount || "",
            category: item?.category || "",
            date: item?.date ? item.date.substring(0, 10) : "",
            description: item?.description || "",
            status: item?.status || "Pending"
        });

        setShowModal(true);
    };

    const handleView = (item) => {
        setSelectedTransaction(item || null);
        setEditingId(item?._id || item?.id || null);

        setFormData({
            transactionId: item?.transactionId || "",
            title: item?.title || "",
            type: item?.type || "Expense",
            amount: item?.amount || "",
            category: item?.category || "",
            date: item?.date ? item.date.substring(0, 10) : "",
            description: item?.description || "",
            status: item?.status || "Pending"
        });

        setShowModal(true);
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this transaction?"
        );

        if (!confirmDelete) return;

        try {
            await deleteTransaction(id);
            alert("Transaction Deleted Successfully");
            await Promise.all([fetchTransactions(), fetchStats()]);
        } catch (error) {
            console.error("Error deleting transaction:", error);
            alert(error?.response?.data?.message || error.message);
            setError("Failed to delete transaction.");
        }
    };

    const validateForm = () => {
        if (!formData.transactionId?.toString().trim()) {
            return "Transaction ID is required.";
        }

        if (!formData.title?.trim()) {
            return "Title is required.";
        }

        if (!formData.amount?.toString().trim()) {
            return "Amount is required.";
        }

        if (!formData.category?.trim()) {
            return "Category is required.";
        }

        if (!formData.date?.trim()) {
            return "Date is required.";
        }

        return "";
    };

    const handleSubmit = async (e) => {
        if (e?.preventDefault) {
            e.preventDefault();
        }

        const validationMessage = validateForm();

        if (validationMessage) {
            setError(validationMessage);
            return;
        }

        await handleSave();
    };

    const filteredTransactions = useMemo(() => {
        const term = searchTerm.toLowerCase().trim();

        if (!term) {
            return transactions;
        }

        return transactions.filter((transaction) => {
            const id = (transaction?.transactionId || transaction?.id || "")
                .toString()
                .toLowerCase();
            const title = (transaction?.title || "").toLowerCase();
            const category = (transaction?.category || "").toLowerCase();
            const type = (transaction?.type || "").toLowerCase();
            const description = (transaction?.description || "").toLowerCase();
            const date = (transaction?.date || "").toLowerCase();
            const status = (transaction?.status || "").toLowerCase();
            const amount = (transaction?.amount || "").toString().toLowerCase();

            return (
                id.includes(term) ||
                title.includes(term) ||
                category.includes(term) ||
                type.includes(term) ||
                description.includes(term) ||
                date.includes(term) ||
                status.includes(term) ||
                amount.includes(term)
            );
        });
    }, [transactions, searchTerm]);

    const fallbackStats = useMemo(() => {
        const totalRevenue =
            stats?.totalRevenue ??
            transactions
                .filter((item) => item?.type === "Revenue" || item?.type === "Income")
                .reduce((sum, item) => sum + Number(item?.amount || 0), 0);

        const totalExpenses =
            stats?.totalExpenses ??
            transactions
                .filter((item) => item?.type === "Expense")
                .reduce((sum, item) => sum + Number(item?.amount || 0), 0);

        const profit = stats?.profit ?? totalRevenue - totalExpenses;
        const totalTransactions = stats?.totalTransactions ?? transactions.length;

        return {
            totalRevenue,
            totalExpenses,
            profit,
            totalTransactions
        };
    }, [stats, transactions]);
    if (loading) {
        return (
             <h2 style={{ padding: "20px" }}>
                 Loading...
             </h2>
        );
    }

    return (
        <div className="finance">
            <div className="finance-header">
                <h1>Finance Management</h1>
                <button onClick={handleOpenAddModal}>Add Transaction</button>
            </div>

            <div className="search-box">
                <SearchBar
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                />
            </div>

            {error && <p className="finance-error">{error}</p>}

            <div className="finance-stats">
                <FinanceStats
                    stats={fallbackStats}
                    transactions={transactions}
                />
            </div>

            <h2 className="table-title">Recent Transactions</h2>

            {loading ? (
                <p>Loading...</p>
            ) : (
                <FinanceTable
                    transactions={filteredTransactions}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onView={handleView}
                />
            )}

            <Modal isOpen={showModal} onClose={handleCloseModal}>
                <FinanceModal
                    showModal={showModal}
                    setShowModal={setShowModal}
                    formData={formData}
                    setFormData={setFormData}
                    handleSave={handleSave}
                    editingId={editingId}
                    onSubmit={handleSubmit}
                    onClose={handleCloseModal}
                    selectedTransaction={selectedTransaction}
                    loading={submitting}
                />
            </Modal>

            {!loading && filteredTransactions.length === 0 && (
                <div className="finance-empty-state">
                    <p>No transactions found.</p>
                </div>
            )}

            {!loading && transactions.length > 0 && (
                <div className="finance-summary">
                    <div className="summary-row">
                        <span>Filtered Results</span>
                        <strong>{filteredTransactions.length}</strong>
                    </div>

                    <div className="summary-row">
                        <span>Total Records</span>
                        <strong>{transactions.length}</strong>
                    </div>

                    <div className="summary-row">
                        <span>Modal Status</span>
                        <strong>{showModal ? "Open" : "Closed"}</strong>
                    </div>

                    <div className="summary-row">
                        <span>Mode</span>
                        <strong>{editingId ? "Edit" : "Add"}</strong>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Finance;