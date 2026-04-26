// pages/MyAnswersPage.jsx
import { useEffect, useState } from "react";
import Sidebar from "../components/feature_evaluation/Evaluation_sidebar";
import Topbar from "../components/layout/Topbar";
import AnswersTable from "../components/feature_myAnswers/AnswersTable";
import { getMyAnswers } from "../services/myAnswersService";

export default function MyAnswersPage() {
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    let isMounted = true;
    getMyAnswers()
      .then((data) => { if (isMounted) setAnswers(data.answers); })
      .catch((err) => { if (isMounted) setError(err?.message ?? "Failed to load answers"); })
      .finally(()  => { if (isMounted) setLoading(false); });
    return () => { isMounted = false; };
  }, []);

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />

        <main className="flex-1 overflow-y-auto px-8 py-8">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">My Answers</h1>
            <p className="text-sm text-gray-400 mt-1">
              All questions you have submitted answers for.
            </p>
          </div>

          {/* Table card */}
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-base font-semibold text-gray-800">Submitted Answers</h2>
              {!loading && !error && (
                <span className="text-xs text-gray-400">
                  {answers.length} answer{answers.length !== 1 ? "s" : ""}
                </span>
              )}
            </div>

            <AnswersTable answers={answers} loading={loading} error={error} />
          </div>
        </main>
      </div>
    </div>
  );
}