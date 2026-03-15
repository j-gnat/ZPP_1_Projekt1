import Sidebar from '../../Sidebar';
import '../Page.css';

function SalesFunnel() {
    return (
        <div className="page">
            <header className="page-header">
                <div className="logo">NJM_Soft</div>
            </header>
            <div className="page-content">
                <Sidebar />
                <div className="main-content">
                    <h1>Sales Funnel</h1>
                    <p>To jest zawartość strony 1.</p>
                </div>
            </div>
        </div>
    );
}

export default SalesFunnel;