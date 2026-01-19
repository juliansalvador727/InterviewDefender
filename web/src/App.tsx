import { useEffect, useState } from "react";
import ConnectGitHubAppButton from "./components/GithubLogin";

const API = import.meta.env.VITE_API_BASE ?? "http://localhost:8000";

export default function App() {
  const [token, setToken] = useState("");
  const [me, setMe] = useState<any>(null);
  const [repos, setRepos] = useState<any>(null);
  const [err, setErr] = useState("");

  // Load token from URL or localStorage
  useEffect(() => {
    const url = new URL(window.location.href);

    const tokenFromQuery = url.searchParams.get("token");
    const tokenFromHash = new URLSearchParams(url.hash.replace(/^#/, "")).get(
      "token",
    );
    const t = tokenFromQuery || tokenFromHash;

    if (t) {
      localStorage.setItem("access_token", t);
      setToken(t);

      // Clean URL
      url.searchParams.delete("token");
      history.replaceState(
        {},
        "",
        url.pathname + url.search + url.hash.replace(/token=[^&]+&?/, ""),
      );
    } else {
      const stored = localStorage.getItem("access_token");
      if (stored) setToken(stored);
    }
  }, []);

  // Auto-load /me once we have a token
  useEffect(() => {
    if (!token) return;
    void loadMe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  async function devLogin() {
    setErr("");
    setMe(null);
    setRepos(null);
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
      localStorage.setItem("access_token", data.access_token);
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

  async function loadRepos() {
    setErr("");
    setRepos(null);
    try {
      const res = await fetch(`${API}/api/v1/github/app/repos`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(await res.text());
      setRepos(await res.json());
    } catch (e: any) {
      setErr(e.message ?? "repos failed");
    }
  }

  function logout() {
    localStorage.removeItem("access_token");
    setToken("");
    setMe(null);
    setRepos(null);
    setErr("");
  }

  return (
    <div style={{ padding: 24, fontFamily: "system-ui" }}>
      <h1>Interview Sim</h1>

      <div
        style={{
          display: "flex",
          gap: 8,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <button onClick={devLogin}>Dev Login</button>

        <button onClick={loadMe} disabled={!token}>
          /me
        </button>

        <ConnectGitHubAppButton apiBase={API} token={token} />

        <button onClick={loadRepos} disabled={!token}>
          Load Repos
        </button>

        <button onClick={logout} disabled={!token}>
          Logout
        </button>
      </div>

      {token && (
        <p>
          <b>Token:</b> {token.slice(0, 24)}...
        </p>
      )}

      {me && (
        <>
          <h3>Me</h3>
          <pre>{JSON.stringify(me, null, 2)}</pre>
        </>
      )}

      {repos && (
        <>
          <h3>Repos</h3>
          <pre>{JSON.stringify(repos, null, 2)}</pre>
        </>
      )}

      {err && <pre style={{ color: "crimson" }}>{err}</pre>}
    </div>
  );
}
