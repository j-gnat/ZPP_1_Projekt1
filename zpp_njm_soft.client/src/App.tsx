import { Routes, Route, useNavigate } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login/Login.tsx";
import Dashboard from "./pages/Dashboard/Dashboard.tsx";
import SalesFunnel from "./pages/SalesFunnel/SalesFunnel.tsx";
import CRM from "./pages/CRM/CRM.tsx";
import Communication from "./pages/Communication/Communication.tsx";
import Courses from "./pages/Courses/Courses.tsx";
import Documents from "./pages/Documents/Documents.tsx";
import Calendar from "./pages/Calendar/Calendar.tsx";
import FunnelBuilder from "./pages/SalesFunnel/FunnelBuilder.tsx";
import FunnelsList from "./pages/SalesFunnel/FunnelsList.tsx";
import FunnelDetails from "./pages/SalesFunnel/FunnelDetails.tsx";
import FunnelSteps from "./pages/SalesFunnel/FunnelSteps.tsx";
import ABTest from "./pages/SalesFunnel/ABTest.tsx";
import Leads from "./pages/SalesFunnel/Leads.tsx";
import Popups from "./pages/SalesFunnel/Popups.tsx";
import Stats from "./pages/SalesFunnel/Stats.tsx";
import FunnelSettings from "./pages/SalesFunnel/FunnelSettings.tsx";

function Home() {
    const navigate = useNavigate();
    return (
        <div style={{ fontFamily: "system-ui, sans-serif", minHeight: "100vh", background: "#0f172a", color: "white" }}>
            <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 48px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                    <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em" }}>NJM_Soft</div>
                    <button onClick={() => navigate("/login")}
                        style={{ padding: "10px 24px", background: "#6366f1", color: "white", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 14, fontWeight: 500 }}>
                        Zaloguj się
                    </button>
            </header>
            <main style={{ textAlign: "center", padding: "80px 48px 48px" }}>
                <h1 style={{ fontSize: 52, fontWeight: 800, margin: "0 0 16px", letterSpacing: "-0.03em", background: "linear-gradient(135deg,#a5b4fc,#818cf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                    Platforma Lejków Sprzedażowych
                </h1>
                <p style={{ fontSize: 20, color: "rgba(255,255,255,0.6)", maxWidth: 520, margin: "0 auto 40px" }}>
                    Twórz, publikuj i optymalizuj skuteczne lejki sprzedażowe. Edytor drag-and-drop, testy A/B, CRM i analityka — wszystko w jednym miejscu.
                </p>
                <button onClick={() => navigate("/login")}
                    style={{ padding: "14px 36px", background: "#6366f1", color: "white", border: "none", borderRadius: 10, cursor: "pointer", fontSize: 16, fontWeight: 600 }}>
                    Rozpocznij
                </button>

                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                    gap: 24,
                    maxWidth: 960,
                    marginTop: 64,
                    margin: "64px auto 0",
                    textAlign: "left",

                    }}
                >
                    {[
                        { icon: "◈", title: "Kreator Drag-and-Drop", desc: "Buduj strony wizualnie z nagłówkami, obrazami, formularzami, CTA i wideo VSL." },
                        { icon: "◉", title: "Integracja CRM", desc: "Automatycznie zbieraj leady i zarządzaj nimi w swojej bazie." },
                        { icon: "⚡", title: "Testy A/B", desc: "Testuj warianty, śledź konwersje i wybieraj zwycięską stronę." },
                        { icon: "▣", title: "Panel Analityczny", desc: "Śledź odwiedzających, konwersje, przychody i źródła ruchu." },
                        { icon: "◎", title: "Reguły Pop-upów", desc: "Wyzwalacze pop-upów: wyjście, opóźnienie, głębokość przewijania." },
                        { icon: "⊕", title: "Własna domena", desc: "Publikuj lejki na własnej domenie z szybkim DNS." },
                    ].map((f) => (
                        <div key={f.title} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "20px" }}>
                            <div style={{ fontSize: 28, marginBottom: 10 }}>{f.icon}</div>
                            <h3 style={{ margin: "0 0 6px", fontSize: 15, fontWeight: 600 }}>{f.title}</h3>
                            <p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>{f.desc}</p>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}

function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/sales-funnel" element={<SalesFunnel />} />
            <Route path="/crm" element={<CRM />} />
            <Route path="/communication" element={<Communication />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/documents" element={<Documents />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/funnels" element={<FunnelsList />} />
            <Route path="/funnel/:id" element={<FunnelDetails />} />
            <Route path="/funnel/:id/step/:stepId" element={<FunnelSteps />} />
            <Route path="/builder/:id/:stepId" element={<FunnelBuilder />} />
            <Route path="/funnel-builder" element={<FunnelBuilder />} />
            <Route path="/ab-test" element={<ABTest />} />
            <Route path="/leads" element={<Leads />} />
            <Route path="/popups" element={<Popups />} />
            <Route path="/stats" element={<Stats />} />
            <Route path="/funnel-settings" element={<FunnelSettings />} />
        </Routes>
    );
}

export default App;