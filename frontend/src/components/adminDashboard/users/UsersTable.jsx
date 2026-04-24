// components/adminDashboard/users/UsersTable.jsx
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Filter } from "lucide-react";
import { getUsers } from "../../../services/adminService";

function formatDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function UsersTable() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("ALL");

  useEffect(() => {
    let cancelled = false;

    async function fetchUsers() {
      try {
        const data = await getUsers();
        if (!cancelled) setUsers(data);
      } catch {
        if (!cancelled) setError("Failed to load users");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchUsers();

    return () => {
      cancelled = true;
    };
  }, []);

  const roles = useMemo(() => {
    const set = new Set(users.map((u) => u.role).filter(Boolean));
    return ["ALL", ...Array.from(set)];
  }, [users]);

  const filtered = users.filter((u) => {
    const term = search.toLowerCase();
    const matchSearch =
      u.name.toLowerCase().includes(term) ||
      (u.email ?? "").toLowerCase().includes(term);
    const matchRole = role === "ALL" || u.role === role;
    return matchSearch && matchRole;
  });

  return (
    <>
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2 flex-1 max-w-sm">
          <Search className="w-4 h-4 text-gray-400" />
          <input
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="outline-none w-full text-sm bg-transparent"
          />
        </div>

        <div className="flex gap-2 items-center">
          <Filter className="w-4 h-4 text-gray-400" />
          {roles.map((r) => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                role === r
                  ? "bg-blue-900 text-white border-blue-900"
                  : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-400 uppercase text-xs">
            <tr>
              <th className="px-6 py-3 text-left font-semibold">Name</th>
              <th className="px-6 py-3 text-left font-semibold">Email</th>
              <th className="px-6 py-3 text-left font-semibold">Role</th>
              <th className="px-6 py-3 text-left font-semibold">Answers</th>
              <th className="px-6 py-3 text-left font-semibold">Pending</th>
              <th className="px-6 py-3 text-left font-semibold">Approved</th>
              <th className="px-6 py-3 text-left font-semibold">Rejected</th>
              <th className="px-6 py-3 text-left font-semibold">
                Last submission
              </th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td
                  colSpan={8}
                  className="px-6 py-10 text-center text-gray-400"
                >
                  Loading...
                </td>
              </tr>
            )}

            {error && !loading && (
              <tr>
                <td colSpan={8} className="px-6 py-10 text-center text-red-500">
                  {error}
                </td>
              </tr>
            )}

            {!loading && !error && filtered.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  className="px-6 py-10 text-center text-gray-400"
                >
                  No users found.
                </td>
              </tr>
            )}

            {!loading &&
              !error &&
              filtered.map((u) => (
                <tr
                  key={u.user_id}
                  className="border-t border-gray-50 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <Link
                      to={`/admin/users/${u.user_id}`}
                      className="font-medium text-gray-800 hover:text-blue-600 transition-colors"
                    >
                      {u.name}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{u.email ?? "—"}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                      {u.role ?? "USER"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    {u.total_answers ?? 0}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full bg-orange-100 text-orange-600">
                      {u.pending ?? 0}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full bg-green-100 text-green-700">
                      {u.approved ?? 0}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full bg-red-100 text-red-600">
                      {u.rejected ?? 0}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {formatDate(u.last_submission_at)}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
