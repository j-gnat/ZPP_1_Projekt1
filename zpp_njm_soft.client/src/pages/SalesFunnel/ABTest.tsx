import React, { useState } from "react";
import Sidebar from "../../Sidebar";
import "../Page.css";
import "./SalesFunnel.css";

type Variant = {
    id: string;
    name: string;
    label: string;
    views: number;
    conversions: number;
    active: boolean;
};

const ABTest: React.FC = () => {
    const [variants, setVariants] = useState<Variant[]>([
        { id: "a", name: "Headline: Get 50% Off Today", label: "A", views: 1200, conversions: 85, active: true },
        { id: "b", name: "Headline: Limited Time Offer", label: "B", views: 980, conversions: 92, active: true },
    ]);

    const update = (id: string, field: keyof Variant, value: number | boolean) => {
        setVariants((prev) => prev.map((v) => v.id === id ? { ...v, [field]: value } : v));
    };

    const totalViews = variants.reduce((a, v) => a + v.views, 0);

    return (
        <div className="dashboard-wrapper">
            <Sidebar />
            <div className="dashboard-content">
                <div className="dashboard-header">
                    <h1>A/B Testing</h1>
                    <p>Compare variants and optimize your conversion rate.</p>
                </div>

                <div className="stats-grid" style={{ gridTemplateColumns: "repeat(3,1fr)" }}>
                    <div className="stat-card">
                        <div className="stat-label">Total Views</div>
                        <div className="stat-value">{totalViews.toLocaleString()}</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-label">Total Conversions</div>
                        <div className="stat-value">{variants.reduce((a, v) => a + v.conversions, 0)}</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-label">Overall CR</div>
                        <div className="stat-value">
                            {totalViews === 0 ? "0" : Math.round((variants.reduce((a, v) => a + v.conversions, 0) / totalViews) * 100)}%
                        </div>
                    </div>
                </div>

                <div className="ab-variants">
                    {variants.map((v) => {
                        const cr = v.views === 0 ? 0 : Math.round((v.conversions / v.views) * 100);
                        const isWinner = v.conversions === Math.max(...variants.map((x) => x.conversions));
                        return (
                            <div key={v.id} className={`ab-variant-card variant-${v.label.toLowerCase()}`}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                                    <h4>Variant {v.label}{isWinner && variants.length > 1 ? " 🏆" : ""}</h4>
                                    <label className="toggle-switch">
                                        <input type="checkbox" checked={v.active} onChange={(e) => update(v.id, "active", e.target.checked)} />
                                        <span className="toggle-slider" />
                                    </label>
                                </div>
                                <p style={{ margin: "0 0 12px", fontSize: 14, color: "#374151" }}>{v.name}</p>
                                <div className="stat-row" style={{ borderBottom: "none" }}>
                                    <span style={{ fontSize: 13 }}>Views</span>
                                    <strong>{v.views}</strong>
                                </div>
                                <div className="stat-row" style={{ borderBottom: "none" }}>
                                    <span style={{ fontSize: 13 }}>Conversions</span>
                                    <strong>{v.conversions}</strong>
                                </div>
                                <div className="stat-row" style={{ borderBottom: "none" }}>
                                    <span style={{ fontSize: 13 }}>CR</span>
                                    <strong style={{ color: cr > 7 ? "#059669" : "#374151" }}>{cr}%</strong>
                                </div>
                                <div style={{ marginTop: 12, display: "flex", gap: 6 }}>
                                    <button className="btn-secondary-modern" style={{ flex: 1, padding: "6px 0", fontSize: 12 }}
                                        onClick={() => update(v.id, "views", v.views + 100)}>+100 Views</button>
                                    <button className="btn-primary-modern" style={{ flex: 1, padding: "6px 0", fontSize: 12 }}
                                        onClick={() => update(v.id, "conversions", v.conversions + 10)}>+10 Conv.</button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="card" style={{ marginTop: 24 }}>
                    <h2>Funnel Bar Comparison</h2>
                    <div className="funnel-chart">
                        {variants.map((v) => {
                            const cr = v.views === 0 ? 0 : Math.round((v.conversions / v.views) * 100);
                            return (
                                <div className="funnel-bar-row" key={v.id}>
                                    <div className="funnel-bar-label">Variant {v.label}</div>
                                    <div className="funnel-bar-track">
                                        <div className="funnel-bar-fill"
                                            style={{ width: `${cr}%`, background: v.label === "A" ? "linear-gradient(90deg,#6366f1,#818cf8)" : "linear-gradient(90deg,#f59e0b,#fbbf24)" }}>
                                            {cr}%
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ABTest;