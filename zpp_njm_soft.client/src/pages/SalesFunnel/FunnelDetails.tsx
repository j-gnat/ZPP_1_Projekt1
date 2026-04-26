import React, { useEffect, useState } from "react";
import Sidebar from "../../Sidebar";
import { useParams, useNavigate } from "react-router-dom";
import "../Page.css";
import "./SalesFunnel.css";

type FunnelStep = {
    id: string;
    name: string;
    type: string;
    views?: number;
    conversions?: number;
};

const stepTypes: Record<string, { icon: string; color: string }> = {
    landing: { icon: "◈", color: "#eef2ff" },
    optin: { icon: "◉", color: "#d1fae5" },
    thankyou: { icon: "◎", color: "#fef3c7" },
    upsell: { icon: "⊕", color: "#fee2e2" },
    checkout: { icon: "▣", color: "#dbeafe" },
    vsl: { icon: "▷", color: "#fce7f3" },
};

const FunnelDetails: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [steps, setSteps] = useState<FunnelStep[]>([]);
    const [funnelName, setFunnelName] = useState("Sales Funnel");

    useEffect(() => {
        const rawSteps = localStorage.getItem(`funnel_${id}_steps`);
        if (rawSteps) {
            setSteps(JSON.parse(rawSteps));
        } else {
            const defaults: FunnelStep[] = [
                { id: "1", name: "Landing Page", type: "landing", views: 0, conversions: 0 },
                { id: "2", name: "Opt-in Page", type: "optin", views: 0, conversions: 0 },
                { id: "3", name: "Thank You Page", type: "thankyou", views: 0, conversions: 0 },
                { id: "4", name: "Upsell Page", type: "upsell", views: 0, conversions: 0 },
                { id: "5", name: "Checkout Page", type: "checkout", views: 0, conversions: 0 },
            ];
            setSteps(defaults);
            localStorage.setItem(`funnel_${id}_steps`, JSON.stringify(defaults));
        }

        const raw = localStorage.getItem("funnels_list");
        if (raw) {
            const list = JSON.parse(raw);
            const found = list.find((f: { id: string; name: string }) => f.id === id);
            if (found) setFunnelName(found.name);
        }
    }, [id]);

    const addStep = () => {
        const name = prompt("Step name:");
        if (!name) return;
        const newStep: FunnelStep = {
            id: Date.now().toString(),
            name,
            type: "landing",
            views: 0,
            conversions: 0,
        };
        const updated = [...steps, newStep];
        setSteps(updated);
        localStorage.setItem(`funnel_${id}_steps`, JSON.stringify(updated));
    };

    const removeStep = (stepId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm("Remove this step?")) return;
        const updated = steps.filter((s) => s.id !== stepId);
        setSteps(updated);
        localStorage.setItem(`funnel_${id}_steps`, JSON.stringify(updated));
    };

    const totalViews = steps.reduce((a, s) => a + (s.views || 0), 0);
    const totalConversions = steps.reduce((a, s) => a + (s.conversions || 0), 0);
    const overallCR = totalViews === 0 ? 0 : Math.round((totalConversions / totalViews) * 100);

    return (
        <div className="dashboard-wrapper">
            <Sidebar />
            <div className="dashboard-content">
                <button className="back-button" style={{ marginBottom: 16, background: "#f3f4f6", color: "#374151", border: "1px solid #d1d5db" }} onClick={() => navigate("/funnels")}>
                    ← Back to Funnels
                </button>

                <div className="dashboard-header">
                    <h1>{funnelName}</h1>
                    <p>Funnel steps and conversion overview</p>
                </div>

                <div className="stats-grid" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
                    <div className="stat-card">
                        <div className="stat-label">Total Views</div>
                        <div className="stat-value">{totalViews}</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-label">Total Conversions</div>
                        <div className="stat-value">{totalConversions}</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-label">Overall CR</div>
                        <div className="stat-value">{overallCR}%</div>
                    </div>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "24px 0 12px" }}>
                    <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: "#1f2937" }}>Funnel Steps</h2>
                    <button className="btn-primary-modern" onClick={addStep}>+ Add Step</button>
                </div>

                <div className="funnel-steps-list">
                    {steps.map((step, idx) => {
                        const meta = stepTypes[step.type] || stepTypes.landing;
                        const cr = (step.views || 0) === 0 ? 0 : Math.round(((step.conversions || 0) / (step.views || 0)) * 100);
                        return (
                            <div
                                key={step.id}
                                className="funnel-step-item"
                                onClick={() => navigate(`/funnel/${id}/step/${step.id}`)}
                            >
                                <div className="funnel-step-left">
                                    <div className="step-badge" style={{ background: meta.color, color: "#374151" }}>
                                        {idx + 1}
                                    </div>
                                    <div className="step-info">
                                        <h4>{step.name}</h4>
                                        <span>{step.type} · {step.views || 0} views · {cr}% CR</span>
                                    </div>
                                </div>
                                <div className="step-actions" onClick={(e) => e.stopPropagation()}>
                                    <button className="btn-secondary-modern" style={{ padding: "6px 12px", fontSize: 12 }}
                                        onClick={(e) => { e.stopPropagation(); navigate(`/builder/${id}/${step.id}`); }}>
                                        Edit Page
                                    </button>
                                    <button className="btn-danger-modern" style={{ padding: "6px 10px" }} onClick={(e) => removeStep(step.id, e)}>
                                        ✕
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {steps.length > 0 && (
                    <div className="card" style={{ marginTop: 24 }}>
                        <h2>Funnel Visualization</h2>
                        <div className="funnel-chart">
                            {steps.map((step, idx) => {
                                const pct = idx === 0 ? 100 : Math.max(15, 100 - idx * 18);
                                return (
                                    <div className="funnel-bar-row" key={step.id}>
                                        <div className="funnel-bar-label">{step.name}</div>
                                        <div className="funnel-bar-track">
                                            <div className="funnel-bar-fill" style={{ width: `${pct}%` }}>
                                                {pct}%
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FunnelDetails;