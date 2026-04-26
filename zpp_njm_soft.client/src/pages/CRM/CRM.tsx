import React, { useState } from "react";
import Sidebar from "../../Sidebar";
import "../Page.css";
import "../SalesFunnel/SalesFunnel.css";

type Lead = {
    id: string;
    name: string;
    email: string;
    phone: string;
    tag: "hot" | "warm" | "cold" | "new";
    source: string;
    date: string;
};

const sampleLeads: Lead[] = [
    { id: "1", name: "Anna Kowalska", email: "anna@example.com", phone: "+48 600 123 456", tag: "hot", source: "Landing Page", date: "2026-04-20" },
    { id: "2", name: "Marek Nowak", email: "marek@example.com", phone: "+48 601 234 567", tag: "warm", source: "Facebook Ad", date: "2026-04-19" },
    { id: "3", name: "Joanna Wiśniewska", email: "joanna@example.com", phone: "+48 602 345 678", tag: "cold", source: "Email Campaign", date: "2026-04-18" },
    { id: "4", name: "Piotr Zając", email: "piotr@example.com", phone: "+48 603 456 789", tag: "new", source: "Referral", date: "2026-04-22" },
    { id: "5", name: "Katarzyna Dąbrowska", email: "katarzyna@example.com", phone: "+48 604 567 890", tag: "hot", source: "Landing Page", date: "2026-04-23" },
];

const tagColors: Record<string, string> = {
    hot: "tag-hot", warm: "tag-warm", cold: "tag-cold", new: "tag-new",
};

function CRM() {
    const [leads, setLeads] = useState<Lead[]>(sampleLeads);
    const [search, setSearch] = useState("");
    const [filterTag, setFilterTag] = useState<string>("all");
    const [showAdd, setShowAdd] = useState(false);
    const [form, setForm] = useState({ name: "", email: "", phone: "", source: "", tag: "new" as Lead["tag"] });

    const filtered = leads.filter((l) => {
        const matchSearch = l.name.toLowerCase().includes(search.toLowerCase()) || l.email.toLowerCase().includes(search.toLowerCase());
        const matchTag = filterTag === "all" || l.tag === filterTag;
        return matchSearch && matchTag;
    });

    const addLead = () => {
        if (!form.name || !form.email) return;
        setLeads((prev) => [
            ...prev,
            { ...form, id: Date.now().toString(), date: new Date().toISOString().slice(0, 10) },
        ]);
        setForm({ name: "", email: "", phone: "", source: "", tag: "new" });
        setShowAdd(false);
    };

    const removeLead = (id: string) => {
        if (confirm("Remove this lead?")) setLeads((prev) => prev.filter((l) => l.id !== id));
    };

    return (
        <div className="dashboard-wrapper">
            <Sidebar />
            <div className="dashboard-content">
                <div className="dashboard-header">
                    <h1>CRM</h1>
                    <p>Zarządzaj swoimi potencjalnymi klientami i kontaktami.</p>
                </div>

                <div className="stats-grid" style={{ gridTemplateColumns: "repeat(4,1fr)" }}>
                    {(["hot", "warm", "cold", "new"] as Lead["tag"][]).map((t) => (
                        <div className="stat-card" key={t}>
                            <div className="stat-label">{t.charAt(0).toUpperCase() + t.slice(1)} Leads</div>
                            <div className="stat-value">{leads.filter((l) => l.tag === t).length}</div>
                        </div>
                    ))}
                </div>

                <div style={{ display: "flex", gap: 10, margin: "20px 0 12px", alignItems: "center" }}>
                    <div className="search-bar" style={{ flex: 1, marginBottom: 0 }}>
                        <span style={{ color: "#9ca3af", fontSize: 14 }}>🔍</span>
                        <input placeholder="Szukaj leadów..." value={search} onChange={(e) => setSearch(e.target.value)} />
                    </div>
                    <select value={filterTag} onChange={(e) => setFilterTag(e.target.value)}
                        style={{ padding: "10px 12px", border: "1px solid #d1d5db", borderRadius: 8, fontSize: 14, color: "#374151" }}>
                        <option value="all">Tagi</option>
                        <option value="hot">Hot</option>
                        <option value="warm">Warm</option>
                        <option value="cold">Cold</option>
                        <option value="new">New</option>
                    </select>
                    <button className="btn-primary-modern" onClick={() => setShowAdd((v) => !v)}>
                        {showAdd ? "Anuluj" : "+ Dodaj leada"}
                    </button>
                </div>

                {showAdd && (
                    <div className="card">
                        <h2>Dodaj leada</h2>
                        <div className="page-form-modern">
                            <input placeholder="Imię i nazwisko *" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
                            <input placeholder="Email *" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
                            <input placeholder="Telefon" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
                            <input placeholder="Źródło (np. Strona docelowa)" value={form.source} onChange={(e) => setForm((f) => ({ ...f, source: e.target.value }))} />
                            <select value={form.tag} onChange={(e) => setForm((f) => ({ ...f, tag: e.target.value as Lead["tag"] }))}>
                                <option value="new">New</option>
                                <option value="hot">Hot</option>
                                <option value="warm">Warm</option>
                                <option value="cold">Cold</option>
                            </select>
                            <button className="btn-primary-modern" onClick={addLead}>Zapisz leada</button>
                        </div>
                    </div>
                )}

                <div className="card">
                    <h2>Leady ({filtered.length})</h2>
                    <table className="leads-table">
                        <thead>
                            <tr>
                                <th>Imię</th>
                                <th>Email</th>
                                <th>Telefon</th>
                                <th>Tag</th>
                                <th>Źródło</th>
                                <th>Data</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((lead) => (
                                <tr key={lead.id}>
                                    <td style={{ fontWeight: 500 }}>{lead.name}</td>
                                    <td>{lead.email}</td>
                                    <td>{lead.phone}</td>
                                    <td><span className={`tag-badge ${tagColors[lead.tag]}`}>{lead.tag}</span></td>
                                    <td>{lead.source}</td>
                                    <td>{lead.date}</td>
                                    <td>
                                        <button onClick={() => removeLead(lead.id)}
                                            style={{ background: "none", border: "none", color: "#dc2626", cursor: "pointer", fontSize: 14 }}>✕</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filtered.length === 0 && <p style={{ color: "#9ca3af", textAlign: "center", padding: 20 }}>Nie znaleziono takich leadów</p>}
                </div>
            </div>
        </div>
    );
}

export default CRM;