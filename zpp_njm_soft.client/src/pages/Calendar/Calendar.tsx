import { useState } from "react";
import Sidebar from "../../Sidebar";
import "../Page.css";
import "../SalesFunnel/SalesFunnel.css";
import "./Calendar.css";

type CalendarView = "month" | "week" | "day";
type EventType = "meeting" | "call" | "task" | "blocked";
type VideoProvider = "zoom" | "teams" | "meet" | "none";

type CalendarEvent = {
    id: string;
    title: string;
    date: string;
    startTime: string;
    endTime: string;
    type: EventType;
    description: string;
    attendees: string[];
    videoProvider: VideoProvider;
    videoLink: string;
    timezone: string;
    isBlocked: boolean;
    teamMember: string;
    qualifyingAnswers: Record<string, string>;
};

type QualifyingQuestion = {
    id: string;
    question: string;
    required: boolean;
};

type Integration = {
    id: string;
    name: string;
    icon: string;
    desc: string;
    category: "calendar" | "video" | "social" | "notification";
    connected: boolean;
    connectUrl: string;
    profileUrl?: string;
};

const TIMEZONES = [
    "Europe/Warsaw",
    "Europe/London",
    "America/New_York",
    "America/Chicago",
    "America/Los_Angeles",
    "Asia/Tokyo",
    "Asia/Dubai",
    "Australia/Sydney",
];

const TEAM_MEMBERS = ["Jan Kowalski", "Anna Nowak", "Piotr Wiśniewski", "Katarzyna Dąbrowska"];

const VIDEO_PROVIDERS: { value: VideoProvider; label: string; icon: string }[] = [
    { value: "zoom", label: "Zoom", icon: "📹" },
    { value: "teams", label: "Microsoft Teams", icon: "💼" },
    { value: "meet", label: "Google Meet", icon: "🎥" },
    { value: "none", label: "Brak", icon: "❌" },
];

const DEFAULT_QUALIFYING_QUESTIONS: QualifyingQuestion[] = [
    { id: "1", question: "Jaki jest Twój budżet?", required: true },
    { id: "2", question: "Kiedy planujesz wdrożenie?", required: false },
    { id: "3", question: "Ile osób liczy Twój zespół?", required: false },
];

const INITIAL_INTEGRATIONS: Integration[] = [
    {
        id: "google_cal",
        name: "Google Calendar",
        icon: "📅",
        desc: "Synchronizacja dwukierunkowa z Google Calendar",
        category: "calendar",
        connected: false,
        connectUrl: "https://calendar.google.com",
    },
    {
        id: "outlook",
        name: "Microsoft Outlook",
        icon: "💼",
        desc: "Synchronizacja Exchange / Office 365",
        category: "calendar",
        connected: false,
        connectUrl: "https://outlook.office.com",
    },
    {
        id: "zoom",
        name: "Zoom",
        icon: "📹",
        desc: "Automatyczne tworzenie linków do spotkań Zoom",
        category: "video",
        connected: false,
        connectUrl: "https://zoom.us/signin",
    },
    {
        id: "teams",
        name: "Microsoft Teams",
        icon: "🟦",
        desc: "Generuj linki Teams przy każdej rezerwacji",
        category: "video",
        connected: false,
        connectUrl: "https://teams.microsoft.com",
    },
    {
        id: "meet",
        name: "Google Meet",
        icon: "🎥",
        desc: "Automatyczne linki Google Meet do wydarzeń",
        category: "video",
        connected: false,
        connectUrl: "https://meet.google.com",
    },
    {
        id: "linkedin",
        name: "LinkedIn",
        icon: "🔗",
        desc: "Połącz profil LinkedIn — wyświetlany przy spotkaniach",
        category: "social",
        connected: false,
        connectUrl: "https://www.linkedin.com/login",
        profileUrl: "https://www.linkedin.com/feed/",
    },
    {
        id: "facebook",
        name: "Facebook",
        icon: "📘",
        desc: "Udostępniaj dostępność przez stronę Facebook",
        category: "social",
        connected: false,
        connectUrl: "https://www.facebook.com/login",
        profileUrl: "https://www.facebook.com",
    },
    {
        id: "instagram",
        name: "Instagram",
        icon: "📷",
        desc: "Link do rezerwacji w bio Instagram",
        category: "social",
        connected: false,
        connectUrl: "https://www.instagram.com/accounts/login",
        profileUrl: "https://www.instagram.com",
    },
    {
        id: "email_notif",
        name: "Powiadomienia Email",
        icon: "📧",
        desc: "Wysyłaj potwierdzenia i przypomnienia email",
        category: "notification",
        connected: true,
        connectUrl: "#",
    },
    {
        id: "sms_notif",
        name: "Powiadomienia SMS",
        icon: "📱",
        desc: "Przypomnienia SMS przed spotkaniem",
        category: "notification",
        connected: false,
        connectUrl: "#",
    },
];

const DAYS_PL = ["Pn", "Wt", "Śr", "Cz", "Pt", "So", "Nd"];
const MONTHS_PL = ["Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec", "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"];

const typeColors: Record<EventType, string> = {
    meeting: "#6366f1",
    call: "#059669",
    task: "#f59e0b",
    blocked: "#dc2626",
};

const typeLabels: Record<EventType, string> = {
    meeting: "Spotkanie",
    call: "Telefon",
    task: "Zadanie",
    blocked: "Zablokowane",
};

const initialEvents: CalendarEvent[] = [
    {
        id: "1",
        title: "Prezentacja produktu",
        date: new Date().toISOString().slice(0, 10),
        startTime: "10:00",
        endTime: "11:00",
        type: "meeting",
        description: "Demo dla klienta VIP — omówienie funkcji platformy",
        attendees: ["jan@example.com", "anna@example.com"],
        videoProvider: "zoom",
        videoLink: "https://zoom.us/j/123456789",
        timezone: "Europe/Warsaw",
        isBlocked: false,
        teamMember: "Jan Kowalski",
        qualifyingAnswers: {},
    },
    {
        id: "2",
        title: "Rozmowa kwalifikacyjna",
        date: new Date().toISOString().slice(0, 10),
        startTime: "14:00",
        endTime: "14:30",
        type: "call",
        description: "Wstępna kwalifikacja leada z kampanii Facebook",
        attendees: ["piotr@example.com"],
        videoProvider: "meet",
        videoLink: "https://meet.google.com/abc-def-ghi",
        timezone: "Europe/Warsaw",
        isBlocked: false,
        teamMember: "Anna Nowak",
        qualifyingAnswers: { "1": "50 000 PLN", "2": "Q3 2026" },
    },
];

function getDaysInMonth(year: number, month: number) {
    return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
    const d = new Date(year, month, 1).getDay();
    return d === 0 ? 6 : d - 1;
}

function formatDate(year: number, month: number, day: number) {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function generateVideoLink(provider: VideoProvider): string {
    if (provider === "zoom") return `https://zoom.us/j/${Math.floor(Math.random() * 9000000000) + 1000000000}`;
    if (provider === "teams") return `https://teams.microsoft.com/l/meetup-join/19%3A${Math.random().toString(36).slice(2)}`;
    if (provider === "meet") {
        const chars = "abcdefghijklmnopqrstuvwxyz";
        const seg = () => Array.from({ length: 3 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
        return `https://meet.google.com/${seg()}-${seg()}-${seg()}`;
    }
    return "";
}

function Calendar() {
    const today = new Date();
    const [view, setView] = useState<CalendarView>("month");
    const [currentYear, setCurrentYear] = useState(today.getFullYear());
    const [currentMonth, setCurrentMonth] = useState(today.getMonth());
    const [events, setEvents] = useState<CalendarEvent[]>(initialEvents);
    const [selectedDate, setSelectedDate] = useState<string>(today.toISOString().slice(0, 10));
    const [showAddEvent, setShowAddEvent] = useState(false);
    const [showEventDetail, setShowEventDetail] = useState<CalendarEvent | null>(null);
    const [activeTab, setActiveTab] = useState<"calendar" | "team" | "availability" | "integrations" | "booking">("calendar");
    const [qualifyingQuestions, setQualifyingQuestions] = useState<QualifyingQuestion[]>(DEFAULT_QUALIFYING_QUESTIONS);
    const [blockedSlots, setBlockedSlots] = useState<{ date: string; time: string }[]>([]);
    const [userTimezone, setUserTimezone] = useState("Europe/Warsaw");
    const [integrations, setIntegrations] = useState<Integration[]>(INITIAL_INTEGRATIONS);
    const [savedNotif, setSavedNotif] = useState(false);

    const [form, setForm] = useState<Partial<CalendarEvent>>({
        title: "",
        date: selectedDate,
        startTime: "09:00",
        endTime: "10:00",
        type: "meeting",
        description: "",
        attendees: [],
        videoProvider: "none",
        videoLink: "",
        timezone: userTimezone,
        isBlocked: false,
        teamMember: TEAM_MEMBERS[0],
        qualifyingAnswers: {},
    });

    const [newAttendee, setNewAttendee] = useState("");
    const [bookingForm, setBookingForm] = useState<Record<string, string>>({});
    const [bookingStep, setBookingStep] = useState(1);
    const [bookingDate, setBookingDate] = useState("");
    const [bookingTime, setBookingTime] = useState("");
    const [bookingConfirmed, setBookingConfirmed] = useState(false);
    const [newQQuestion, setNewQQuestion] = useState("");
    const [blockDate, setBlockDate] = useState("");
    const [blockTime, setBlockTime] = useState("09:00");

    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

    const prevMonth = () => {
        if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1); }
        else setCurrentMonth(m => m - 1);
    };

    const nextMonth = () => {
        if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1); }
        else setCurrentMonth(m => m + 1);
    };

    const handleVideoProviderChange = (provider: VideoProvider) => {
        const link = provider !== "none" ? generateVideoLink(provider) : "";
        setForm(f => ({ ...f, videoProvider: provider, videoLink: link }));
    };

    const addEvent = () => {
        if (!form.title || !form.date) return;
        const event: CalendarEvent = {
            id: Date.now().toString(),
            title: form.title || "",
            date: form.date || selectedDate,
            startTime: form.startTime || "09:00",
            endTime: form.endTime || "10:00",
            type: form.type || "meeting",
            description: form.description || "",
            attendees: form.attendees || [],
            videoProvider: form.videoProvider || "none",
            videoLink: form.videoLink || "",
            timezone: form.timezone || userTimezone,
            isBlocked: form.isBlocked || false,
            teamMember: form.teamMember || TEAM_MEMBERS[0],
            qualifyingAnswers: form.qualifyingAnswers || {},
        };
        setEvents(prev => [...prev, event]);
        setShowAddEvent(false);
        setForm({ title: "", date: selectedDate, startTime: "09:00", endTime: "10:00", type: "meeting", description: "", attendees: [], videoProvider: "none", videoLink: "", timezone: userTimezone, isBlocked: false, teamMember: TEAM_MEMBERS[0], qualifyingAnswers: {} });
    };

    const removeEvent = (id: string) => {
        setEvents(prev => prev.filter(e => e.id !== id));
        setShowEventDetail(null);
    };

    const getEventsForDate = (date: string) => events.filter(e => e.date === date);

    const addBlockedSlot = () => {
        if (!blockDate || !blockTime) return;
        setBlockedSlots(prev => [...prev, { date: blockDate, time: blockTime }]);
        setBlockDate("");
        setBlockTime("09:00");
    };

    const isSlotBlocked = (date: string, time: string) => blockedSlots.some(s => s.date === date && s.time === time);

    const addQuestion = () => {
        if (!newQQuestion.trim()) return;
        setQualifyingQuestions(prev => [...prev, { id: Date.now().toString(), question: newQQuestion, required: false }]);
        setNewQQuestion("");
    };

    const removeQuestion = (id: string) => setQualifyingQuestions(prev => prev.filter(q => q.id !== id));

    const toggleIntegration = (id: string) => {
        setIntegrations(prev => prev.map(i => i.id === id ? { ...i, connected: !i.connected } : i));
    };

    const openIntegration = (integration: Integration) => {
        if (integration.id === "email_notif" || integration.id === "sms_notif") {
            toggleIntegration(integration.id);
            return;
        }
        window.open(integration.connectUrl, "_blank", "noopener,noreferrer");
        setTimeout(() => toggleIntegration(integration.id), 500);
    };

    const confirmBooking = () => {
        if (!bookingDate || !bookingTime) return;
        if (isSlotBlocked(bookingDate, bookingTime)) { alert("Ten termin jest niedostępny."); return; }
        const videoIntegration = integrations.find(i => i.category === "video" && i.connected);
        const provider = videoIntegration ? (videoIntegration.id as VideoProvider) : "none";
        const link = provider !== "none" ? generateVideoLink(provider) : "";
        const event: CalendarEvent = {
            id: Date.now().toString(),
            title: "Rezerwacja (lejek)",
            date: bookingDate,
            startTime: bookingTime,
            endTime: bookingTime.replace(/^(\d+):/, (_, h) => `${parseInt(h) + 1}:`),
            type: "meeting",
            description: "Booking z landing page",
            attendees: [],
            videoProvider: provider,
            videoLink: link,
            timezone: userTimezone,
            isBlocked: false,
            teamMember: TEAM_MEMBERS[0],
            qualifyingAnswers: bookingForm,
        };
        setEvents(prev => [...prev, event]);
        setBookingConfirmed(true);
    };

    const saveSettings = () => {
        setSavedNotif(true);
        setTimeout(() => setSavedNotif(false), 2000);
    };

    const renderMonthGrid = () => {
        const cells = [];
        for (let i = 0; i < firstDay; i++) {
            cells.push(<div key={`empty-${i}`} className="cal-day cal-day-empty" />);
        }
        for (let d = 1; d <= daysInMonth; d++) {
            const dateStr = formatDate(currentYear, currentMonth, d);
            const dayEvents = getEventsForDate(dateStr);
            const isToday = dateStr === today.toISOString().slice(0, 10);
            const isSelected = dateStr === selectedDate;
            cells.push(
                <div key={d} className={`cal-day${isToday ? " cal-today" : ""}${isSelected ? " cal-selected" : ""}`}
                    onClick={() => { setSelectedDate(dateStr); setForm(f => ({ ...f, date: dateStr })); }}>
                    <span className="cal-day-num">{d}</span>
                    <div className="cal-day-events">
                        {dayEvents.slice(0, 3).map(ev => (
                            <div key={ev.id} className="cal-event-dot"
                                style={{ background: typeColors[ev.type] }}
                                onClick={e => { e.stopPropagation(); setShowEventDetail(ev); }}>
                                {ev.startTime} {ev.title}
                            </div>
                        ))}
                        {dayEvents.length > 3 && <div className="cal-more">+{dayEvents.length - 3} więcej</div>}
                    </div>
                </div>
            );
        }
        return cells;
    };

    const renderDayList = () => {
        const dayEvents = getEventsForDate(selectedDate);
        const hours = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, "0")}:00`);
        return (
            <div className="cal-day-view">
                {hours.map(hour => {
                    const ev = dayEvents.filter(e => e.startTime.startsWith(hour.slice(0, 2)));
                    const blocked = isSlotBlocked(selectedDate, hour);
                    return (
                        <div key={hour} className={`cal-hour-row${blocked ? " cal-hour-blocked" : ""}`}>
                            <span className="cal-hour-label">{hour}</span>
                            <div className="cal-hour-content">
                                {blocked && <span className="cal-blocked-badge">🚫 Zablokowane</span>}
                                {ev.map(e => (
                                    <div key={e.id} className="cal-hour-event" style={{ borderLeft: `3px solid ${typeColors[e.type]}` }}
                                        onClick={() => setShowEventDetail(e)}>
                                        <strong>{e.title}</strong>
                                        <span>{e.startTime}–{e.endTime}</span>
                                        {e.videoProvider !== "none" && (
                                            <span className="cal-video-badge">
                                                {VIDEO_PROVIDERS.find(p => p.value === e.videoProvider)?.icon} {e.videoProvider}
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    const integrationCategories: { key: Integration["category"]; label: string }[] = [
        { key: "calendar", label: "📅 Kalendarze" },
        { key: "video", label: "🎥 Wideokonferencje" },
        { key: "social", label: "🌐 Media społecznościowe" },
        { key: "notification", label: "🔔 Powiadomienia" },
    ];

    return (
        <div className="dashboard-wrapper">
            <Sidebar />
            <div className="dashboard-content">
                <div className="dashboard-header">
                    <h1>Kalendarz</h1>
                    <p>Zarządzaj spotkaniami, dostępnością i rezerwacjami.</p>
                </div>

                <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
                    {(["calendar", "team", "availability", "integrations", "booking"] as const).map(t => (
                        <button key={t} onClick={() => setActiveTab(t)}
                            style={{ padding: "8px 18px", borderRadius: 8, border: "1px solid #d1d5db", fontSize: 14, cursor: "pointer",
                                background: activeTab === t ? "#6366f1" : "#f9fafb", color: activeTab === t ? "white" : "#374151" }}>
                            {t === "calendar" ? "📅 Kalendarz" : t === "team" ? "👥 Zespół" : t === "availability" ? "🕐 Dostępność" : t === "integrations" ? "🔗 Integracje" : "🔖 Booking"}
                        </button>
                    ))}
                </div>

                {activeTab === "calendar" && (
                    <>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
                            <div style={{ display: "flex", gap: 6 }}>
                                {(["month", "week", "day"] as CalendarView[]).map(v => (
                                    <button key={v} onClick={() => setView(v)}
                                        style={{ padding: "6px 14px", borderRadius: 6, border: "1px solid #d1d5db", fontSize: 13, cursor: "pointer",
                                            background: view === v ? "#6366f1" : "#f9fafb", color: view === v ? "white" : "#374151" }}>
                                        {v === "month" ? "Miesiąc" : v === "week" ? "Tydzień" : "Dzień"}
                                    </button>
                                ))}
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                <button onClick={prevMonth} style={{ padding: "6px 12px", borderRadius: 6, border: "1px solid #d1d5db", background: "#f9fafb", cursor: "pointer" }}>‹</button>
                                <strong style={{ fontSize: 16 }}>{MONTHS_PL[currentMonth]} {currentYear}</strong>
                                <button onClick={nextMonth} style={{ padding: "6px 12px", borderRadius: 6, border: "1px solid #d1d5db", background: "#f9fafb", cursor: "pointer" }}>›</button>
                            </div>
                            <div style={{ display: "flex", gap: 8 }}>
                                <select value={userTimezone} onChange={e => setUserTimezone(e.target.value)}
                                    style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid #d1d5db", fontSize: 13 }}>
                                    {TIMEZONES.map(tz => <option key={tz} value={tz}>{tz}</option>)}
                                </select>
                                <button className="btn-primary-modern" onClick={() => { setShowAddEvent(v => !v); setForm(f => ({ ...f, date: selectedDate })); }}>
                                    {showAddEvent ? "Anuluj" : "+ Dodaj wydarzenie"}
                                </button>
                            </div>
                        </div>

                        {showAddEvent && (
                            <div className="card" style={{ marginBottom: 20 }}>
                                <h2>Nowe wydarzenie</h2>
                                <div className="cal-form-grid">
                                    <input placeholder="Tytuł *" value={form.title || ""} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
                                    <input type="date" value={form.date || ""} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
                                    <input type="time" value={form.startTime || ""} onChange={e => setForm(f => ({ ...f, startTime: e.target.value }))} />
                                    <input type="time" value={form.endTime || ""} onChange={e => setForm(f => ({ ...f, endTime: e.target.value }))} />
                                    <select value={form.type || "meeting"} onChange={e => setForm(f => ({ ...f, type: e.target.value as EventType }))}>
                                        {(Object.keys(typeLabels) as EventType[]).map(t => <option key={t} value={t}>{typeLabels[t]}</option>)}
                                    </select>
                                    <select value={form.teamMember || ""} onChange={e => setForm(f => ({ ...f, teamMember: e.target.value }))}>
                                        {TEAM_MEMBERS.map(m => <option key={m} value={m}>{m}</option>)}
                                    </select>
                                    <select value={form.videoProvider || "none"} onChange={e => handleVideoProviderChange(e.target.value as VideoProvider)}>
                                        {VIDEO_PROVIDERS.map(p => <option key={p.value} value={p.value}>{p.icon} {p.label}</option>)}
                                    </select>
                                    <select value={form.timezone || userTimezone} onChange={e => setForm(f => ({ ...f, timezone: e.target.value }))}>
                                        {TIMEZONES.map(tz => <option key={tz} value={tz}>{tz}</option>)}
                                    </select>
                                    {form.videoProvider !== "none" && (
                                        <div style={{ gridColumn: "1/-1", display: "flex", gap: 8, alignItems: "center" }}>
                                            <input value={form.videoLink || ""} onChange={e => setForm(f => ({ ...f, videoLink: e.target.value }))}
                                                placeholder="Link do spotkania (auto-generowany)" style={{ flex: 1 }} />
                                            <a href={form.videoLink || "#"} target="_blank" rel="noopener noreferrer"
                                                style={{ padding: "8px 14px", background: "#6366f1", color: "white", borderRadius: 8, fontSize: 13, textDecoration: "none", whiteSpace: "nowrap" }}>
                                                Dołącz →
                                            </a>
                                        </div>
                                    )}
                                    <textarea placeholder="Opis" rows={2} value={form.description || ""} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                                        style={{ gridColumn: "1/-1", resize: "vertical", padding: "8px 10px", border: "1px solid #d1d5db", borderRadius: 8, fontSize: 14 }} />
                                    <div style={{ gridColumn: "1/-1", display: "flex", gap: 8 }}>
                                        <input placeholder="Email uczestnika" value={newAttendee} onChange={e => setNewAttendee(e.target.value)} style={{ flex: 1 }} />
                                        <button className="btn-secondary-modern" onClick={() => { if (newAttendee) { setForm(f => ({ ...f, attendees: [...(f.attendees || []), newAttendee] })); setNewAttendee(""); } }}>Dodaj</button>
                                    </div>
                                    {(form.attendees || []).length > 0 && (
                                        <div style={{ gridColumn: "1/-1", display: "flex", flexWrap: "wrap", gap: 6 }}>
                                            {(form.attendees || []).map((a, i) => (
                                                <span key={i} className="tag-badge tag-cold">{a}
                                                    <button onClick={() => setForm(f => ({ ...f, attendees: (f.attendees || []).filter((_, j) => j !== i) }))}
                                                        style={{ background: "none", border: "none", cursor: "pointer", color: "#dc2626", marginLeft: 4, padding: 0 }}>×</button>
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                    <button className="btn-primary-modern" onClick={addEvent}>Zapisz wydarzenie</button>
                                </div>
                            </div>
                        )}

                        {view === "month" && (
                            <div className="card">
                                <div className="cal-grid-header">
                                    {DAYS_PL.map(d => <div key={d} className="cal-grid-day-header">{d}</div>)}
                                </div>
                                <div className="cal-grid">
                                    {renderMonthGrid()}
                                </div>
                            </div>
                        )}

                        {view === "day" && (
                            <div className="card">
                                <h2 style={{ marginBottom: 0 }}>{selectedDate}</h2>
                                {renderDayList()}
                            </div>
                        )}

                        {view === "week" && (
                            <div className="card">
                                <div className="cal-week-grid">
                                    {Array.from({ length: 7 }, (_, i) => {
                                        const d = new Date(selectedDate);
                                        d.setDate(d.getDate() - d.getDay() + i + 1);
                                        const ds = d.toISOString().slice(0, 10);
                                        const evs = getEventsForDate(ds);
                                        const isToday = ds === today.toISOString().slice(0, 10);
                                        return (
                                            <div key={i} className={`cal-week-col${isToday ? " cal-today-col" : ""}`} onClick={() => setSelectedDate(ds)}>
                                                <div className="cal-week-col-header">{DAYS_PL[i]}<br /><strong>{d.getDate()}</strong></div>
                                                {evs.map(ev => (
                                                    <div key={ev.id} className="cal-week-event"
                                                        style={{ borderLeft: `3px solid ${typeColors[ev.type]}` }}
                                                        onClick={e => { e.stopPropagation(); setShowEventDetail(ev); }}>
                                                        <div style={{ fontWeight: 600, fontSize: 12 }}>{ev.startTime}</div>
                                                        <div style={{ fontSize: 11 }}>{ev.title}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        <div className="card" style={{ marginTop: 20 }}>
                            <h2>Wydarzenia — {selectedDate}</h2>
                            {getEventsForDate(selectedDate).length === 0 && <p style={{ color: "#9ca3af", fontSize: 14 }}>Brak wydarzeń tego dnia.</p>}
                            {getEventsForDate(selectedDate).map(ev => (
                                <div key={ev.id} className="cal-event-row" style={{ borderLeft: `4px solid ${typeColors[ev.type]}` }}
                                    onClick={() => setShowEventDetail(ev)}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                                        <strong>{ev.title}</strong>
                                        <span style={{ color: "#6b7280", fontSize: 13 }}>{ev.startTime}–{ev.endTime}</span>
                                        <span className="tag-badge" style={{ background: typeColors[ev.type] + "22", color: typeColors[ev.type] }}>{typeLabels[ev.type]}</span>
                                        {ev.videoProvider !== "none" && (
                                            <a href={ev.videoLink} target="_blank" rel="noopener noreferrer"
                                                onClick={e => e.stopPropagation()}
                                                className="cal-video-badge" style={{ textDecoration: "none" }}>
                                                {VIDEO_PROVIDERS.find(p => p.value === ev.videoProvider)?.icon} Dołącz
                                            </a>
                                        )}
                                    </div>
                                    <span style={{ fontSize: 12, color: "#9ca3af" }}>{ev.teamMember}</span>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {activeTab === "team" && (
                    <div className="card">
                        <h2>Kalendarz zespołu</h2>
                        <p style={{ color: "#6b7280", fontSize: 13, marginBottom: 16 }}>Widok wszystkich członków zespołu i ich wydarzeń.</p>
                        {TEAM_MEMBERS.map(member => {
                            const memberEvents = events.filter(e => e.teamMember === member);
                            const linkedIn = integrations.find(i => i.id === "linkedin");
                            return (
                                <div key={member} className="cal-team-member">
                                    <div className="cal-team-avatar">{member.split(" ").map(n => n[0]).join("")}</div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                            <div style={{ fontWeight: 600, fontSize: 14, color: "#1f2937" }}>{member}</div>
                                            {linkedIn?.connected && (
                                                <a href={linkedIn.profileUrl} target="_blank" rel="noopener noreferrer"
                                                    style={{ fontSize: 11, color: "#0077b5", textDecoration: "none", background: "#e8f4fd", padding: "2px 8px", borderRadius: 10 }}>
                                                    🔗 LinkedIn
                                                </a>
                                            )}
                                        </div>
                                        <div style={{ fontSize: 12, color: "#6b7280" }}>{memberEvents.length} wydarzeń</div>
                                        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 6 }}>
                                            {memberEvents.slice(0, 4).map(ev => (
                                                <span key={ev.id} className="tag-badge" style={{ background: typeColors[ev.type] + "22", color: typeColors[ev.type], cursor: "pointer" }}
                                                    onClick={() => setShowEventDetail(ev)}>
                                                    {ev.date} {ev.startTime} {ev.title}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {activeTab === "availability" && (
                    <div className="card">
                        <h2>Blokowanie godzin i dostępność</h2>
                        <p style={{ color: "#6b7280", fontSize: 13 }}>Zablokuj konkretne daty i godziny, aby były niedostępne do rezerwacji.</p>
                        <div style={{ display: "flex", gap: 10, marginTop: 16, alignItems: "flex-end", flexWrap: "wrap" }}>
                            <div>
                                <label style={{ fontSize: 12, color: "#6b7280", display: "block", marginBottom: 4 }}>Data</label>
                                <input type="date" value={blockDate} onChange={e => setBlockDate(e.target.value)}
                                    style={{ padding: "8px 10px", border: "1px solid #d1d5db", borderRadius: 8, fontSize: 14 }} />
                            </div>
                            <div>
                                <label style={{ fontSize: 12, color: "#6b7280", display: "block", marginBottom: 4 }}>Godzina</label>
                                <input type="time" value={blockTime} onChange={e => setBlockTime(e.target.value)}
                                    style={{ padding: "8px 10px", border: "1px solid #d1d5db", borderRadius: 8, fontSize: 14 }} />
                            </div>
                            <button className="btn-primary-modern" onClick={addBlockedSlot}>🚫 Zablokuj</button>
                        </div>
                        {blockedSlots.length === 0 && <p style={{ color: "#9ca3af", fontSize: 13, marginTop: 16 }}>Brak zablokowanych slotów.</p>}
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
                            {blockedSlots.map((s, i) => (
                                <span key={i} className="tag-badge tag-hot" style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                    🚫 {s.date} {s.time}
                                    <button onClick={() => setBlockedSlots(prev => prev.filter((_, j) => j !== i))}
                                        style={{ background: "none", border: "none", color: "#dc2626", cursor: "pointer", padding: 0, fontSize: 12 }}>×</button>
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === "integrations" && (
                    <>
                        {integrationCategories.map(cat => (
                            <div className="card" key={cat.key} style={{ marginBottom: 16 }}>
                                <h2>{cat.label}</h2>
                                <div className="integration-list">
                                    {integrations.filter(i => i.category === cat.key).map(integration => (
                                        <div className="integration-item" key={integration.id}>
                                            <div style={{ display: "flex", alignItems: "center" }}>
                                                <span className="integration-logo">{integration.icon}</span>
                                                <div>
                                                    <div className="integration-name">{integration.name}</div>
                                                    <div className="integration-status">{integration.desc}</div>
                                                </div>
                                            </div>
                                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                                {integration.connected && <span className="connected-badge">✓ Połączono</span>}
                                                {integration.connected && integration.profileUrl && (
                                                    <a href={integration.profileUrl} target="_blank" rel="noopener noreferrer"
                                                        style={{ fontSize: 12, color: "#6366f1", textDecoration: "none", padding: "4px 10px", border: "1px solid #c7d2fe", borderRadius: 6 }}>
                                                        Otwórz →
                                                    </a>
                                                )}
                                                <button
                                                    className={integration.connected ? "btn-secondary-modern" : "btn-primary-modern"}
                                                    style={{ padding: "6px 14px", fontSize: 13 }}
                                                    onClick={() => {
                                                        if (integration.connected) {
                                                            toggleIntegration(integration.id);
                                                        } else {
                                                            openIntegration(integration);
                                                        }
                                                    }}>
                                                    {integration.connected ? "Rozłącz" : "Połącz"}
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}

                        <div className="card">
                            <h2>⚙️ Ustawienia strefy czasowej</h2>
                            <div style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 12 }}>
                                <select value={userTimezone} onChange={e => setUserTimezone(e.target.value)}
                                    style={{ padding: "8px 12px", border: "1px solid #d1d5db", borderRadius: 8, fontSize: 14 }}>
                                    {TIMEZONES.map(tz => <option key={tz} value={tz}>{tz}</option>)}
                                </select>
                                <button className="btn-primary-modern" onClick={saveSettings} style={{ background: savedNotif ? "#059669" : undefined }}>
                                    {savedNotif ? "✓ Zapisano!" : "Zapisz"}
                                </button>
                            </div>
                        </div>
                    </>
                )}

                {activeTab === "booking" && (
                    <>
                        <div className="card">
                            <h2>Formularz kwalifikacyjny</h2>
                            <p style={{ color: "#6b7280", fontSize: 13 }}>Pytania zadawane klientowi przy rezerwacji przez lejek/landing page.</p>
                            <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
                                <input placeholder="Dodaj pytanie..." value={newQQuestion} onChange={e => setNewQQuestion(e.target.value)}
                                    style={{ flex: 1, padding: "8px 10px", border: "1px solid #d1d5db", borderRadius: 8, fontSize: 14 }}
                                    onKeyDown={e => e.key === "Enter" && addQuestion()} />
                                <button className="btn-primary-modern" onClick={addQuestion}>Dodaj</button>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 12 }}>
                                {qualifyingQuestions.map(q => (
                                    <div key={q.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: "#f9fafb", borderRadius: 8, border: "1px solid #e5e7eb" }}>
                                        <span style={{ flex: 1, fontSize: 14 }}>{q.question}</span>
                                        <label style={{ fontSize: 12, color: "#6b7280", display: "flex", alignItems: "center", gap: 4, cursor: "pointer" }}>
                                            <input type="checkbox" checked={q.required} onChange={() => setQualifyingQuestions(prev => prev.map(x => x.id === q.id ? { ...x, required: !x.required } : x))} />
                                            Wymagane
                                        </label>
                                        <button onClick={() => removeQuestion(q.id)} style={{ background: "none", border: "none", color: "#dc2626", cursor: "pointer", fontSize: 16 }}>✕</button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="card">
                            <h2>Podgląd — Booking z lejka</h2>
                            <p style={{ color: "#6b7280", fontSize: 13 }}>Tak wygląda formularz rezerwacji osadzony na landing page.</p>
                            {integrations.filter(i => i.category === "video" && i.connected).length > 0 && (
                                <div style={{ fontSize: 13, color: "#059669", background: "#d1fae5", padding: "8px 12px", borderRadius: 8, marginTop: 8 }}>
                                    ✓ Aktywna integracja wideo: {integrations.filter(i => i.category === "video" && i.connected).map(i => i.name).join(", ")} — link zostanie wygenerowany automatycznie
                                </div>
                            )}
                            <div className="cal-booking-preview">
                                {!bookingConfirmed ? (
                                    <>
                                        {bookingStep === 1 && (
                                            <div>
                                                <h3 style={{ margin: "0 0 12px" }}>Wybierz termin</h3>
                                                <div style={{ display: "flex", gap: 10, marginBottom: 12, flexWrap: "wrap" }}>
                                                    <input type="date" value={bookingDate} onChange={e => setBookingDate(e.target.value)}
                                                        style={{ flex: 1, minWidth: 140, padding: "8px 10px", border: "1px solid #d1d5db", borderRadius: 8, fontSize: 14 }} />
                                                    <input type="time" value={bookingTime} onChange={e => setBookingTime(e.target.value)}
                                                        style={{ flex: 1, minWidth: 120, padding: "8px 10px", border: "1px solid #d1d5db", borderRadius: 8, fontSize: 14 }} />
                                                </div>
                                                {bookingDate && bookingTime && isSlotBlocked(bookingDate, bookingTime) && (
                                                    <p style={{ color: "#dc2626", fontSize: 13 }}>⚠️ Ten termin jest niedostępny.</p>
                                                )}
                                                <button className="btn-primary-modern"
                                                    onClick={() => { if (bookingDate && bookingTime && !isSlotBlocked(bookingDate, bookingTime)) setBookingStep(2); }}
                                                    style={{ opacity: (!bookingDate || !bookingTime || isSlotBlocked(bookingDate, bookingTime)) ? 0.5 : 1 }}>
                                                    Dalej →
                                                </button>
                                            </div>
                                        )}
                                        {bookingStep === 2 && (
                                            <div>
                                                <h3 style={{ margin: "0 0 12px" }}>Pytania kwalifikacyjne</h3>
                                                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                                                    {qualifyingQuestions.map(q => (
                                                        <div key={q.id}>
                                                            <label style={{ fontSize: 13, color: "#374151", display: "block", marginBottom: 4 }}>
                                                                {q.question}{q.required && <span style={{ color: "#dc2626" }}> *</span>}
                                                            </label>
                                                            <input value={bookingForm[q.id] || ""} onChange={e => setBookingForm(f => ({ ...f, [q.id]: e.target.value }))}
                                                                style={{ width: "100%", padding: "8px 10px", border: "1px solid #d1d5db", borderRadius: 8, fontSize: 14, boxSizing: "border-box" }} />
                                                        </div>
                                                    ))}
                                                </div>
                                                <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
                                                    <button className="btn-secondary-modern" onClick={() => setBookingStep(1)}>← Wstecz</button>
                                                    <button className="btn-primary-modern" onClick={confirmBooking}>Potwierdź rezerwację</button>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div style={{ textAlign: "center", padding: "24px 0" }}>
                                        <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
                                        <h3>Rezerwacja potwierdzona!</h3>
                                        <p style={{ color: "#6b7280", fontSize: 14 }}>{bookingDate} o {bookingTime}</p>
                                        {events.find(e => e.date === bookingDate && e.startTime === bookingTime && e.videoProvider !== "none") && (
                                            <div style={{ marginTop: 8 }}>
                                                <a href={events.find(e => e.date === bookingDate && e.startTime === bookingTime)?.videoLink}
                                                    target="_blank" rel="noopener noreferrer"
                                                    style={{ color: "#6366f1", fontSize: 14 }}>
                                                    🎥 Dołącz do spotkania →
                                                </a>
                                            </div>
                                        )}
                                        <p style={{ color: "#6b7280", fontSize: 13 }}>Potwierdzenie zostało wysłane na email.</p>
                                        <button className="btn-secondary-modern" onClick={() => { setBookingConfirmed(false); setBookingStep(1); setBookingDate(""); setBookingTime(""); setBookingForm({}); }}>
                                            Nowa rezerwacja
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                )}

                {showEventDetail && (
                    <div className="cal-modal-overlay" onClick={() => setShowEventDetail(null)}>
                        <div className="cal-modal" onClick={e => e.stopPropagation()}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                                <div>
                                    <h2 style={{ margin: "0 0 4px" }}>{showEventDetail.title}</h2>
                                    <span className="tag-badge" style={{ background: typeColors[showEventDetail.type] + "22", color: typeColors[showEventDetail.type] }}>
                                        {typeLabels[showEventDetail.type]}
                                    </span>
                                </div>
                                <button onClick={() => setShowEventDetail(null)} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#9ca3af" }}>×</button>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 14 }}>
                                <div style={{ display: "flex", gap: 8, background: "#f9fafb", borderRadius: 8, padding: "10px 14px" }}>
                                    <span>📅</span>
                                    <div>
                                        <div style={{ fontWeight: 600 }}>{showEventDetail.date}</div>
                                        <div style={{ color: "#6b7280" }}>{showEventDetail.startTime} – {showEventDetail.endTime} ({showEventDetail.timezone})</div>
                                    </div>
                                </div>
                                <div style={{ display: "flex", gap: 8, background: "#f9fafb", borderRadius: 8, padding: "10px 14px" }}>
                                    <span>👤</span>
                                    <div>
                                        <div style={{ fontWeight: 600 }}>{showEventDetail.teamMember}</div>
                                        {integrations.find(i => i.id === "linkedin" && i.connected) && (
                                            <a href={integrations.find(i => i.id === "linkedin")?.profileUrl} target="_blank" rel="noopener noreferrer"
                                                style={{ color: "#0077b5", fontSize: 12, textDecoration: "none" }}>🔗 Zobacz LinkedIn</a>
                                        )}
                                    </div>
                                </div>
                                {showEventDetail.videoProvider !== "none" && (
                                    <div style={{ display: "flex", gap: 8, background: "#eef2ff", borderRadius: 8, padding: "10px 14px", alignItems: "center" }}>
                                        <span>{VIDEO_PROVIDERS.find(p => p.value === showEventDetail.videoProvider)?.icon}</span>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontWeight: 600 }}>{showEventDetail.videoProvider.charAt(0).toUpperCase() + showEventDetail.videoProvider.slice(1)}</div>
                                            <div style={{ color: "#6b7280", fontSize: 12, wordBreak: "break-all" }}>{showEventDetail.videoLink}</div>
                                        </div>
                                        <a href={showEventDetail.videoLink} target="_blank" rel="noopener noreferrer"
                                            style={{ padding: "6px 14px", background: "#6366f1", color: "white", borderRadius: 6, textDecoration: "none", fontSize: 13, whiteSpace: "nowrap" }}>
                                            Dołącz →
                                        </a>
                                    </div>
                                )}
                                {showEventDetail.description && (
                                    <div style={{ background: "#f9fafb", borderRadius: 8, padding: "10px 14px" }}>
                                        <div style={{ fontWeight: 600, marginBottom: 4 }}>📝 Opis</div>
                                        <div style={{ color: "#374151" }}>{showEventDetail.description}</div>
                                    </div>
                                )}
                                {showEventDetail.attendees.length > 0 && (
                                    <div style={{ background: "#f9fafb", borderRadius: 8, padding: "10px 14px" }}>
                                        <div style={{ fontWeight: 600, marginBottom: 6 }}>👥 Uczestnicy</div>
                                        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                                            {showEventDetail.attendees.map((a, i) => (
                                                <span key={i} className="tag-badge tag-cold">{a}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {Object.keys(showEventDetail.qualifyingAnswers).length > 0 && (
                                    <div style={{ background: "#f9fafb", borderRadius: 8, padding: "10px 14px" }}>
                                        <div style={{ fontWeight: 600, marginBottom: 6 }}>📋 Odpowiedzi kwalifikacyjne</div>
                                        {qualifyingQuestions.filter(q => showEventDetail.qualifyingAnswers[q.id]).map(q => (
                                            <div key={q.id} style={{ fontSize: 13, marginBottom: 4 }}>
                                                <span style={{ color: "#6b7280" }}>{q.question}: </span>
                                                <strong>{showEventDetail.qualifyingAnswers[q.id]}</strong>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div style={{ marginTop: 20, display: "flex", gap: 8 }}>
                                <button className="btn-danger-modern" onClick={() => removeEvent(showEventDetail.id)}>Usuń</button>
                                <button className="btn-secondary-modern" onClick={() => setShowEventDetail(null)}>Zamknij</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Calendar;