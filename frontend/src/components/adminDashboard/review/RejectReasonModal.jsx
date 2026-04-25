// components/adminDashboard/review/RejectReasonModal.jsx
//
// Small controlled modal that captures a rejection reason before
// calling the backend. Reason is required.

import { useState } from "react";
import { XCircle, Loader2, X } from "lucide-react";

export default function RejectReasonModal({
  open,
  onClose,
  onConfirm,
  submitting,
  question,
}) {
  const [reason, setReason] = useState("");

  const handleClose = () => {
  if (!submitting) {
    setReason("");
    onClose();
  }
};

  if (!open) return null;

  const canSubmit = reason.trim().length >= 3 && !submitting;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        <header className="flex items-start justify-between gap-3 px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-100 text-red-600">
              <XCircle className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">
                Reject this answer?
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                The user will see your reason.
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={submitting}
            className="text-gray-400 hover:text-gray-700 disabled:opacity-50"
          >
            <X className="w-4 h-4" />
          </button>
        </header>

        <div className="px-5 py-4">
          {question && (
            <p className="text-xs text-gray-500 mb-2 line-clamp-2">
              <span className="font-medium text-gray-700">Question:</span>{" "}
              {question}
            </p>
          )}

          <label className="block text-xs font-medium text-gray-700 mb-1">
            Reason for rejection
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={4}
            placeholder="Explain why this answer / proof is not acceptable..."
            className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 resize-none"
          />
          <p className="text-[10px] text-gray-400 mt-1">
            Minimum 3 characters.
          </p>
        </div>

        <footer className="flex items-center justify-end gap-2 px-5 py-3 bg-gray-50 border-t border-gray-100">
          <button
            onClick={handleClose}
            disabled={submitting}
            className="px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 hover:bg-white border border-transparent hover:border-gray-200 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(reason.trim())}
            disabled={!canSubmit}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <XCircle className="w-3.5 h-3.5" />
            )}
            Confirm rejection
          </button>
        </footer>
      </div>
    </div>
  );
}