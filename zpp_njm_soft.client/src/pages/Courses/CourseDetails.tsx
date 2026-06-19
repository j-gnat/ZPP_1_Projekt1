import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from '../../Sidebar';
import '../Page.css';
import './Courses.css';

interface Lesson {
    id: number;
    title: string;
    videoUrl: string;
}

interface Module {
    id: number;
    name: string;
    lessons: Lesson[];
}

interface Course {
    id: number;
    title: string;
    description: string;
    modules: Module[];
}

function CourseDetails() {
    const { courseId } = useParams<{ courseId: string }>();
    const navigate = useNavigate();
    
    const [course, setCourse] = useState<Course | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedVideoUrl, setSelectedVideoUrl] = useState<string>('');

    useEffect(() => {
        fetch(`/api/courses/${courseId}`)
            .then(res => {
            if (!res.ok) {
                throw new Error('Course not found');
            }
            return res.json();
        })
        .then(data => {
            setCourse(data);
            if (data.modules?.length > 0 && data.modules[0].lessons?.length > 0) {
                setSelectedVideoUrl(data.modules[0].lessons[0].videoUrl);
            }
            setLoading(false);
        })
        .catch(err => {
            console.error("Błąd ładowania:", err);
            setCourse(null);
            setLoading(false);
        });
}, [courseId]);

    if (loading) {
        return (
            <div className="page">
                <div className="page-content">
                    <Sidebar />
                    <div className="main-content">Ładowanie szczegółów kursu...</div>
                </div>
            </div>
        );
    }

    if (!course) {
        return (
            <div className="page">
                <div className="page-content">
                    <Sidebar />
                    <div className="main-content" style={{ padding: '40px', textAlign: 'center' }}>
                        <h1 style={{ color: '#374151' }}>Kurs jest niedostępny</h1>
                        <p style={{ color: '#6b7280', marginBottom: '24px' }}>
                            Wybrany kurs nie istnieje lub został usunięty. 
                            Przejdź do listy wszystkich dostępnych kursów.
                        </p>
                        <button 
                            className="course-btn" 
                            onClick={() => navigate('/courses')}
                        >
                            Przeglądaj ofertę kursów
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="page">
            <div className="page-content">
                <Sidebar />
                <div className="main-content">
                    <button className="back-btn" onClick={() => navigate('/courses')}>← Powrót do listy kursów</button>
                    <h1 className="course-title">{course.title}</h1>

                    {/* Nowy kontener z układem Flex */}
                    <div className="learning-container">
                        {/* Lewa strona: Lista modułów */}
                        <div className="modules-list">
                            {course.modules.map(module => (
                                <details key={module.id} className="module-card">
                                    <summary>{module.name}</summary>
                                    <ul>
                                        {module.lessons.map(lesson => (
                                            <li key={lesson.id} onClick={() => setSelectedVideoUrl(lesson.videoUrl)}>
                                                {lesson.title}
                                            </li>
                                        ))}
                                    </ul>
                                </details>
                            ))}
                        </div>

                        {/* Prawa strona: Odtwarzacz wideo */}
                        <div className="video-player-wrapper">
                            <div className="video-placeholder">
                                {selectedVideoUrl ? `Odtwarzanie: ${selectedVideoUrl}` : "Wybierz lekcję"}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CourseDetails;