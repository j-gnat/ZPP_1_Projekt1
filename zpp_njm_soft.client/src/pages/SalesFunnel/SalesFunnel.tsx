import React from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../Sidebar";
import "../Page.css";
import "./SalesFunnel.css";

const SalesFunnel: React.FC = () => {
    const navigate = useNavigate();

    const tiles = [
        { title: "Lejki", desc: "Twórz i zarządzaj lejkami sprzedażowymi", icon: "◈", path: "/funnels" },
        { title: "Testy A/B", desc: "Warianty, konwersje, statystyki", icon: "⚡", path: "/ab-test" },
        { title: "Leady", desc: "Lista leadów, tagi, źródła", icon: "◉", path: "/leads" },
        { title: "Pop-upy", desc: "Zasady wyświetlania i konfiguracja", icon: "◎", path: "/popups" },
        { title: "Analityka", desc: "Konwersje, wykresy, analizy", icon: "▣", path: "/stats" },
        { title: "Ustawienia", desc: "Domena, SEO, integracje", icon: "⊕", path: "/funnel-settings" },
    ];

    return (
        <div className="dashboard-wrapper">
            <Sidebar />
            <div className="dashboard-content">
                <div className="dashboard-header">
                    <h1>Lejek Sprzedażowy</h1>
                    <p>Wybierz moduł, aby rozpocząć.</p>
                </div>
                <div className="tiles-grid">
                    {tiles.map((tile, idx) => (
                        <div key={idx} className="tile-card" onClick={() => navigate(tile.path)}>
                            <div className="tile-icon">{tile.icon}</div>
                            <h3>{tile.title}</h3>
                            <p>{tile.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SalesFunnel;