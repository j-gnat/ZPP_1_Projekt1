import Sidebar from '../../Sidebar';
import '../Page.css';

function Courses() {
    return (
        <div className="page">
            <header className="page-header">
                <div className="logo">NJM_Soft</div>
            </header>
            <div className="page-content">
                <Sidebar />
                <div className="main-content">
                    <h1>Courses</h1>
                    <p>To jest zawartość strony 4.</p>
                </div>
            </div>
        </div>
    );
}

export default Courses;