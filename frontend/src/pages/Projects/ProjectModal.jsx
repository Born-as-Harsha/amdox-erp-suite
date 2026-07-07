import Modal from "../../components/common/Modal";

function ProjectModal({
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
            title={editingId ? "Edit Project" : "Add Project"}
            onClose={() => setShowModal(false)}
        >
            <input
                placeholder="Project ID"
                value={formData.projectId}
                onChange={(e) =>
                    setFormData({
                        ...formData,
                        projectId: e.target.value
                    })
                }
            />

            <input
                placeholder="Project Name"
                value={formData.projectName}
                onChange={(e) =>
                    setFormData({
                        ...formData,
                        projectName: e.target.value
                    })
                }
            />

            <input
                placeholder="Manager"
                value={formData.manager}
                onChange={(e) =>
                    setFormData({
                        ...formData,
                        manager: e.target.value
                    })
                }
            />

            <input
                type="number"
                placeholder="Budget"
                value={formData.budget}
                onChange={(e) =>
                    setFormData({
                        ...formData,
                        budget: e.target.value
                    })
                }
            />

            <input
                placeholder="Client"
                value={formData.client}
                onChange={(e) =>
                    setFormData({
                        ...formData,
                        client: e.target.value
                    })
                }
            />

            <input
                type="date"
                value={formData.deadline}
                onChange={(e) =>
                    setFormData({
                        ...formData,
                        deadline: e.target.value
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
                {editingId ? "Update Project" : "Save Project"}
            </button>
        </Modal>
    );
}

export default ProjectModal;