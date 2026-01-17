import { useState } from "react";

const API = import.meta.env.VITE_API_BASE ?? "http://localhost:8000";

export default function App() {
  const [token, setToken] = useState("");
  const [me, setMe] = useState<any>(null);
  const [err, setErr] = useState("");

  async function devLogin() {
    setErr("");
    setMe(null);
    try {
      const res = await fetch(`${API}/api/v1/auth/dev-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          github_id: "12345",
          username: "julian-dev",
          avatar_url: null,
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setToken(data.access_token);
    } catch (e: any) {
      setErr(e.message ?? "login failed");
    }
  }

  async function loadMe() {
    setErr("");
    try {
      const res = await fetch(`${API}/api/v1/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(await res.text());
      setMe(await res.json());
    } catch (e: any) {
      setErr(e.message ?? "me failed");
    }
  }

  return (
    <div style={{ padding: 24, fontFamily: "system-ui" }}>
      <h1>Interview Sim</h1>

      <button onClick={devLogin}>Dev Login</button>
      <button onClick={loadMe} disabled={!token} style={{ marginLeft: 8 }}>
        /me
      </button>

      {token && (
        <p>
          <b>Token:</b> {token.slice(0, 24)}...
        </p>
      )}
      {me && <pre>{JSON.stringify(me, null, 2)}</pre>}
      {err && <pre style={{ color: "crimson" }}>{err}</pre>}
    </div>
  );
}
