import { useState, useMemo } from "react";
import { FaPlus, FaTrash, FaPhone, FaEnvelope } from "react-icons/fa";

function Suppliers() {
    const [searchTerm, setSearchTerm] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [suppliers, setSuppliers] = useState([
        { id: "SUP001", name: "Amdox Global Trading", contact: "Vikram Malhotra", phone: "+91 98765 01234", email: "vikram@amdox.com", category: "Electronics" },
        { id: "SUP002", name: "Apex Steel Ltd", contact: "Rajesh Kumar", phone: "+91 98765 05678", email: "rajesh@apexsteel.com", category: "Hardware" },
        { id: "SUP003", name: "Standard Furnishing", contact: "Neha Sen", phone: "+91 98765 09999", email: "neha@stdfurnishing.com", category: "Furniture" }
    ]);

    const [newSupplier, setNewSupplier] = useState({
        id: "",
        name: "",
        contact: "",
        phone: "",
        email: "",
        category: ""
    });

    const filteredSuppliers = useMemo(() => {
        return suppliers.filter(item => {
            return (
                item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.category.toLowerCase().includes(searchTerm.toLowerCase())
            );
        });
    }, [suppliers, searchTerm]);

    const handleSave = (e) => {
        e.preventDefault();
        if (!newSupplier.id || !newSupplier.name || !newSupplier.category || !newSupplier.phone || !newSupplier.email) {
            alert("Please fill all mandatory fields.");
            return;
        }
        setSuppliers(prev => [...prev, newSupplier]);
        setShowModal(false);
        setNewSupplier({ id: "", name: "", contact: "", phone: "", email: "", category: "" });
    };

    const handleDelete = (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this supplier?");
        if (!confirmDelete) return;
        setSuppliers(prev => prev.filter(s => s.id !== id));
    };

    return (
        <div style={{ padding: "30px", background: "#f8fafc", minHeight: "calc(100vh - 140px)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px", flexWrap: "wrap", gap: "20px" }}>
                <div>
                    <h1 style={{ fontSize: "28px", fontWeight: 700, color: "#0f172a", marginBottom: "6px" }}>Suppliers Directory</h1>
                    <p style={{ color: "#64748b", fontSize: "15px" }}>Manage vendor listings, contact persons, and supply logistics channels.</p>
                </div>
                <button type="button" className="erp-btn-primary" onClick={() => setShowModal(true)}>
                    <FaPlus /> Add Supplier
                </button>
            </div>

            {/* KPI statistics cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "20px", marginBottom: "30px" }}>
                <div className="erp-card">
                    <h3 style={{ fontSize: "13px", fontWeight: 600, color: "#64748b", marginBottom: "8px" }}>Active Suppliers</h3>
                    <h2 style={{ fontSize: "26px", fontWeight: 700, color: "#0f172a" }}>{suppliers.length}</h2>
                    <small style={{ fontSize: "12px", color: "#94a3b8" }}>Whitelisted manufacturers & brokers</small>
                </div>
                <div className="erp-card">
                    <h3 style={{ fontSize: "13px", fontWeight: 600, color: "#64748b", marginBottom: "8px" }}>Supply Departments</h3>
                    <h2 style={{ fontSize: "26px", fontWeight: 700, color: "#2563eb" }}>{new Set(suppliers.map(s => s.category)).size}</h2>
                    <small style={{ fontSize: "12px", color: "#94a3b8" }}>Sourcing categories</small>
                </div>
            </div>

            {/* Search controls */}
            <div className="erp-filters-bar" style={{ display: "flex", gap: "15px", marginBottom: "20px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "14px", fontWeight: 600, color: "#475569" }}>Search:</span>
                    <input
                        type="text"
                        placeholder="Search name, category..."
                        className="erp-filter-select"
                        style={{ padding: "8px 12px", border: "1px solid #cbd5e1", borderRadius: "8px", outline: "none" }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Suppliers Table */}
            <div className="erp-table-container">
                <table className="erp-table">
                    <thead>
                        <tr>
                            <th>Supplier ID</th>
                            <th>Company Name</th>
                            <th>Category</th>
                            <th>Contact Person</th>
                            <th>Phone</th>
                            <th>Email</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredSuppliers.length > 0 ? (
                            filteredSuppliers.map((item) => (
                                <tr key={item.id}>
                                    <td><strong>{item.id}</strong></td>
                                    <td>{item.name}</td>
                                    <td>{item.category}</td>
                                    <td>{item.contact}</td>
                                    <td>
                                        <FaPhone style={{ color: "#94a3b8", marginRight: "6px" }} />
                                        {item.phone}
                                    </td>
                                    <td>
                                        <FaEnvelope style={{ color: "#94a3b8", marginRight: "6px" }} />
                                        {item.email}
                                    </td>
                                    <td>
                                        <button
                                            type="button"
                                            className="delete-icon-btn"
                                            onClick={() => handleDelete(item.id)}
                                            title="Delete Supplier"
                                        >
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" style={{ textAlign: "center", padding: "30px", color: "#64748b" }}>
                                    No suppliers matched the search criteria.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal Dialog Form */}
            {showModal && (
                <div className="modal-backdrop">
                    <div className="erp-card modal-form-card">
                        <h2>Add New Supplier</h2>
                        <form onSubmit={handleSave} className="modal-grid-form">
                            <div className="erp-form-group">
                                <label>Supplier ID</label>
                                <input
                                    type="text"
                                    className="erp-input"
                                    value={newSupplier.id}
                                    onChange={(e) => setNewSupplier({ ...newSupplier, id: e.target.value })}
                                    placeholder="SUP004"
                                />
                            </div>

                            <div className="erp-form-group">
                                <label>Company Name</label>
                                <input
                                    type="text"
                                    className="erp-input"
                                    value={newSupplier.name}
                                    onChange={(e) => setNewSupplier({ ...newSupplier, name: e.target.value })}
                                    placeholder="TATA Logistics"
                                />
                            </div>

                            <div className="erp-form-group">
                                <label>Category</label>
                                <input
                                    type="text"
                                    className="erp-input"
                                    value={newSupplier.category}
                                    onChange={(e) => setNewSupplier({ ...newSupplier, category: e.target.value })}
                                    placeholder="Metal Products"
                                />
                            </div>

                            <div className="erp-form-group">
                                <label>Contact Person</label>
                                <input
                                    type="text"
                                    className="erp-input"
                                    value={newSupplier.contact}
                                    onChange={(e) => setNewSupplier({ ...newSupplier, contact: e.target.value })}
                                    placeholder="Aman Verma"
                                />
                            </div>

                            <div className="erp-form-group">
                                <label>Phone</label>
                                <input
                                    type="text"
                                    className="erp-input"
                                    value={newSupplier.phone}
                                    onChange={(e) => setNewSupplier({ ...newSupplier, phone: e.target.value })}
                                    placeholder="+91 98765 99887"
                                />
                            </div>

                            <div className="erp-form-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    className="erp-input"
                                    value={newSupplier.email}
                                    onChange={(e) => setNewSupplier({ ...newSupplier, email: e.target.value })}
                                    placeholder="aman@tatalogistics.com"
                                />
                            </div>

                            <div className="modal-actions-row">
                                <button type="button" className="erp-btn-secondary" onClick={() => setShowModal(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="erp-btn-primary">
                                    Add Vendor
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Suppliers;
