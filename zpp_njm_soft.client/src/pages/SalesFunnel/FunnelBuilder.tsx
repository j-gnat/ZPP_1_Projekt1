import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../Page.css";
import "./SalesFunnel.css";

type ElementType = "heading" | "paragraph" | "image" | "button" | "divider" | "video" | "optin";

type BuilderElement = {
    id: number;
    type: ElementType;
    content: string;
    styles: {
        color: string;
        fontSize: string;
        textAlign: "left" | "center" | "right";
        padding: string;
        margin: string;
        background: string;
        fontWeight: string;
    };
};

const defaultStyles = {
    color: "#111827",
    fontSize: "16px",
    textAlign: "left" as const,
    padding: "8px",
    margin: "8px 0",
    background: "transparent",
    fontWeight: "400",
};

const elementDefs: { type: ElementType; label: string; defaultContent: string }[] = [
    { type: "heading", label: "Heading", defaultContent: "Your Headline Here" },
    { type: "paragraph", label: "Paragraph", defaultContent: "Add your compelling text here." },
    { type: "button", label: "CTA Button", defaultContent: "Get Started Now" },
    { type: "image", label: "Image", defaultContent: "https://placehold.co/800x400/6366f1/ffffff?text=Your+Image" },
    { type: "video", label: "Video (VSL)", defaultContent: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
    { type: "optin", label: "Opt-in Form", defaultContent: "Subscribe to get updates" },
    { type: "divider", label: "Divider", defaultContent: "" },
];

const FunnelBuilder: React.FC = () => {
    const { id, stepId } = useParams();
    const navigate = useNavigate();

    const [elements, setElements] = useState<BuilderElement[]>([]);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        const raw = localStorage.getItem(`funnel_${id}_step_${stepId}_page`);
        if (raw) {
            try { setElements(JSON.parse(raw)); } catch { /* ignore */ }
        }
    }, [id, stepId]);

    const savePage = () => {
        localStorage.setItem(`funnel_${id}_step_${stepId}_page`, JSON.stringify(elements));
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const addElement = (type: ElementType) => {
        const def = elementDefs.find((d) => d.type === type);
        setElements((prev) => [
            ...prev,
            { id: Date.now(), type, content: def?.defaultContent || "", styles: { ...defaultStyles } },
        ]);
    };

    const updateStyle = (elId: number, field: string, value: string) => {
        setElements((prev) =>
            prev.map((el) => el.id === elId ? { ...el, styles: { ...el.styles, [field]: value } } : el)
        );
    };

    const updateContent = (elId: number, value: string) => {
        setElements((prev) => prev.map((el) => el.id === elId ? { ...el, content: value } : el));
    };

    const removeElement = (elId: number) => {
        setElements((prev) => prev.filter((el) => el.id !== elId));
        if (selectedId === elId) setSelectedId(null);
    };

    const moveElement = (elId: number, dir: -1 | 1) => {
        setElements((prev) => {
            const idx = prev.findIndex((el) => el.id === elId);
            if (idx === -1) return prev;
            const next = [...prev];
            const swap = idx + dir;
            if (swap < 0 || swap >= next.length) return prev;
            [next[idx], next[swap]] = [next[swap], next[idx]];
            return next;
        });
    };

    const selected = elements.find((el) => el.id === selectedId);

    const renderElement = (el: BuilderElement) => {
        const s = {
            color: el.styles.color,
            fontSize: el.styles.fontSize,
            textAlign: el.styles.textAlign,
            padding: el.styles.padding,
            margin: el.styles.margin,
            background: el.styles.background,
            fontWeight: el.styles.fontWeight,
        };

        if (el.type === "heading") return (
            <h2 contentEditable suppressContentEditableWarning onBlur={(e) => updateContent(el.id, e.target.innerText)} style={{ ...s, margin: 0 }}>
                {el.content}
            </h2>
        );

        if (el.type === "paragraph") return (
            <p contentEditable suppressContentEditableWarning onBlur={(e) => updateContent(el.id, e.target.innerText)} style={{ ...s, margin: 0 }}>
                {el.content}
            </p>
        );

        if (el.type === "button") return (
            <button className="cta-button" style={{ ...s, border: "none", cursor: "pointer", borderRadius: 8 }}
                onClick={() => { const t = prompt("Button text:", el.content); if (t) updateContent(el.id, t); }}>
                {el.content}
            </button>
        );

        if (el.type === "image") return (
            <img src={el.content} alt="" style={{ width: "100%", borderRadius: 8, display: "block" }}
                onClick={() => { const u = prompt("Image URL:", el.content); if (u) updateContent(el.id, u); }} />
        );

        if (el.type === "video") return (
            <div style={{ position: "relative", paddingBottom: "56.25%", height: 0, overflow: "hidden", borderRadius: 8 }}>
                <iframe src={el.content} style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }}
                    title="video" allowFullScreen />
            </div>
        );

        if (el.type === "optin") return (
            <div style={{ ...s, background: el.styles.background || "#f3f4f6", borderRadius: 10, padding: "24px" }}>
                <p style={{ margin: "0 0 12px", fontWeight: "600", fontSize: 16 }}>{el.content}</p>
                <div style={{ display: "flex", gap: 8 }}>
                    <input type="email" placeholder="Your email address" style={{ flex: 1, padding: "10px 12px", border: "1px solid #d1d5db", borderRadius: 8, fontSize: 14 }} readOnly />
                    <button className="cta-button" style={{ padding: "10px 18px", fontSize: 14 }}>Subscribe</button>
                </div>
            </div>
        );

        if (el.type === "divider") return (
            <hr style={{ border: "none", borderTop: "2px solid #e5e7eb", margin: "16px 0" }} />
        );

        return null;
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: "#f8fafc" }}>
            <div className="builder-topbar">
                <button className="back-button" onClick={() => navigate(`/funnel/${id}/step/${stepId}`)}>
                    ← Back
                </button>
                <div className="breadcrumbs">
                    <span>Funnel</span><span>›</span>
                    <span>Step {stepId}</span><span>›</span>
                    <strong>Page Builder</strong>
                </div>
                <button className="btn-primary-modern" onClick={savePage} style={{ background: saved ? "#059669" : undefined }}>
                    {saved ? "Saved!" : "Save Page"}
                </button>
            </div>

            <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
                <div className="builder-left-panel">
                    <h3>Elements</h3>
                    {elementDefs.map((def) => (
                        <button key={def.type} onClick={() => addElement(def.type)}>
                            + {def.label}
                        </button>
                    ))}
                    <div style={{ marginTop: "auto", paddingTop: 16, borderTop: "1px solid #e5e7eb" }}>
                        <button style={{ background: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca" }}
                            onClick={() => { if (confirm("Clear all elements?")) { setElements([]); setSelectedId(null); } }}>
                            Clear All
                        </button>
                    </div>
                </div>

                <div className="builder-canvas" onClick={() => setSelectedId(null)}>
                    {elements.length === 0 && (
                        <div className="placeholder">
                            <p style={{ fontSize: 16, marginBottom: 8 }}>Your canvas is empty</p>
                            <p style={{ fontSize: 13 }}>Add elements from the left panel</p>
                        </div>
                    )}
                    {elements.map((el) => (
                        <div key={el.id} style={{ position: "relative", marginBottom: 8 }}
                            onClick={(e) => { e.stopPropagation(); setSelectedId(el.id); }}>
                            {selectedId === el.id && (
                                <div className="canvas-element-toolbar">
                                    <button onClick={() => moveElement(el.id, -1)}>↑</button>
                                    <button onClick={() => moveElement(el.id, 1)}>↓</button>
                                    <button style={{ color: "#fca5a5" }} onClick={() => removeElement(el.id)}>✕</button>
                                </div>
                            )}
                            <div className={`canvas-element${selectedId === el.id ? " selected" : ""}`}>
                                {renderElement(el)}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="builder-right-panel">
                    <h3>Properties</h3>
                    {!selected && <p style={{ color: "#9ca3af", fontSize: 13 }}>Select an element to edit its properties.</p>}
                    {selected && (
                        <>
                            {(selected.type === "optin") && (
                                <>
                                    <label>Form Label</label>
                                    <input value={selected.content} onChange={(e) => updateContent(selected.id, e.target.value)} />
                                </>
                            )}
                            {(selected.type === "video") && (
                                <>
                                    <label>Embed URL</label>
                                    <input value={selected.content} onChange={(e) => updateContent(selected.id, e.target.value)} />
                                </>
                            )}
                            {(selected.type !== "divider") && (
                                <>
                                    <label>Text Color</label>
                                    <input type="color" value={selected.styles.color} onChange={(e) => updateStyle(selected.id, "color", e.target.value)} />

                                    <label>Background</label>
                                    <input type="color" value={selected.styles.background === "transparent" ? "#ffffff" : selected.styles.background}
                                        onChange={(e) => updateStyle(selected.id, "background", e.target.value)} />

                                    <label>Font Size</label>
                                    <input value={selected.styles.fontSize} onChange={(e) => updateStyle(selected.id, "fontSize", e.target.value)} />

                                    <label>Font Weight</label>
                                    <select value={selected.styles.fontWeight} onChange={(e) => updateStyle(selected.id, "fontWeight", e.target.value)}>
                                        <option value="400">Normal</option>
                                        <option value="500">Medium</option>
                                        <option value="600">Semi-bold</option>
                                        <option value="700">Bold</option>
                                    </select>

                                    <label>Alignment</label>
                                    <select value={selected.styles.textAlign} onChange={(e) => updateStyle(selected.id, "textAlign", e.target.value)}>
                                        <option value="left">Left</option>
                                        <option value="center">Center</option>
                                        <option value="right">Right</option>
                                    </select>

                                    <label>Padding</label>
                                    <input value={selected.styles.padding} onChange={(e) => updateStyle(selected.id, "padding", e.target.value)} />

                                    <label>Margin</label>
                                    <input value={selected.styles.margin} onChange={(e) => updateStyle(selected.id, "margin", e.target.value)} />
                                </>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FunnelBuilder;