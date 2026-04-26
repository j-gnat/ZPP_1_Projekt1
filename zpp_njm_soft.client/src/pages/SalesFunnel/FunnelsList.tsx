import React, { useEffect, useState } from "react";
import Sidebar from "../../Sidebar";
import { useNavigate } from "react-router-dom";
import "../Page.css";
import "./SalesFunnel.css";

type Funnel = {
    id: string;
    name: string;
    status: "active" | "draft" | "archived";
    steps: number;
    leads: number;
    created: string;
};

const STORAGE_KEY = "funnels_list";

const FunnelsList: React.FC = () => {
    const navigate = useNavigate();
    const [funnels, setFunnels] = useState<Funnel[]>([]);
    const [name, setName] = useState("");
    const [search, setSearch] = useState("");

    useEffect(() => {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) setFunnels(JSON.parse(raw));
    }, []);

    const persist = (list: Funnel[]) => {
        setFunnels(list);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    };

    const createFunnel = () => {
        if (!name.trim()) return;
        const next: Funnel = {
            id: Date.now().toString(),
            name: name.trim(),
            status: "draft",
            steps: 5,
            leads: 0,
            created: new Date().toLocaleDateString(),
        };
        persist([...funnels, next]);
        setName("");
    };

    const deleteFunnel = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm("Delete this funnel?")) return;
        persist(funnels.filter((f) => f.id !== id));
    };

    const statusColor: Record<string, string> = {
        active: "tag-new",
        draft: "tag-cold",
        archived: "tag-warm",
    };

    const filtered = funnels.filter((f) =>
        f.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="dashboard-wrapper">
            <Sidebar />
            <div className="dashboard-content">
                <div className="dashboard-header">
                    <h1>Funnels</h1>
                    <p>Manage all your sales funnels.</p>
                </div>

                <div className="card">
                    <h2>Create new funnel</h2>
                    <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
                        <input
                            type="text"
                            placeholder="Funnel name..."
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && createFunnel()}
                            style={{ flex: 1, padding: "10px 12px", border: "1px solid #d1d5db", borderRadius: 8, fontSize: 14 }}
                        />
                        <button className="btn-primary-modern" onClick={createFunnel}>
                            + Create Funnel
                        </button>
                    </div>
                </div>

                <div className="search-bar">
                    <span style={{ color: "#9ca3af", fontSize: 14 }}>🔍</span>
                    <input
                        placeholder="Search funnels..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                {filtered.length === 0 && (
                    <p style={{ color: "#9ca3af", textAlign: "center", marginTop: 40 }}>
                        No funnels yet. Create your first funnel above.
                    </p>
                )}

                <div className="funnel-steps-list">
                    {filtered.map((f) => (
                        <div
                            key={f.id}
                            className="funnel-step-item"
                            onClick={() => navigate(`/funnel/${f.id}`)}
                        >
                            <div className="funnel-step-left">
                                <div className="step-badge" style={{ background: "#eef2ff", color: "#4338ca", borderRadius: 8 }}>
                                    ◈
                                </div>
                                <div className="step-info">
                                    <h4>{f.name}</h4>
                                    <span>{f.steps} steps · {f.leads} leads · Created {f.created}</span>
                                </div>
                            </div>
                            <div className="step-actions" onClick={(e) => e.stopPropagation()}>
                                <span className={`tag-badge ${statusColor[f.status]}`}>{f.status}</span>
                                <button
                                    className="btn-secondary-modern"
                                    style={{ padding: "6px 12px", fontSize: 12 }}
                                    onClick={() => navigate(`/funnel/${f.id}`)}
                                >
                                    Open
                                </button>
                                <button
                                    className="btn-danger-modern"
                                    style={{ padding: "6px 10px" }}
                                    onClick={(e) => deleteFunnel(f.id, e)}
                                >
                                    ✕
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FunnelsList;