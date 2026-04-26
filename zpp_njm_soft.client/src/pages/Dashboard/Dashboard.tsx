import { useNavigate } from "react-router-dom";
import Sidebar from "../../Sidebar";
import "../Page.css";
import "../SalesFunnel/SalesFunnel.css";

function Dashboard() {
    const navigate = useNavigate();

    const metrics = [
        { label: "Suma leadów", value: "1,284", change: "+12%", up: true },
        { label: "Aktywne lejki", value: "7", change: "+2", up: true },
        { label: "Współczynnik konwersji", value: "3.8%", change: "-0.2%", up: false },
        { label: "Przychód (od początku miesiąca)", value: "$24,570", change: "+18%", up: true },
    ];

    const shortcuts = [
        { label: "Lejek sprzedażowy", path: "/sales-funnel", icon: "◈", desc: "Lejki, kreator, testy A/B" },
        { label: "CRM", path: "/crm", icon: "◉", desc: "Leady, kontakty, proces sprzedaży" },
        { label: "Komunikacja", path: "/communication", icon: "◎", desc: "Kampanie Email, SMS" },
        { label: "Kursy", path: "/courses", icon: "◇", desc: "Kreator kursów online" },
    ];

    return (
        <div className="dashboard-wrapper">
            <Sidebar />
            <div className="dashboard-content">
                <div className="dashboard-header">
                    <h1>Dashboard</h1>
                    <p>Witaj ponownie. Oto Twój przegląd biznesowy.</p>
                </div>

                <div className="stats-grid">
                    {metrics.map((m) => (
                        <div className="stat-card" key={m.label}>
                            <div className="stat-label">{m.label}</div>
                            <div className="stat-value">{m.value}</div>
                            <div className={`stat-change ${m.up ? "up" : "down"}`}>
                                {m.up ? "▲" : "▼"} {m.change} vs ostatni miesiąc
                            </div>
                        </div>
                    ))}
                </div>

                <div className="tiles-grid" style={{ marginTop: 24 }}>
                    {shortcuts.map((s) => (
                        <div className="tile-card" key={s.path} onClick={() => navigate(s.path)}>
                            <div className="tile-icon">{s.icon}</div>
                            <h3>{s.label}</h3>
                            <p>{s.desc}</p>
                        </div>
                    ))}
                </div>

                <div className="card" style={{ marginTop: 24 }}>
                    <h2>Ostatnia aktywność</h2>
                    <div className="stat-row"><span>Nowy lead: Jan Kowalski</span><strong>2 min temu</strong></div>
                    <div className="stat-row"><span>Opublikowano lejek "Black Friday"</span><strong>1 godz. temu</strong></div>
                    <div className="stat-row"><span>Wariant B testu A/B wygrywa</span><strong>3 godz. temu</strong></div>
                    <div className="stat-row"><span>Kampania email wysłana do 340 leadów</span><strong>Wczoraj</strong></div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;