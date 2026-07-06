import "./Inventory.css";
import { useEffect, useMemo, useState } from "react";
import ProductTable from "./ProductTable";
import SearchBar from "./SearchBar";
import ProductModal from "./ProductModal";
import {
    getInventory,
    addProduct,
    deleteProduct,
    updateProduct
} from "../../api/inventoryApi";

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
    const [searchTerm, setSearchTerm] = useState("");
    const [formData, setFormData] = useState(initialFormData);
    const [editingProduct, setEditingProduct] = useState(null);
    const [saving, setSaving] = useState(false);

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

    function normalizePayload(data) {
        return {
            productId: String(data.productId).trim(),
            productName: String(data.productName).trim(),
            category: String(data.category).trim(),
            quantity: Number(data.quantity),
            price: Number(data.price),
            supplier: String(data.supplier).trim(),
            status: String(data.status).trim()
        };
    }

    function validateForm(data) {
        if (!String(data.productId).trim()) {
            return "Product ID is required";
        }

        if (!String(data.productName).trim()) {
            return "Product name is required";
        }

        if (!String(data.category).trim()) {
            return "Category is required";
        }

        if (data.quantity === "" || Number.isNaN(Number(data.quantity))) {
            return "Quantity is required";
        }

        if (Number(data.quantity) < 0) {
            return "Quantity cannot be negative";
        }

        if (data.price === "" || Number.isNaN(Number(data.price))) {
            return "Price is required";
        }

        if (Number(data.price) < 0) {
            return "Price cannot be negative";
        }

        if (!String(data.supplier).trim()) {
            return "Supplier is required";
        }

        if (!String(data.status).trim()) {
            return "Status is required";
        }

        return "";
    }

    async function fetchProducts() {
        try {
            const response = await getInventory();
            const inventoryData = Array.isArray(response?.data)
                ? response.data
                : [];

            setProducts(inventoryData);
        } catch (error) {
            console.error("Fetch inventory error:", error);
            alert(error.response?.data?.message || error.message);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }

    useEffect(() => {
        async function loadProducts() {
            await fetchProducts();
        }

        loadProducts();
    }, []);

    async function handleRefresh() {
        try {
            setRefreshing(true);
            const response = await getInventory();
            const inventoryData = Array.isArray(response?.data)
                ? response.data
                : [];

            setProducts(inventoryData);
        } catch (error) {
            console.error("Refresh inventory error:", error);
            alert(error.response?.data?.message || error.message);
        } finally {
            setRefreshing(false);
        }
    }

    async function handleSave() {
        const validationMessage = validateForm(formData);

        if (validationMessage) {
            alert(validationMessage);
            return;
        }

        const payload = normalizePayload(formData);

        try {
            setSaving(true);

            if (editingProduct) {
                await updateProduct(editingProduct._id, payload);
                alert("Product updated successfully");
            } else {
                await addProduct(payload);
                alert("Product added successfully");
            }

            closeModal();
            await fetchProducts();
        } catch (error) {
            console.error("Save product error:", error);
            alert(error.response?.data?.message || error.message);
        } finally {
            setSaving(false);
        }
    }

    function handleEdit(product) {
        setEditingProduct(product);
        setFormData({
            productId: product.productId || "",
            productName: product.productName || "",
            category: product.category || "",
            quantity: product.quantity ?? "",
            price: product.price ?? "",
            supplier: product.supplier || "",
            status: product.status || "In Stock"
        });
        setShowModal(true);
    }

    async function handleDelete(id) {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this product?"
        );

        if (!confirmDelete) return;

        try {
            await deleteProduct(id);
            alert("Product deleted successfully");
            await fetchProducts();
        } catch (error) {
            console.error("Delete product error:", error);
            alert(error.response?.data?.message || error.message);
        }
    }

    const filteredProducts = useMemo(() => {
        const term = searchTerm.toLowerCase().trim();

        if (!term) {
            return products;
        }

        return products.filter((product) => {
            const productName = String(product.productName || "").toLowerCase();
            const productId = String(product.productId || "").toLowerCase();
            const category = String(product.category || "").toLowerCase();
            const supplier = String(product.supplier || "").toLowerCase();
            const status = String(product.status || "").toLowerCase();

            return (
                productName.includes(term) ||
                productId.includes(term) ||
                category.includes(term) ||
                supplier.includes(term) ||
                status.includes(term)
            );
        });
    }, [products, searchTerm]);

    const totalProducts = products.length;

    const totalCategories = useMemo(() => {
        return new Set(
            products.map((product) => String(product.category || "").trim())
        ).size;
    }, [products]);

    const availableCount = useMemo(() => {
        return products.filter(
            (product) => product.status === "In Stock"
        ).length;
    }, [products]);

    const lowStockCount = useMemo(() => {
        return products.filter(
            (product) => product.status === "Low Stock"
        ).length;
    }, [products]);

    const outOfStockCount = useMemo(() => {
        return products.filter(
            (product) => product.status === "Out of Stock"
        ).length;
    }, [products]);

    const totalInventoryValue = useMemo(() => {
        return products.reduce((sum, product) => {
            const quantity = Number(product.quantity) || 0;
            const price = Number(product.price) || 0;
            return sum + quantity * price;
        }, 0);
    }, [products]);

    if (loading) {
        return <h2 style={{ padding: "20px" }}>Loading...</h2>;
    }

    return (
        <div className="inventory">
            <div className="inventory-header">
                <div>
                    <h1>Inventory Management</h1>
                    <p className="inventory-subtitle">
                        Manage stock, suppliers, categories, and product status
                    </p>
                </div>

                <div className="inventory-header-actions">
                    <button
                        type="button"
                        className="secondary-btn"
                        onClick={handleRefresh}
                        disabled={refreshing}
                    >
                        {refreshing ? "Refreshing..." : "Refresh"}
                    </button>

                    <button
                        type="button"
                        className="primary-btn"
                        onClick={openAddModal}
                    >
                        Add Product
                    </button>
                </div>
            </div>

            <SearchBar
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
            />

            <div className="inventory-stats">
                <div className="stat-card">
                    <h3>Total Products</h3>
                    <p>{totalProducts}</p>
                </div>

                <div className="stat-card">
                    <h3>Categories</h3>
                    <p>{totalCategories}</p>
                </div>

                <div className="stat-card">
                    <h3>Available</h3>
                    <p>{availableCount}</p>
                </div>

                <div className="stat-card">
                    <h3>Low Stock</h3>
                    <p>{lowStockCount}</p>
                </div>

                <div className="stat-card">
                    <h3>Out of Stock</h3>
                    <p>{outOfStockCount}</p>
                </div>

                <div className="stat-card">
                    <h3>Total Value</h3>
                    <p>₹{totalInventoryValue.toLocaleString("en-IN")}</p>
                </div>
            </div>

            <ProductTable
                products={filteredProducts}
                handleDelete={handleDelete}
                handleEdit={handleEdit}
            />

            <ProductModal
                showModal={showModal}
                setShowModal={setShowModal}
                formData={formData}
                setFormData={setFormData}
                handleSave={handleSave}
                closeModal={closeModal}
                isEditing={Boolean(editingProduct)}
                saving={saving}
            />
        </div>
    );
}

export default Inventory;