import "./Finance.css";
import { useEffect, useMemo, useState } from "react";
import {
    getTransactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    getFinanceStats
} from "../../api/financeApi";
import { useSearch } from "../../context/SearchContext";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { FaPlus, FaSort, FaSortUp, FaSortDown, FaEdit, FaTrash, FaDownload, FaPrint, FaSpinner } from "react-icons/fa";

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
    const [stats, setStats] = useState({
        totalIncome: 0,
        totalExpense: 0,
        balance: 0
    });
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState(initialFormState);
    const [submitting, setSubmitting] = useState(false);

    // Filtering, sorting and paging state
    const { searchTerm } = useSearch();
    const [selectedType, setSelectedType] = useState("All");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [sortBy, setSortBy] = useState("date");
    const [sortDirection, setSortDirection] = useState("desc");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    useEffect(() => {
        loadFinanceData();
    }, []);

    // Reset pagination on filter update
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, selectedType, selectedCategory]);

    async function loadFinanceData() {
        setLoading(true);
        try {
            const [transRes, statsRes] = await Promise.all([
                getTransactions(),
                getFinanceStats()
            ]);
            setTransactions(Array.isArray(transRes?.data) ? transRes.data : []);
            setStats(statsRes?.data || { totalIncome: 0, totalExpense: 0, balance: 0 });
        } catch (error) {
            console.error("Load finance data error", error);
        } finally {
            setLoading(false);
        }
    }

    const openAddModal = () => {
        setFormData(initialFormState);
        setEditingId(null);
        setShowModal(true);
    };

    const handleEdit = (transaction) => {
        setEditingId(transaction._id);
        setFormData({
            transactionId: transaction.transactionId || "",
            title: transaction.title || "",
            type: transaction.type || "Expense",
            amount: transaction.amount || "",
            category: transaction.category || "",
            date: transaction.date ? transaction.date.substring(0, 10) : "",
            description: transaction.description || "",
            status: transaction.status || "Pending"
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this transaction?");
        if (!confirmDelete) return;

        try {
            await deleteTransaction(id);
            await loadFinanceData();
        } catch (error) {
            console.error("Delete transaction error", error);
            alert("Failed to delete transaction.");
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();

        if (
            !formData.transactionId.trim() ||
            !formData.title.trim() ||
            formData.amount === "" ||
            !formData.category.trim() ||
            !formData.date
        ) {
            alert("Please fill all mandatory fields.");
            return;
        }

        setSubmitting(true);
        const payload = {
            transactionId: formData.transactionId.trim(),
            title: formData.title.trim(),
            type: formData.type,
            amount: Number(formData.amount),
            category: formData.category.trim(),
            date: formData.date,
            description: formData.description.trim(),
            status: formData.status
        };

        try {
            if (editingId) {
                await updateTransaction(editingId, payload);
            } else {
                await addTransaction(payload);
            }
            await loadFinanceData();
            setShowModal(false);
            setFormData(initialFormState);
        } catch (error) {
            console.error("Save transaction error", error);
            alert(error.response?.data?.message || "Failed to save transaction.");
        } finally {
            setSubmitting(false);
        }
    };

    // CSV Download stream builder (built-in XML/CSV generation)
    const exportToCSV = () => {
        if (transactions.length === 0) {
            alert("No data available to export.");
            return;
        }

        const headers = ["ID", "Title", "Type", "Amount", "Category", "Date", "Status", "Description"];
        const rows = transactions.map((t) => [
            t.transactionId,
            t.title,
            t.type,
            t.amount,
            t.category,
            new Date(t.date).toLocaleDateString(),
            t.status,
            t.description
        ]);

        const csvContent = "data:text/csv;charset=utf-8," 
            + [headers.join(","), ...rows.map(e => e.map(val => `"${String(val).replace(/"/g, '""')}"`).join(","))].join("\n");
        
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `AMADOX_Transactions_Ledger_${new Date().toISOString().substring(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Print helper
    const triggerPrint = () => {
        window.print();
    };

    // Unique Categories list
    const categoryOptions = useMemo(() => {
        const categories = new Set(transactions.map(t => t.category).filter(Boolean));
        return ["All", ...Array.from(categories)];
    }, [transactions]);

    // Sorting trigger
    const triggerSort = (column) => {
        if (sortBy === column) {
            setSortDirection(prev => prev === "asc" ? "desc" : "asc");
        } else {
            setSortBy(column);
            setSortDirection("asc");
        }
    };

    // Render sorting icon
    const renderSortIcon = (column) => {
        if (sortBy !== column) return <FaSort className="sort-icon-muted" />;
        return sortDirection === "asc" ? <FaSortUp /> : <FaSortDown />;
    };

    // Visual AreaChart dataset (aggregating monthly earnings vs outgoings)
    const financialTimelineData = useMemo(() => {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const monthlyAggregation = months.map(m => ({ name: m, Income: 0, Expense: 0 }));

        transactions.forEach(t => {
            if (t.date) {
                const dateObj = new Date(t.date);
                const monthIndex = dateObj.getMonth();
                if (t.type === "Income") {
                    monthlyAggregation[monthIndex].Income += Number(t.amount || 0);
                } else {
                    monthlyAggregation[monthIndex].Expense += Number(t.amount || 0);
                }
            }
        });

        // Filter out months that have zero income and zero expense to keep chart centered
        const currentMonthIndex = new Date().getMonth();
        return monthlyAggregation.slice(0, currentMonthIndex + 1);
    }, [transactions]);

    // Search, Filter, Sort processing
    const filteredTransactions = useMemo(() => {
        let result = [...transactions];

        // 1. Search Filter
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            result = result.filter(
                (t) =>
                    (t.title || "").toLowerCase().includes(term) ||
                    (t.transactionId || "").toLowerCase().includes(term) ||
                    (t.category || "").toLowerCase().includes(term) ||
                    (t.description || "").toLowerCase().includes(term)
            );
        }

        // 2. Type Filter
        if (selectedType && selectedType !== "All") {
            result = result.filter(t => t.type === selectedType);
        }

        // 3. Category Filter
        if (selectedCategory && selectedCategory !== "All") {
            result = result.filter(t => t.category === selectedCategory);
        }

        // 4. Sort
        if (sortBy) {
            result.sort((a, b) => {
                let valA = a[sortBy];
                let valB = b[sortBy];

                if (sortBy === "date") {
                    valA = new Date(valA).getTime();
                    valB = new Date(valB).getTime();
                } else if (typeof valA === "string") {
                    valA = valA.toLowerCase();
                    valB = (valB || "").toLowerCase();
                }

                if (valA < valB) return sortDirection === "asc" ? -1 : 1;
                if (valA > valB) return sortDirection === "asc" ? 1 : -1;
                return 0;
            });
        }

        return result;
    }, [transactions, searchTerm, selectedType, selectedCategory, sortBy, sortDirection]);

    // Paginate subset
    const paginatedTransactions = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredTransactions.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredTransactions, currentPage, itemsPerPage]);

    const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage) || 1;

    if (loading) {
        return (
            <div className="finance-loading-view">
                <FaSpinner className="spinner" />
                <h2>Loading General Ledger...</h2>
            </div>
        );
    }

    return (
        <div className="finance-view-container">
            <div className="finance-header-row no-print">
                <div>
                    <h1>Finance Management</h1>
                    <p>Track organization income stream, expense accounts, transactions audit logs, and analytics.</p>
                </div>
                <div className="finance-actions-row">
                    <button type="button" className="erp-btn-secondary" onClick={exportToCSV} title="Export CSV">
                        <FaDownload /> Export CSV
                    </button>
                    <button type="button" className="erp-btn-secondary" onClick={triggerPrint} title="Print Statements">
                        <FaPrint /> Print
                    </button>
                    <button type="button" className="erp-btn-primary" onClick={openAddModal}>
                        <FaPlus /> Add Transaction
                    </button>
                </div>
            </div>

            {/* KPI statistics cards */}
            <div className="finance-metrics-grid">
                <div className="erp-card fin-metric-card income">
                    <h3>Total Income</h3>
                    <h2>₹{stats.totalIncome.toLocaleString("en-IN")}</h2>
                    <small>System earnings</small>
                </div>
                <div className="erp-card fin-metric-card expense">
                    <h3>Total Expense</h3>
                    <h2>₹{stats.totalExpense.toLocaleString("en-IN")}</h2>
                    <small>Capital outgoings</small>
                </div>
                <div className="erp-card fin-metric-card net">
                    <h3>Net Balance</h3>
                    <h2 style={{ color: stats.balance >= 0 ? "#16a34a" : "#ef4444" }}>
                        ₹{stats.balance.toLocaleString("en-IN")}
                    </h2>
                    <small>System liquidity</small>
                </div>
            </div>

            {/* Visual analytical chart */}
            <div className="finance-charts-row no-print">
                <div className="erp-card finance-chart-card">
                    <h3>Cashflow Visual Analysis</h3>
                    <p>Monthly trends for earnings vs outgoings across active ledger accounts.</p>
                    <div style={{ width: "100%", height: 260 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={financialTimelineData}>
                                <defs>
                                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#16a34a" stopOpacity={0.2}/>
                                        <stop offset="95%" stopColor="#16a34a" stopOpacity={0}/>
                                    </linearGradient>
                                    <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2}/>
                                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                                <YAxis stroke="#64748b" fontSize={11} />
                                <Tooltip formatter={(value) => `₹${value.toLocaleString("en-IN")}`} />
                                <Area type="monotone" dataKey="Income" stroke="#16a34a" strokeWidth={3} fillOpacity={1} fill="url(#colorIncome)" name="Income" />
                                <Area type="monotone" dataKey="Expense" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorExpense)" name="Expense" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Filters Row */}
            <div className="erp-filters-bar no-print">
                <div className="filter-group">
                    <span className="filter-label">Type:</span>
                    <select
                        className="erp-filter-select"
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                    >
                        <option value="All">All Types</option>
                        <option value="Income">Income Only</option>
                        <option value="Expense">Expense Only</option>
                    </select>
                </div>

                <div className="filter-group">
                    <span className="filter-label">Category:</span>
                    <select
                        className="erp-filter-select"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        {categoryOptions.map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Main Ledger Table */}
            <div className="erp-table-container">
                <table className="erp-table">
                    <thead>
                        <tr>
                            <th style={{ cursor: "pointer" }} onClick={() => triggerSort("transactionId")}>
                                Transaction ID {renderSortIcon("transactionId")}
                            </th>
                            <th style={{ cursor: "pointer" }} onClick={() => triggerSort("title")}>
                                Title {renderSortIcon("title")}
                            </th>
                            <th style={{ cursor: "pointer" }} onClick={() => triggerSort("type")}>
                                Type {renderSortIcon("type")}
                            </th>
                            <th style={{ cursor: "pointer" }} onClick={() => triggerSort("amount")}>
                                Amount {renderSortIcon("amount")}
                            </th>
                            <th style={{ cursor: "pointer" }} onClick={() => triggerSort("category")}>
                                Category {renderSortIcon("category")}
                            </th>
                            <th style={{ cursor: "pointer" }} onClick={() => triggerSort("date")}>
                                Date {renderSortIcon("date")}
                            </th>
                            <th>Status</th>
                            <th className="no-print">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedTransactions.length > 0 ? (
                            paginatedTransactions.map((t) => (
                                <tr key={t._id}>
                                    <td><strong>{t.transactionId}</strong></td>
                                    <td>{t.title}</td>
                                    <td>
                                        <span className={`erp-badge ${t.type === "Income" ? "success" : "danger"}`}>
                                            {t.type}
                                        </span>
                                    </td>
                                    <td>₹{t.amount.toLocaleString("en-IN")}</td>
                                    <td>{t.category}</td>
                                    <td>{new Date(t.date).toLocaleDateString()}</td>
                                    <td>
                                        <span className={`erp-badge ${t.status === "Completed" ? "success" : "pending"}`}>
                                            {t.status}
                                        </span>
                                    </td>
                                    <td className="no-print">
                                        <button
                                            type="button"
                                            className="edit-icon-btn"
                                            onClick={() => handleEdit(t)}
                                            title="Edit"
                                        >
                                            <FaEdit />
                                        </button>
                                        <button
                                            type="button"
                                            className="delete-icon-btn"
                                            onClick={() => handleDelete(t._id)}
                                            title="Delete"
                                        >
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="8" style={{ textAlign: "center", padding: "30px", color: "#64748b" }}>
                                    No matching transactions found in database ledger.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {/* Table Paginator */}
                <div className="erp-pagination no-print">
                    <span className="erp-pagination-info">
                        Showing Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong> ({filteredTransactions.length} total entries)
                    </span>
                    <div className="erp-pagination-buttons">
                        <button
                            type="button"
                            className="erp-pagination-btn"
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        >
                            Previous
                        </button>
                        <button
                            type="button"
                            className="erp-pagination-btn"
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal Dialog Form */}
            {showModal && (
                <div className="modal-backdrop no-print">
                    <div className="erp-card modal-form-card">
                        <h2>{editingId ? "Modify Transaction Details" : "Record New Financial Flow"}</h2>
                        <form onSubmit={handleSave} className="modal-grid-form">
                            <div className="erp-form-group">
                                <label>Transaction ID</label>
                                <input
                                    type="text"
                                    className="erp-input"
                                    value={formData.transactionId}
                                    onChange={(e) => setFormData({ ...formData, transactionId: e.target.value })}
                                    disabled={Boolean(editingId)}
                                    placeholder="TXN504"
                                />
                            </div>

                            <div className="erp-form-group">
                                <label>Transaction Title</label>
                                <input
                                    type="text"
                                    className="erp-input"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="e.g. AWS Hosting Bill"
                                />
                            </div>

                            <div className="erp-form-group">
                                <label>Flow Type</label>
                                <select
                                    className="erp-input"
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                >
                                    <option value="Income">Income (Receipt)</option>
                                    <option value="Expense">Expense (Payment)</option>
                                </select>
                            </div>

                            <div className="erp-form-group">
                                <label>Amount (INR)</label>
                                <input
                                    type="number"
                                    className="erp-input"
                                    value={formData.amount}
                                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                    placeholder="15000"
                                />
                            </div>

                            <div className="erp-form-group">
                                <label>Category</label>
                                <input
                                    type="text"
                                    className="erp-input"
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    placeholder="Hosting / Office Rent"
                                />
                            </div>

                            <div className="erp-form-group">
                                <label>Record Date</label>
                                <input
                                    type="date"
                                    className="erp-input"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                />
                            </div>

                            <div className="erp-form-group">
                                <label>Ledger Status</label>
                                <select
                                    className="erp-input"
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                >
                                    <option value="Completed">Completed</option>
                                    <option value="Pending">Pending</option>
                                </select>
                            </div>

                            <div className="erp-form-group-full">
                                <label>Flow Description</label>
                                <textarea
                                    rows="2"
                                    className="erp-input"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Optional details..."
                                    style={{ resize: "vertical", padding: "10px 14px" }}
                                />
                            </div>

                            <div className="modal-actions-row">
                                <button type="button" className="erp-btn-secondary" onClick={() => setShowModal(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="erp-btn-primary" disabled={submitting}>
                                    {submitting ? "Saving..." : editingId ? "Save Record" : "Add Record"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Finance;