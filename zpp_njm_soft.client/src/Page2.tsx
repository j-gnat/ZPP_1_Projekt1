import Sidebar from './Sidebar';
import './Page.css';

function Page2() {
    return (
        <div className="page">
            <header className="page-header">
                <div className="logo">NJM_Soft</div>
            </header>
            <div className="page-content">
                <div className="main-content">
                    <h1>Strona 2</h1>
                    <p>To jest zawartość strony 2.</p>
                </div>
                <Sidebar />
            </div>
        </div>
    );
}

export default Page2;