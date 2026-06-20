import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../../Sidebar";
import "../Page.css";
import "./Courses.css";

interface QuizQuestion {
    id: number;
    question: string;
    options: string[];
    correct: number;
}

interface Material {
    id: number;
    name: string;
    type: "pdf" | "video" | "link" | "file";
    url: string;
}

interface Lesson {
    id: number;
    title: string;
    videoUrl: string;
    content?: string;
    quiz?: QuizQuestion[];
    materials?: Material[];
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

const SAMPLE_QUIZ: QuizQuestion[] = [
    {
        id: 1,
        question: "Co to jest marketing cyfrowy?",
        options: [
            "Sprzedaż produktów fizycznych w sklepie",
            "Promocja produktów i usług za pomocą kanałów cyfrowych",
            "Projektowanie stron internetowych",
            "Zarządzanie bazą danych",
        ],
        correct: 1,
    },
    {
        id: 2,
        question: "Który kanał NIE jest częścią marketingu cyfrowego?",
        options: ["Social media", "Email marketing", "Billboardy uliczne", "SEO"],
        correct: 2,
    },
];

const SAMPLE_MATERIALS: Material[] = [
    { id: 1, name: "Wprowadzenie do marketingu — PDF", type: "pdf", url: "#" },
    { id: 2, name: "Szablon lejka sprzedażowego", type: "file", url: "#" },
    { id: 3, name: "Dodatkowe zasoby online", type: "link", url: "https://example.com" },
];

const TYPE_ICON: Record<string, string> = {
    pdf: "📄",
    file: "📁",
    video: "🎬",
    link: "🔗",
};

function CourseDetails() {
    const { courseId } = useParams<{ courseId: string }>();
    const navigate = useNavigate();

    const [course, setCourse] = useState<Course | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
    const [completedLessons, setCompletedLessons] = useState<Set<number>>(new Set());
    const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
    const [quizSubmitted, setQuizSubmitted] = useState(false);
    const [activeTab, setActiveTab] = useState<"video" | "quiz" | "materials">("video");

    useEffect(() => {
        fetch(`/api/courses/${courseId}`)
            .then(res => {
                if (!res.ok) throw new Error("Not found");
                return res.json();
            })
            .then((data: Course) => {
                setCourse(data);
                if (data.modules?.length > 0 && data.modules[0].lessons?.length > 0) {
                    const first = data.modules[0].lessons[0];
                    setActiveLesson({ ...first, quiz: SAMPLE_QUIZ, materials: SAMPLE_MATERIALS });
                }
                setLoading(false);
            })
            .catch(() => {
                setCourse(null);
                setLoading(false);
            });
    }, [courseId]);

    const totalLessons = course?.modules.reduce((a, m) => a + m.lessons.length, 0) ?? 0;
    const progress = totalLessons > 0 ? Math.round((completedLessons.size / totalLessons) * 100) : 0;

    const markComplete = (lessonId: number) => {
        setCompletedLessons(prev => new Set([...prev, lessonId]));
    };

    const selectLesson = (lesson: Lesson) => {
        setActiveLesson({ ...lesson, quiz: SAMPLE_QUIZ, materials: SAMPLE_MATERIALS });
        setQuizAnswers({});
        setQuizSubmitted(false);
        setActiveTab("video");
    };

    const submitQuiz = () => setQuizSubmitted(true);

    const quizScore = () => {
        if (!activeLesson?.quiz) return 0;
        const correct = activeLesson.quiz.filter(q => quizAnswers[q.id] === q.correct).length;
        return Math.round((correct / activeLesson.quiz.length) * 100);
    };

    if (loading) {
        return (
            <div className="dashboard-wrapper">
                <Sidebar />
                <div className="dashboard-content"><p style={{ color: "#9ca3af" }}>Ładowanie kursu...</p></div>
            </div>
        );
    }

    if (!course) {
        return (
            <div className="dashboard-wrapper">
                <Sidebar />
                <div className="dashboard-content" style={{ textAlign: "center", paddingTop: 60 }}>
                    <h1 style={{ color: "#374151" }}>Kurs niedostępny</h1>
                    <p style={{ color: "#6b7280", marginBottom: 24 }}>Wybrany kurs nie istnieje lub nie masz do niego dostępu.</p>
                    <button className="course-btn" onClick={() => navigate("/courses")}>Wróć do listy kursów</button>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-wrapper">
            <Sidebar />
            <div className="dashboard-content">
                <button className="back-btn" onClick={() => navigate("/courses")}>← Powrót do kursów</button>
                <h1 className="course-title">{course.title}</h1>
                <p className="course-subtitle">{course.description}</p>

                <div style={{ marginBottom: 16 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#6b7280", marginBottom: 6 }}>
                        <span>Postęp kursu</span>
                        <span>{completedLessons.size} / {totalLessons} lekcji ({progress}%)</span>
                    </div>
                    <div className="course-progress-bar" style={{ height: 8 }}>
                        <div className="course-progress-fill" style={{ width: `${progress}%` }} />
                    </div>
                </div>

                {progress === 100 && (
                    <div className="cert-card" style={{ marginBottom: 20, padding: "20px 24px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                            <div style={{ fontSize: 40 }}>🎓</div>
                            <div style={{ textAlign: "left" }}>
                                <div style={{ fontWeight: 700, fontSize: 18 }}>Kurs ukończony!</div>
                                <div style={{ opacity: 0.85, fontSize: 13 }}>Twój certyfikat jest gotowy do pobrania.</div>
                            </div>
                            <button className="course-btn" style={{ marginLeft: "auto", background: "white", color: "#6366f1" }}>
                                Pobierz certyfikat
                            </button>
                        </div>
                    </div>
                )}

                <div className="learning-container">
                    <div className="modules-list">
                        {course.modules.map(module => (
                            <details key={module.id} className="module-card" open>
                                <summary>{module.name}</summary>
                                <ul>
                                    {module.lessons.map(lesson => {
                                        const done = completedLessons.has(lesson.id);
                                        const isActive = activeLesson?.id === lesson.id;
                                        return (
                                            <li key={lesson.id}
                                                className={`${done ? "lesson-completed" : ""}${isActive ? " lesson-active" : ""}`}
                                                onClick={() => selectLesson(lesson)}>
                                                <span className={`lesson-check${done ? " done" : isActive ? " active" : ""}`}>
                                                    {done ? "✓" : ""}
                                                </span>
                                                {lesson.title}
                                            </li>
                                        );
                                    })}
                                </ul>
                            </details>
                        ))}
                    </div>

                    <div className="video-player-wrapper">
                        {activeLesson ? (
                            <>
                                <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                                    {(["video", "quiz", "materials"] as const).map(t => (
                                        <button key={t}
                                            style={{
                                                padding: "6px 14px", borderRadius: 8, fontSize: 13, cursor: "pointer",
                                                border: "1px solid #d1d5db",
                                                background: activeTab === t ? "#6366f1" : "#f9fafb",
                                                color: activeTab === t ? "white" : "#374151",
                                            }}
                                            onClick={() => setActiveTab(t)}>
                                            {t === "video" ? "🎬 Lekcja" : t === "quiz" ? "📝 Quiz" : "📎 Materiały"}
                                        </button>
                                    ))}
                                </div>

                                {activeTab === "video" && (
                                    <>
                                        <div className="video-placeholder">
                                            <div style={{ fontSize: 48 }}>▶️</div>
                                            <div>{activeLesson.title}</div>
                                            <div style={{ fontSize: 12, opacity: 0.6 }}>{activeLesson.videoUrl}</div>
                                        </div>
                                        <div className="lesson-content-area">
                                            <h3>{activeLesson.title}</h3>
                                            <p>{activeLesson.content || "Treść tej lekcji zawiera wprowadzenie do tematu. Obejrzyj wideo powyżej, a następnie przejdź do quizu, aby sprawdzić zrozumienie materiału."}</p>
                                            {!completedLessons.has(activeLesson.id) && (
                                                <button className="course-btn" onClick={() => markComplete(activeLesson.id)}>
                                                    ✔ Oznacz jako ukończoną
                                                </button>
                                            )}
                                            {completedLessons.has(activeLesson.id) && (
                                                <span style={{ color: "#059669", fontSize: 14, fontWeight: 600 }}>✔ Lekcja ukończona</span>
                                            )}
                                        </div>
                                    </>
                                )}

                                {activeTab === "quiz" && (
                                    <div>
                                        {activeLesson.quiz?.map(q => (
                                            <div key={q.id} className="quiz-card">
                                                <h3>{q.question}</h3>
                                                {q.options.map((opt, idx) => {
                                                    let cls = "quiz-option";
                                                    if (quizAnswers[q.id] === idx) cls += " selected";
                                                    if (quizSubmitted) {
                                                        if (idx === q.correct) cls = "quiz-option correct";
                                                        else if (quizAnswers[q.id] === idx) cls = "quiz-option incorrect";
                                                    }
                                                    return (
                                                        <div key={idx} className={cls}
                                                            onClick={() => !quizSubmitted && setQuizAnswers(a => ({ ...a, [q.id]: idx }))}>
                                                            <span style={{ fontWeight: 600, minWidth: 20 }}>{String.fromCharCode(65 + idx)}.</span>
                                                            {opt}
                                                        </div>
                                                    );
                                                })}
                                                {quizSubmitted && (
                                                    <div className={`quiz-result ${quizAnswers[q.id] === q.correct ? "correct" : "incorrect"}`}>
                                                        {quizAnswers[q.id] === q.correct ? "✔ Poprawna odpowiedź!" : `✗ Poprawna odpowiedź: ${q.options[q.correct]}`}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                        {!quizSubmitted ? (
                                            <button className="course-btn" onClick={submitQuiz}
                                                style={{ opacity: Object.keys(quizAnswers).length < (activeLesson.quiz?.length ?? 0) ? 0.5 : 1 }}>
                                                Zatwierdź odpowiedzi
                                            </button>
                                        ) : (
                                            <div style={{ padding: "16px 20px", background: quizScore() >= 50 ? "#d1fae5" : "#fee2e2", borderRadius: 10, fontSize: 15, fontWeight: 600, color: quizScore() >= 50 ? "#065f46" : "#991b1b" }}>
                                                Wynik: {quizScore()}% — {quizScore() >= 50 ? "🎉 Zaliczone!" : "❌ Spróbuj ponownie"}
                                                <button className="course-btn secondary" style={{ marginLeft: 12, padding: "6px 14px", fontSize: 13 }}
                                                    onClick={() => { setQuizAnswers({}); setQuizSubmitted(false); }}>
                                                    Powtórz quiz
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {activeTab === "materials" && (
                                    <div>
                                        <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1f2937", marginBottom: 12 }}>Materiały dodatkowe</h3>
                                        {SAMPLE_MATERIALS.map(mat => (
                                            <a key={mat.id} href={mat.url} target="_blank" rel="noopener noreferrer"
                                                className="material-item" style={{ textDecoration: "none", color: "#374151" }}>
                                                <span className="material-icon">{TYPE_ICON[mat.type]}</span>
                                                <span style={{ flex: 1 }}>{mat.name}</span>
                                                <span style={{ fontSize: 12, color: "#6366f1" }}>Pobierz →</span>
                                            </a>
                                        ))}
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="video-placeholder">
                                <div style={{ fontSize: 36 }}>📚</div>
                                <div>Wybierz lekcję z listy po lewej</div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CourseDetails;