import { useNavigate } from 'react-router-dom';
import './Sidebar.css';

function Sidebar() {
    const navigate = useNavigate();

    const buttons = [
        { label: 'Strona 1', path: '/page1' },
        { label: 'Strona 2', path: '/page2' },
        { label: 'Strona 3', path: '/page3' },
        { label: 'Strona 4', path: '/page4' },
        { label: 'Strona 5', path: '/page5' },
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