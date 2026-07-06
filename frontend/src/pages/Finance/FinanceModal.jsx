import Modal from "../../components/common/Modal";

function FinanceModal({
    showModal,
    setShowModal,
    formData,
    setFormData,
    handleSave,
    editingId
}) {

    if (!showModal) return null;

    return (

        <Modal
            title={editingId ? "Edit Transaction" : "Add Transaction"}
            onClose={() => setShowModal(false)}
        >

            <input
                placeholder="Transaction ID"
                value={formData.transactionId}
                onChange={(e) =>
                    setFormData({
                        ...formData,
                        transactionId: e.target.value
                    })
                }
            />

            <input
                placeholder="Title"
                value={formData.title}
                onChange={(e) =>
                    setFormData({
                        ...formData,
                        title: e.target.value
                    })
                }
            />

            <select
                value={formData.type}
                onChange={(e) =>
                    setFormData({
                        ...formData,
                        type: e.target.value
                    })
                }
            >
                <option>Income</option>
                <option>Expense</option>
            </select>

            <input
                type="number"
                placeholder="Amount"
                value={formData.amount}
                onChange={(e) =>
                    setFormData({
                        ...formData,
                        amount: e.target.value
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
                type="date"
                value={formData.date}
                onChange={(e) =>
                    setFormData({
                        ...formData,
                        date: e.target.value
                    })
                }
            />

            <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) =>
                    setFormData({
                        ...formData,
                        description: e.target.value
                    })
                }
            />

            <button onClick={handleSave}>

                {editingId ? "Update Transaction" : "Save Transaction"}

            </button>

        </Modal>

    );

}

export default FinanceModal;