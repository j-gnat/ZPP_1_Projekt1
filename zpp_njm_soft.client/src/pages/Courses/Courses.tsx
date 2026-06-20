import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../Sidebar";
import "../Page.css";
import "../SalesFunnel/SalesFunnel.css";
import "./Courses.css";

interface Course {
    id: number;
    title: string;
    description: string;
}

type Tab = "catalog" | "my-courses" | "certificates" | "stats" | "roles";

const BADGES = [
    { id: 1, icon: "🏆", name: "Pierwszy Kurs", desc: "Ukończ swój pierwszy kurs", earned: true },
    { id: 2, icon: "🔥", name: "Seria 7 dni", desc: "Ucz się 7 dni z rzędu", earned: true },
    { id: 3, icon: "⚡", name: "Szybki Uczeń", desc: "Ukończ kurs w < 2 dni", earned: false },
    { id: 4, icon: "🎯", name: "Quiz Master", desc: "Zdobądź 100% w quizie", earned: false },
    { id: 5, icon: "📚", name: "Bibliofil", desc: "Ukończ 5 kursów", earned: false },
    { id: 6, icon: "💎", name: "Ekspert", desc: "Ukończ kurs zaawansowany", earned: false },
];

const ROLES = [
    { name: "Admin", key: "admin", icon: "👑", desc: "Pełny dostęp: tworzenie, edycja, usuwanie kursów, zarządzanie użytkownikami" },
    { name: "Instruktor", key: "instructor", icon: "🎓", desc: "Tworzenie i edycja własnych kursów, podgląd postępów uczestników" },
    { name: "Uczestnik", key: "participant", icon: "📖", desc: "Dostęp do zakupionych/przydzielonych kursów, quizy, certyfikaty" },
];

const CURRENT_ROLE = "participant";

function Courses() {
    const navigate = useNavigate();
    const [tab, setTab] = useState<Tab>("catalog");
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [accessMap] = useState<Record<number, boolean>>({ 1: true });

    useEffect(() => {
        fetch("/api/courses")
            .then(r => r.json())
            .then(data => { setCourses(data); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    const completedCount = 1;
    const totalLessons = 12;
    const completedLessons = 5;
    const quizScore = 80;

    const roleClass: Record<string, string> = {
        admin: "role-admin",
        instructor: "role-instructor",
        participant: "role-participant",
    };

    return (
        <div className="dashboard-wrapper">
            <Sidebar />
            <div className="dashboard-content">
                <div className="dashboard-header">
                    <h1>Kursy</h1>
                    <p>Platforma edukacyjna — kursy, quizy, certyfikaty i materiały.</p>
                </div>

                <div className="courses-tabs">
                    {([
                        ["catalog", "📚 Katalog"],
                        ["my-courses", "🎒 Moje kursy"],
                        ["certificates", "🏅 Certyfikaty i odznaki"],
                        ["stats", "📊 Statystyki"],
                        ["roles", "👥 Role i dostęp"],
                    ] as [Tab, string][]).map(([key, label]) => (
                        <button key={key} className={`courses-tab${tab === key ? " active" : ""}`} onClick={() => setTab(key)}>
                            {label}
                        </button>
                    ))}
                </div>

                {tab === "catalog" && (
                    <>
                        <div className="courses-header">
                            <div style={{ fontSize: 14, color: "#6b7280" }}>{courses.length} dostępnych kursów</div>
                            {(["admin", "instructor"] as const).includes(CURRENT_ROLE as any) ? (
                                <button className="course-btn" style={{ padding: "8px 16px" }}>+ Nowy kurs</button>
                            ) : null}
                        </div>

                        {loading ? <p style={{ color: "#9ca3af" }}>Ładowanie...</p> : (
                            <div className="courses-grid">
                                {courses.map(course => {
                                    const hasAccess = !!accessMap[course.id];
                                    return (
                                        <div key={course.id} className="course-card">
                                            <span className={`course-card-badge ${hasAccess ? "badge-paid" : "badge-free"}`}>
                                                {hasAccess ? "✔ Masz dostęp" : "🔒 Wymagany zakup"}
                                            </span>
                                            <h3>{course.title}</h3>
                                            <p>{course.description}</p>
                                            <div className="course-card-meta">
                                                <span>📹 Video + tekst</span>
                                                <span>📝 Quiz</span>
                                                <span>🏆 Certyfikat</span>
                                            </div>
                                            {hasAccess ? (
                                                <button className="course-btn" onClick={() => navigate(`/courses/${course.id}`)}>
                                                    Otwórz kurs →
                                                </button>
                                            ) : (
                                                <div style={{ display: "flex", gap: 8 }}>
                                                    <button className="course-btn secondary" onClick={() => navigate(`/courses/${course.id}`)}>Podgląd</button>
                                                    <button className="course-btn">Kup dostęp</button>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </>
                )}

                {tab === "my-courses" && (
                    <>
                        <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1f2937", marginBottom: 16 }}>Moje kursy</h2>
                        {courses.filter(c => !!accessMap[c.id]).length === 0 ? (
                            <div className="card">
                                <p style={{ color: "#9ca3af", fontSize: 14 }}>Nie masz jeszcze żadnych kursów. Przejdź do katalogu, aby zakupić dostęp.</p>
                                <button className="course-btn" style={{ marginTop: 12, width: "fit-content" }} onClick={() => setTab("catalog")}>
                                    Przeglądaj katalog
                                </button>
                            </div>
                        ) : (
                            <div className="courses-grid">
                                {courses.filter(c => !!accessMap[c.id]).map(course => (
                                    <div key={course.id} className="course-card">
                                        <span className="course-card-badge badge-paid">✔ Masz dostęp</span>
                                        <h3>{course.title}</h3>
                                        <p>{course.description}</p>
                                        <div className="course-progress-bar">
                                            <div className="course-progress-fill" style={{ width: "42%" }} />
                                        </div>
                                        <div className="course-progress-label">5 / 12 lekcji ukończonych (42%)</div>
                                        <button className="course-btn" onClick={() => navigate(`/courses/${course.id}`)}>
                                            Kontynuuj naukę →
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}

                {tab === "certificates" && (
                    <>
                        {completedCount > 0 && (
                            <div className="cert-card">
                                <div style={{ fontSize: 48, marginBottom: 8 }}>🎓</div>
                                <h2>Certyfikat ukończenia</h2>
                                <p>Marketing Cyfrowy — ukończono 100%</p>
                                <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
                                    <button className="course-btn" style={{ background: "white", color: "#6366f1" }}>
                                        Pobierz PDF
                                    </button>
                                    <button className="course-btn" style={{ background: "rgba(255,255,255,0.2)", color: "white", border: "1px solid rgba(255,255,255,0.4)" }}>
                                        Udostępnij
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="card">
                            <h2>🏅 Odznaki</h2>
                            <p style={{ color: "#6b7280", fontSize: 13, marginBottom: 0 }}>Zdobywaj odznaki za aktywność i osiągnięcia.</p>
                            <div className="badge-grid">
                                {BADGES.map(badge => (
                                    <div key={badge.id} className={`badge-item${badge.earned ? "" : " badge-locked"}`}>
                                        <div className="badge-icon">{badge.icon}</div>
                                        <div className="badge-name">{badge.name}</div>
                                        <div className="badge-desc">{badge.desc}</div>
                                        {badge.earned && <div style={{ marginTop: 6, fontSize: 11, color: "#059669", fontWeight: 600 }}>✔ Zdobyta</div>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}

                {tab === "stats" && (
                    <>
                        <div className="stats-row-grid">
                            <div className="mini-stat">
                                <div className="mini-stat-label">Ukończone kursy</div>
                                <div className="mini-stat-value">{completedCount}</div>
                            </div>
                            <div className="mini-stat">
                                <div className="mini-stat-label">Lekcje ukończone</div>
                                <div className="mini-stat-value">{completedLessons} / {totalLessons}</div>
                            </div>
                            <div className="mini-stat">
                                <div className="mini-stat-label">Śr. wynik quizów</div>
                                <div className="mini-stat-value">{quizScore}%</div>
                            </div>
                            <div className="mini-stat">
                                <div className="mini-stat-label">Czas nauki</div>
                                <div className="mini-stat-value">4h 20m</div>
                            </div>
                        </div>

                        <div className="card">
                            <h2>Postęp kursów</h2>
                            {courses.filter(c => !!accessMap[c.id]).map(course => (
                                <div key={course.id} style={{ marginBottom: 16 }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 14, fontWeight: 500, color: "#1f2937" }}>
                                        <span>{course.title}</span>
                                        <span style={{ color: "#6b7280" }}>42%</span>
                                    </div>
                                    <div className="course-progress-bar">
                                        <div className="course-progress-fill" style={{ width: "42%" }} />
                                    </div>
                                </div>
                            ))}
                            {courses.filter(c => !accessMap[c.id]).map(course => (
                                <div key={course.id} style={{ marginBottom: 16, opacity: 0.4 }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 14, color: "#9ca3af" }}>
                                        <span>{course.title}</span>
                                        <span>🔒 Brak dostępu</span>
                                    </div>
                                    <div className="course-progress-bar">
                                        <div className="course-progress-fill" style={{ width: "0%" }} />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="card">
                            <h2>Engagement</h2>
                            <div className="stat-row"><span>Ostatnia aktywność</span><strong>Dziś, 09:45</strong></div>
                            <div className="stat-row"><span>Seria dni nauki</span><strong>🔥 7 dni</strong></div>
                            <div className="stat-row"><span>Odznaki zdobyte</span><strong>{BADGES.filter(b => b.earned).length} / {BADGES.length}</strong></div>
                            <div className="stat-row"><span>Quizy wypełnione</span><strong>3</strong></div>
                            <div className="stat-row"><span>Materiały pobrane</span><strong>2 pliki</strong></div>
                        </div>
                    </>
                )}

                {tab === "roles" && (
                    <>
                        <div className="card">
                            <h2>Role użytkowników</h2>
                            <p style={{ color: "#6b7280", fontSize: 13 }}>
                                Twoja aktualna rola: <span className={`role-badge ${roleClass[CURRENT_ROLE]}`}>
                                    {ROLES.find(r => r.key === CURRENT_ROLE)?.icon} {ROLES.find(r => r.key === CURRENT_ROLE)?.name}
                                </span>
                            </p>
                            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 16 }}>
                                {ROLES.map(role => (
                                    <div key={role.key} className="access-row" style={{ border: CURRENT_ROLE === role.key ? "2px solid #6366f1" : undefined }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                            <span className="access-icon">{role.icon}</span>
                                            <div>
                                                <div style={{ fontWeight: 600, fontSize: 14, color: "#1f2937" }}>{role.name}</div>
                                                <div style={{ fontSize: 12, color: "#6b7280" }}>{role.desc}</div>
                                            </div>
                                        </div>
                                        <span className={`role-badge ${roleClass[role.key]}`}>{role.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="card">
                            <h2>Dostęp do kursów</h2>
                            <p style={{ color: "#6b7280", fontSize: 13, marginBottom: 12 }}>Dostęp można uzyskać przez zakup lub podpisanie dokumentu.</p>
                            {courses.map(course => {
                                const hasAccess = !!accessMap[course.id];
                                return (
                                    <div key={course.id} className="access-row">
                                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                            <span className="access-icon">{hasAccess ? "✅" : "🔒"}</span>
                                            <div>
                                                <div style={{ fontWeight: 500, fontSize: 14 }}>{course.title}</div>
                                                <div style={{ fontSize: 12, color: "#6b7280" }}>
                                                    {hasAccess ? "Dostęp aktywny (zakup)" : "Brak dostępu — kup lub podpisz dokument"}
                                                </div>
                                            </div>
                                        </div>
                                        {!hasAccess && (
                                            <div style={{ display: "flex", gap: 6 }}>
                                                <button className="course-btn" style={{ padding: "6px 12px", fontSize: 12 }}>Kup</button>
                                                <button className="course-btn secondary" style={{ padding: "6px 12px", fontSize: 12 }}>Dokument</button>
                                            </div>
                                        )}
                                        {hasAccess && <span style={{ fontSize: 12, color: "#059669", fontWeight: 600 }}>Aktywny</span>}
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default Courses;