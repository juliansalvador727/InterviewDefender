import { useEffect, useState } from "react";
import ContinueWithGitHub from "./components/GithubLogin";
import ConnectGitHubAppButton from "./components/GithubLogin";

const API = import.meta.env.VITE_API_BASE ?? "http://localhost:8000";

export default function App() {
  const [me, setMe] = useState<any>(null);
  const [repos, setRepos] = useState<any>(null);
  const [err, setErr] = useState("");

  // On load, try to fetch the current user via HttpOnly session cookie
  useEffect(() => {
    void loadMe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadMe() {
    setErr("");
    try {
      const res = await fetch(`${API}/api/v1/me`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error(await res.text());
      setMe(await res.json());
    } catch (e: any) {
      setMe(null);
      // If you're not logged in, this is expected—don't scream in red.
      // Still store for debugging if you want:
      // setErr(e.message ?? "me failed");
    }
  }

  async function loadRepos() {
    setErr("");
    setRepos(null);
    try {
      const res = await fetch(`${API}/api/v1/github/app/repos`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error(await res.text());
      setRepos(await res.json());
    } catch (e: any) {
      setErr(e.message ?? "repos failed");
    }
  }

  async function logout() {
    setErr("");
    setRepos(null);
    try {
      // Add this endpoint on the backend to delete the "session" cookie:
      // POST /api/v1/auth/logout
      await fetch(`${API}/api/v1/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch {
      // ignore
    } finally {
      setMe(null);
    }
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
        {!me ? (
          <ContinueWithGitHub apiBase={API} />
        ) : (
          <>
            <button onClick={loadMe}>/me</button>

            {/* This is the GitHub App install/connect flow (separate from OAuth login) */}
            <ConnectGitHubAppButton apiBase={API} />

            <button onClick={loadRepos}>Load Repos</button>
            <button onClick={logout}>Logout</button>
          </>
        )}
      </div>

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
