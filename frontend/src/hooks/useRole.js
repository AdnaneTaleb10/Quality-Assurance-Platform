// hooks/useRole.js
import { useEffect, useState } from "react";
import { getMe } from "../services/authService";

/**
 * Returns the current user's role string (e.g. "Admin", "Rector", …)
 * and a readOnly boolean that is true when the user is a Rector.
 */
export function useRole() {
  const [role, setRole]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMe()
      .then((data) => setRole(data.user.role))
      .catch(() => setRole(null))
      .finally(() => setLoading(false));
  }, []);

  return {
    role,
    loading,
    isAdmin:   role === "Admin",
    isRector:  role === "Rector",
    readOnly:  role === "Rector",   // Rector = read-only on admin pages
  };
}