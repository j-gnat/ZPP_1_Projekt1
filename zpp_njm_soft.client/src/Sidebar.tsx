import { useNavigate, useLocation } from "react-router-dom";
import "./Sidebar.css";


function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const sections = [
    {
      label: "Menu główne",
      buttons: [
        { label: "Dashboard", path: "/dashboard", icon: "⊞" },
      ],
    },
    {
      label: "Marketing",
      buttons: [
        { label: "Lejki sprzedaży", path: "/sales-funnel", icon: "◈" },
        { label: "CRM", path: "/crm", icon: "◉" },
        { label: "Komunikacja", path: "/communication", icon: "◎" },
      ],
    },
    {
      label: "Biznes",
      buttons: [
        { label: "Kursy", path: "/courses", icon: "◇" },
        { label: "Dokumenty", path: "/documents", icon: "◻" },
        { label: "Kalendarz", path: "/calendar", icon: "◷" },
      ],
    },
  ];

  return (
    <aside className="sidebar">
      {sections.map(section => (
        <div key={section.label} className="sidebar-section">
          <div className="sidebar-section-title">
            {section.label}
          </div>

          <div className="sidebar-buttons">
            {section.buttons.map(btn => (
              <button
                key={btn.path}
                className={`sidebar-button ${
                  location.pathname === btn.path ? "active" : ""
                }`}
                onClick={() => navigate(btn.path)}
              >
                <span className="icon">{btn.icon}</span>
                {btn.label}
              </button>
            ))}
          </div>
        </div>
      ))}
    </aside>
  );
}


export default Sidebar;