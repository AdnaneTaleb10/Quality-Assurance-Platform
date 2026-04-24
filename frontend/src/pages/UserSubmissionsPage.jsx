// pages/UserSubmissionsPage.jsx
import { useEffect, useState, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Sidebar from "../components/adminDashboard/Sidebar";
import Topbar from "../components/layout/Topbar";
import ReferenceCard from "../components/adminDashboard/submissions/ReferenceCard";
import { getUserSubmissions } from "../services/adminService";

function formatDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function UserSubmissionsPage() {
  const { userId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    getUserSubmissions(userId)
      .then(setData)
      .catch(() => setError("Failed to load user submissions"))
      .finally(() => setLoading(false));
  }, [userId]);

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      setLoading(true);
      setError(null);

      try {
        const res = await getUserSubmissions(userId);
        if (!cancelled) setData(res);
      } catch {
        if (!cancelled) setError("Failed to load user submissions");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [userId]);

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />

        <main className="flex-1 overflow-y-auto px-8 py-8">
          <Link
            to="/admin/users"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Users
          </Link>

          {loading && (
            <p className="text-sm text-gray-400">Loading submissions...</p>
          )}

          {error && !loading && <p className="text-sm text-red-500">{error}</p>}

          {!loading && !error && data && (
            <>
              {/* Header card */}
              <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 mb-6">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center text-lg font-semibold">
                    {data.user.name
                      ?.split(" ")
                      .map((s) => s[0])
                      .slice(0, 2)
                      .join("")
                      .toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <h1 className="text-2xl font-bold text-gray-900">
                      {data.user.name}
                    </h1>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {data.user.email}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 mt-3">
                      <span className="inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                        {data.user.role ?? "USER"}
                      </span>
                      <span className="text-xs text-gray-400">
                        Joined {formatDate(data.user.joined_at)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* References */}
              {data.references.length === 0 ? (
                <div className="bg-white border border-gray-100 rounded-2xl p-10 text-center text-gray-400 text-sm">
                  This user hasn't submitted any answers yet.
                </div>
              ) : (
                data.references.map((ref) => (
                  <ReferenceCard
                    key={ref.reference_id}
                    reference={ref}
                    userId={userId}
                    onChanged={load}
                  />
                ))
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
