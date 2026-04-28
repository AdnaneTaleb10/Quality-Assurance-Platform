// components/adminDashboard/review/AnswerReviewCard.jsx
import { useState } from "react";
import {
  CheckCircle2,
  XCircle,
  MessageSquare,
  Calendar,
  Loader2,
} from "lucide-react";

import ProofViewer from "./ProofViewer";
import RejectReasonModal from "./RejectReasonModal";
import { reviewAnswer } from "../../../services/adminService";

function formatDateTime(d) {
  if (!d) return "—";
  return new Date(d).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AnswerReviewCard({ answer, onDecided, readOnly = false }) {
  const [submitting, setSubmitting] = useState(null);
  const [error,      setError]      = useState(null);
  const [rejectOpen, setRejectOpen] = useState(false);

  const isYes = answer.response === "YES";

  async function approve() {
    setSubmitting("APPROVED");
    setError(null);
    try {
      await reviewAnswer({ answer_id: answer.answer_id, status: "APPROVED", comment: "" });
      onDecided?.(answer.answer_id);
    } catch {
      setError("Could not approve this answer. Please try again.");
      setSubmitting(null);
    }
  }

  async function rejectWithReason(comment) {
    setSubmitting("REJECTED");
    setError(null);
    try {
      await reviewAnswer({ answer_id: answer.answer_id, status: "REJECTED", comment });
      setRejectOpen(false);
      onDecided?.(answer.answer_id);
    } catch {
      setError("Could not reject this answer. Please try again.");
      setSubmitting(null);
    }
  }

  return (
    <article className="px-6 py-5">
      <div className="flex items-start gap-4">
        {/* Response pill */}
        <div className={`shrink-0 mt-0.5 inline-flex items-center text-[11px] font-bold px-2.5 py-1 rounded-md tracking-wide ${isYes ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
          {answer.response}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-900 leading-relaxed">
            {answer.question_text}
          </h3>

          <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-gray-400">
            <span className="inline-flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {formatDateTime(answer.submitted_at)}
            </span>
            {answer.question_id && (
              <span>Q-ID: {answer.question_id}</span>
            )}
          </div>

          {answer.comment && (
            <div className="mt-3 flex gap-2 items-start bg-gray-50 border border-gray-100 rounded-lg px-3 py-2">
              <MessageSquare className="w-3.5 h-3.5 text-gray-400 mt-0.5 shrink-0" />
              <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-line">
                {answer.comment}
              </p>
            </div>
          )}

          <div className="mt-4">
            <ProofViewer proof={answer.proof} />
          </div>

          {error && <p className="mt-3 text-xs text-red-500">{error}</p>}

          {/* Actions — hidden for Rector */}
          {!readOnly && (
            <div className="mt-4 flex items-center gap-2">
              <button
                onClick={approve}
                disabled={!!submitting}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-green-600 text-white hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
              >
                {submitting === "APPROVED"
                  ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  : <CheckCircle2 className="w-3.5 h-3.5" />
                }
                Approve
              </button>
              <button
                onClick={() => setRejectOpen(true)}
                disabled={!!submitting}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white text-red-600 border border-red-200 hover:bg-red-50 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
              >
                <XCircle className="w-3.5 h-3.5" />
                Reject
              </button>
            </div>
          )}
        </div>
      </div>

      {!readOnly && (
        <RejectReasonModal
          open={rejectOpen}
          submitting={submitting === "REJECTED"}
          onClose={() => !submitting && setRejectOpen(false)}
          onConfirm={rejectWithReason}
          question={answer.question_text}
        />
      )}
    </article>
  );
}