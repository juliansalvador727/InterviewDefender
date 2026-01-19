import { useState, useMemo } from "react";
import Navbar from "../components/Navbar";
import { RefreshCw, Github, Lock, Unlock, Star, GitFork, Loader2, FolderGit2, ExternalLink, Search, X } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_BASE_URL as string | undefined;

export default function DashboardPage() {
  const [repos, setRepos] = useState<any[] | null>(null);
  const [reposError, setReposError] = useState("");
  const [reposLoading, setReposLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

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

  // Filter repositories based on search query
  const filteredRepos = useMemo(() => {
    if (!repos) return null;
    if (!searchQuery.trim()) return repos;

    const query = searchQuery.toLowerCase().trim();
    return repos.filter((repo) => {
      const fullName = (repo.full_name ?? repo.name ?? "").toLowerCase();
      const description = (repo.description ?? "").toLowerCase();
      const language = (repo.language ?? "").toLowerCase();
      
      return (
        fullName.includes(query) ||
        description.includes(query) ||
        language.includes(query)
      );
    });
  }, [repos, searchQuery]);

  return (
    <div className="min-h-screen gradient-mesh text-white">
      {/* Floating orbs */}
      <div className="fixed top-40 right-20 w-[500px] h-[500px] bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-20 left-20 w-[600px] h-[600px] bg-gradient-to-tr from-violet-500/10 to-pink-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Navbar */}
      <Navbar variant="sticky" />

      {/* Page Actions Bar */}
      <div className="sticky top-[73px] z-40 glass-effect border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-end">
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
        </div>
      </div>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        {/* Page Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-4xl sm:text-5xl font-black mb-3 sm:mb-4 gradient-text">
            Your Repositories
          </h1>
          <p className="text-lg sm:text-xl text-gray-400">
            Connected codebases ready for AI-powered interview prep
          </p>
        </div>

        {/* Search Bar */}
        {repos && repos.length > 0 && (
          <div className="mb-6 sm:mb-8">
            <div className="relative max-w-2xl">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search repositories by name, description, or language..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-12 py-3.5 rounded-xl glass-effect border border-white/10 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all text-sm sm:text-base"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white transition-colors"
                  aria-label="Clear search"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
            {searchQuery && filteredRepos && (
              <p className="mt-3 text-sm text-gray-400 px-1">
                Found {filteredRepos.length} {filteredRepos.length === 1 ? 'repository' : 'repositories'}
              </p>
            )}
          </div>
        )}

        {/* Error Message */}
        {reposError && (
          <div className="mb-6 sm:mb-8 glass-card rounded-2xl p-4 sm:px-6 sm:py-5 border-l-4 border-red-500 flex items-start gap-3 sm:gap-4">
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
        {filteredRepos && filteredRepos.length > 0 ? (
          <div className="grid gap-6">
            {filteredRepos.map((repo, index) => (
              <div
                key={repo.id ?? repo.full_name}
                className="group glass-card rounded-2xl p-5 sm:p-6 lg:p-8 hover:scale-[1.02] transition-all duration-300 opacity-0 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="flex items-start gap-4 sm:gap-6">
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
                      className="group/link inline-flex items-center gap-2 mb-2 sm:mb-3"
                    >
                      <h3 className="text-lg sm:text-xl font-bold text-white group-hover/link:text-purple-400 transition-colors break-all">
                        {repo.full_name ?? repo.name ?? "Unnamed repo"}
                      </h3>
                      <ExternalLink className="w-4 h-4 text-gray-500 opacity-0 group-hover/link:opacity-100 transition-opacity flex-shrink-0" />
                    </a>
                    
                    {repo.description && (
                      <p className="text-sm sm:text-base text-gray-400 mb-3 sm:mb-4 leading-relaxed">
                        {repo.description}
                      </p>
                    )}
                    
                    <div className="flex items-center flex-wrap gap-2 sm:gap-3">
                      {/* Privacy Badge */}
                      <div className={`px-2.5 sm:px-3 py-1.5 rounded-lg flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium ${
                        repo.private 
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' 
                          : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      }`}>
                        {repo.private ? (
                          <>
                            <Lock className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
                            <span className="hidden xs:inline">Private</span>
                          </>
                        ) : (
                          <>
                            <Unlock className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
                            <span className="hidden xs:inline">Public</span>
                          </>
                        )}
                      </div>

                      {/* Language */}
                      {repo.language && (
                        <div className="px-2.5 sm:px-3 py-1.5 rounded-lg bg-white/5 text-gray-300 text-xs sm:text-sm font-medium border border-white/10">
                          {repo.language}
                        </div>
                      )}

                      {/* Stats */}
                      {repo.stargazers_count !== undefined && (
                        <div className="flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm text-gray-400">
                          <Star className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
                          {repo.stargazers_count.toLocaleString()}
                        </div>
                      )}
                      {repo.forks_count !== undefined && (
                        <div className="flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm text-gray-400">
                          <GitFork className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
                          {repo.forks_count.toLocaleString()}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredRepos && filteredRepos.length === 0 && searchQuery ? (
          <div className="glass-card rounded-3xl p-12 sm:p-16 lg:p-20 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/30 flex items-center justify-center">
              <Search className="w-10 h-10 text-purple-400" />
            </div>
            <h3 className="text-2xl font-bold mb-3">No Matches Found</h3>
            <p className="text-gray-400 max-w-md mx-auto px-4 mb-6">
              No repositories match your search for "<span className="text-white font-medium">{searchQuery}</span>"
            </p>
            <button
              onClick={() => setSearchQuery("")}
              className="px-6 py-2.5 rounded-xl glass-effect hover:bg-white/10 transition-all text-sm font-medium text-purple-400 hover:text-purple-300"
            >
              Clear Search
            </button>
          </div>
        ) : repos && repos.length === 0 ? (
          <div className="glass-card rounded-3xl p-12 sm:p-16 lg:p-20 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/30 flex items-center justify-center">
              <FolderGit2 className="w-10 h-10 text-purple-400" />
            </div>
            <h3 className="text-2xl font-bold mb-3">No Repositories Found</h3>
            <p className="text-gray-400 max-w-md mx-auto px-4">
              Make sure you've granted InterviewDefender access to at least one repository through the GitHub App.
            </p>
          </div>
        ) : (
          <div className="glass-card rounded-3xl p-12 sm:p-16 lg:p-24 text-center">
            <div className="w-24 h-24 mx-auto mb-8 rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/30 flex items-center justify-center animate-pulse">
              <FolderGit2 className="w-12 h-12 text-purple-400" />
            </div>
            <h3 className="text-3xl font-bold mb-4">Ready to Load</h3>
            <p className="text-lg text-gray-400 mb-8 max-w-md mx-auto px-4">
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
