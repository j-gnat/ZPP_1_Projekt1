import Sidebar from '../../Sidebar';
import '../Page.css';

function Dashboard() {
    return (
        <div className="page">
            <header className="page-header">
                <div className="logo">NJM_Soft</div>
            </header>
            <div className="page-content">
                <Sidebar />
                <div className="main-content">
                    <h1>Dashboard</h1>
                    <p>Witaj w panelu administracyjnym.</p>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;