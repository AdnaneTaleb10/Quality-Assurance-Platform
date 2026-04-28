// components/adminDashboard/validation/ValidationTable.jsx
import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import ValidationModal from "./ValidationModal";
import { getAnswers } from "../../../services/adminService";

const statusStyles = {
  APPROVED: "bg-green-100 text-green-700",
  PENDING:  "bg-orange-100 text-orange-600",
  REJECTED: "bg-red-100 text-red-600",
};

const answerStyles = {
  YES: "bg-green-50 text-green-700 border border-green-200",
  NO:  "bg-red-50 text-red-700 border border-red-200",
};

export default function ValidationTable({ search, status, readOnly = false }) {
  const [answers,  setAnswers]  = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    getAnswers(status !== "ALL" ? { status } : {})
      .then((data) => setAnswers(Array.isArray(data) ? data : []))
      .catch(() => setError("Failed to load answers"))
      .finally(() => setLoading(false));
  }, [status]);

  useEffect(() => {
    let cancelled = false;
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const data = await getAnswers(status !== "ALL" ? { status } : {});
        if (!cancelled) setAnswers(Array.isArray(data) ? data : []);
      } catch {
        if (!cancelled) setError("Failed to load answers");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchData();
    return () => { cancelled = true; };
  }, [status]);

  const term     = (search ?? "").toLowerCase();
  const filtered = answers.filter(
    (a) =>
      (a.user     ?? "").toLowerCase().includes(term) ||
      (a.question ?? "").toLowerCase().includes(term),
  );

  const cols = readOnly ? 4 : 5;

  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-400 uppercase text-xs">
            <tr>
              <th className="px-6 py-3 text-left font-semibold">User</th>
              <th className="px-6 py-3 text-left font-semibold">Question</th>
              <th className="px-6 py-3 text-left font-semibold">Answer</th>
              <th className="px-6 py-3 text-left font-semibold">Status</th>
              {!readOnly && <th className="px-6 py-3" />}
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={cols} className="px-6 py-10 text-center text-gray-400">Loading…</td></tr>
            )}
            {error && !loading && (
              <tr><td colSpan={cols} className="px-6 py-10 text-center text-red-500">{error}</td></tr>
            )}
            {!loading && !error && filtered.length === 0 && (
              <tr><td colSpan={cols} className="px-6 py-10 text-center text-gray-400">No submissions found.</td></tr>
            )}
            {!loading && !error && filtered.map((a, idx) => (
              <tr key={`${a.answer_id}-${idx}`} className="border-t border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <Link to={`/admin/users/${a.user_id}`} className="font-medium text-gray-800 hover:text-blue-600 transition-colors">
                    {a.user}
                  </Link>
                </td>
                <td className="px-6 py-4 text-gray-700 max-w-md truncate">{a.question}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full ${answerStyles[a.answer] ?? "bg-gray-100 text-gray-600"}`}>
                    {a.answer}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center text-xs font-semibold px-3 py-1 rounded-full ${statusStyles[a.status] ?? "bg-gray-100 text-gray-600"}`}>
                    {a.status}
                  </span>
                </td>
                {!readOnly && (
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => setSelected(a)} className="text-blue-600 text-xs font-medium hover:text-blue-800">
                      Review
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected && (
        <ValidationModal
          answer={selected}
          readOnly={readOnly}
          onClose={() => setSelected(null)}
          onDone={() => { setSelected(null); load(); }}
        />
      )}
    </>
  );
}