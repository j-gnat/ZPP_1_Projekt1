import React, { useState } from "react";
import Sidebar from "../../Sidebar";
import "../Page.css";
import "./SalesFunnel.css";

const integrations = [
    { name: "Mailchimp", logo: "📧", connected: true, desc: "Email marketing" },
    { name: "HubSpot", logo: "🔶", connected: false, desc: "CRM integration" },
    { name: "Stripe", logo: "💳", connected: true, desc: "Payment processing" },
    { name: "Google Analytics", logo: "📊", connected: true, desc: "Traffic analytics" },
    { name: "Facebook Pixel", logo: "🔵", connected: false, desc: "Ad retargeting" },
    { name: "Zapier", logo: "⚡", connected: false, desc: "Workflow automation" },
];

const FunnelSettings: React.FC = () => {
    const [domain, setDomain] = useState("myfunnel.njmsoft.com");
    const [seoTitle, setSeoTitle] = useState("Best Offer — Limited Time");
    const [seoDesc, setSeoDesc] = useState("Get the best deal today. Don't miss out!");
    const [saved, setSaved] = useState(false);

    const save = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    return (
        <div className="dashboard-wrapper">
            <Sidebar />
            <div className="dashboard-content">
                <div className="dashboard-header">
                    <h1>Funnel Settings</h1>
                    <p>Domain, SEO, and third-party integrations.</p>
                </div>

                <div className="card">
                    <h2>Custom Domain</h2>
                    <p style={{ color: "#6b7280", fontSize: 13, marginTop: 4 }}>Publish your funnel on a dedicated domain.</p>
                    <div className="domain-input-row">
                        <input value={domain} onChange={(e) => setDomain(e.target.value)} placeholder="yourdomain.com" />
                        <button className="btn-primary-modern">Connect Domain</button>
                    </div>
                    <p style={{ fontSize: 12, color: "#6b7280", marginTop: 8 }}>
                        Point your DNS CNAME to: <code style={{ background: "#f3f4f6", padding: "2px 6px", borderRadius: 4 }}>funnel.njmsoft.com</code>
                    </p>
                </div>

                <div className="card">
                    <h2>SEO Settings</h2>
                    <div className="page-form-modern">
                        <div>
                            <label style={{ fontSize: 13, color: "#6b7280", display: "block", marginBottom: 4 }}>Page Title</label>
                            <input value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} placeholder="Page title..." />
                        </div>
                        <div>
                            <label style={{ fontSize: 13, color: "#6b7280", display: "block", marginBottom: 4 }}>Meta Description</label>
                            <textarea value={seoDesc} onChange={(e) => setSeoDesc(e.target.value)} rows={3}
                                style={{ resize: "vertical" }} placeholder="Meta description..." />
                        </div>
                        <button className="btn-primary-modern" onClick={save} style={{ alignSelf: "flex-start", background: saved ? "#059669" : undefined }}>
                            {saved ? "Saved!" : "Save SEO Settings"}
                        </button>
                    </div>
                </div>

                <div className="card">
                    <h2>Integrations</h2>
                    <div className="integration-list">
                        {integrations.map((i) => (
                            <div className="integration-item" key={i.name}>
                                <div style={{ display: "flex", alignItems: "center" }}>
                                    <span className="integration-logo">{i.logo}</span>
                                    <div>
                                        <div className="integration-name">{i.name}</div>
                                        <div className="integration-status">{i.desc}</div>
                                    </div>
                                </div>
                                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                    {i.connected && <span className="connected-badge">Connected</span>}
                                    <button className={i.connected ? "btn-secondary-modern" : "btn-primary-modern"} style={{ padding: "6px 14px", fontSize: 13 }}>
                                        {i.connected ? "Disconnect" : "Connect"}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FunnelSettings;