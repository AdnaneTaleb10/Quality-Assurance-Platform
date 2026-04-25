import { useEffect, useState, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  MessageSquare,
  Paperclip,
} from "lucide-react";

import Sidebar from "../components/adminDashboard/Sidebar";
import Topbar from "../components/layout/Topbar";
import { getUserSubmissions } from "../services/adminService";

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

function initials(name = "") {
  return name
    .split(" ")
    .map((s) => s[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

const STATUS_STYLE = {
  APPROVED: { pill: "bg-green-100 text-green-700", Icon: CheckCircle2 },
  REJECTED: { pill: "bg-red-100 text-red-600", Icon: XCircle },
  PENDING: { pill: "bg-orange-100 text-orange-600", Icon: Clock },
};

const FILTERS = ["ALL", "PENDING", "APPROVED", "REJECTED"];

export default function UserSubmissionsPage() {
  const { userId } = useParams();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(!!userId);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    if (!userId) return;
    let isMounted = true;

    async function fetchData() {
      try {
        const result = await getUserSubmissions(userId);
        if (isMounted) setData(result);
      } catch (err) {
        if (isMounted)
          setError(err?.response?.data?.error ?? "Failed to load submissions");
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
            !term || a.question_text.toLowerCase().includes(term);
          const matchStatus =
            statusFilter === "ALL" || a.status === statusFilter;
          return matchSearch && matchStatus;
        }),
      }))
      .filter((r) => r.answers.length > 0);
  }, [data, search, statusFilter]);

  // Totals across all references
  const totals = useMemo(() => {
    if (!data) return { pending: 0, approved: 0, rejected: 0 };
    const all = data.references.flatMap((r) => r.answers);
    return {
      pending: all.filter((a) => a.status === "PENDING").length,
      approved: all.filter((a) => a.status === "APPROVED").length,
      rejected: all.filter((a) => a.status === "REJECTED").length,
    };
  }, [data]);

  if (!userId) {
    return (
      <div className="flex h-screen bg-gray-50 font-sans">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Topbar />
          <main className="flex-1 flex items-center justify-center">
            <p className="text-sm text-red-500">User ID missing from URL.</p>
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
            <p className="text-sm text-gray-400">Loading submissions…</p>
          )}
          {error && !loading && <p className="text-sm text-red-500">{error}</p>}

          {!loading && !error && data && (
            <>
              {/* ── Header ── */}
              <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 mb-6">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center text-lg font-semibold shrink-0">
                    {initials(data.user.name)}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between flex-wrap gap-4">
                      <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                          {data.user.name}
                        </h1>
                        <p className="text-sm text-gray-500">
                          {data.user.email}
                        </p>
                      </div>

                      {/* Summary badges */}
                      <div className="flex items-center gap-2 flex-wrap">
                        {totals.pending > 0 && (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full bg-orange-100 text-orange-600">
                            <Clock className="w-3.5 h-3.5" />
                            {totals.pending} pending
                          </span>
                        )}
                        <span className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full bg-green-100 text-green-700">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          {totals.approved} approved
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full bg-red-100 text-red-600">
                          <XCircle className="w-3.5 h-3.5" />
                          {totals.rejected} rejected
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mt-3">
                      <span className="text-xs px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                        {data.user.role ?? "USER"}
                      </span>
                      {totals.pending > 0 && (
                        <Link
                          to={`/admin/users/${userId}/answers/pending`}
                          className="text-xs font-semibold text-blue-700 hover:underline"
                        >
                          Review pending →
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Filters ── */}
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2 flex-1 max-w-sm">
                  <Search className="w-4 h-4 text-gray-400" />
                  <input
                    placeholder="Search questions…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="outline-none w-full text-sm bg-transparent"
                  />
                </div>

                {FILTERS.map((f) => (
                  <button
                    key={f}
                    onClick={() => setStatusFilter(f)}
                    className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                      statusFilter === f
                        ? "bg-blue-900 text-white border-blue-900"
                        : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    {f === "ALL"
                      ? "All"
                      : f.charAt(0) + f.slice(1).toLowerCase()}
                  </button>
                ))}
              </div>

              {/* ── References & answers ── */}
              {visibleReferences.length === 0 ? (
                <div className="bg-white border rounded-2xl p-12 text-center">
                  <CheckCircle2 className="w-6 h-6 mx-auto text-gray-300 mb-3" />
                  <h3 className="font-semibold text-gray-500">
                    No answers found
                  </h3>
                </div>
              ) : (
                visibleReferences.map((ref) => (
                  <section
                    key={ref.reference_id}
                    className="bg-white border border-gray-100 rounded-2xl mb-6 overflow-hidden"
                  >
                    {/* Reference header */}
                    <header className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/60">
                      <h2 className="font-semibold text-gray-800">
                        {ref.reference_title}
                      </h2>
                      <div className="flex items-center gap-2 text-xs">
                        {ref.pending_count > 0 && (
                          <span className="px-2 py-0.5 rounded-full bg-orange-100 text-orange-600 font-semibold">
                            {ref.pending_count} pending
                          </span>
                        )}
                        <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-semibold">
                          {ref.approved_count} approved
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-600 font-semibold">
                          {ref.rejected_count} rejected
                        </span>
                      </div>
                    </header>

                    {/* Answers */}
                    {ref.answers.map((a, i) => {
                      const { pill, Icon } =
                        STATUS_STYLE[a.status] ?? STATUS_STYLE.PENDING;

                      return (
                        <article
                          key={a.answer_id}
                          className={`px-6 py-5 flex items-start gap-4 ${
                            i < ref.answers.length - 1
                              ? "border-b border-gray-50"
                              : ""
                          }`}
                        >
                          {/* Response pill */}
                          <div
                            className={`shrink-0 mt-0.5 inline-flex items-center text-[11px] font-bold px-2.5 py-1 rounded-md tracking-wide ${
                              a.response === "YES"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {a.response}
                          </div>

                          <div className="flex-1 min-w-0">
                            {/* Question */}
                            <p className="text-sm font-semibold text-gray-900 leading-relaxed">
                              {a.question_text}
                            </p>

                            {/* Meta row */}
                            <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-gray-400">
                              <span className="inline-flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {formatDateTime(a.submitted_at)}
                              </span>

                              {/* Status badge */}
                              <span
                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-semibold ${pill}`}
                              >
                                <Icon className="w-3 h-3" />
                                {a.status.charAt(0) +
                                  a.status.slice(1).toLowerCase()}
                              </span>

                              {a.validated_at && (
                                <span className="text-gray-400">
                                  Reviewed {formatDateTime(a.validated_at)}
                                </span>
                              )}
                            </div>

                            {/* Admin comment (rejection reason) */}
                            {a.admin_comment && (
                              <div className="mt-3 flex gap-2 items-start bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                                <MessageSquare className="w-3.5 h-3.5 text-red-400 mt-0.5 shrink-0" />
                                <p className="text-xs text-red-700 leading-relaxed">
                                  {a.admin_comment}
                                </p>
                              </div>
                            )}

                            {/* Proof link */}
                            {a.proof?.url && (
                              <a
                                href={a.proof.url}
                                target="_blank"
                                rel="noreferrer"
                                className="mt-3 inline-flex items-center gap-1.5 text-xs text-blue-600 hover:underline"
                              >
                                <Paperclip className="w-3.5 h-3.5" />
                                {a.proof.file_name ?? "View proof"}
                              </a>
                            )}
                          </div>
                        </article>
                      );
                    })}
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
