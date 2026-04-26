import React, { useState } from "react";
import Sidebar from "../../Sidebar";
import "../Page.css";
import "../SalesFunnel/SalesFunnel.css";

const campaigns = [
    { id: "1", name: "Welcome Series", type: "Email", status: "active", sent: 1240, opened: 680, cr: 55 },
    { id: "2", name: "Black Friday Promo", type: "Email", status: "scheduled", sent: 0, opened: 0, cr: 0 },
    { id: "3", name: "Cart Abandonment", type: "SMS", status: "active", sent: 340, opened: 290, cr: 85 },
];

function Communication() {
    const [tab, setTab] = useState<"campaigns" | "compose">("campaigns");
    const [subject, setSubject] = useState("");
    const [body, setBody] = useState("");
    const [sent, setSent] = useState(false);

    const send = () => {
        if (!subject || !body) return;
        setSent(true);
        setTimeout(() => { setSent(false); setSubject(""); setBody(""); }, 2500);
    };

    return (
        <div className="dashboard-wrapper">
            <Sidebar />
            <div className="dashboard-content">
                <div className="dashboard-header">
                    <h1>Komunikacja</h1>
                    <p>Email i SMS kampanie dla Twoich leadów.</p>
                </div>

                <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
                    {(["campaigns", "compose"] as const).map((t) => (
                        <button key={t} onClick={() => setTab(t)}
                            style={{ padding: "8px 20px", borderRadius: 8, border: "1px solid #d1d5db", fontSize: 14,
                                background: tab === t ? "#6366f1" : "#f9fafb", color: tab === t ? "white" : "#374151", cursor: "pointer" }}>
                            {t === "campaigns" ? "Kampanie" : "Stwórz kampanię"}
                        </button>
                    ))}
                </div>

                {tab === "campaigns" && (
                    <div className="card">
                        <h2>Wszystkie kampanie</h2>
                        <table className="leads-table">
                            <thead>
                                <tr>
                                    <th>Nazwa</th><th>Typ</th><th>Status</th><th>Wysłane</th><th>Otwarte</th><th>Stopa otwarcia</th>
                                </tr>
                            </thead>
                            <tbody>
                                {campaigns.map((c) => (
                                    <tr key={c.id}>
                                        <td style={{ fontWeight: 500 }}>{c.name}</td>
                                        <td>{c.type}</td>
                                        <td><span className={`tag-badge ${c.status === "active" ? "tag-new" : "tag-warm"}`}>{c.status}</span></td>
                                        <td>{c.sent}</td>
                                        <td>{c.opened}</td>
                                        <td>{c.cr}%</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {tab === "compose" && (
                    <div className="card">
                        <h2>Zredaguj Email</h2>
                        <div className="page-form-modern">
                            <input placeholder="Temat" value={subject} onChange={(e) => setSubject(e.target.value)} />
                            <textarea placeholder="Napisz swoją wiadomość..." rows={8} value={body} onChange={(e) => setBody(e.target.value)} style={{ resize: "vertical" }} />
                            <button className="btn-primary-modern" onClick={send} style={{ alignSelf: "flex-start", background: sent ? "#059669" : undefined }}>
                                {sent ? "Email w kolejce!" : "Wyślij do wszystkich leadów "}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Communication;