import { useCallback, useEffect, useReducer } from "react";
import { useParams, useNavigate } from "react-router-dom";

import Topbar from "../components/layout/Topbar";
import Sidebar from "../components/feature_evaluation/Evaluation_sidebar";
import QuestionCard from "../components/feature_evaluation/QuestionCard";
import Toast from "../components/feature_evaluation/Toast";
import { getQuestion, submitAnswer } from "../services/evaluationService";

const makeInitial = () => ({
  question:       null,
  loading:        true,
  fetchError:     null,
  selectedAnswer: null,
  uploadedFiles:  {},
  submitting:     false,
  toast:          null,
});

function reducer(state, action) {
  switch (action.type) {
    case "FETCH_SUCCESS": return { ...state, question: action.payload, loading: false, fetchError: null };
    case "FETCH_ERROR":   return { ...state, question: null, loading: false, fetchError: action.payload };
    case "SET_ANSWER":    return { ...state, selectedAnswer: action.payload };
    case "SET_FILE":      return { ...state, uploadedFiles: { ...state.uploadedFiles, [action.slot]: action.file } };
    case "SUBMIT_START":  return { ...state, submitting: true };
    case "SUBMIT_END":    return { ...state, submitting: false };
    case "SHOW_TOAST":    return { ...state, toast: { message: action.message, type: action.toastType } };
    case "CLEAR_TOAST":   return { ...state, toast: null };
    case "RESET":         return makeInitial();
    default:              return state;
  }
}

export default function EvaluationPage() {
  const { questionId } = useParams();
  const navigate       = useNavigate();
  const [state, dispatch] = useReducer(reducer, undefined, makeInitial);
  const { question, loading, fetchError, selectedAnswer, uploadedFiles, submitting, toast } = state;

  useEffect(() => {
    let cancelled = false;
    dispatch({ type: "RESET" });

    getQuestion(questionId)
      .then((data) => { if (!cancelled) dispatch({ type: "FETCH_SUCCESS", payload: data }); })
      .catch(()    => { if (!cancelled) dispatch({ type: "FETCH_ERROR",   payload: "Failed to load question." }); });

    return () => { cancelled = true; };
  }, [questionId]);

  const showToast = useCallback((message, type = "error") => {
    dispatch({ type: "SHOW_TOAST", message, toastType: type });
  }, []);

  const handleSaveAndContinue = async () => {
    if (!selectedAnswer) {
      showToast("Please select Yes or No before continuing.");
      return;
    }

    // Derive required count from actual slots, not from API field
    const proofSlots     = question?.proof_slots ?? [];
    const proofsRequired = proofSlots.length;
    const uploadedCount  = Object.values(uploadedFiles).filter(Boolean).length;

    if (uploadedCount < proofsRequired) {
      showToast(
        `Please upload all ${proofsRequired} required proof document${proofsRequired > 1 ? "s" : ""} (${uploadedCount}/${proofsRequired} uploaded).`
      );
      return;
    }

    dispatch({ type: "SUBMIT_START" });
    try {
      // Send files in slot_order order
      const files = proofSlots
        .map(({ slot_order }) => uploadedFiles[slot_order])
        .filter(Boolean);

      const result = await submitAnswer({
        questionId: question.question_id,
        answer:     selectedAnswer.toUpperCase(),
        files,
      });

      showToast("Answer saved successfully!", "success");

      setTimeout(() => {
        if (result.next_question_id) {
          navigate(`/evaluation/${result.next_question_id}`);
        } else {
          navigate("/evaluation/done");
        }
      }, 1000);

    } catch (err) {
      const msg = err?.response?.data?.error ?? "Failed to submit. Please try again.";
      showToast(msg);
    } finally {
      dispatch({ type: "SUBMIT_END" });
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#F5F7FA] font-sans">
      <Topbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 flex flex-col overflow-y-auto pt-8 items-center">
          <div className="w-full max-w-[720px] mb-8 px-2">
            <h2 className="text-[28px] font-bold text-[#1E293B]">
              {question?.champ_name ?? "Evaluation"}
            </h2>
            {question && (
              <p className="text-sm text-gray-400 mt-1">{question.reference_title}</p>
            )}
          </div>

          {loading && (
            <div className="w-full max-w-[600px] px-2">
              <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm animate-pulse space-y-4">
                <div className="h-4 bg-gray-100 rounded w-1/4" />
                <div className="h-6 bg-gray-100 rounded w-3/4" />
                <div className="grid grid-cols-2 gap-3">
                  <div className="h-16 bg-gray-100 rounded-lg" />
                  <div className="h-16 bg-gray-100 rounded-lg" />
                </div>
                <div className="space-y-2">
                  {[1,2,3].map(i => <div key={i} className="h-12 bg-gray-100 rounded-md" />)}
                </div>
              </div>
            </div>
          )}

          {fetchError && (
            <div className="px-4 py-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl">
              {fetchError}
            </div>
          )}

          {!loading && !fetchError && question && (
            <div className="w-full max-w-[720px] px-2 pb-8">
              <QuestionCard
                question={question}
                selectedAnswer={selectedAnswer}
                onAnswerChange={(val) => dispatch({ type: "SET_ANSWER", payload: val })}
                uploadedFiles={uploadedFiles}
                onFileUpload={(slot, file) => dispatch({ type: "SET_FILE", slot, file })}
                onSaveAndContinue={handleSaveAndContinue}
                submitting={submitting}
              />
            </div>
          )}
        </main>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => dispatch({ type: "CLEAR_TOAST" })}
        />
      )}
    </div>
  );
}