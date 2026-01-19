import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Shield, Github, LogOut, Home, LayoutDashboard, GitBranch } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_BASE_URL as string | undefined;

interface NavbarProps {
  variant?: "fixed" | "sticky";
}

export default function Navbar({ variant = "fixed" }: NavbarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, [location.pathname]);

  async function checkAuth() {
    if (!API_BASE) {
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/v1/me`, {
        credentials: "include",
      });
      setIsAuthenticated(res.ok);
    } catch (error) {
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
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
      setIsAuthenticated(false);
      navigate("/");
    }
  }

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className={`${variant === "fixed" ? "fixed" : "sticky"} top-0 left-0 right-0 z-50 glass-effect border-b border-white/5`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg shadow-purple-500/50 group-hover:scale-105 transition-transform">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold hidden sm:inline">InterviewDefender</span>
          </Link>

          {/* Navigation Links */}
          {!isLoading && (
            <nav className="flex items-center gap-2 sm:gap-3">
              {isAuthenticated ? (
                <>
                  {/* Dashboard Link */}
                  <Link
                    to="/dashboard"
                    className={`px-3 sm:px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-medium transition-all ${
                      isActive("/dashboard")
                        ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                        : "glass-effect hover:bg-white/10 text-gray-300 hover:text-white"
                    }`}
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span className="hidden xs:inline">Dashboard</span>
                  </Link>

                  {/* Connect App Link */}
                  <Link
                    to="/connect"
                    className={`px-3 sm:px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-medium transition-all ${
                      isActive("/connect")
                        ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                        : "glass-effect hover:bg-white/10 text-gray-300 hover:text-white"
                    }`}
                  >
                    <GitBranch className="w-4 h-4" />
                    <span className="hidden sm:inline">Connect</span>
                  </Link>

                  {/* Logout Button */}
                  <button
                    onClick={() => void handleLogout()}
                    className="px-3 sm:px-4 py-2 rounded-xl glass-effect hover:bg-white/10 transition-all flex items-center gap-2 text-sm font-medium text-gray-300 hover:text-white"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden xs:inline">Logout</span>
                  </button>
                </>
              ) : (
                <>
                  {/* Home Link */}
                  {!isActive("/") && (
                    <Link
                      to="/"
                      className="px-3 sm:px-4 py-2 rounded-xl glass-effect hover:bg-white/10 transition-all flex items-center gap-2 text-sm font-medium text-gray-300 hover:text-white"
                    >
                      <Home className="w-4 h-4" />
                      <span className="hidden xs:inline">Home</span>
                    </Link>
                  )}

                  {/* GitHub Link */}
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 sm:px-4 py-2 rounded-xl glass-effect hover:bg-white/10 transition-all flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-white"
                  >
                    <Github className="w-4 h-4" />
                    <span className="hidden sm:inline">GitHub</span>
                  </a>
                </>
              )}
            </nav>
          )}
        </div>
      </div>
    </header>
  );
}
