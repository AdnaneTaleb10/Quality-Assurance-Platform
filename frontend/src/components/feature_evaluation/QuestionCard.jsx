import YesNoSelector from "./YesNoSelector";
import FileUploadZone from "./FileUploadZone";

export default function QuestionCard({
  question,
  selectedAnswer,
  onAnswerChange,
  uploadedFiles,
  onFileUpload,
  onSaveAndContinue,
  submitting,
}) {
  const proofSlots     = question?.proof_slots     ?? [];
  const proofsRequired = proofSlots.length; // derive from slots, not from a separate field
  const uploadedCount  = Object.values(uploadedFiles).filter(Boolean).length;

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm w-full max-w-[600px] mx-auto">

      {/* Reference badge */}
      {question?.reference_code && (
        <span className="inline-block text-[10px] font-semibold text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full mb-3 uppercase tracking-wide">
          {question.reference_code}
        </span>
      )}

      {/* Question text */}
      <h3 className="text-[16px] font-medium text-[#1E293B] mb-6 leading-6">
        {question?.question_text ?? "Loading…"}
      </h3>

      {/* YES / NO */}
      <div className="mb-6">
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Your Declaration
        </p>
        <YesNoSelector selected={selectedAnswer} onChange={onAnswerChange} />
      </div>

      {/* Proof uploads — always show section, even if slots are loading */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
            Proof of Certification
          </p>
          {proofsRequired > 0 && (
            <span className="text-[11px] text-gray-400">
              {uploadedCount} / {proofsRequired} uploaded
            </span>
          )}
        </div>

        {proofSlots.length > 0 ? (
          <FileUploadZone
            proofSlots={proofSlots}
            uploadedFiles={uploadedFiles}
            onFileUpload={onFileUpload}
          />
        ) : (
          <p className="text-xs text-gray-400 italic">No proof documents required for this question.</p>
        )}
      </div>

      {/* Submit */}
      <div className="flex justify-end">
        <button
          onClick={onSaveAndContinue}
          disabled={submitting}
          className="bg-[#1E56A0] hover:bg-[#1a4a8a] disabled:opacity-50 text-white px-5 py-2.5 rounded-md text-sm font-medium shadow transition-colors"
        >
          {submitting ? "Saving…" : "Save and Continue"}
        </button>
      </div>
    </div>
  );
}