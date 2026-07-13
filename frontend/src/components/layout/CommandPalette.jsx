import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaTimes, FaKeyboard, FaHistory, FaFolder, FaUser, FaBox, FaMoneyBillWave, FaTasks, FaFolderOpen } from "react-icons/fa";
import api from "../../services/api";
import "./CommandPalette.css";

function CommandPalette() {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [history, setHistory] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [loading, setLoading] = useState(false);

    const modalRef = useRef(null);
    const inputRef = useRef(null);

    // Load recent history on mount
    useEffect(() => {
        const saved = localStorage.getItem("erp_search_history");
        if (saved) {
            try {
                setHistory(JSON.parse(saved));
            } catch (err) {
                setHistory([]);
            }
        }
    }, []);

    // Listen for Ctrl+K and / globally
    useEffect(() => {
        const handleKeyDown = (e) => {
            const isInputActive = document.activeElement.tagName === "INPUT" || 
                                 document.activeElement.tagName === "TEXTAREA" || 
                                 document.activeElement.isContentEditable;

            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
                e.preventDefault();
                setIsOpen((prev) => !prev);
            } else if (e.key === "/" && !isInputActive) {
                e.preventDefault();
                setIsOpen(true);
            } else if (e.key === "Escape") {
                setIsOpen(false);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    // Focus input on open
    useEffect(() => {
        if (isOpen) {
            setQuery("");
            setResults([]);
            setSelectedIndex(0);
            setTimeout(() => inputRef.current?.focus(), 80);
        }
    }, [isOpen]);

    // Handle debounced search query fetching
    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            return;
        }

        const delay = setTimeout(async () => {
            setLoading(true);
            try {
                const response = await api.get(`/search?q=${encodeURIComponent(query)}`);
                setResults(response.data.results || []);
                setSelectedIndex(0);
            } catch (err) {
                console.error("Search fetch failed:", err);
            } finally {
                setLoading(false);
            }
        }, 300);

        return () => clearTimeout(delay);
    }, [query]);

    // Save item to recent history
    const saveToHistory = (item) => {
        const updated = [item, ...history.filter(h => h.title !== item.title)].slice(0, 10);
        setHistory(updated);
        localStorage.setItem("erp_search_history", JSON.stringify(updated));
    };

    // Trigger action / navigate
    const handleSelect = (item) => {
        saveToHistory(item);
        setIsOpen(false);
        navigate(item.path);
    };

    // Keyboard list navigation listeners
    const handleInputKeyDown = (e) => {
        const maxIndex = query.trim() ? results.length - 1 : history.length - 1;
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setSelectedIndex((prev) => (prev < maxIndex ? prev + 1 : 0));
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setSelectedIndex((prev) => (prev > 0 ? prev - 1 : maxIndex));
        } else if (e.key === "Enter") {
            e.preventDefault();
            const activeList = query.trim() ? results : history;
            if (activeList[selectedIndex]) {
                handleSelect(activeList[selectedIndex]);
            }
        }
    };

    // Render corresponding category icons
    const renderIcon = (type) => {
        switch (type) {
            case "Module": return <FaFolderOpen style={{ color: "#2563eb" }} />;
            case "Employee": return <FaUser style={{ color: "#10b981" }} />;
            case "Inventory": return <FaBox style={{ color: "#d97706" }} />;
            case "Finance": return <FaMoneyBillWave style={{ color: "#059669" }} />;
            case "Task": return <FaTasks style={{ color: "#7c3aed" }} />;
            default: return <FaFolder style={{ color: "#64748b" }} />;
        }
    };

    if (!isOpen) return null;

    return (
        <div className="palette-overlay" onClick={() => setIsOpen(false)}>
            <div 
                className="palette-modal" 
                ref={modalRef} 
                onClick={(e) => e.stopPropagation()}
            >
                <div className="palette-search-wrapper">
                    <FaSearch className="palette-search-icon" />
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Search anything or run commands... (Use Up/Down + Enter)"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleInputKeyDown}
                    />
                    <button className="palette-close-btn" onClick={() => setIsOpen(false)}>
                        <FaTimes />
                    </button>
                </div>

                <div className="palette-body">
                    {/* Render Results */}
                    {query.trim() && (
                        <div className="results-section">
                            <span className="section-label">Search Results</span>
                            {loading ? (
                                <div className="palette-loading-state">
                                    <div className="palette-spinner"></div>
                                    <span>Searching databases...</span>
                                </div>
                            ) : results.length > 0 ? (
                                <div className="palette-list">
                                    {results.map((item, idx) => (
                                        <div
                                            key={idx}
                                            className={`palette-item ${idx === selectedIndex ? "active" : ""}`}
                                            onClick={() => handleSelect(item)}
                                            onMouseEnter={() => setSelectedIndex(idx)}
                                        >
                                            <div className="item-icon-col">
                                                {renderIcon(item.type)}
                                            </div>
                                            <div className="item-details">
                                                <h4>{item.title}</h4>
                                                {item.description && <p>{item.description}</p>}
                                            </div>
                                            <div className="item-meta">
                                                <span className="item-badge">{item.type}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="palette-empty-state">
                                    <span>No matching records found.</span>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Render History (only if query is empty) */}
                    {!query.trim() && (
                        <div className="history-section">
                            <span className="section-label">
                                <FaHistory style={{ marginRight: "6px" }} /> Recent Searches
                            </span>
                            {history.length > 0 ? (
                                <div className="palette-list">
                                    {history.map((item, idx) => (
                                        <div
                                            key={idx}
                                            className={`palette-item ${idx === selectedIndex ? "active" : ""}`}
                                            onClick={() => handleSelect(item)}
                                            onMouseEnter={() => setSelectedIndex(idx)}
                                        >
                                            <div className="item-icon-col">
                                                {renderIcon(item.type)}
                                            </div>
                                            <div className="item-details">
                                                <h4>{item.title}</h4>
                                                {item.description && <p>{item.description}</p>}
                                            </div>
                                            <div className="item-meta">
                                                <span className="item-badge-recent">Recent</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="palette-empty-state" style={{ padding: "30px 10px" }}>
                                    <span style={{ fontSize: "12px" }}>No recent searches. Try searching for "Inventory", "Dashboard", or specific employee names.</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer Hotkey Guides */}
                <div className="palette-footer">
                    <div>
                        <span className="key-tag">↑↓</span> to navigate
                        <span className="key-tag" style={{ marginLeft: "10px" }}>Enter</span> to select
                    </div>
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <FaKeyboard style={{ marginRight: "6px" }} />
                        Press <span className="key-tag">Esc</span> to close
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CommandPalette;
