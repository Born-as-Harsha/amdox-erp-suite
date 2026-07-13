import "./Inventory.css";
import { useEffect, useMemo, useState } from "react";
import {
    getInventory,
    addProduct,
    deleteProduct,
    updateProduct
} from "../../api/inventoryApi";
import { useSearch } from "../../context/SearchContext";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { FaPlus, FaSort, FaSortUp, FaSortDown, FaEdit, FaTrash, FaSync } from "react-icons/fa";

function Inventory() {
    const initialFormData = {
        productId: "",
        productName: "",
        category: "",
        quantity: "",
        price: "",
        supplier: "",
        status: "In Stock"
    };

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState(initialFormData);
    const [editingProduct, setEditingProduct] = useState(null);
    const [saving, setSaving] = useState(false);

    // Filtering, sorting and paging state
    const { searchTerm } = useSearch();
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [selectedStockStatus, setSelectedStockStatus] = useState("All");
    const [sortBy, setSortBy] = useState("productName");
    const [sortDirection, setSortDirection] = useState("asc");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    useEffect(() => {
        loadProducts();
    }, []);

    // Reset paginator on search/filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, selectedCategory, selectedStockStatus]);

    async function loadProducts() {
        setLoading(true);
        try {
            const response = await getInventory();
            setProducts(Array.isArray(response?.data) ? response.data : []);
        } catch (error) {
            console.error("Load products error", error);
        } finally {
            setLoading(false);
        }
    }

    const handleRefresh = async () => {
        setRefreshing(true);
        try {
            const response = await getInventory();
            setProducts(Array.isArray(response?.data) ? response.data : []);
        } catch (error) {
            console.error(error);
        } finally {
            setRefreshing(false);
        }
    };

    function resetForm() {
        setFormData(initialFormData);
        setEditingProduct(null);
    }

    function openAddModal() {
        resetForm();
        setShowModal(true);
    }

    function closeModal() {
        setShowModal(false);
        resetForm();
    }

    const handleEdit = (product) => {
        setEditingProduct(product);
        setFormData({
            productId: product.productId || "",
            productName: product.productName || "",
            category: product.category || "",
            quantity: product.quantity || 0,
            price: product.price || 0,
            supplier: product.supplier || "",
            status: product.status || "In Stock"
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this product?");
        if (!confirmDelete) return;

        try {
            await deleteProduct(id);
            await loadProducts();
        } catch (error) {
            console.error(error);
            alert("Failed to delete product");
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();

        if (
            !formData.productId.trim() ||
            !formData.productName.trim() ||
            !formData.category.trim() ||
            formData.quantity === "" ||
            formData.price === "" ||
            !formData.supplier.trim()
        ) {
            alert("Please fill all fields before saving.");
            return;
        }

        setSaving(true);
        const payload = {
            productId: formData.productId.trim(),
            productName: formData.productName.trim(),
            category: formData.category.trim(),
            quantity: Number(formData.quantity),
            price: Number(formData.price),
            supplier: formData.supplier.trim(),
            status: formData.status
        };

        try {
            if (editingProduct) {
                await updateProduct(editingProduct._id, payload);
            } else {
                await addProduct(payload);
            }
            await loadProducts();
            closeModal();
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || "Failed to save product.");
        } finally {
            setSaving(false);
        }
    };

    // Table Header Sorting trigger
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

    // Unique Categories list
    const categoryOptions = useMemo(() => {
        const categories = new Set(products.map(p => p.category).filter(Boolean));
        return ["All", ...Array.from(categories)];
    }, [products]);

    // KPI Metrics calculation
    const metrics = useMemo(() => {
        const totalProducts = products.length;
        const categories = new Set(products.map(p => p.category)).size;
        const available = products.filter(p => p.status === "In Stock").length;
        const lowStock = products.filter(p => p.status === "Low Stock").length;
        const outOfStock = products.filter(p => p.status === "Out of Stock").length;
        const totalValue = products.reduce((sum, p) => sum + (Number(p.price || 0) * Number(p.quantity || 0)), 0);

        return { totalProducts, categories, available, lowStock, outOfStock, totalValue };
    }, [products]);

    // Visual Charts dataset
    const categoryChartData = useMemo(() => {
        const categoriesMap = {};
        products.forEach(p => {
            if (p.category) {
                categoriesMap[p.category] = (categoriesMap[p.category] || 0) + (Number(p.price || 0) * Number(p.quantity || 0));
            }
        });
        return Object.keys(categoriesMap).map(cat => ({
            name: cat,
            value: categoriesMap[cat]
        }));
    }, [products]);

    // Search, Filter, Sort processing
    const filteredProducts = useMemo(() => {
        let result = [...products];

        // 1. Search Filter
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            result = result.filter(
                (p) =>
                    (p.productName || "").toLowerCase().includes(term) ||
                    (p.productId || "").toLowerCase().includes(term) ||
                    (p.category || "").toLowerCase().includes(term) ||
                    (p.supplier || "").toLowerCase().includes(term)
            );
        }

        // 2. Category Filter
        if (selectedCategory && selectedCategory !== "All") {
            result = result.filter(p => p.category === selectedCategory);
        }

        // 3. Stock Status Filter
        if (selectedStockStatus && selectedStockStatus !== "All") {
            result = result.filter(p => p.status === selectedStockStatus);
        }

        // 4. Sort
        if (sortBy) {
            result.sort((a, b) => {
                let valA = a[sortBy];
                let valB = b[sortBy];
                if (typeof valA === "string") {
                    valA = valA.toLowerCase();
                    valB = (valB || "").toLowerCase();
                }
                if (valA < valB) return sortDirection === "asc" ? -1 : 1;
                if (valA > valB) return sortDirection === "asc" ? 1 : -1;
                return 0;
            });
        }

        return result;
    }, [products, searchTerm, selectedCategory, selectedStockStatus, sortBy, sortDirection]);

    // Paginated subsets
    const paginatedProducts = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredProducts, currentPage, itemsPerPage]);

    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;

    if (loading) {
        return (
            <div className="inventory-loading-view">
                <FaSync className="spinner" />
                <h2>Loading Corporate Inventory...</h2>
            </div>
        );
    }

    return (
        <div className="inventory-view-container">
            <div className="inventory-header-row">
                <div>
                    <h1>Inventory Management</h1>
                    <p>Track, manage, and audit corporate logistics, stock status, categories, and values.</p>
                </div>
                <div className="inventory-actions-row">
                    <button
                        type="button"
                        className="erp-btn-secondary"
                        onClick={handleRefresh}
                        disabled={refreshing}
                    >
                        <FaSync className={refreshing ? "spinner" : ""} /> {refreshing ? "Syncing..." : "Sync Stock"}
                    </button>
                    <button type="button" className="erp-btn-primary" onClick={openAddModal}>
                        <FaPlus /> Add Product
                    </button>
                </div>
            </div>

            {/* Metric KPI cards */}
            <div className="inventory-metrics-grid">
                <div className="erp-card inv-metric-card">
                    <h3>Total Products</h3>
                    <h2>{metrics.totalProducts}</h2>
                    <small>SKUs Listed</small>
                </div>
                <div className="erp-card inv-metric-card">
                    <h3>Categories</h3>
                    <h2>{metrics.categories}</h2>
                    <small>Stock departments</small>
                </div>
                <div className="erp-card inv-metric-card">
                    <h3>In Stock</h3>
                    <h2>{metrics.available}</h2>
                    <small>Fully available</small>
                </div>
                <div className="erp-card inv-metric-card">
                    <h3>Low / Out of Stock</h3>
                    <h2>
                        {metrics.lowStock} <span style={{ color: "#ef4444" }}>/ {metrics.outOfStock}</span>
                    </h2>
                    <small>Needs replenishment</small>
                </div>
                <div className="erp-card inv-metric-card">
                    <h3>Total Value</h3>
                    <h2>₹{metrics.totalValue.toLocaleString("en-IN")}</h2>
                    <small>Inventory assets worth</small>
                </div>
            </div>

            {/* Layout with visual charts */}
            {categoryChartData.length > 0 && (
                <div className="inventory-charts-row">
                    <div className="erp-card inventory-chart-card">
                        <h3>Stock Value Distribution by Category</h3>
                        <p>Total asset valuation across multiple stock categories.</p>
                        <div style={{ width: "100%", height: 260 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={categoryChartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                    <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                                    <YAxis stroke="#64748b" fontSize={11} />
                                    <Tooltip formatter={(value) => `₹${value.toLocaleString("en-IN")}`} />
                                    <Bar dataKey="value" fill="#2563eb" radius={[4, 4, 0, 0]} barSize={40} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            )}

            {/* Filters Row */}
            <div className="erp-filters-bar">
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

                <div className="filter-group">
                    <span className="filter-label">Stock Status:</span>
                    <select
                        className="erp-filter-select"
                        value={selectedStockStatus}
                        onChange={(e) => setSelectedStockStatus(e.target.value)}
                    >
                        <option value="All">All Stocks</option>
                        <option value="In Stock">In Stock</option>
                        <option value="Low Stock">Low Stock</option>
                        <option value="Out of Stock">Out of Stock</option>
                    </select>
                </div>
            </div>

            {/* Inventory table */}
            <div className="erp-table-container">
                <table className="erp-table">
                    <thead>
                        <tr>
                            <th style={{ cursor: "pointer" }} onClick={() => triggerSort("productId")}>
                                SKU ID {renderSortIcon("productId")}
                            </th>
                            <th style={{ cursor: "pointer" }} onClick={() => triggerSort("productName")}>
                                Product Name {renderSortIcon("productName")}
                            </th>
                            <th style={{ cursor: "pointer" }} onClick={() => triggerSort("category")}>
                                Category {renderSortIcon("category")}
                            </th>
                            <th style={{ cursor: "pointer" }} onClick={() => triggerSort("quantity")}>
                                Quantity {renderSortIcon("quantity")}
                            </th>
                            <th style={{ cursor: "pointer" }} onClick={() => triggerSort("price")}>
                                Unit Price {renderSortIcon("price")}
                            </th>
                            <th>Supplier</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedProducts.length > 0 ? (
                            paginatedProducts.map((prod) => (
                                <tr key={prod._id}>
                                    <td><strong>{prod.productId}</strong></td>
                                    <td>{prod.productName}</td>
                                    <td>{prod.category}</td>
                                    <td>{prod.quantity} items</td>
                                    <td>₹{prod.price.toLocaleString("en-IN")}</td>
                                    <td>{prod.supplier}</td>
                                    <td>
                                        <span
                                            className={`erp-badge ${
                                                prod.status === "In Stock"
                                                    ? "success"
                                                    : prod.status === "Low Stock"
                                                    ? "warning"
                                                    : "danger"
                                            }`}
                                        >
                                            {prod.status}
                                        </span>
                                    </td>
                                    <td>
                                        <button
                                            type="button"
                                            className="edit-icon-btn"
                                            onClick={() => handleEdit(prod)}
                                            title="Edit"
                                        >
                                            <FaEdit />
                                        </button>
                                        <button
                                            type="button"
                                            className="delete-icon-btn"
                                            onClick={() => handleDelete(prod._id)}
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
                                    No matching products found in stock ledger.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {/* Table Paginator */}
                <div className="erp-pagination">
                    <span className="erp-pagination-info">
                        Showing Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong> ({filteredProducts.length} total items)
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
                <div className="modal-backdrop">
                    <div className="erp-card modal-form-card">
                        <h2>{editingProduct ? "Modify Product Details" : "Add New Stock SKU"}</h2>
                        <form onSubmit={handleSave} className="modal-grid-form">
                            <div className="erp-form-group">
                                <label>SKU / Product ID</label>
                                <input
                                    type="text"
                                    className="erp-input"
                                    value={formData.productId}
                                    onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                                    disabled={Boolean(editingProduct)}
                                    placeholder="SKU204"
                                />
                            </div>

                            <div className="erp-form-group">
                                <label>Product Name</label>
                                <input
                                    type="text"
                                    className="erp-input"
                                    value={formData.productName}
                                    onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                                    placeholder="Standard Laptop Desk"
                                />
                            </div>

                            <div className="erp-form-group">
                                <label>Category</label>
                                <input
                                    type="text"
                                    className="erp-input"
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    placeholder="Furniture"
                                />
                            </div>

                            <div className="erp-form-group">
                                <label>Stock Quantity</label>
                                <input
                                    type="number"
                                    className="erp-input"
                                    value={formData.quantity}
                                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                    placeholder="100"
                                />
                            </div>

                            <div className="erp-form-group">
                                <label>Unit Price (INR)</label>
                                <input
                                    type="number"
                                    className="erp-input"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    placeholder="2499"
                                />
                            </div>

                            <div className="erp-form-group">
                                <label>Supplier / Manufacturer</label>
                                <input
                                    type="text"
                                    className="erp-input"
                                    value={formData.supplier}
                                    onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                                    placeholder="Amdox Global Trading"
                                />
                            </div>

                            <div className="erp-form-group">
                                <label>Stock Status</label>
                                <select
                                    className="erp-input"
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                >
                                    <option value="In Stock">In Stock</option>
                                    <option value="Low Stock">Low Stock</option>
                                    <option value="Out of Stock">Out of Stock</option>
                                </select>
                            </div>

                            <div className="modal-actions-row">
                                <button type="button" className="erp-btn-secondary" onClick={closeModal}>
                                    Cancel
                                </button>
                                <button type="submit" className="erp-btn-primary" disabled={saving}>
                                    {saving ? "Processing..." : editingProduct ? "Save Adjustments" : "Add SKU"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Inventory;