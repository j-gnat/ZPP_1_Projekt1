import Sidebar from './Sidebar';
import './Page.css';

function Page3() {
    return (
        <div className="page">
            <header className="page-header">
                <div className="logo">NJM_Soft</div>
            </header>
            <div className="page-content">
                <div className="main-content">
                    <h1>Strona 3</h1>
                    <p>To jest zawartość strony 3.</p>
                </div>
                <Sidebar />
            </div>
        </div>
    );
}

export default Page3;