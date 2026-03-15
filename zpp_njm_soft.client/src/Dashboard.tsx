import Sidebar from './Sidebar';
import './Dashboard.css';

function Dashboard() {
    return (
        <div className="dashboard">
            <header className="dashboard-header">
                <div className="logo">NJM_Soft</div>
            </header>
            <div className="dashboard-content">
                <div className="main-content">
                    <h1>Dashboard</h1>
                    <p>Witaj w panelu administracyjnym.</p>
                </div>
                <Sidebar />
            </div>
        </div>
    );
}

export default Dashboard;