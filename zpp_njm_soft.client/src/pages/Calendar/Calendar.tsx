import Sidebar from '../../Sidebar';
import '../Page.css';

function Calendar() {
    return (
        <div className="page">
            <header className="page-header">
                <div className="logo">NJM_Soft</div>
            </header>
            <div className="page-content">
                <Sidebar />
                <div className="main-content">
                    <h1>Calendar</h1>
                    <p>This is the calendar page.</p>
                </div>
            </div>
        </div>
    );
}

export default Calendar;