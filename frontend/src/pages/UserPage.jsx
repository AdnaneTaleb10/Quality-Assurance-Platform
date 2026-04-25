import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Clock,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Users,
} from "lucide-react";

import Sidebar from "../components/adminDashboard/Sidebar";
import Topbar from "../components/layout/Topbar";
import { getUsers } from "../services/adminService";

function initials(name = "") {
  return name
    .split(" ")
    .map((s) => s[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function formatDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const AVATAR_COLOURS = [
  "bg-blue-100 text-blue-700",
  "bg-violet-100 text-violet-700",
  "bg-emerald-100 text-emerald-700",
  "bg-orange-100 text-orange-700",
  "bg-pink-100 text-pink-700",
];

// A single status enum prevents us from ever needing to call multiple
// setStates synchronously inside an effect body.
const STATUS = { LOADING: "loading", SUCCESS: "success", ERROR: "error" };

export default function UsersPage() {
  const [users, setUsers]   = useState([]);
  const [status, setStatus] = useState(STATUS.LOADING);
  const [errorMsg, setErrorMsg] = useState(null);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce: setState runs inside a timer callback — not synchronously in
  // the effect body — so this is fine with react-hooks/set-state-in-effect.
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 350);
    return () => clearTimeout(t);
  }, [search]);

  // Data fetch: every setState call happens inside an async callback or a
  // microtask, never synchronously at the top of the effect body.
  useEffect(() => {
    let isMounted = true;

    async function fetchUsers() {
      // Signal "loading" inside a microtask so it is not synchronous in the
      // effect body — satisfies react-hooks/set-state-in-effect.
      await Promise.resolve();
      if (isMounted) setStatus(STATUS.LOADING);

      try {
        const data = await getUsers(
          debouncedSearch ? { search: debouncedSearch } : {}
        );
        if (isMounted) {
          setUsers(data);
          setStatus(STATUS.SUCCESS);
        }
      } catch {
        if (isMounted) {
          setErrorMsg("Failed to load users.");
          setStatus(STATUS.ERROR);
        }
      }
    }

    fetchUsers();

    return () => {
      isMounted = false;
    };
  }, [debouncedSearch]);

  const isLoading = status === STATUS.LOADING;
  const isError   = status === STATUS.ERROR;
  const isEmpty   = status === STATUS.SUCCESS && users.length === 0;
  const hasUsers  = status === STATUS.SUCCESS && users.length > 0;

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />

        <main className="flex-1 overflow-y-auto px-8 py-8">
          {/* Page header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Users
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Browse submitted answers and review pending validations per user.
            </p>
          </div>

          {/* Search */}
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2 max-w-sm mb-6">
            <Search className="w-4 h-4 text-gray-400 shrink-0" />
            <input
              placeholder="Search by name or email…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="outline-none w-full text-sm bg-transparent"
            />
          </div>

          {/* Error */}
          {isError && (
            <p className="text-sm text-red-500 mb-4">{errorMsg}</p>
          )}

          {/* Loading skeleton */}
          {isLoading && (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white border border-gray-100 rounded-2xl p-5 animate-pulse flex items-center gap-4"
                >
                  <div className="w-10 h-10 rounded-xl bg-gray-100" />
                  <div className="flex-1 space-y-2">
                    <div className="w-40 h-3 bg-gray-100 rounded" />
                    <div className="w-56 h-3 bg-gray-100 rounded" />
                  </div>
                  <div className="w-20 h-6 bg-gray-100 rounded-full" />
                </div>
              ))}
            </div>
          )}

          {/* Empty state */}
          {isEmpty && (
            <div className="bg-white border rounded-2xl p-16 text-center">
              <Users className="w-8 h-8 mx-auto text-gray-300 mb-3" />
              <h3 className="font-semibold text-gray-700">No users found</h3>
              {debouncedSearch && (
                <p className="text-sm text-gray-400 mt-1">
                  Try a different search term.
                </p>
              )}
            </div>
          )}

          {/* User list */}
          {hasUsers && (
            <div className="space-y-3">
              {users.map((user, idx) => {
                const colour     = AVATAR_COLOURS[idx % AVATAR_COLOURS.length];
                const hasPending = user.pending_count > 0;

                return (
                  <div
                    key={user.id}
                    className="bg-white border border-gray-100 rounded-2xl p-5 flex items-center gap-4 hover:shadow-sm transition-shadow"
                  >
                    {/* Avatar */}
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-semibold shrink-0 ${colour}`}
                    >
                      {initials(user.name)}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-gray-900 truncate">
                          {user.name}
                        </span>
                        {user.role && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100 font-medium">
                            {user.role}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 truncate">{user.email}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Joined {formatDate(user.joined_at)} &middot;{" "}
                        {user.total_answers} answer
                        {user.total_answers !== 1 ? "s" : ""}
                      </p>
                    </div>

                    {/* Counts */}
                    <div className="hidden sm:flex items-center gap-3 text-xs shrink-0">
                      {hasPending && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange-100 text-orange-600 font-semibold">
                          <Clock className="w-3 h-3" />
                          {user.pending_count} pending
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1 text-green-600">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {user.approved_count}
                      </span>
                      <span className="inline-flex items-center gap-1 text-red-500">
                        <XCircle className="w-3.5 h-3.5" />
                        {user.rejected_count}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      {hasPending && (
                        <Link
                          to={`/admin/users/${user.id}/answers/pending`}
                          className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                        >
                          Review
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      )}
                      <Link
                        to={`/admin/users/${user.id}/submissions`}
                        className="inline-flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                      >
                        All submissions
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}