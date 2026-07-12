import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { FaPrint, FaArrowUp, FaArrowDown } from "react-icons/fa";

function Analytics() {
    const profitTrendsData = [
        { month: "Jan", Profit: 45000, Revenue: 110000 },
        { month: "Feb", Profit: 52000, Revenue: 125000 },
        { month: "Mar", Profit: 59000, Revenue: 140000 },
        { month: "Apr", Profit: 68000, Revenue: 160000 },
        { month: "May", Profit: 75000, Revenue: 185000 },
        { month: "Jun", Profit: 92000, Revenue: 210000 }
    ];

    const departmentExpenseData = [
        { name: "Engineering", expense: 85000 },
        { name: "Sales & Marketing", expense: 62000 },
        { name: "HR Operations", expense: 28000 },
        { name: "Inventory", expense: 45000 },
        { name: "Administration", expense: 19000 }
    ];

    return (
        <div style={{ padding: "30px", background: "#f8fafc", minHeight: "calc(100vh - 140px)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px", flexWrap: "wrap", gap: "20px" }} className="no-print">
                <div>
                    <h1 style={{ fontSize: "28px", fontWeight: 700, color: "#0f172a", marginBottom: "6px" }}>Executive Analytics</h1>
                    <p style={{ color: "#64748b", fontSize: "15px" }}>Financial highlights, corporate growth index, ROI rates, and department budgets.</p>
                </div>
                <div>
                    <button type="button" className="erp-btn-secondary" onClick={() => window.print()}>
                        <FaPrint /> Print Summary
                    </button>
                </div>
            </div>

            {/* KPI Executive stats cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px", marginBottom: "30px" }}>
                <div className="erp-card">
                    <h3 style={{ fontSize: "13px", fontWeight: 600, color: "#64748b", marginBottom: "8px" }}>EBIT Margin</h3>
                    <h2 style={{ fontSize: "26px", fontWeight: 700, color: "#0f172a" }}>32.4%</h2>
                    <small style={{ fontSize: "12px", color: "#16a34a", display: "flex", alignItems: "center", gap: "4px" }}>
                        <FaArrowUp /> +1.8% vs Last Qtr
                    </small>
                </div>
                <div className="erp-card">
                    <h3 style={{ fontSize: "13px", fontWeight: 600, color: "#64748b", marginBottom: "8px" }}>Net Margin %</h3>
                    <h2 style={{ fontSize: "26px", fontWeight: 700, color: "#0f172a" }}>18.5%</h2>
                    <small style={{ fontSize: "12px", color: "#16a34a", display: "flex", alignItems: "center", gap: "4px" }}>
                        <FaArrowUp /> +0.5% MoM
                    </small>
                </div>
                <div className="erp-card">
                    <h3 style={{ fontSize: "13px", fontWeight: 600, color: "#64748b", marginBottom: "8px" }}>Revenue Growth</h3>
                    <h2 style={{ fontSize: "26px", fontWeight: 700, color: "#2563eb" }}>+24.1%</h2>
                    <small style={{ fontSize: "12px", color: "#16a34a", display: "flex", alignItems: "center", gap: "4px" }}>
                        <FaArrowUp /> YoY expansion
                    </small>
                </div>
                <div className="erp-card">
                    <h3 style={{ fontSize: "13px", fontWeight: 600, color: "#64748b", marginBottom: "8px" }}>ROI Return</h3>
                    <h2 style={{ fontSize: "26px", fontWeight: 700, color: "#0f172a" }}>14.2x</h2>
                    <small style={{ fontSize: "12px", color: "#ef4444", display: "flex", alignItems: "center", gap: "4px" }}>
                        <FaArrowDown /> -0.2x vs forecast
                    </small>
                </div>
            </div>

            {/* Visual Charts Layout */}
            <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "25px", marginBottom: "30px" }}>
                {/* Profit Margin Trends */}
                <div className="erp-card">
                    <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#0f172a", marginBottom: "4px" }}>Profit Margin Trends</h3>
                    <p style={{ fontSize: "13px", color: "#64748b", marginBottom: "20px" }}>Earnings comparison with revenue cashflows for the current fiscal period.</p>
                    <div style={{ width: "100%", height: 300 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={profitTrendsData}>
                                <defs>
                                    <linearGradient id="colorRevenueEx" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2}/>
                                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                                    </linearGradient>
                                    <linearGradient id="colorProfitEx" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#16a34a" stopOpacity={0.2}/>
                                        <stop offset="95%" stopColor="#16a34a" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                                <YAxis stroke="#64748b" fontSize={11} />
                                <Tooltip formatter={(value) => `₹${value.toLocaleString("en-IN")}`} />
                                <Area type="monotone" dataKey="Revenue" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenueEx)" name="Revenue" />
                                <Area type="monotone" dataKey="Profit" stroke="#16a34a" strokeWidth={3} fillOpacity={1} fill="url(#colorProfitEx)" name="Net Profit" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Department Expense Breakdown */}
                <div className="erp-card">
                    <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#0f172a", marginBottom: "4px" }}>Department Expense Breakdown</h3>
                    <p style={{ fontSize: "13px", color: "#64748b", marginBottom: "20px" }}>Active expense allocations across units.</p>
                    <div style={{ width: "100%", height: 300 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={departmentExpenseData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                                <YAxis stroke="#64748b" fontSize={11} />
                                <Tooltip formatter={(value) => `₹${value.toLocaleString("en-IN")}`} />
                                <Bar dataKey="expense" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Analytics;
