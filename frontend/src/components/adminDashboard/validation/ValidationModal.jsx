// components/adminDashboard/validation/ValidationModal.jsx
import { useState } from "react";
import { X, CheckCircle2, XCircle, FileText, ExternalLink } from "lucide-react";
import { validateAnswer } from "../../../services/adminService";

export default function ValidationModal({ answer, onClose, onDone }) {
  const [comment, setComment] = useState(answer.comment ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(status) {
    setLoading(true);
    setError(null);
    try {
      await validateAnswer({
        answer_id: answer.answer_id,
        status,
        comment,
      });
      onDone();
      onClose();
    } catch {
      setError("Failed to submit. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">
            Review Answer #{answer.answer_id}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
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

          {answer.proof && (
            <a
              href={`${import.meta.env.VITE_API_URL?.replace("/api", "")}/${answer.proof}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 transition-colors"
            >
              <FileText className="w-4 h-4" />
              View Proof Document
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">
              Comment (optional)
            </label>
            <textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add a comment for the user..."
              className="w-full text-sm border border-gray-200 rounded-xl px-4 py-3 text-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>

        {/* Actions */}
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
            {loading ? "Saving..." : "Approve"}
          </button>
        </div>
      </div>
    </div>
  );
}