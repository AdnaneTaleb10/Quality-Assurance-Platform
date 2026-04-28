import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getMe } from "../services/authService";

export default function ProtectedRoute({
  children,
  requireAdmin         = false,
  requireAdminOrRector = false,
}) {
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    getMe()
      .then((data) => {
        const role = data.user.role;
        if (requireAdmin && role !== "Admin") {
          setStatus("forbidden");
        } else if (requireAdminOrRector && role !== "Admin" && role !== "Rector") {
          setStatus("forbidden");
        } else {
          setStatus("ok");
        }
      })
      .catch(() => setStatus("unauth"));
  }, [requireAdmin, requireAdminOrRector]);

  if (status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <span className="text-sm text-gray-400">Checking authentication…</span>
      </div>
    );
  }

  if (status === "unauth")    return <Navigate to="/login"     replace />;
  if (status === "forbidden") return <Navigate to="/dashboard" replace />;
  return children;
}