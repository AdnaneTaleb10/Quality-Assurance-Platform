// components/adminDashboard/submissions/ReferenceCard.jsx
import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  XCircle,
  FileText,
  ExternalLink,
} from "lucide-react";
import { validateReference } from "../../../services/adminService";

const statusStyles = {
  APPROVED: "bg-green-100 text-green-700",
  PENDING: "bg-orange-100 text-orange-600",
  REJECTED: "bg-red-100 text-red-600",
};

const answerStyles = {
  YES: "bg-green-50 text-green-700 border border-green-200",
  NO: "bg-red-50 text-red-700 border border-red-200",
};

export default function ReferenceCard({ reference, userId, onChanged }) {
  const [open, setOpen] = useState(true);
  const [comment, setComment] = useState("");
  const [revalidate, setRevalidate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const pending = reference.answers.filter((a) => a.status === "PENDING");
  const approved = reference.answers.filter((a) => a.status === "APPROVED");
  const rejected = reference.answers.filter((a) => a.status === "REJECTED");

  async function bulk(status) {
    setLoading(true);
    setError(null);
    try {
      await validateReference({
        userId,
        referenceId: reference.reference_id,
        status,
        comment,
        revalidate,
      });
      setComment("");
      onChanged?.();
    } catch {
      setError("Failed to submit. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white border border-gray-100 rounded-2xl mb-6 shadow-sm overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-6 py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors"
      >
        <div className="text-left">
          <h2 className="font-semibold text-gray-900">{reference.name}</h2>
          <p className="text-xs text-gray-400 mt-0.5">
            {reference.answers.length} answers · {pending.length} pending ·{" "}
            {approved.length} approved · {rejected.length} rejected
          </p>
        </div>
        {open ? (
          <ChevronUp className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        )}
      </button>

      {open && (
        <>
          {/* Body */}
          <div className="divide-y divide-gray-50">
            {reference.answers.map((a) => (
              <div key={a.answer_id} className="px-6 py-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{a.question}</p>

                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <span
                        className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full ${
                          answerStyles[a.answer] ?? "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {a.answer}
                      </span>

                      <span
                        className={`inline-flex items-center text-xs font-semibold px-3 py-1 rounded-full ${
                          statusStyles[a.status] ?? "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {a.status}
                      </span>

                      {a.proof && (
                        <a
                          href={`${import.meta.env.VITE_API_URL?.replace(
                            "/api",
                            ""
                          )}/${a.proof}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          Proof
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>

                    {a.comment && (
                      <div className="mt-3 text-xs text-gray-600 bg-gray-50 rounded-lg px-3 py-2">
                        <span className="font-medium text-gray-500">
                          Existing comment:{" "}
                        </span>
                        {a.comment}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer — bulk actions */}
          <div className="px-6 py-5 border-t border-gray-100 bg-gray-50 space-y-3">
            <textarea
              rows={2}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Shared comment for this reference (optional)..."
              className="w-full text-sm border border-gray-200 rounded-xl px-4 py-3 text-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none bg-white"
            />

            <div className="flex flex-wrap items-center justify-between gap-3">
              <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={revalidate}
                  onChange={(e) => setRevalidate(e.target.checked)}
                  className="rounded border-gray-300"
                />
                Re-validate all (override already decided)
              </label>

              <div className="flex items-center gap-2">
                <button
                  disabled={loading || (!revalidate && pending.length === 0)}
                  onClick={() => bulk("REJECTED")}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-red-200 text-red-600 text-sm font-medium hover:bg-red-50 transition-colors disabled:opacity-50"
                >
                  <XCircle className="w-4 h-4" />
                  Reject {revalidate ? "all" : "all pending"}
                </button>
                <button
                  disabled={loading || (!revalidate && pending.length === 0)}
                  onClick={() => bulk("APPROVED")}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-900 text-white text-sm font-medium hover:bg-blue-950 transition-colors disabled:opacity-50"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {loading
                    ? "Saving..."
                    : `Approve ${revalidate ? "all" : "all pending"}`}
                </button>
              </div>
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
        </>
      )}
    </div>
  );
}