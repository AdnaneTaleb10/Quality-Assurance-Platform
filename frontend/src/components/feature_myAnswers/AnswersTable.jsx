// components/feature_myAnswers/AnswersTable.jsx
import {
  CheckCircle2,
  Clock,
  XCircle,
  FileText,
  AlertCircle,
  Loader2,
} from "lucide-react";

function StatusBadge({ status }) {
  const map = {
    APPROVED: {
      label: "Approved",
      icon: CheckCircle2,
      cls: "bg-green-50 text-green-700 border-green-200",
    },
    PENDING: {
      label: "Pending",
      icon: Clock,
      cls: "bg-orange-50 text-orange-600 border-orange-200",
    },
    REJECTED: {
      label: "Rejected",
      icon: XCircle,
      cls: "bg-red-50 text-red-600 border-red-200",
    },
  };
  const { label, icon: Icon, cls } = map[status] ?? map.PENDING;
  return (
    <span
      className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full border ${cls}`}
    >
      <Icon className="w-3 h-3" />
      {label}
    </span>
  );
}

function AnswerBadge({ answer }) {
  return (
    <span
      className={`inline-flex items-center text-[11px] font-bold px-2.5 py-1 rounded-full ${
        answer === "YES"
          ? "bg-green-100 text-green-700"
          : "bg-red-100 text-red-600"
      }`}
    >
      {answer === "YES" ? "Yes" : "No"}
    </span>
  );
}

function formatDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function AnswersTable({ answers, loading, error }) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
        <p className="text-sm text-gray-400">Loading your answers…</p>
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

  if (!answers || answers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <FileText className="w-6 h-6 text-gray-300" />
        <p className="text-sm text-gray-400">No answers submitted yet.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50/60">
            <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider py-3 px-6 w-32">
              Code
            </th>
            <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider py-3 px-4">
              Question
            </th>
            <th className="text-center text-[11px] font-semibold text-gray-400 uppercase tracking-wider py-3 px-4 w-24">
              Answer
            </th>
            <th className="text-center text-[11px] font-semibold text-gray-400 uppercase tracking-wider py-3 px-4 w-24">
              Proofs
            </th>
            <th className="text-center text-[11px] font-semibold text-gray-400 uppercase tracking-wider py-3 px-4 w-32">
              Status
            </th>
            <th className="text-right text-[11px] font-semibold text-gray-400 uppercase tracking-wider py-3 px-6 w-32">
              Submitted
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-50">
          {answers.map((row) => (
            <tr
              key={row.answer_id}
              className="hover:bg-blue-50/30 transition-colors"
            >
              {/* Code */}
              <td className="py-4 px-6">
                <span className="font-mono text-[11px] font-semibold text-blue-700 bg-blue-50 border border-blue-100 rounded-md px-2 py-0.5">
                  {row.question_code}
                </span>
              </td>

              {/* Question text */}
              <td className="py-4 px-4">
                <p className="text-gray-800 text-sm leading-snug line-clamp-2">
                  {row.question_text}
                </p>
                {row.validation_status === "REJECTED" &&
                  row.rejection_comment && (
                    <p className="text-[11px] text-red-500 mt-1 italic">
                      Reason: {row.rejection_comment}
                    </p>
                  )}
              </td>

              {/* Answer */}
              <td className="py-4 px-4 text-center">
                <AnswerBadge answer={row.answer} />
              </td>

              {/* Proofs count */}
              <td className="py-4 px-4 text-center">
                <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-full px-2.5 py-1">
                  <FileText className="w-3 h-3 text-gray-400" />
                  {row.proofs_count}
                </span>
              </td>

              {/* Validation status */}
              <td className="py-4 px-4 text-center">
                <StatusBadge status={row.validation_status} />
              </td>

              {/* Submitted at */}
              <td className="py-4 px-6 text-right text-xs text-gray-400">
                {formatDate(row.submitted_at)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
