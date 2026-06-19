import { useEffect, useState } from 'react';
import Sidebar from '../../Sidebar';
import '../Page.css';
import './Courses.css'; //
import { useNavigate } from 'react-router-dom';

// Definicja typu zgodna z modelem w C#
interface Course {
    id: number;
    title: string;
    description: string;
}

function Courses() {
    const navigate = useNavigate();
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        // Pobieranie danych z Twojego API
        fetch('/api/courses')
            .then(response => response.json())
            .then(data => {
                setCourses(data);
                setLoading(false);
            })
            .catch(err => console.error("Błąd pobierania kursów:", err));
    }, []);

    return (
        <div className="page">
            <div className="page-content">
                <Sidebar />
                <div className="main-content courses-container">
                    <div className="courses-header">
                        <h1>Moje Kursy</h1>
                    </div>
                    
                    {loading ? (
                        <p>Ładowanie...</p>
                    ) : (
                        <div className="courses-grid">
                            {courses.map(course => (
                                <div key={course.id} className="course-card">
                                    <h3>{course.title}</h3>
                                    <p>{course.description}</p>
                                    <button className="course-btn" onClick={() => navigate(`/courses/${course.id}`)}>
                                        Otwórz kurs
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Courses;