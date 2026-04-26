import React, { useState } from "react";
import Sidebar from "../../Sidebar";
import "../Page.css";
import "./SalesFunnel.css";

const Stats: React.FC = () => {
    const [period, setPeriod] = useState("7d");

    const metrics = [
        { label: "Total Visitors", value: "14,280", change: "+8%", up: true },
        { label: "Leads Captured", value: "1,284", change: "+12%", up: true },
        { label: "Avg. CR", value: "8.99%", change: "+0.4%", up: true },
        { label: "Revenue", value: "$24,570", change: "+18%", up: true },
    ];

    const funnelData = [
        { stage: "Visitors", count: 14280, pct: 100 },
        { stage: "Landing Page", count: 9840, pct: 69 },
        { stage: "Opt-in", count: 4120, pct: 29 },
        { stage: "Upsell", count: 1284, pct: 9 },
        { stage: "Checkout", count: 521, pct: 4 },
    ];

    const sourceData = [
        { source: "Organic Search", leads: 412, pct: 32 },
        { source: "Facebook Ads", leads: 385, pct: 30 },
        { source: "Email Campaign", leads: 256, pct: 20 },
        { source: "Referral", leads: 154, pct: 12 },
        { source: "Direct", leads: 77, pct: 6 },
    ];

    return (
        <div className="dashboard-wrapper">
            <Sidebar />
            <div className="dashboard-content">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                    <div className="dashboard-header" style={{ marginBottom: 0 }}>
                        <h1>Analytics</h1>
                        <p>Conversion statistics and performance overview.</p>
                    </div>
                    <div style={{ display: "flex", gap: 6 }}>
                        {["7d", "30d", "90d"].map((p) => (
                            <button key={p} onClick={() => setPeriod(p)}
                                style={{ padding: "6px 14px", borderRadius: 6, border: "1px solid #d1d5db", fontSize: 13,
                                    background: period === p ? "#6366f1" : "#f9fafb", color: period === p ? "white" : "#374151", cursor: "pointer" }}>
                                {p}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="stats-grid">
                    {metrics.map((m) => (
                        <div className="stat-card" key={m.label}>
                            <div className="stat-label">{m.label}</div>
                            <div className="stat-value">{m.value}</div>
                            <div className={`stat-change ${m.up ? "up" : "down"}`}>
                                {m.up ? "▲" : "▼"} {m.change} ({period})
                            </div>
                        </div>
                    ))}
                </div>

                <div className="card">
                    <h2>Funnel Drop-off</h2>
                    <div className="funnel-chart">
                        {funnelData.map((row) => (
                            <div className="funnel-bar-row" key={row.stage}>
                                <div className="funnel-bar-label">{row.stage}</div>
                                <div className="funnel-bar-track">
                                    <div className="funnel-bar-fill" style={{ width: `${row.pct}%` }}>
                                        {row.count.toLocaleString()} ({row.pct}%)
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="card">
                    <h2>Traffic Sources</h2>
                    <table className="leads-table">
                        <thead>
                            <tr>
                                <th>Source</th>
                                <th>Leads</th>
                                <th>Share</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sourceData.map((s) => (
                                <tr key={s.source}>
                                    <td style={{ fontWeight: 500 }}>{s.source}</td>
                                    <td>{s.leads}</td>
                                    <td>
                                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                            <div style={{ flex: 1, height: 8, background: "#f3f4f6", borderRadius: 4, overflow: "hidden" }}>
                                                <div style={{ width: `${s.pct}%`, height: "100%", background: "#6366f1", borderRadius: 4 }} />
                                            </div>
                                            <span style={{ fontSize: 12, color: "#6b7280", minWidth: 30 }}>{s.pct}%</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Stats;