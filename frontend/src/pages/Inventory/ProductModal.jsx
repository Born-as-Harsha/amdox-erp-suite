import Modal from "../../components/common/Modal";

function ProductModal({
    showModal,
    setShowModal,
    formData,
    setFormData,
    handleSave,
    isEditing,
    saving,
    closeModal
}) {
    if (!showModal) return null;

    return (
        <Modal
            title={isEditing ? "Edit Product" : "Add Product"}
            onClose={closeModal || (() => setShowModal(false))}
        >
            <input
                placeholder="Product ID"
                value={formData.productId}
                onChange={(e) =>
                    setFormData({
                        ...formData,
                        productId: e.target.value
                    })
                }
                disabled={isEditing}
            />

            <input
                placeholder="Product Name"
                value={formData.productName}
                onChange={(e) =>
                    setFormData({
                        ...formData,
                        productName: e.target.value
                    })
                }
            />

            <input
                placeholder="Category"
                value={formData.category}
                onChange={(e) =>
                    setFormData({
                        ...formData,
                        category: e.target.value
                    })
                }
            />

            <input
                type="number"
                placeholder="Quantity"
                value={formData.quantity}
                onChange={(e) =>
                    setFormData({
                        ...formData,
                        quantity: e.target.value
                    })
                }
            />

            <input
                type="number"
                placeholder="Price"
                value={formData.price}
                onChange={(e) =>
                    setFormData({
                        ...formData,
                        price: e.target.value
                    })
                }
            />

            <input
                placeholder="Supplier"
                value={formData.supplier}
                onChange={(e) =>
                    setFormData({
                        ...formData,
                        supplier: e.target.value
                    })
                }
            />

            <select
                value={formData.status}
                onChange={(e) =>
                    setFormData({
                        ...formData,
                        status: e.target.value
                    })
                }
            >
                <option value="In Stock">In Stock</option>
                <option value="Low Stock">Low Stock</option>
                <option value="Out of Stock">Out of Stock</option>
            </select>

            <button onClick={handleSave} disabled={saving}>
                {saving
                    ? isEditing
                        ? "Updating..."
                        : "Saving..."
                    : isEditing
                    ? "Update Product"
                    : "Save Product"}
            </button>
        </Modal>
    );
}

export default ProductModal;