import Sidebar from '../../Sidebar';
import '../Page.css';

function Communication() {
    return (
        <div className="page">
            <header className="page-header">
                <div className="logo">NJM_Soft</div>
            </header>
            <div className="page-content">
                <Sidebar />
                <div className="main-content">
                    <h1>Communication</h1>
                    <p>To jest zawartość strony 3.</p>
                </div>
            </div>
        </div>
    );
}

export default Communication;