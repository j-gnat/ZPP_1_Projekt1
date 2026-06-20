import { useState, useRef } from "react";
import Sidebar from "../../Sidebar";
import "../Page.css";
import "../SalesFunnel/SalesFunnel.css";

type DocStatus = "pending" | "signed" | "rejected" | "archived";
type DocType = "pdf" | "html";

type SignatureEvent = {
    date: string;
    action: string;
    user: string;
};

type Document = {
    id: string;
    name: string;
    type: DocType;
    status: DocStatus;
    uploadedAt: string;
    leadName: string;
    leadEmail: string;
    fileSize: string;
    signedAt?: string;
    signatureLog: SignatureEvent[];
    fileUrl: string;
    archived: boolean;
};

const statusColors: Record<DocStatus, string> = {
    pending: "tag-warm",
    signed: "tag-new",
    rejected: "tag-hot",
    archived: "tag-cold",
};

const statusLabels: Record<DocStatus, string> = {
    pending: "Oczekuje",
    signed: "Podpisano",
    rejected: "Odrzucono",
    archived: "Archiwum",
};

const initialDocs: Document[] = [
    {
        id: "1",
        name: "Umowa_NDA_2026.pdf",
        type: "pdf",
        status: "signed",
        uploadedAt: "2026-06-01",
        leadName: "Anna Kowalska",
        leadEmail: "anna@example.com",
        fileSize: "214 KB",
        signedAt: "2026-06-03",
        fileUrl: "#",
        archived: false,
        signatureLog: [
            { date: "2026-06-01 10:00", action: "Wgrano dokument", user: "Admin" },
            { date: "2026-06-02 14:22", action: "Wysłano do podpisu", user: "Admin" },
            { date: "2026-06-03 09:15", action: "Podpisano e-podpisem", user: "Anna Kowalska" },
        ],
    },
    {
        id: "2",
        name: "Oferta_Handlowa_Q2.html",
        type: "html",
        status: "pending",
        uploadedAt: "2026-06-10",
        leadName: "Marek Nowak",
        leadEmail: "marek@example.com",
        fileSize: "88 KB",
        fileUrl: "#",
        archived: false,
        signatureLog: [
            { date: "2026-06-10 08:00", action: "Wgrano dokument", user: "Admin" },
            { date: "2026-06-11 12:00", action: "Wysłano powiadomienie email", user: "System" },
        ],
    },
    {
        id: "3",
        name: "Regulamin_Kursu.pdf",
        type: "pdf",
        status: "archived",
        uploadedAt: "2026-05-15",
        leadName: "Joanna Wiśniewska",
        leadEmail: "joanna@example.com",
        fileSize: "340 KB",
        fileUrl: "#",
        archived: true,
        signatureLog: [
            { date: "2026-05-15 09:00", action: "Wgrano dokument", user: "Admin" },
            { date: "2026-05-20 11:00", action: "Zarchiwizowano", user: "Admin" },
        ],
    },
];

function Documents() {
    const [docs, setDocs] = useState<Document[]>(initialDocs);
    const [selected, setSelected] = useState<Document | null>(null);
    const [tab, setTab] = useState<"all" | "pending" | "signed" | "archived">("all");
    const [showUpload, setShowUpload] = useState(false);
    const [notification, setNotification] = useState<string | null>(null);
    const [signModal, setSignModal] = useState<Document | null>(null);
    const [signName, setSignName] = useState("");
    const [signMethod, setSignMethod] = useState<"click" | "draw">("click");
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [uploadForm, setUploadForm] = useState({ name: "", leadName: "", leadEmail: "", type: "pdf" as DocType });
    const fileInputRef = useRef<HTMLInputElement>(null);

    const flash = (msg: string) => {
        setNotification(msg);
        setTimeout(() => setNotification(null), 3000);
    };

    const filtered = docs.filter(d => {
        if (tab === "all") return !d.archived;
        if (tab === "archived") return d.archived;
        return d.status === tab && !d.archived;
    });

    const uploadDoc = () => {
        if (!uploadForm.name || !uploadForm.leadName || !uploadForm.leadEmail) {
            flash("Wypełnij wszystkie pola.");
            return;
        }
        const doc: Document = {
            id: Date.now().toString(),
            name: uploadForm.name,
            type: uploadForm.type,
            status: "pending",
            uploadedAt: new Date().toISOString().slice(0, 10),
            leadName: uploadForm.leadName,
            leadEmail: uploadForm.leadEmail,
            fileSize: "— KB",
            fileUrl: "#",
            archived: false,
            signatureLog: [{ date: new Date().toLocaleString("pl-PL"), action: "Wgrano dokument", user: "Admin" }],
        };
        setDocs(prev => [doc, ...prev]);
        setUploadForm({ name: "", leadName: "", leadEmail: "", type: "pdf" });
        setShowUpload(false);
        flash("Dokument został wgrany.");
    };

    const sendForSignature = (id: string) => {
        setDocs(prev => prev.map(d => {
            if (d.id !== id) return d;
            const log = [...d.signatureLog, { date: new Date().toLocaleString("pl-PL"), action: "Wysłano powiadomienie o podpisie", user: "System" }];
            return { ...d, signatureLog: log };
        }));
        flash("Powiadomienie o podpisaniu zostało wysłane.");
    };

    const archiveDoc = (id: string) => {
        setDocs(prev => prev.map(d => {
            if (d.id !== id) return d;
            const log = [...d.signatureLog, { date: new Date().toLocaleString("pl-PL"), action: "Zarchiwizowano", user: "Admin" }];
            return { ...d, archived: true, status: "archived", signatureLog: log };
        }));
        setSelected(null);
        flash("Dokument przeniesiony do archiwum.");
    };

    const deleteDoc = (id: string) => {
        if (!confirm("Usunąć ten dokument?")) return;
        setDocs(prev => prev.filter(d => d.id !== id));
        setSelected(null);
    };

    const startSign = (doc: Document) => {
        setSignModal(doc);
        setSignName("");
        setSignMethod("click");
        setTimeout(() => {
            if (canvasRef.current) {
                const ctx = canvasRef.current.getContext("2d");
                if (ctx) { ctx.clearRect(0, 0, 400, 120); }
            }
        }, 50);
    };

    const confirmSign = () => {
        if (!signModal) return;
        if (signMethod === "click" && !signName.trim()) { flash("Wpisz imię i nazwisko."); return; }
        setDocs(prev => prev.map(d => {
            if (d.id !== signModal.id) return d;
            const log = [...d.signatureLog, { date: new Date().toLocaleString("pl-PL"), action: `Podpisano e-podpisem (${signMethod === "click" ? "klik" : "rysowanie"})`, user: signName || d.leadName }];
            return { ...d, status: "signed", signedAt: new Date().toISOString().slice(0, 10), signatureLog: log };
        }));
        flash("Dokument został podpisany. Powiadomienie wysłane.");
        setSignModal(null);
    };

    const drawStart = (e: React.MouseEvent<HTMLCanvasElement>) => {
        setIsDrawing(true);
        const rect = canvasRef.current!.getBoundingClientRect();
        const ctx = canvasRef.current!.getContext("2d")!;
        ctx.beginPath();
        ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    };

    const drawMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDrawing || !canvasRef.current) return;
        const rect = canvasRef.current.getBoundingClientRect();
        const ctx = canvasRef.current.getContext("2d")!;
        ctx.strokeStyle = "#1f2937";
        ctx.lineWidth = 2;
        ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
        ctx.stroke();
    };

    const drawEnd = () => setIsDrawing(false);

    const clearCanvas = () => {
        if (!canvasRef.current) return;
        const ctx = canvasRef.current.getContext("2d")!;
        ctx.clearRect(0, 0, 400, 120);
    };

    return (
        <div className="dashboard-wrapper">
            <Sidebar />
            <div className="dashboard-content">
                <div className="dashboard-header">
                    <h1>Dokumenty</h1>
                    <p>Upload, e-podpis, historia i archiwum dokumentów.</p>
                </div>

                {notification && (
                    <div className="card" style={{ padding: "12px 16px", marginBottom: 16, borderLeft: "4px solid #6366f1", color: "#374151" }}>
                        {notification}
                    </div>
                )}

                <div className="stats-grid" style={{ gridTemplateColumns: "repeat(4,1fr)" }}>
                    {(["all", "pending", "signed", "archived"] as const).map(t => (
                        <div key={t} className="stat-card" style={{ cursor: "pointer", border: tab === t ? "2px solid #6366f1" : undefined }} onClick={() => setTab(t)}>
                            <div className="stat-label">{t === "all" ? "Wszystkie" : t === "pending" ? "Oczekuje" : t === "signed" ? "Podpisane" : "Archiwum"}</div>
                            <div className="stat-value">
                                {t === "all" ? docs.filter(d => !d.archived).length
                                    : t === "archived" ? docs.filter(d => d.archived).length
                                    : docs.filter(d => d.status === t && !d.archived).length}
                            </div>
                        </div>
                    ))}
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16, gap: 10 }}>
                    <button className="btn-secondary-modern" onClick={() => fileInputRef.current?.click()}>
                        📁 Wybierz plik
                    </button>
                    <input ref={fileInputRef} type="file" accept=".pdf,.html" style={{ display: "none" }}
                        onChange={e => {
                            const f = e.target.files?.[0];
                            if (f) {
                                setUploadForm(prev => ({ ...prev, name: f.name, type: f.name.endsWith(".html") ? "html" : "pdf" }));
                                setShowUpload(true);
                            }
                        }} />
                    <button className="btn-primary-modern" onClick={() => setShowUpload(v => !v)}>
                        {showUpload ? "Anuluj" : "+ Wgraj dokument"}
                    </button>
                </div>

                {showUpload && (
                    <div className="card" style={{ marginBottom: 20 }}>
                        <h2>Nowy dokument</h2>
                        <div className="page-form-modern">
                            <input placeholder="Nazwa pliku (np. Umowa.pdf)" value={uploadForm.name} onChange={e => setUploadForm(f => ({ ...f, name: e.target.value }))} />
                            <select value={uploadForm.type} onChange={e => setUploadForm(f => ({ ...f, type: e.target.value as DocType }))}>
                                <option value="pdf">PDF</option>
                                <option value="html">HTML</option>
                            </select>
                            <input placeholder="Imię i nazwisko leada / klienta" value={uploadForm.leadName} onChange={e => setUploadForm(f => ({ ...f, leadName: e.target.value }))} />
                            <input placeholder="Email leada / klienta" value={uploadForm.leadEmail} onChange={e => setUploadForm(f => ({ ...f, leadEmail: e.target.value }))} />
                            <button className="btn-primary-modern" style={{ alignSelf: "flex-start" }} onClick={uploadDoc}>Wgraj</button>
                        </div>
                    </div>
                )}

                <div className="card">
                    <h2>Dokumenty ({filtered.length})</h2>
                    <table className="leads-table">
                        <thead>
                            <tr>
                                <th>Nazwa</th>
                                <th>Typ</th>
                                <th>Status</th>
                                <th>Lead / Klient</th>
                                <th>Data wgrania</th>
                                <th>Rozmiar</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(doc => (
                                <tr key={doc.id} style={{ cursor: "pointer" }} onClick={() => setSelected(doc)}>
                                    <td style={{ fontWeight: 500 }}>
                                        {doc.type === "pdf" ? "📄" : "🌐"} {doc.name}
                                    </td>
                                    <td style={{ textTransform: "uppercase", fontSize: 11, color: "#6b7280" }}>{doc.type}</td>
                                    <td><span className={`tag-badge ${statusColors[doc.status]}`}>{statusLabels[doc.status]}</span></td>
                                    <td>
                                        <div style={{ fontWeight: 500, fontSize: 13 }}>{doc.leadName}</div>
                                        <div style={{ fontSize: 11, color: "#9ca3af" }}>{doc.leadEmail}</div>
                                    </td>
                                    <td>{doc.uploadedAt}</td>
                                    <td>{doc.fileSize}</td>
                                    <td onClick={e => e.stopPropagation()}>
                                        <div style={{ display: "flex", gap: 6 }}>
                                            {doc.status === "pending" && (
                                                <button className="btn-primary-modern" style={{ padding: "5px 10px", fontSize: 12 }} onClick={() => startSign(doc)}>
                                                    ✍️ Podpisz
                                                </button>
                                            )}
                                            {doc.status === "pending" && (
                                                <button className="btn-secondary-modern" style={{ padding: "5px 10px", fontSize: 12 }} onClick={() => sendForSignature(doc.id)}>
                                                    📧
                                                </button>
                                            )}
                                            {!doc.archived && (
                                                <button className="btn-secondary-modern" style={{ padding: "5px 10px", fontSize: 12 }} onClick={() => archiveDoc(doc.id)}>
                                                    🗄
                                                </button>
                                            )}
                                            <button style={{ background: "none", border: "none", color: "#dc2626", cursor: "pointer", fontSize: 14 }} onClick={() => deleteDoc(doc.id)}>✕</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filtered.length === 0 && <p style={{ color: "#9ca3af", textAlign: "center", padding: 20 }}>Brak dokumentów.</p>}
                </div>

                {selected && (
                    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}
                        onClick={() => setSelected(null)}>
                        <div style={{ background: "white", borderRadius: 14, padding: 28, width: 560, maxWidth: "95vw", maxHeight: "80vh", overflowY: "auto" }}
                            onClick={e => e.stopPropagation()}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                                <h2 style={{ margin: 0, fontSize: 18 }}>{selected.name}</h2>
                                <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#9ca3af" }}>×</button>
                            </div>
                            <div style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: 8, fontSize: 14, marginBottom: 16 }}>
                                <span style={{ color: "#6b7280" }}>Status</span>
                                <span><span className={`tag-badge ${statusColors[selected.status]}`}>{statusLabels[selected.status]}</span></span>
                                <span style={{ color: "#6b7280" }}>Typ</span><span>{selected.type.toUpperCase()}</span>
                                <span style={{ color: "#6b7280" }}>Rozmiar</span><span>{selected.fileSize}</span>
                                <span style={{ color: "#6b7280" }}>Lead</span><span>{selected.leadName} ({selected.leadEmail})</span>
                                <span style={{ color: "#6b7280" }}>Wgrano</span><span>{selected.uploadedAt}</span>
                                {selected.signedAt && <><span style={{ color: "#6b7280" }}>Podpisano</span><span>{selected.signedAt}</span></>}
                            </div>
                            <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Historia podpisów i aktywności</h3>
                            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                                {selected.signatureLog.map((ev, i) => (
                                    <div key={i} style={{ display: "flex", gap: 12, padding: "8px 12px", background: "#f9fafb", borderRadius: 8, fontSize: 13 }}>
                                        <span style={{ color: "#9ca3af", minWidth: 140 }}>{ev.date}</span>
                                        <span style={{ flex: 1 }}>{ev.action}</span>
                                        <span style={{ color: "#6b7280" }}>{ev.user}</span>
                                    </div>
                                ))}
                            </div>
                            <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
                                <a href={selected.fileUrl} target="_blank" rel="noopener noreferrer"
                                    style={{ padding: "8px 16px", background: "#6366f1", color: "white", borderRadius: 8, textDecoration: "none", fontSize: 13 }}>
                                    📥 Pobierz
                                </a>
                                {selected.status === "pending" && (
                                    <button className="btn-primary-modern" style={{ fontSize: 13 }} onClick={() => { setSelected(null); startSign(selected); }}>✍️ Podpisz</button>
                                )}
                                {!selected.archived && (
                                    <button className="btn-secondary-modern" style={{ fontSize: 13 }} onClick={() => archiveDoc(selected.id)}>🗄 Archiwizuj</button>
                                )}
                                <button style={{ marginLeft: "auto", padding: "8px 16px", background: "#fee2e2", color: "#dc2626", border: "1px solid #fecaca", borderRadius: 8, cursor: "pointer", fontSize: 13 }}
                                    onClick={() => deleteDoc(selected.id)}>
                                    Usuń
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {signModal && (
                    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1100, display: "flex", alignItems: "center", justifyContent: "center" }}
                        onClick={() => setSignModal(null)}>
                        <div style={{ background: "white", borderRadius: 14, padding: 28, width: 480, maxWidth: "95vw" }} onClick={e => e.stopPropagation()}>
                            <h2 style={{ margin: "0 0 4px", fontSize: 18 }}>E-Podpis dokumentu</h2>
                            <p style={{ color: "#6b7280", fontSize: 13, margin: "0 0 20px" }}>{signModal.name}</p>
                            <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                                {(["click", "draw"] as const).map(m => (
                                    <button key={m} onClick={() => setSignMethod(m)}
                                        style={{ flex: 1, padding: "8px", borderRadius: 8, border: "1px solid #d1d5db", cursor: "pointer", fontSize: 13,
                                            background: signMethod === m ? "#6366f1" : "#f9fafb", color: signMethod === m ? "white" : "#374151" }}>
                                        {m === "click" ? "✍️ Podpis kliknięciem" : "🖊️ Narysuj podpis"}
                                    </button>
                                ))}
                            </div>
                            {signMethod === "click" && (
                                <input placeholder="Wpisz imię i nazwisko jako podpis" value={signName} onChange={e => setSignName(e.target.value)}
                                    style={{ width: "100%", padding: "10px 12px", border: "1px solid #d1d5db", borderRadius: 8, fontSize: 14, boxSizing: "border-box" }} />
                            )}
                            {signMethod === "draw" && (
                                <div>
                                    <canvas ref={canvasRef} width={420} height={120}
                                        style={{ border: "2px dashed #d1d5db", borderRadius: 8, cursor: "crosshair", touchAction: "none", display: "block" }}
                                        onMouseDown={drawStart} onMouseMove={drawMove} onMouseUp={drawEnd} onMouseLeave={drawEnd} />
                                    <button onClick={clearCanvas} style={{ marginTop: 6, fontSize: 12, background: "none", border: "none", color: "#6b7280", cursor: "pointer" }}>
                                        Wyczyść
                                    </button>
                                </div>
                            )}
                            <div style={{ marginTop: 12, padding: "10px 14px", background: "#fef3c7", borderRadius: 8, fontSize: 12, color: "#92400e" }}>
                                Potwierdzam podpisanie dokumentu "{signModal.name}" i wyrażam zgodę na jego treść.
                            </div>
                            <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
                                <button className="btn-primary-modern" onClick={confirmSign}>✅ Podpisz dokument</button>
                                <button className="btn-secondary-modern" onClick={() => setSignModal(null)}>Anuluj</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Documents;