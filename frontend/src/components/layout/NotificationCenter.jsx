import { useState, useEffect, useRef } from "react";
import { FaBell, FaVolumeMute, FaVolumeUp, FaTrash, FaCheckDouble, FaArchive, FaPaperPlane } from "react-icons/fa";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import "./NotificationCenter.css";

function NotificationCenter() {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [soundEnabled, setSoundEnabled] = useState(true);
    
    // Create notification form parameters
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newNotif, setNewNotif] = useState({
        title: "",
        description: "",
        priority: "Medium",
        type: "Announcement",
        targetType: "All",
        targetId: ""
    });

    const dropdownRef = useRef(null);

    // Audio context beep synthesizer
    const playAlertSound = () => {
        if (!soundEnabled) return;
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            
            osc.type = "sine";
            osc.frequency.setValueAtTime(880, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.25);
            
            gain.gain.setValueAtTime(0.2, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
            
            osc.connect(gain);
            gain.connect(ctx.destination);
            
            osc.start();
            osc.stop(ctx.currentTime + 0.3);
        } catch (err) {
            console.error("Failed to play synthesized alert:", err);
        }
    };

    const fetchNotifications = async () => {
        try {
            const res = await api.get("/notifications");
            setNotifications(res.data || []);
        } catch (err) {
            console.error("Failed to load notifications:", err);
        }
    };

    // Listen to real-time Server-Sent Events (SSE)
    useEffect(() => {
        if (!user) return;

        fetchNotifications();

        const token = localStorage.getItem("token");
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
        const cleanUrl = apiUrl.replace(/\/api$/, "");
        
        // Establish EventSource link passing auth token in query string
        const streamUrl = `${cleanUrl}/api/notifications/stream?token=${token}`;
        const source = new EventSource(streamUrl);

        source.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                setNotifications((prev) => [
                    { ...data, isRead: false, isArchived: false },
                    ...prev
                ]);
                playAlertSound();
                toast.info(`🔔 ${data.title}: ${data.description || ""}`);
            } catch (err) {
                console.error("SSE parse error:", err);
            }
        };

        source.onerror = (err) => {
            console.warn("EventSource encountered connection error. Reconnecting...");
        };

        return () => source.close();
    }, [user, soundEnabled]);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleMarkAsRead = async (id) => {
        try {
            await api.put(`/notifications/${id}/read`);
            setNotifications(prev => 
                prev.map(n => n._id === id ? { ...n, isRead: true } : n)
            );
        } catch (err) {
            toast.error("Failed to mark notification as read.");
        }
    };

    const handleMarkAllRead = async () => {
        try {
            await api.put("/notifications/mark-all-read");
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            toast.success("All notifications marked as read.");
        } catch (err) {
            toast.error("Failed to update status.");
        }
    };

    const handleArchive = async (id) => {
        try {
            await api.put(`/notifications/${id}/archive`);
            setNotifications(prev => prev.filter(n => n._id !== id));
            toast.success("Notification archived.");
        } catch (err) {
            toast.error("Failed to archive notification.");
        }
    };

    const handleCreateNotification = async (e) => {
        e.preventDefault();
        try {
            await api.post("/notifications", newNotif);
            toast.success("Broadcast notification sent successfully!");
            setShowCreateModal(false);
            setNewNotif({
                title: "",
                description: "",
                priority: "Medium",
                type: "Announcement",
                targetType: "All",
                targetId: ""
            });
            fetchNotifications();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to dispatch notification.");
        }
    };

    const unreadCount = notifications.filter(n => !n.isRead && !n.isArchived).length;
    const privilegedRoles = ["Super Admin", "Admin", "HR Manager", "Finance Manager", "Project Manager"];
    const canCreate = user && privilegedRoles.includes(user.role);

    return (
        <div className="notif-center-wrapper" ref={dropdownRef}>
            <button 
                className="notification-btn" 
                onClick={() => setIsOpen(!isOpen)}
                title="Notifications Console"
            >
                <FaBell />
                {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
            </button>

            {isOpen && (
                <div className="notif-dropdown">
                    <div className="notif-dropdown-header">
                        <h4>Notifications Center</h4>
                        <div className="header-actions">
                            <button 
                                className="sound-toggle-btn"
                                onClick={() => setSoundEnabled(!soundEnabled)}
                                title={soundEnabled ? "Mute Sounds" : "Enable Sounds"}
                            >
                                {soundEnabled ? <FaVolumeUp /> : <FaVolumeMute />}
                            </button>
                            {unreadCount > 0 && (
                                <button 
                                    className="mark-all-btn"
                                    onClick={handleMarkAllRead}
                                    title="Mark all as read"
                                >
                                    <FaCheckDouble /> Mark Read
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="notif-dropdown-body">
                        {notifications.length > 0 ? (
                            notifications
                                .filter(n => !n.isArchived)
                                .slice(0, 15)
                                .map((notif) => (
                                    <div 
                                        key={notif._id} 
                                        className={`notif-card ${notif.isRead ? "read" : "unread"} priority-${notif.priority.toLowerCase()}`}
                                    >
                                        <div className="notif-card-header">
                                            <span className="notif-type-tag">{notif.type}</span>
                                            <span className="notif-time">{new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                        <h5>{notif.title}</h5>
                                        <p>{notif.description}</p>
                                        <div className="notif-card-actions">
                                            {!notif.isRead && (
                                                <button onClick={() => handleMarkAsRead(notif._id)} title="Mark as read">
                                                    Mark Read
                                                </button>
                                            )}
                                            <button onClick={() => handleArchive(notif._id)} title="Archive notification">
                                                <FaArchive /> Archive
                                            </button>
                                        </div>
                                    </div>
                                ))
                        ) : (
                            <div className="notif-empty-state">
                                <span>No new notifications</span>
                            </div>
                        )}
                    </div>

                    {canCreate && (
                        <div className="notif-dropdown-footer">
                            <button 
                                className="create-notif-btn"
                                onClick={() => {
                                    setIsOpen(false);
                                    setShowCreateModal(true);
                                }}
                            >
                                <FaPaperPlane style={{ marginRight: "6px" }} /> Dispatch Announcement
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Create Announcement Modal */}
            {showCreateModal && (
                <div className="palette-overlay" onClick={() => setShowCreateModal(false)}>
                    <div 
                        className="palette-modal create-notif-modal" 
                        onClick={(e) => e.stopPropagation()}
                        style={{ padding: "30px", maxWidth: "500px" }}
                    >
                        <h3><FaBell style={{ color: "#2563eb", marginRight: "8px" }} /> Dispatch Notification</h3>
                        <p style={{ fontSize: "13px", color: "#64748b", marginBottom: "20px" }}>Create and broadcast enterprise-grade alerts matching department or role filters.</p>
                        
                        <form onSubmit={handleCreateNotification} className="settings-form">
                            <div className="form-group" style={{ marginBottom: "15px" }}>
                                <label>Notification Title</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Server Maintenance Notice"
                                    value={newNotif.title}
                                    onChange={(e) => setNewNotif({ ...newNotif, title: e.target.value })}
                                    style={{ padding: "10px", border: "1px solid #cbd5e1", borderRadius: "8px" }}
                                />
                            </div>

                            <div className="form-group" style={{ marginBottom: "15px" }}>
                                <label>Description Content</label>
                                <textarea
                                    rows="3"
                                    placeholder="Enter additional alert details..."
                                    value={newNotif.description}
                                    onChange={(e) => setNewNotif({ ...newNotif, description: e.target.value })}
                                    style={{ padding: "10px", border: "1px solid #cbd5e1", borderRadius: "8px", resize: "none" }}
                                />
                            </div>

                            <div style={{ display: "flex", gap: "15px", marginBottom: "15px" }}>
                                <div className="form-group" style={{ flex: 1 }}>
                                    <label>Alert Category</label>
                                    <select
                                        value={newNotif.type}
                                        onChange={(e) => setNewNotif({ ...newNotif, type: e.target.value })}
                                        style={{ padding: "10px", border: "1px solid #cbd5e1", borderRadius: "8px", background: "#f8fafc" }}
                                    >
                                        <option value="Announcement">Announcement</option>
                                        <option value="Task">Task</option>
                                        <option value="Reminder">Reminder</option>
                                        <option value="Approval">Approval</option>
                                        <option value="Finance">Finance</option>
                                        <option value="System">System</option>
                                    </select>
                                </div>
                                <div className="form-group" style={{ flex: 1 }}>
                                    <label>Priority</label>
                                    <select
                                        value={newNotif.priority}
                                        onChange={(e) => setNewNotif({ ...newNotif, priority: e.target.value })}
                                        style={{ padding: "10px", border: "1px solid #cbd5e1", borderRadius: "8px", background: "#f8fafc" }}
                                    >
                                        <option value="Low">Low</option>
                                        <option value="Medium">Medium</option>
                                        <option value="High">High</option>
                                    </select>
                                </div>
                            </div>

                            <div style={{ display: "flex", gap: "15px", marginBottom: "25px" }}>
                                <div className="form-group" style={{ flex: 1 }}>
                                    <label>Target Audience</label>
                                    <select
                                        value={newNotif.targetType}
                                        onChange={(e) => setNewNotif({ ...newNotif, targetType: e.target.value, targetId: "" })}
                                        style={{ padding: "10px", border: "1px solid #cbd5e1", borderRadius: "8px", background: "#f8fafc" }}
                                    >
                                        <option value="All">Entire Company</option>
                                        <option value="Role">Specific Role</option>
                                        <option value="Department">Specific Department</option>
                                    </select>
                                </div>
                                
                                {newNotif.targetType !== "All" && (
                                    <div className="form-group" style={{ flex: 1 }}>
                                        <label>Filter Target Name</label>
                                        <input
                                            type="text"
                                            required
                                            placeholder={newNotif.targetType === "Role" ? "e.g. HR Manager" : "e.g. Engineering"}
                                            value={newNotif.targetId}
                                            onChange={(e) => setNewNotif({ ...newNotif, targetId: e.target.value })}
                                            style={{ padding: "10px", border: "1px solid #cbd5e1", borderRadius: "8px" }}
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="settings-form-actions" style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                                <button 
                                    type="button" 
                                    className="settings-submit-btn" 
                                    onClick={() => setShowCreateModal(false)}
                                    style={{ background: "#64748b" }}
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="settings-submit-btn">
                                    Broadcast Alert
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default NotificationCenter;
