import { useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE_URL as string | undefined;

export default function DashboardPage() {
  const [repos, setRepos] = useState<any[] | null>(null);
  const [reposError, setReposError] = useState("");
  const [reposLoading, setReposLoading] = useState(false);

  async function handleShowRepositories() {
    setReposError("");
    setReposLoading(true);

    if (!API_BASE) {
      setReposError("Missing VITE_API_BASE_URL.");
      setReposLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/v1/github/app/repos`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      // Backend returns { total_count, repositories }
      setRepos(data.repositories || []);
    } catch (error) {
      console.error("Failed to load repositories:", error);
      setReposError("Unable to load repositories.");
    } finally {
      setReposLoading(false);
    }
  }

  async function handleLogout() {
    if (!API_BASE) return;

    try {
      await fetch(`${API_BASE}/api/v1/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      // Redirect to home regardless of API call result
      window.location.href = "/";
    }
  }

  return (
    <div className="min-h-screen bg-white text-neutral-900">
      {/* Header */}
      <header className="border-b border-neutral-300 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
          <span className="font-bold text-[16px]">InterviewDefender</span>
          <div className="flex items-center gap-4">
            <button
              onClick={() => void handleShowRepositories()}
              disabled={reposLoading}
              className="text-[13px] text-blue-600 hover:underline disabled:text-neutral-400 disabled:no-underline"
            >
              {reposLoading ? "loading..." : repos ? "refresh" : "load repositories"}
            </button>
            <span className="text-neutral-300">|</span>
            <button
              onClick={() => void handleLogout()}
              className="text-[13px] text-neutral-600 hover:underline"
            >
              logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="mx-auto max-w-5xl px-4 py-6">
        {/* Error Message */}
        {reposError && (
          <div className="mb-4 border border-red-300 bg-red-50 px-4 py-2 text-[13px] text-red-700">
            {reposError}
          </div>
        )}

        {/* Repository List */}
        {repos && repos.length > 0 ? (
          <div className="border border-neutral-300">
            {repos.map((repo, index) => (
              <div
                key={repo.id ?? repo.full_name}
                className={`border-b border-neutral-300 last:border-b-0 ${
                  index % 2 === 0 ? 'bg-white' : 'bg-neutral-50'
                }`}
              >
                <div className="px-4 py-3">
                  <div className="flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <a
                        href={repo.html_url ?? "#"}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 hover:underline text-[14px] font-medium"
                      >
                        {repo.full_name ?? repo.name ?? "Unnamed repo"}
                      </a>
                      {repo.description && (
                        <p className="mt-1 text-[13px] text-neutral-600">
                          {repo.description}
                        </p>
                      )}
                      <div className="mt-1 flex items-center gap-3 text-[11px] text-neutral-500">
                        <span>{repo.private ? '🔒 Private' : '📖 Public'}</span>
                        {repo.language && <span>• {repo.language}</span>}
                        {repo.stargazers_count !== undefined && (
                          <span>• ⭐ {repo.stargazers_count}</span>
                        )}
                        {repo.forks_count !== undefined && (
                          <span>• 🔱 {repo.forks_count}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : repos && repos.length === 0 ? (
          <div className="border border-neutral-300 bg-neutral-50 px-4 py-8 text-center">
            <p className="text-[14px] text-neutral-600">
              No repositories found. Make sure you've granted access to at least one repository.
            </p>
          </div>
        ) : (
          <div className="border border-neutral-300 bg-neutral-50 px-4 py-8 text-center">
            <p className="text-[14px] text-neutral-600">
              Click "load repositories" above to view your connected repositories.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
