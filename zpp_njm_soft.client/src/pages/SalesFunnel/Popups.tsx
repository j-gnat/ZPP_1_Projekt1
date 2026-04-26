import React, { useState } from "react";
import Sidebar from "../../Sidebar";
import "../Page.css";
import "./SalesFunnel.css";

type Popup = {
    id: string;
    name: string;
    rule: string;
    active: boolean;
    type: "exit_intent" | "time_delay" | "scroll" | "click";
};

const Popups: React.FC = () => {
    const [popups, setPopups] = useState<Popup[]>([
        { id: "1", name: "Exit Intent Offer", rule: "On exit intent", active: true, type: "exit_intent" },
        { id: "2", name: "Welcome Pop-up", rule: "After 5 seconds", active: false, type: "time_delay" },
        { id: "3", name: "50% Scroll Trigger", rule: "At 50% scroll depth", active: true, type: "scroll" },
    ]);

    const [showAdd, setShowAdd] = useState(false);
    const [form, setForm] = useState({ name: "", rule: "", type: "exit_intent" as Popup["type"] });

    const toggle = (id: string) => {
        setPopups((prev) => prev.map((p) => p.id === id ? { ...p, active: !p.active } : p));
    };

    const add = () => {
        if (!form.name) return;
        setPopups((prev) => [...prev, { ...form, id: Date.now().toString(), active: false }]);
        setForm({ name: "", rule: "", type: "exit_intent" });
        setShowAdd(false);
    };

    const remove = (id: string) => {
        if (confirm("Delete this pop-up?")) setPopups((prev) => prev.filter((p) => p.id !== id));
    };

    const typeLabel: Record<Popup["type"], string> = {
        exit_intent: "Exit Intent",
        time_delay: "Time Delay",
        scroll: "Scroll Depth",
        click: "On Click",
    };

    return (
        <div className="dashboard-wrapper">
            <Sidebar />
            <div className="dashboard-content">
                <div className="dashboard-header">
                    <h1>Pop-ups</h1>
                    <p>Configure display rules for pop-up overlays.</p>
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
                    <button className="btn-primary-modern" onClick={() => setShowAdd((v) => !v)}>
                        {showAdd ? "Cancel" : "+ New Pop-up"}
                    </button>
                </div>

                {showAdd && (
                    <div className="card">
                        <h2>New Pop-up</h2>
                        <div className="page-form-modern">
                            <input placeholder="Pop-up name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
                            <input placeholder="Display rule description" value={form.rule} onChange={(e) => setForm((f) => ({ ...f, rule: e.target.value }))} />
                            <select value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as Popup["type"] }))}>
                                <option value="exit_intent">Exit Intent</option>
                                <option value="time_delay">Time Delay</option>
                                <option value="scroll">Scroll Depth</option>
                                <option value="click">On Click</option>
                            </select>
                            <button className="btn-primary-modern" onClick={add}>Create</button>
                        </div>
                    </div>
                )}

                <div className="popup-list">
                    {popups.map((p) => (
                        <div className="popup-item" key={p.id}>
                            <div>
                                <div className="popup-name">{p.name}</div>
                                <div className="popup-rule">{typeLabel[p.type]} — {p.rule}</div>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                <span className={`tag-badge ${p.active ? "tag-new" : "tag-cold"}`}>
                                    {p.active ? "Active" : "Inactive"}
                                </span>
                                <label className="toggle-switch">
                                    <input type="checkbox" checked={p.active} onChange={() => toggle(p.id)} />
                                    <span className="toggle-slider" />
                                </label>
                                <button onClick={() => remove(p.id)}
                                    style={{ background: "none", border: "none", color: "#dc2626", cursor: "pointer", fontSize: 16 }}>✕</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Popups;