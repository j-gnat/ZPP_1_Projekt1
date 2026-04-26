import React, { useEffect, useState } from "react";
import Sidebar from "../../Sidebar";
import { useParams, useNavigate } from "react-router-dom";
import "../Page.css";
import "./SalesFunnel.css";

type FunnelStep = {
    id: string;
    name: string;
    type: string;
};

type StepStats = {
    views: number;
    conversions: number;
    lastActivity: string | null;
};

const FunnelSteps: React.FC = () => {
    const { id, stepId } = useParams();
    const navigate = useNavigate();

    const [step, setStep] = useState<FunnelStep | null>(null);
    const [stats, setStats] = useState<StepStats>({ views: 0, conversions: 0, lastActivity: null });

    useEffect(() => {
        const rawSteps = localStorage.getItem(`funnel_${id}_steps`);
        if (!rawSteps) return;
        const steps: FunnelStep[] = JSON.parse(rawSteps);
        const found = steps.find((s) => s.id === stepId);
        setStep(found || null);

        const rawStats = localStorage.getItem(`funnel_${id}_step_${stepId}_stats`);
        if (rawStats) setStats(JSON.parse(rawStats));
    }, [id, stepId]);

    const persist = (s: StepStats) => {
        setStats(s);
        localStorage.setItem(`funnel_${id}_step_${stepId}_stats`, JSON.stringify(s));

        const rawSteps = localStorage.getItem(`funnel_${id}_steps`);
        if (rawSteps) {
            const steps = JSON.parse(rawSteps).map((st: FunnelStep & Partial<StepStats>) =>
                st.id === stepId ? { ...st, views: s.views, conversions: s.conversions } : st
            );
            localStorage.setItem(`funnel_${id}_steps`, JSON.stringify(steps));
        }
    };

    if (!step) return (
        <div className="dashboard-wrapper">
            <Sidebar />
            <div className="dashboard-content"><p>Step not found.</p></div>
        </div>
    );

    const cr = stats.views === 0 ? 0 : Math.round((stats.conversions / stats.views) * 100);

    return (
        <div className="dashboard-wrapper">
            <Sidebar />
            <div className="dashboard-content">
                <button className="back-button" style={{ marginBottom: 16, background: "#f3f4f6", color: "#374151", border: "1px solid #d1d5db" }}
                    onClick={() => navigate(`/funnel/${id}`)}>
                    ← Back to Funnel
                </button>

                <div className="dashboard-header">
                    <h1>{step.name}</h1>
                    <p>Step type: {step.type}</p>
                </div>

                <div className="stats-grid" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
                    <div className="stat-card">
                        <div className="stat-label">Views</div>
                        <div className="stat-value">{stats.views}</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-label">Conversions</div>
                        <div className="stat-value">{stats.conversions}</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-label">Conversion Rate</div>
                        <div className="stat-value">{cr}%</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-label">Last Activity</div>
                        <div className="stat-value" style={{ fontSize: 14 }}>{stats.lastActivity ? new Date(stats.lastActivity).toLocaleString() : "—"}</div>
                    </div>
                </div>

                <div className="card" style={{ marginTop: 20 }}>
                    <h2>Simulate Traffic</h2>
                    <p style={{ color: "#6b7280", fontSize: 14 }}>Manually add views and conversions to test your funnel statistics.</p>
                    <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
                        <button className="btn-secondary-modern"
                            onClick={() => persist({ ...stats, views: stats.views + 1, lastActivity: new Date().toISOString() })}>
                            + Add View
                        </button>
                        <button className="btn-primary-modern"
                            onClick={() => persist({ ...stats, conversions: stats.conversions + 1, lastActivity: new Date().toISOString() })}>
                            + Add Conversion
                        </button>
                        <button className="btn-danger-modern"
                            onClick={() => { if (confirm("Reset stats?")) persist({ views: 0, conversions: 0, lastActivity: null }); }}>
                            Reset
                        </button>
                    </div>
                </div>

                <div style={{ marginTop: 20 }}>
                    <button className="btn-primary-modern" onClick={() => navigate(`/builder/${id}/${stepId}`)}>
                        Open Page Builder →
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FunnelSteps;