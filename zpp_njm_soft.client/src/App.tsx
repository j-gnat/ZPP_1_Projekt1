import { Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';
import Login from './pages/Login/Login.tsx';
import Dashboard from './pages/Dashboard/Dashboard.tsx';
import SalesFunnel from './pages/SalesFunnel/SalesFunnel.tsx';
import CRM from './pages/CRM/CRM.tsx';
import Communication from './pages/Communication/Communication.tsx';
import Courses from './pages/Courses/Courses.tsx';
import Documents from './pages/Documents/Documents.tsx';
import Calendar from './pages/Calendar/Calendar.tsx';

function App() {
    const navigate = useNavigate();

    const handleLoginClick = () => {
        navigate('/login');
    };

    return (
        <Routes>
            <Route path="/" element={
                <div className="app">
                    <header className="header">
                        <div className="logo">NJM_Soft</div>
                        <button className="login-btn" onClick={handleLoginClick}>Login</button>
                    </header>
                    <main className="main">
                        <h1>Witamy w NJM_Soft</h1>
                        <p>Nasze usługi i funkcje</p>
                        <div className="features">
                            <div className="feature">
                                <img src="https://via.placeholder.com/300x200?text=Web+Development" alt="Web Development" />
                                <h2>Rozwój stron internetowych</h2>
                                <p>Tworzymy nowoczesne i responsywne strony internetowe.</p>
                            </div>
                            <div className="feature">
                                <img src="https://via.placeholder.com/300x200?text=Mobile+Apps" alt="Mobile Apps" />
                                <h2>Aplikacje mobilne</h2>
                                <p>Projektujemy i rozwijamy aplikacje na platformy iOS i Android.</p>
                            </div>
                            <div className="feature">
                                <img src="https://via.placeholder.com/300x200?text=Consulting" alt="Consulting" />
                                <h2>Konsulting IT</h2>
                                <p>Doradzamy w zakresie technologii i optymalizacji procesów.</p>
                            </div>
                            <div className="feature">
                                <img src="https://via.placeholder.com/300x200?text=Support" alt="Support" />
                                <h2>Wsparcie techniczne</h2>
                                <p>Zapewniamy ciągłe wsparcie i utrzymanie systemów.</p>
                            </div>
                        </div>
                    </main>
                </div>
            } />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/sales-funnel" element={<SalesFunnel />} />
            <Route path="/crm" element={<CRM />} />
            <Route path="/communication" element={<Communication />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/documents" element={<Documents />} />
            <Route path="/calendar" element={<Calendar />} />
        </Routes>
    );
}

export default App;