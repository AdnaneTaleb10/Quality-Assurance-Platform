// components/dashboard/QuestionsTable.jsx
import { useNavigate } from "react-router-dom";
import { ArrowRight, FileCheck2, AlertCircle, Loader2 } from "lucide-react";

export default function QuestionsTable({ questions, loading, error }) {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
        <p className="text-sm text-gray-400">Loading questions…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <AlertCircle className="w-6 h-6 text-red-400" />
        <p className="text-sm text-red-500">{error}</p>
      </div>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <FileCheck2 className="w-6 h-6 text-gray-300" />
        <p className="text-sm text-gray-400">No questions to answer yet.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider pb-3 px-6 w-48">
              Reference
            </th>
            <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider pb-3 px-4">
              Question
            </th>
            <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider pb-3 px-4 w-36">
              Champs
            </th>
            <th className="text-center text-xs font-semibold text-gray-400 uppercase tracking-wider pb-3 px-4 w-32">
              Proofs
            </th>
            <th className="pb-3 px-6 w-32" />
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-50">
          {questions.map((q) => (
            <tr
              key={q.question_id}
              className="group hover:bg-blue-50/40 transition-colors duration-150"
            >
              {/* Reference code + title */}
              <td className="py-4 px-6">
                <span className="inline-block font-mono text-[11px] font-semibold text-blue-700 bg-blue-50 border border-blue-100 rounded-md px-2 py-0.5 mb-1">
                  {q.reference_code}
                </span>
              </td>

              {/* Question text */}
              <td className="py-4 px-4">
                <p className="text-gray-800 font-medium leading-snug line-clamp-2">
                  {q.question_text}
                </p>
                {q.question_code && (
                  <span className="text-[11px] text-gray-400 font-mono">
                    {q.question_code}
                  </span>
                )}
              </td>

              {/* Champion (champ) title */}
              <td className="py-4 px-4">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-[11px] font-bold shrink-0">
                    {initials(q.champ_name ?? "—")}
                  </div>
                  <span className="text-xs text-gray-700 line-clamp-1">
                    {q.champ_name ?? "—"}
                  </span>
                </div>
              </td>

              {/* Number of proofs required */}
              <td className="py-4 px-4 text-center">
                <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-full px-2.5 py-1">
                  <FileCheck2 className="w-3 h-3 text-gray-400" />
                  {q.proofs_required ?? 0}
                </span>
              </td>

              {/* Answer button */}
              <td className="py-4 px-6 text-right">
                <button
                  onClick={() => navigate(`/evaluation/${q.question_id}`)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-lg bg-blue-900 text-white hover:bg-blue-800 active:scale-95 transition-all duration-150 shadow-sm"
                >
                  Answer
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function initials(name = "") {
  return name
    .split(" ")
    .map((s) => s[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}
