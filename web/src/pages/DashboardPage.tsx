import { useState } from "react";
import { RefreshCw, LogOut, Github, Lock, Unlock, Star, GitFork, Loader2, FolderGit2, Shield, ExternalLink } from "lucide-react";

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
      window.location.href = "/";
    }
  }

  return (
    <div className="min-h-screen gradient-mesh text-white">
      {/* Floating orbs */}
      <div className="fixed top-40 right-20 w-[500px] h-[500px] bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-20 left-20 w-[600px] h-[600px] bg-gradient-to-tr from-violet-500/10 to-pink-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-50 glass-effect border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg shadow-purple-500/50">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold">InterviewDefender</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => void handleShowRepositories()}
              disabled={reposLoading}
              className="px-4 py-2 rounded-xl glass-effect hover:bg-white/10 transition-all flex items-center gap-2 text-sm font-medium disabled:opacity-50"
            >
              {reposLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Loading
                </>
              ) : repos ? (
                <>
                  <RefreshCw className="w-4 h-4" />
                  Refresh
                </>
              ) : (
                <>
                  <FolderGit2 className="w-4 h-4" />
                  Load Repos
                </>
              )}
            </button>
            <button
              onClick={() => void handleLogout()}
              className="px-4 py-2 rounded-xl glass-effect hover:bg-white/10 transition-all flex items-center gap-2 text-sm font-medium text-gray-300 hover:text-white"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-black mb-3 gradient-text">
            Your Repositories
          </h1>
          <p className="text-xl text-gray-400">
            Connected codebases ready for AI-powered interview prep
          </p>
        </div>

        {/* Error Message */}
        {reposError && (
          <div className="mb-8 glass-card rounded-2xl px-6 py-4 border-l-4 border-red-500 flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-red-300 mb-1">Error Loading Repositories</p>
              <p className="text-sm text-gray-400">{reposError}</p>
            </div>
          </div>
        )}

        {/* Repository List */}
        {repos && repos.length > 0 ? (
          <div className="grid gap-6">
            {repos.map((repo, index) => (
              <div
                key={repo.id ?? repo.full_name}
                className="group glass-card rounded-2xl p-6 hover:scale-[1.02] transition-all duration-300 opacity-0 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="flex items-start gap-6">
                  {/* Icon */}
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/30 flex items-center justify-center group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-purple-500/50 transition-all duration-300">
                      <Github className="w-7 h-7 text-purple-400" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <a
                      href={repo.html_url ?? "#"}
                      target="_blank"
                      rel="noreferrer"
                      className="group/link inline-flex items-center gap-2 mb-3"
                    >
                      <h3 className="text-xl font-bold text-white group-hover/link:text-purple-400 transition-colors">
                        {repo.full_name ?? repo.name ?? "Unnamed repo"}
                      </h3>
                      <ExternalLink className="w-4 h-4 text-gray-500 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                    </a>
                    
                    {repo.description && (
                      <p className="text-gray-400 mb-4 leading-relaxed">
                        {repo.description}
                      </p>
                    )}
                    
                    <div className="flex items-center flex-wrap gap-3">
                      {/* Privacy Badge */}
                      <div className={`px-3 py-1.5 rounded-lg flex items-center gap-2 text-sm font-medium ${
                        repo.private 
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' 
                          : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      }`}>
                        {repo.private ? (
                          <>
                            <Lock className="w-3.5 h-3.5" />
                            Private
                          </>
                        ) : (
                          <>
                            <Unlock className="w-3.5 h-3.5" />
                            Public
                          </>
                        )}
                      </div>

                      {/* Language */}
                      {repo.language && (
                        <div className="px-3 py-1.5 rounded-lg bg-white/5 text-gray-300 text-sm font-medium border border-white/10">
                          {repo.language}
                        </div>
                      )}

                      {/* Stats */}
                      {repo.stargazers_count !== undefined && (
                        <div className="flex items-center gap-1.5 text-sm text-gray-400">
                          <Star className="w-4 h-4" />
                          {repo.stargazers_count.toLocaleString()}
                        </div>
                      )}
                      {repo.forks_count !== undefined && (
                        <div className="flex items-center gap-1.5 text-sm text-gray-400">
                          <GitFork className="w-4 h-4" />
                          {repo.forks_count.toLocaleString()}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : repos && repos.length === 0 ? (
          <div className="glass-card rounded-3xl p-16 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/30 flex items-center justify-center">
              <FolderGit2 className="w-10 h-10 text-purple-400" />
            </div>
            <h3 className="text-2xl font-bold mb-3">No Repositories Found</h3>
            <p className="text-gray-400 max-w-md mx-auto">
              Make sure you've granted InterviewDefender access to at least one repository through the GitHub App.
            </p>
          </div>
        ) : (
          <div className="glass-card rounded-3xl p-20 text-center">
            <div className="w-24 h-24 mx-auto mb-8 rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/30 flex items-center justify-center animate-pulse">
              <FolderGit2 className="w-12 h-12 text-purple-400" />
            </div>
            <h3 className="text-3xl font-bold mb-4">Ready to Load</h3>
            <p className="text-lg text-gray-400 mb-8 max-w-md mx-auto">
              Click the "Load Repos" button above to view your connected GitHub repositories.
            </p>
            <div className="inline-block px-4 py-2 rounded-lg bg-white/5 text-sm text-gray-500 font-mono">
              Awaiting user action...
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
