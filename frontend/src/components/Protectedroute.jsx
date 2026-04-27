// components/ProtectedRoute.jsx
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getMe } from "../services/authService";

export default function ProtectedRoute({ children, requireAdmin = false }) {
  const [status, setStatus] = useState("loading"); // "loading" | "ok" | "unauth" | "forbidden"
  const [role, setRole]     = useState(null);

  useEffect(() => {
    getMe()
      .then((data) => {
        const userRole = data.user.role;
        setRole(userRole);

        if (requireAdmin && userRole !== "Admin") {
          setStatus("forbidden");
        } else {
          setStatus("ok");
        }
      })
      .catch(() => setStatus("unauth"));
  }, [requireAdmin]);

  if (status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <span className="text-sm text-gray-400">Checking authentication…</span>
      </div>
    );
  }

  if (status === "unauth") {
    return <Navigate to="/login" replace />;
  }

  // Non-admin trying to access an admin route → send to their dashboard
  if (status === "forbidden") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}