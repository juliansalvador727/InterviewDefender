import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { RefreshCw, LogOut, Github, Lock, Book, Star, GitFork, Loader2, Cloud } from "lucide-react";

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
    <div className="min-h-screen noise-bg text-gray-100">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gray-700/50 bg-gray-900/80 backdrop-blur-xl">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">ID</span>
            </div>
            <span className="font-bold text-[17px] text-amber-300">InterviewDefender</span>
          </div>
          <div className="flex items-center gap-5">
            <Button
              onClick={() => void handleShowRepositories()}
              disabled={reposLoading}
              variant="outline"
              size="sm"
              className="border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 uppercase tracking-wider"
            >
              {reposLoading ? (
                <>
                  <Loader2 className="animate-spin h-3 w-3" />
                  Loading
                </>
              ) : repos ? (
                <>
                  <RefreshCw className="h-3 w-3" />
                  Refresh
                </>
              ) : (
                <>
                  <RefreshCw className="h-3 w-3" />
                  Load Repos
                </>
              )}
            </Button>
            <Separator orientation="vertical" className="h-4" />
            <Button
              onClick={() => void handleLogout()}
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-amber-400 uppercase tracking-wider"
            >
              <LogOut className="h-3 w-3" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="mx-auto max-w-6xl px-6 py-10">
        {/* Page title */}
        <div className="mb-8">
          <h1 className="text-[42px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-400 mb-2">
            Mission Control
          </h1>
          <p className="text-gray-400 text-[14px] font-light">
            Your connected repositories and interview preparation hub
          </p>
        </div>

        {/* Error Message */}
        {reposError && (
          <div className="mb-6 border border-red-500/30 bg-red-500/10 px-5 py-3 rounded-lg text-[13px] text-red-300 flex items-center gap-3">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {reposError}
          </div>
        )}

        {/* Repository List */}
        {repos && repos.length > 0 ? (
          <div className="grid gap-4">
            {repos.map((repo, index) => (
              <Card
                key={repo.id ?? repo.full_name}
                className="group opacity-0 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Github className="w-5 h-5 text-amber-400" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <a
                        href={repo.html_url ?? "#"}
                        target="_blank"
                        rel="noreferrer"
                        className="text-amber-300 hover:text-amber-200 text-[16px] font-semibold inline-flex items-center gap-2 group/link transition-colors"
                      >
                        {repo.full_name ?? repo.name ?? "Unnamed repo"}
                        <svg className="w-4 h-4 opacity-0 -translate-x-2 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                      {repo.description && (
                        <p className="mt-2 text-[13px] text-gray-400 font-light leading-relaxed">
                          {repo.description}
                        </p>
                      )}
                      <div className="mt-3 flex items-center flex-wrap gap-3 text-[11px] text-gray-500 font-mono">
                        <Badge variant={repo.private ? "amber" : "outline"} className="gap-1.5">
                          {repo.private ? (
                            <>
                              <Lock className="w-3 h-3" />
                              Private
                            </>
                          ) : (
                            <>
                              <Book className="w-3 h-3" />
                              Public
                            </>
                          )}
                        </Badge>
                        {repo.language && (
                          <Badge variant="outline" className="text-amber-500/70 border-gray-700">
                            {repo.language}
                          </Badge>
                        )}
                        {repo.stargazers_count !== undefined && (
                          <span className="flex items-center gap-1">
                            <Star className="w-3 h-3" />
                            {repo.stargazers_count}
                          </span>
                        )}
                        {repo.forks_count !== undefined && (
                          <span className="flex items-center gap-1">
                            <GitFork className="w-3 h-3" />
                            {repo.forks_count}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : repos && repos.length === 0 ? (
          <Card className="text-center">
            <CardContent className="px-8 py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-700/50 flex items-center justify-center">
                <Github className="w-8 h-8 text-gray-500" />
              </div>
              <p className="text-[15px] text-gray-300 font-medium mb-2">No repositories found</p>
              <p className="text-[13px] text-gray-500 font-light">
                Make sure you've granted access to at least one repository
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="px-8 py-16 text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 flex items-center justify-center animate-pulse">
                <Cloud className="w-10 h-10 text-amber-400" />
              </div>
              <p className="text-[16px] text-gray-300 font-medium mb-2">Ready to initialize</p>
              <p className="text-[13px] text-gray-500 font-light font-mono">
                $ Click "LOAD REPOS" to view connected repositories
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
