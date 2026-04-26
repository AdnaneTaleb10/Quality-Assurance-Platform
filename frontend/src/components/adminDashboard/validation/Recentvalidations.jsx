// components/adminDashboard/validation/RecentValidations.jsx
// Shows only APPROVED and REJECTED answers (no PENDING)

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAnswers } from "../../../services/adminService";

const statusStyles = {
  APPROVED: "bg-green-100 text-green-700",
  REJECTED: "bg-red-100 text-red-600",
};

const statusLabel = {
  APPROVED: "Approved",
  REJECTED: "Rejected",
};

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function RecentValidations() {
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const navigate              = useNavigate();

  useEffect(() => {
    // Fetch a larger pool then filter client-side to the 5 most recent validated
    getAnswers({ limit: 50 })
      .then((data) => {
        const validated = data
          .filter((a) => a.status === "APPROVED" || a.status === "REJECTED")
          .slice(0, 5);
        setAnswers(validated);
      })
      .catch(() => setError("Failed to load recent validations"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
        <h2 className="text-base font-semibold text-gray-900">
          Recent Validations
        </h2>
        <button
          onClick={() => navigate("/validation")}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
        >
          View All
        </button>
      </div>

      {error && <p className="px-6 py-4 text-sm text-red-500">{error}</p>}

      {loading && (
        <div className="divide-y divide-gray-50">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-6 py-4 animate-pulse">
              <div className="w-20 h-4 bg-gray-100 rounded" />
              <div className="flex-1 h-4 bg-gray-100 rounded" />
              <div className="w-20 h-6 bg-gray-100 rounded-full" />
              <div className="w-24 h-4 bg-gray-100 rounded" />
            </div>
          ))}
        </div>
      )}

      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                {["#", "Answer ID", "User", "Status", "Date"].map((h) => (
                  <th
                    key={h}
                    className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-6 py-3"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {answers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-sm text-gray-400">
                    No validated answers yet.
                  </td>
                </tr>
              ) : (
                answers.map((a, idx) => (
                  <tr
                    key={a.answer_id}
                    className="border-b border-gray-50 last:border-none hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm text-gray-300">{idx + 1}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => navigate("/validation")}
                        className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        #{a.answer_id}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{a.user}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center text-xs font-semibold px-3 py-1 rounded-full ${
                          statusStyles[a.status] ?? "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {statusLabel[a.status] ?? a.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatDate(a.created_at)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}