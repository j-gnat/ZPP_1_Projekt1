import * as React from "react";
import Sidebar from "../../Sidebar";
import "../Page.css";
import "../SalesFunnel/SalesFunnel.css";

type Tab = "campaigns" | "compose";
type CampaignType = "Email" | "SMS";
type CampaignStatus = "draft" | "scheduled" | "active" | "paused";

type Campaign = {
    id: string;
    name: string;
    type: CampaignType;
    status: CampaignStatus;
    sent: number;
    opened: number;
    scheduledFor?: string;
    subject?: string;
    body: string;
};

type ApiCampaign = {
    id: number;
    name: string;
    type: string;
    status: string;
    sent: number;
    opened: number;
    scheduledFor: string | null;
    subject: string | null;
    body: string;
    createdAt: string;
};

const mapFromApi = (c: ApiCampaign): Campaign => ({
    id: String(c.id),
    name: c.name,
    type: (c.type === "SMS" ? "SMS" : "Email"),
    status: (c.status === "active" || c.status === "scheduled" || c.status === "paused" || c.status === "draft")
        ? c.status
        : "draft",
    sent: c.sent,
    opened: c.opened,
    scheduledFor: c.scheduledFor ? c.scheduledFor.slice(0, 16) : undefined,
    subject: c.subject ?? undefined,
    body: c.body,
});

const initialCampaigns: Campaign[] = [
    {
        id: "1",
        name: "Welcome Series",
        type: "Email",
        status: "active",
        sent: 1240,
        opened: 680,
        subject: "Witamy!",
        body: "Cześć! Dziękujemy za zapis.",
    },
    {
        id: "2",
        name: "Black Friday Promo",
        type: "Email",
        status: "scheduled",
        sent: 0,
        opened: 0,
        scheduledFor: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2).toISOString().slice(0, 16),
        subject: "Black Friday – -50%",
        body: "Tylko dziś!",
    },
    {
        id: "3",
        name: "Cart Abandonment",
        type: "SMS",
        status: "active",
        sent: 340,
        opened: 290,
        body: "Wygląda na to, że nie dokończyłeś zakupu. Potrzebujesz pomocy?",
    },
];

const getOpenRate = (sent: number, opened: number) => {
    if (!sent) return 0;
    return Math.round((opened / sent) * 100);
};

const getStatusLabel = (status: CampaignStatus) => {
    switch (status) {
        case "active":
            return "Aktywna";
        case "scheduled":
            return "Zaplanowana";
        case "paused":
            return "Wstrzymana";
        case "draft":
            return "Szkic";
        default:
            return status;
    }
};

const getStatusBadgeClass = (status: CampaignStatus) => {
    switch (status) {
        case "active":
            return "tag-new";
        case "scheduled":
            return "tag-warm";
        case "paused":
            return "tag-warm";
        case "draft":
            return "tag-warm";
        default:
            return "tag-warm";
    }
};

let idCounter = 1000;
const newId = () => `local-${++idCounter}`;

const Communication: React.FC = () => {
    const [tab, setTab] = React.useState<Tab>("campaigns");
    const [campaigns, setCampaigns] = React.useState<Campaign[]>(() => initialCampaigns);
    const [loading, setLoading] = React.useState(false);

    const [query, setQuery] = React.useState("");
    const [typeFilter, setTypeFilter] = React.useState<"all" | CampaignType>("all");
    const [statusFilter, setStatusFilter] = React.useState<"all" | CampaignStatus>("all");
    const [selectedCampaignId, setSelectedCampaignId] = React.useState<string | null>(null);

    const [campaignName, setCampaignName] = React.useState("");
    const [campaignType, setCampaignType] = React.useState<CampaignType>("Email");
    const [subject, setSubject] = React.useState("");
    const [body, setBody] = React.useState("");
    const [scheduledFor, setScheduledFor] = React.useState("");
    const [testRecipient, setTestRecipient] = React.useState("");

    const [notice, setNotice] = React.useState<string | null>(null);
    const [sent, setSent] = React.useState(false);
    const noticeTimeoutRef = React.useRef<number | null>(null);
    const sentTimeoutRef = React.useRef<number | null>(null);

    React.useEffect(() => {
        return () => {
            if (noticeTimeoutRef.current) window.clearTimeout(noticeTimeoutRef.current);
            if (sentTimeoutRef.current) window.clearTimeout(sentTimeoutRef.current);
        };
    }, []);

    const loadCampaigns = React.useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/campaigns");
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = (await res.json()) as ApiCampaign[];
            setCampaigns(data.map(mapFromApi));
        } catch {
            flashNotice("Nie udało się pobrać kampanii z API. Pokazuję dane przykładowe.");
        } finally {
            setLoading(false);
        }
    }, []);

    React.useEffect(() => {
        void loadCampaigns();
    }, [loadCampaigns]);

    const visibleCampaigns = React.useMemo(() => {
        const q = query.trim().toLowerCase();

        return campaigns
            .filter((c) => {
                if (typeFilter !== "all" && c.type !== typeFilter) return false;
                if (statusFilter !== "all" && c.status !== statusFilter) return false;
                if (!q) return true;
                return c.name.toLowerCase().includes(q);
            });
    }, [campaigns, query, statusFilter, typeFilter]);

    const selectedCampaign = React.useMemo(() => {
        if (!selectedCampaignId) return null;
        return campaigns.find((c) => c.id === selectedCampaignId) ?? null;
    }, [campaigns, selectedCampaignId]);

    const flashNotice = (message: string) => {
        setNotice(message);
        if (noticeTimeoutRef.current) window.clearTimeout(noticeTimeoutRef.current);
        noticeTimeoutRef.current = window.setTimeout(() => setNotice(null), 2500);
    };

    const sendTest = () => {
        if (!testRecipient.trim()) {
            flashNotice("Podaj adres e-mail lub numer telefonu do testu.");
            return;
        }
        if (campaignType === "Email" && (!subject.trim() || !body.trim())) {
            flashNotice("Uzupełnij temat i treść przed wysłaniem testu.");
            return;
        }
        if (campaignType === "SMS" && !body.trim()) {
            flashNotice("Uzupełnij treść SMS przed wysłaniem testu.");
            return;
        }

        flashNotice(`Wysłano test na: ${testRecipient.trim()}`);
    };

    const createCampaign = () => {
        const name = campaignName.trim();
        const subj = subject.trim();
        const msg = body.trim();

        if (!name) {
            flashNotice("Podaj nazwę kampanii.");
            return;
        }

        if (campaignType === "Email" && (!subj || !msg)) {
            flashNotice("Uzupełnij temat i treść kampanii e-mail.");
            return;
        }

        if (campaignType === "SMS" && !msg) {
            flashNotice("Uzupełnij treść kampanii SMS.");
            return;
        }

        const status: CampaignStatus = scheduledFor ? "scheduled" : "draft";

        const payload = {
            name,
            type: campaignType,
            status,
            sent: 0,
            opened: 0,
            scheduledFor: scheduledFor ? new Date(scheduledFor).toISOString() : null,
            subject: campaignType === "Email" ? subj : null,
            body: msg,
        };

        setLoading(true);
        fetch("/api/campaigns", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        })
            .then(async (res) => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const created = (await res.json()) as ApiCampaign;
                setCampaigns((prev) => [mapFromApi(created), ...prev]);
                setCampaignName("");
                setSubject("");
                setBody("");
                setScheduledFor("");
                setTestRecipient("");
                setTab("campaigns");

                setSent(true);
                if (sentTimeoutRef.current) window.clearTimeout(sentTimeoutRef.current);
                sentTimeoutRef.current = window.setTimeout(() => setSent(false), 2500);

                flashNotice("Kampania zapisana w bazie.");
            })
            .catch(() => {
                const next: Campaign = {
                    id: newId(),
                    name,
                    type: campaignType,
                    status,
                    sent: 0,
                    opened: 0,
                    scheduledFor: scheduledFor || undefined,
                    subject: campaignType === "Email" ? subj : undefined,
                    body: msg,
                };
                setCampaigns((prev) => [next, ...prev]);
                flashNotice("Nie udało się zapisać do API. Dodano lokalnie (zniknie po odświeżeniu). ");
            })
            .finally(() => setLoading(false));
    };

    const duplicateCampaign = (id: string) => {
        const original = campaigns.find((c) => c.id === id);
        if (!original) return;

        const baseName = original.name.replace(/\s*\(kopia\)\s*$/i, "");

        const copy: Campaign = {
            ...original,
            id: newId(),
            name: `${baseName} (kopia)`,
            status: "draft",
            sent: 0,
            opened: 0,
            scheduledFor: undefined,
        };

        setCampaigns((prev) => [copy, ...prev]);
        flashNotice("Utworzono kopię kampanii.");
    };

    const togglePaused = (id: string) => {
        setCampaigns((prev) =>
            prev.map((c) => {
                if (c.id !== id) return c;
                if (c.status === "active") return { ...c, status: "paused" };
                if (c.status === "paused") return { ...c, status: "active" };
                return c;
            })
        );
    };

    const startNow = (id: string) => {
        setCampaigns((prev) =>
            prev.map((c) => {
                if (c.id !== id) return c;
                if (c.status !== "scheduled" && c.status !== "draft") return c;
                return { ...c, status: "active", scheduledFor: undefined };
            })
        );
        flashNotice("Kampania uruchomiona.");
    };

    return (
        <div className="dashboard-wrapper">
            <Sidebar />
            <div className="dashboard-content">
                <div className="dashboard-header">
                    <h1>Komunikacja</h1>
                    <p>Email i SMS kampanie dla Twoich leadów.</p>
                </div>

                {notice && (
                    <div
                        className="card"
                        style={{ padding: 12, marginBottom: 16, borderLeft: "4px solid #6366f1", color: "#374151" }}
                        role="status"
                    >
                        {notice}
                    </div>
                )}

                <div style={{ display: "flex", gap: 8, marginBottom: 20 }} role="tablist" aria-label="Komunikacja">
                    {(["campaigns", "compose"] as const).map((t) => (
                        <button
                            key={t}
                            type="button"
                            onClick={() => setTab(t)}
                            role="tab"
                            aria-selected={tab === t}
                            style={{ padding: "8px 20px", borderRadius: 8, border: "1px solid #d1d5db", fontSize: 14,
                                background: tab === t ? "#6366f1" : "#f9fafb", color: tab === t ? "white" : "#374151", cursor: "pointer" }}>
                            {t === "campaigns" ? "Kampanie" : "Stwórz kampanię"}
                        </button>
                    ))}
                </div>

                {tab === "campaigns" && (
                    <div className="card">
                        <h2>Wszystkie kampanie</h2>

                        {loading && <div style={{ color: "#6b7280", marginBottom: 10 }}>Ładowanie...</div>}

                        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", margin: "10px 0 16px" }}>
                            <input
                                placeholder="Szukaj kampanii..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                style={{ maxWidth: 320 }}
                            />
                            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value as "all" | CampaignType)}>
                                <option value="all">Wszystkie typy</option>
                                <option value="Email">Email</option>
                                <option value="SMS">SMS</option>
                            </select>
                            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as "all" | CampaignStatus)}>
                                <option value="all">Wszystkie statusy</option>
                                <option value="draft">Szkic</option>
                                <option value="scheduled">Zaplanowana</option>
                                <option value="active">Aktywna</option>
                                <option value="paused">Wstrzymana</option>
                            </select>
                        </div>

                        <table className="leads-table">
                            <thead>
                                <tr>
                                    <th>Nazwa</th><th>Typ</th><th>Status</th><th>Wysłane</th><th>Otwarte</th><th>Stopa otwarcia</th><th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {visibleCampaigns.map((c) => (
                                    <tr key={c.id}>
                                        <td style={{ fontWeight: 500 }}>{c.name}</td>
                                        <td>{c.type}</td>
                                        <td>
                                            <span className={`tag-badge ${getStatusBadgeClass(c.status)}`}>{getStatusLabel(c.status)}</span>
                                        </td>
                                        <td>{c.sent}</td>
                                        <td>{c.opened}</td>
                                        <td>{getOpenRate(c.sent, c.opened)}%</td>
                                        <td style={{ whiteSpace: "nowrap" }}>
                                            <button
                                                type="button"
                                                className="btn-primary-modern"
                                                onClick={() => setSelectedCampaignId(c.id)}
                                                style={{ padding: "6px 10px", marginRight: 8 }}
                                            >
                                                Szczegóły
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => duplicateCampaign(c.id)}
                                                style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid #d1d5db", background: "#fff" }}
                                            >
                                                Duplikuj
                                            </button>

                                            {(c.status === "active" || c.status === "paused") && (
                                                <button
                                                    type="button"
                                                    onClick={() => togglePaused(c.id)}
                                                    style={{
                                                        padding: "6px 10px",
                                                        borderRadius: 8,
                                                        border: "1px solid #d1d5db",
                                                        background: "#fff",
                                                        marginLeft: 8,
                                                    }}
                                                >
                                                    {c.status === "active" ? "Wstrzymaj" : "Wznów"}
                                                </button>
                                            )}

                                            {(c.status === "scheduled" || c.status === "draft") && (
                                                <button
                                                    type="button"
                                                    onClick={() => startNow(c.id)}
                                                    style={{
                                                        padding: "6px 10px",
                                                        borderRadius: 8,
                                                        border: "1px solid #d1d5db",
                                                        background: "#fff",
                                                        marginLeft: 8,
                                                    }}
                                                >
                                                    Uruchom teraz
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}

                                {visibleCampaigns.length === 0 && (
                                    <tr>
                                        <td colSpan={7} style={{ padding: 14, color: "#6b7280" }}>
                                            Brak kampanii spełniających kryteria.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {tab === "compose" && (
                    <div className="card">
                        <h2>Stwórz kampanię</h2>
                        <div className="page-form-modern">
                            <input placeholder="Nazwa kampanii" value={campaignName} onChange={(e) => setCampaignName(e.target.value)} />

                            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                                <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
                                    <span style={{ minWidth: 60, color: "#374151" }}>Kanał</span>
                                    <select
                                        value={campaignType}
                                        onChange={(e) => {
                                            const next = e.target.value as CampaignType;
                                            setCampaignType(next);
                                            if (next === "SMS") setSubject("");
                                        }}
                                    >
                                        <option value="Email">Email</option>
                                        <option value="SMS">SMS</option>
                                    </select>
                                </label>

                                <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
                                    <span style={{ minWidth: 90, color: "#374151" }}>Harmonogram</span>
                                    <input
                                        type="datetime-local"
                                        value={scheduledFor}
                                        onChange={(e) => setScheduledFor(e.target.value)}
                                    />
                                </label>
                            </div>

                            {campaignType === "Email" && (
                                <input placeholder="Temat" value={subject} onChange={(e) => setSubject(e.target.value)} />
                            )}

                            <textarea
                                placeholder={campaignType === "Email" ? "Napisz swoją wiadomość..." : "Napisz treść SMS..."}
                                rows={8}
                                value={body}
                                onChange={(e) => setBody(e.target.value)}
                                style={{ resize: "vertical" }}
                            />

                            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                                <input
                                    placeholder={campaignType === "Email" ? "Test: adres e-mail" : "Test: numer telefonu"}
                                    value={testRecipient}
                                    onChange={(e) => setTestRecipient(e.target.value)}
                                    style={{ maxWidth: 320 }}
                                />
                                <button
                                    type="button"
                                    onClick={sendTest}
                                    style={{ padding: "10px 14px", borderRadius: 10, border: "1px solid #d1d5db", background: "#fff" }}
                                >
                                    Wyślij test
                                </button>
                            </div>

                            <button
                                type="button"
                                className="btn-primary-modern"
                                onClick={createCampaign}
                                disabled={
                                    loading ||
                                    sent ||
                                    !campaignName.trim() ||
                                    !body.trim() ||
                                    (campaignType === "Email" && !subject.trim())
                                }
                                style={{
                                    alignSelf: "flex-start",
                                    background: sent ? "#059669" : undefined,
                                    opacity:
                                        loading ||
                                        sent ||
                                        !campaignName.trim() ||
                                        !body.trim() ||
                                        (campaignType === "Email" && !subject.trim())
                                            ? 0.6
                                            : 1,
                                    cursor:
                                        loading ||
                                        sent ||
                                        !campaignName.trim() ||
                                        !body.trim() ||
                                        (campaignType === "Email" && !subject.trim())
                                            ? "not-allowed"
                                            : "pointer",
                                }}
                            >
                                {sent ? "Kampania zapisana!" : scheduledFor ? "Zaplanuj kampanię" : "Zapisz jako szkic"}
                            </button>
                        </div>
                    </div>
                )}

                {selectedCampaign && (
                    <div
                        onClick={() => setSelectedCampaignId(null)}
                        style={{
                            position: "fixed",
                            inset: 0,
                            background: "rgba(0,0,0,0.45)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: 16,
                            zIndex: 50,
                        }}
                        role="dialog"
                        aria-modal="true"
                    >
                        <div
                            className="card"
                            onClick={(e) => e.stopPropagation()}
                            style={{ width: "min(720px, 100%)", maxHeight: "80vh", overflow: "auto" }}
                        >
                            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
                                <h2 style={{ margin: 0 }}>{selectedCampaign.name}</h2>
                                <button
                                    type="button"
                                    onClick={() => setSelectedCampaignId(null)}
                                    style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid #d1d5db", background: "#fff" }}
                                >
                                    Zamknij
                                </button>
                            </div>

                            <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "140px 1fr", gap: 8 }}>
                                <div style={{ color: "#6b7280" }}>Typ</div>
                                <div>{selectedCampaign.type}</div>
                                <div style={{ color: "#6b7280" }}>Status</div>
                                <div>
                                    <span className={`tag-badge ${getStatusBadgeClass(selectedCampaign.status)}`}>
                                        {getStatusLabel(selectedCampaign.status)}
                                    </span>
                                </div>
                                <div style={{ color: "#6b7280" }}>Wysłane</div>
                                <div>{selectedCampaign.sent}</div>
                                <div style={{ color: "#6b7280" }}>Otwarte</div>
                                <div>{selectedCampaign.opened}</div>
                                <div style={{ color: "#6b7280" }}>Stopa otwarcia</div>
                                <div>{getOpenRate(selectedCampaign.sent, selectedCampaign.opened)}%</div>
                                {selectedCampaign.scheduledFor && (
                                    <>
                                        <div style={{ color: "#6b7280" }}>Zaplanowano</div>
                                        <div>{selectedCampaign.scheduledFor}</div>
                                    </>
                                )}
                                {selectedCampaign.subject && (
                                    <>
                                        <div style={{ color: "#6b7280" }}>Temat</div>
                                        <div>{selectedCampaign.subject}</div>
                                    </>
                                )}
                                <div style={{ color: "#6b7280" }}>Treść</div>
                                <div style={{ whiteSpace: "pre-wrap" }}>{selectedCampaign.body}</div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Communication;