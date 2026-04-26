// pages/DashboardPage.jsx
import { useEffect, useState } from "react";
import { PlusCircle, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/feature_evaluation/Evaluation_sidebar";
import Topbar from "../components/layout/Topbar";
import StatsBar from "../components/UserDashboard/StatsBar";
import QuestionsTable from "../components/UserDashboard/QuestionsTable";
import { getDashboardData } from "../services/dashboardService";
 
export default function UserDashboardPage() {
  const navigate = useNavigate();

  const [stats, setStats]       = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [search, setSearch]     = useState("");

  useEffect(() => {
    let isMounted = true;

    async function fetchAll() {
      try {
        const data = await getDashboardData();
        if (isMounted) {
          setStats(data.stats);
          setQuestions(data.questions);
        }
      } catch (err) {
        if (isMounted)
          setError(err?.message ?? "Failed to load dashboard");
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchAll();
    return () => { isMounted = false; };
  }, []);

  // Client-side search filter
  const filtered = questions.filter((q) => {
    const term = search.trim().toLowerCase();
    if (!term) return true;
    return (
      q.question_text.toLowerCase().includes(term) ||
      q.reference_code.toLowerCase().includes(term) ||
      q.reference_title?.toLowerCase().includes(term) ||
      q.champ_name?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />

        <main className="flex-1 overflow-y-auto px-8 py-8">
          {/* ── Page header ── */}
          <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                Infrastructure Dashboard
              </h1>
              <p className="text-sm text-gray-400 mt-1">
                Systematic quality assurance for university facilities.
              </p>
            </div>

          </div>

          {/* ── Stats ── */}
          <StatsBar stats={stats} loading={loading} />

          {/* ── Questions table card ── */}
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            {/* Table header row */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-wrap gap-3">
              <h2 className="text-base font-semibold text-gray-800">
                Questions to Answer
              </h2>

              {/* Search */}
              <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 w-64">
                <Search className="w-4 h-4 text-gray-400 shrink-0" />
                <input
                  placeholder="Search questions…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="outline-none bg-transparent text-sm w-full placeholder-gray-400"
                />
              </div>
            </div>

            <QuestionsTable
              questions={filtered}
              loading={loading}
              error={error}
            />
          </div>
        </main>
      </div>
    </div>
  );
}