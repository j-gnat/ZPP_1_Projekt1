import { useNavigate } from 'react-router-dom';
import './Sidebar.css';

function Sidebar() {
    const navigate = useNavigate();

    const buttons = [
        { label: 'Sales Funnel', path: '/sales-funnel' },
        { label: 'CRM', path: '/crm' },
        { label: 'Communication', path: '/communication' },
        { label: 'Courses', path: '/courses' },
        { label: 'Documents', path: '/documents' },
        { label: 'Calendar', path: '/calendar' },
    ];

    return (
        <div className="sidebar">
            {buttons.map((button, index) => (
                <button key={index} className="sidebar-btn" onClick={() => navigate(button.path)}>
                    {button.label}
                </button>
            ))}
        </div>
    );
}

export default Sidebar;