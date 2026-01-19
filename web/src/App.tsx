import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ConnectAppPage from "./pages/ConnectAppPage";
import DashboardPage from "./pages/DashboardPage";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route - Home/Login */}
        <Route
          path="/"
          element={
            <PublicRoute>
              <HomePage />
            </PublicRoute>
          }
        />

        {/* Protected Route - Connect GitHub App */}
        <Route
          path="/connect"
          element={
            <ProtectedRoute>
              <ConnectAppPage />
            </ProtectedRoute>
          }
        />

        {/* Protected Route - Dashboard (requires app connection) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute requiresApp={true}>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        {/* Catch all - redirect to home */}
        <Route path="*" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
}
