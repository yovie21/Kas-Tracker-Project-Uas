import React, { useContext } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import UserDashboard from "./pages/UserDashboard";
import { AuthProvider, AuthContext } from "./context/AuthContext";

function ProtectedRoute({ children, role }) {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div className="p-4">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/user-dashboard" replace />;
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* 🔒 Admin Dashboard */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute role="admin">
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          {/* 👤 User Dashboard */}
          <Route
            path="/user-dashboard"
            element={
              <ProtectedRoute role="user">
                <UserDashboard />
              </ProtectedRoute>
            }
          />

          {/* fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
