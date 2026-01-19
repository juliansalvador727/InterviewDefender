import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE_URL as string | undefined;

interface PublicRouteProps {
  children: React.ReactNode;
}

/**
 * PublicRoute - Redirects authenticated users away from public pages
 * Used for login/home page to redirect already-authenticated users
 */
export default function PublicRoute({ children }: PublicRouteProps) {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAppConnected, setIsAppConnected] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      if (!API_BASE) {
        setLoading(false);
        return;
      }

      try {
        const meRes = await fetch(`${API_BASE}/api/v1/me`, {
          credentials: "include",
        });
        
        if (meRes.ok) {
          setIsAuthenticated(true);

          // Check if app is connected
          const appRes = await fetch(`${API_BASE}/api/v1/github/app/repos`, {
            credentials: "include",
          });
          setIsAppConnected(appRes.ok);
        }
      } catch (error) {
        // Not authenticated, which is fine for public routes
      } finally {
        setLoading(false);
      }
    }

    void checkAuth();
  }, []);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <svg
            className="animate-spin h-8 w-8 text-neutral-900 mx-auto"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <p className="mt-4 text-sm text-neutral-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect authenticated users to appropriate page
  if (isAuthenticated) {
    if (isAppConnected) {
      return <Navigate to="/dashboard" replace />;
    } else {
      return <Navigate to="/connect" replace />;
    }
  }

  return <>{children}</>;
}
