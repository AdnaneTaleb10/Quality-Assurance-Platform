// components/adminDashboard/validation/ValidationModal.jsx
import { useState } from "react";
import { X, CheckCircle2, XCircle, FileText, ExternalLink, Image } from "lucide-react";
import { validateAnswer } from "../../../services/adminService";

const BACKEND = (import.meta.env.VITE_API_URL ?? "").replace(/\/api\/?$/, "");

function proofUrl(filePath) {
  return `${BACKEND}/${filePath}`;
}

function isImage(filePath = "") {
  return /\.(png|jpe?g|gif|webp)$/i.test(filePath);
}

function ProofItem({ filePath, index }) {
  const url  = proofUrl(filePath);
  const img  = isImage(filePath);
  const name = filePath.split("/").pop();
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors group"
    >
      {img
        ? <Image    className="w-4 h-4 text-gray-400 group-hover:text-blue-500 shrink-0" />
        : <FileText className="w-4 h-4 text-gray-400 group-hover:text-blue-500 shrink-0" />
      }
      <span className="text-sm text-blue-600 group-hover:text-blue-800 truncate flex-1">
        Proof {index + 1} — {name}
      </span>
      <ExternalLink className="w-3.5 h-3.5 text-gray-400 group-hover:text-blue-500 shrink-0" />
    </a>
  );
}

export default function ValidationModal({ answer, onClose, onDone, readOnly = false }) {
  const [comment, setComment] = useState(answer.comment ?? "");
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  const proofs = Array.isArray(answer.proofs) && answer.proofs.length > 0
    ? answer.proofs
    : answer.proof ? [answer.proof] : [];

  async function handleSubmit(status) {
    if (status === "REJECTED" && comment.trim().length < 3) {
      setError("A rejection reason (at least 3 characters) is required.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await validateAnswer({ answer_id: answer.answer_id, status, comment });
      onDone();
      onClose();
    } catch (err) {
      setError(err?.response?.data?.error ?? "Failed to submit. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 overflow-hidden" onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-gray-900">
              Review Answer #{answer.answer_id}
            </h2>
            {readOnly && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 border border-amber-200">
                Read-only
              </span>
            )}
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-gray-50 rounded-xl px-4 py-3">
              <p className="text-xs text-gray-400 mb-1">User</p>
              <p className="font-medium text-gray-800">{answer.user}</p>
            </div>
            <div className="bg-gray-50 rounded-xl px-4 py-3">
              <p className="text-xs text-gray-400 mb-1">Answer</p>
              <p className="font-medium text-gray-800">{answer.answer}</p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl px-4 py-3 text-sm">
            <p className="text-xs text-gray-400 mb-1">Question</p>
            <p className="text-gray-800">{answer.question}</p>
          </div>

          {/* Proofs */}
          {proofs.length > 0 ? (
            <div>
              <p className="text-xs font-medium text-gray-500 mb-2">Proof Documents ({proofs.length})</p>
              <div className="space-y-2">
                {proofs.map((fp, i) => <ProofItem key={i} filePath={fp} index={i} />)}
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-400 italic">No proof documents uploaded.</p>
          )}

          {/* Comment — read-only for Rector, editable for Admin */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">
              {readOnly ? "Admin Comment" : (
                <>Comment <span className="text-gray-400 font-normal">(required when rejecting)</span></>
              )}
            </label>
            {readOnly ? (
              <div className="w-full text-sm border border-gray-100 bg-gray-50 rounded-xl px-4 py-3 text-gray-700 min-h-[72px]">
                {comment || <span className="text-gray-400 italic">No comment.</span>}
              </div>
            ) : (
              <textarea
                rows={3}
                value={comment}
                onChange={(e) => { setComment(e.target.value); setError(null); }}
                placeholder="Add a comment for the user..."
                className="w-full text-sm border border-gray-200 rounded-xl px-4 py-3 text-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            )}
          </div>

          {error && (
            <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
          )}
        </div>

        {/* Actions — hidden for Rector */}
        {!readOnly && (
          <div className="flex items-center gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50">
            <button
              disabled={loading}
              onClick={() => handleSubmit("REJECTED")}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-red-200 text-red-600 text-sm font-medium hover:bg-red-50 transition-colors disabled:opacity-50"
            >
              <XCircle className="w-4 h-4" />
              Reject
            </button>
            <button
              disabled={loading}
              onClick={() => handleSubmit("APPROVED")}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-900 text-white text-sm font-medium hover:bg-blue-950 transition-colors disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              {loading ? "Saving…" : "Approve"}
            </button>
          </div>
        )}

        {/* Rector close button */}
        {readOnly && (
          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-100 transition-colors"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}