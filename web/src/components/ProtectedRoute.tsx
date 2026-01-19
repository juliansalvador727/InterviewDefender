import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE_URL as string | undefined;

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiresApp?: boolean; // If true, requires both auth and GitHub App connection
}

export default function ProtectedRoute({ children, requiresApp = false }: ProtectedRouteProps) {
  const location = useLocation();
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
        // Check if user is authenticated
        const meRes = await fetch(`${API_BASE}/api/v1/me`, {
          credentials: "include",
        });
        
        if (meRes.ok) {
          setIsAuthenticated(true);

          // If app connection is required, check that too
          if (requiresApp) {
            const appRes = await fetch(`${API_BASE}/api/v1/github/app/repos`, {
              credentials: "include",
            });
            setIsAppConnected(appRes.ok);
          }
        }
      } catch (error) {
        console.error("Auth check failed:", error);
      } finally {
        setLoading(false);
      }
    }

    void checkAuth();
  }, [requiresApp]);

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

  // Redirect to home if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // Redirect to connect page if app is required but not connected
  if (requiresApp && !isAppConnected) {
    return <Navigate to="/connect" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
