import Sidebar from '../../Sidebar';
import '../Page.css';

function CRM() {
    return (
        <div className="page">
            <header className="page-header">
                <div className="logo">NJM_Soft</div>
            </header>
            <div className="page-content">
                <Sidebar />
                <div className="main-content">
                    <h1>CRM</h1>
                    <p>To jest zawartość strony 2.</p>
                </div>
            </div>
        </div>
    );
}

export default CRM;