import { useEffect, useState, useCallback, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Search, CheckCircle2, Clock } from "lucide-react";

import Sidebar from "../components/adminDashboard/Sidebar";
import Topbar from "../components/layout/Topbar";
import AnswerReviewCard from "../components/adminDashboard/review/AnswerReviewCard";
import { getUserPendingAnswers } from "../services/adminService";

function formatDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function initials(name = "") {
  return name
    .split(" ")
    .map((s) => s[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function UserAnswersReviewPage() {
  const { userId } = useParams();

  const [data, setData] = useState(null);
  // When userId is missing we skip the effect entirely and render inline.
  // This avoids calling setState synchronously inside the effect body.
  const [loading, setLoading] = useState(!!userId);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [responseFilter, setResponseFilter] = useState("ALL");

  useEffect(() => {
    // If userId is falsy we never enter this effect, so no setState is called
    // synchronously — satisfies react-hooks/set-state-in-effect.
    if (!userId) return;

    let isMounted = true;

    async function fetchData() {
      try {
        const result = await getUserPendingAnswers(userId);
        if (isMounted) setData(result);
      } catch (err) {
        if (isMounted)
          setError(err?.response?.data?.error ?? "Failed to load pending answers");
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [userId]);

  const visibleReferences = useMemo(() => {
    if (!data) return [];
    const term = search.trim().toLowerCase();

    return data.references
      .map((r) => ({
        ...r,
        answers: r.answers.filter((a) => {
          const matchSearch =
            !term ||
            a.question_text.toLowerCase().includes(term) ||
            (a.comment ?? "").toLowerCase().includes(term);

          const matchResponse =
            responseFilter === "ALL" || a.response === responseFilter;

          return matchSearch && matchResponse;
        }),
      }))
      .filter((r) => r.answers.length > 0);
  }, [data, search, responseFilter]);

  const handleAnswerDecided = useCallback((answerId) => {
    setData((prev) => {
      if (!prev) return prev;
      const references = prev.references
        .map((r) => ({
          ...r,
          answers: r.answers.filter((a) => a.answer_id !== answerId),
        }))
        .filter((r) => r.answers.length > 0);
      return {
        ...prev,
        references,
        total_pending: Math.max(0, (prev.total_pending ?? 0) - 1),
      };
    });
  }, []);

  // Rendered outside the effect — no setState-in-effect violation
  if (!userId) {
    return (
      <div className="flex h-screen bg-gray-50 font-sans">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Topbar />
          <main className="flex-1 flex items-center justify-center">
            <p className="text-sm text-red-500">
              User ID is missing from the URL. Check your route configuration.
            </p>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />

        <main className="flex-1 overflow-y-auto px-8 py-8">
          <Link
            to="/admin/users"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Users
          </Link>

          {loading && (
            <p className="text-sm text-gray-400">Loading pending answers…</p>
          )}

          {error && !loading && (
            <p className="text-sm text-red-500">{error}</p>
          )}

          {!loading && !error && data && (
            <>
              {/* ── Header card ── */}
              <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 mb-6">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center text-lg font-semibold">
                    {initials(data.user.name)}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                          {data.user.name}
                        </h1>
                        <p className="text-sm text-gray-500">{data.user.email}</p>
                      </div>

                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-orange-100 text-orange-600">
                        <Clock className="w-3.5 h-3.5" />
                        {data.total_pending ?? 0} pending
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mt-3">
                      <span className="text-xs px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                        {data.user.role ?? "USER"}
                      </span>
                      <span className="text-xs text-gray-400">
                        Joined {formatDate(data.user.joined_at)}
                      </span>
                      <Link
                        to={`/admin/users/${userId}/submissions`}
                        className="text-xs text-blue-700 hover:underline"
                      >
                        View full submissions →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Filters ── */}
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2 flex-1 max-w-sm">
                  <Search className="w-4 h-4 text-gray-400" />
                  <input
                    placeholder="Search questions or comments…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="outline-none w-full text-sm bg-transparent"
                  />
                </div>

                {["ALL", "YES", "NO"].map((r) => (
                  <button
                    key={r}
                    onClick={() => setResponseFilter(r)}
                    className={`px-3 py-1 rounded-full text-xs font-medium border ${
                      responseFilter === r
                        ? "bg-blue-900 text-white border-blue-900"
                        : "bg-white text-gray-600 border-gray-200"
                    }`}
                  >
                    {r === "ALL" ? "All answers" : `Response: ${r}`}
                  </button>
                ))}
              </div>

              {/* ── Content ── */}
              {visibleReferences.length === 0 ? (
                <div className="bg-white border rounded-2xl p-12 text-center">
                  <CheckCircle2 className="w-6 h-6 mx-auto text-green-600 mb-3" />
                  <h3 className="font-semibold">Nothing left to review</h3>
                </div>
              ) : (
                visibleReferences.map((ref) => (
                  <section
                    key={ref.reference_id}
                    className="bg-white border rounded-2xl mb-6"
                  >
                    <header className="px-6 py-4 border-b flex justify-between items-center">
                      <h2 className="font-semibold">{ref.reference_title}</h2>
                      <span className="text-xs text-gray-400">
                        {ref.answers.length} pending
                      </span>
                    </header>

                    {ref.answers.map((a) => (
                      <AnswerReviewCard
                        key={a.answer_id}
                        answer={a}
                        onDecided={handleAnswerDecided}
                      />
                    ))}
                  </section>
                ))
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}