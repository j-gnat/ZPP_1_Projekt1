import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (username === "admin" && password === "admin") {
            navigate("/dashboard");
        } else {
            setError("Nieprawidłowy login lub hasło");
        }
    };

    return (
        <div style={{ minHeight: "100vh", background: "#0f172a", display: "flex", flexDirection: "column" }}>
            <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 48px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em", color: "white" }}>NJM_Soft</div>
                <button onClick={() => navigate("/")}
                    style={{ padding: "8px 20px", background: "transparent", color: "rgba(255,255,255,0.7)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 8, cursor: "pointer", fontSize: 14 }}>
                    ← Powrót
                </button>
            </header>

            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
                <div style={{ width: "100%", maxWidth: 420 }}>
                    <div style={{ textAlign: "center", marginBottom: 32 }}>
                        <h1 style={{ fontSize: 32, fontWeight: 800, margin: "0 0 8px", background: "linear-gradient(135deg,#a5b4fc,#818cf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                            Zaloguj się
                        </h1>
                        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 15, margin: 0 }}>Witaj ponownie w NJM_Soft</p>
                    </div>

                    <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, padding: "32px" }}>
                        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                            <div>
                                <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,0.7)", marginBottom: 6 }}>
                                    Nazwa użytkownika
                                </label>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={e => setUsername(e.target.value)}
                                    placeholder="admin"
                                    style={{ width: "100%", padding: "10px 14px", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 8, fontSize: 15, color: "white", outline: "none", boxSizing: "border-box" }}
                                />
                            </div>
                            <div>
                                <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,0.7)", marginBottom: 6 }}>
                                    Hasło
                                </label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    style={{ width: "100%", padding: "10px 14px", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 8, fontSize: 15, color: "white", outline: "none", boxSizing: "border-box" }}
                                />
                            </div>
                            {error && (
                                <div style={{ background: "rgba(220,38,38,0.15)", border: "1px solid rgba(220,38,38,0.3)", borderRadius: 8, padding: "10px 14px", color: "#fca5a5", fontSize: 14 }}>
                                    {error}
                                </div>
                            )}
                            <button type="submit"
                                style={{ padding: "12px", background: "#6366f1", color: "white", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 15, fontWeight: 600, marginTop: 4, transition: "background 0.15s" }}
                                onMouseOver={e => (e.currentTarget.style.background = "#4f46e5")}
                                onMouseOut={e => (e.currentTarget.style.background = "#6366f1")}>
                                Zaloguj się
                            </button>
                        </form>
                        <p style={{ textAlign: "center", marginTop: 20, fontSize: 13, color: "rgba(255,255,255,0.35)", marginBottom: 0 }}>
                            Login: <strong style={{ color: "rgba(255,255,255,0.5)" }}>admin</strong> / Hasło: <strong style={{ color: "rgba(255,255,255,0.5)" }}>admin</strong>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;