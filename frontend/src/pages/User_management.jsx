// pages/UserManagementPage.jsx
// Route: /admin/user-management
import { useEffect, useState, useRef, useCallback } from "react";
import {
  Users,
  Search,
  ChevronDown,
  Pencil,
  Trash2,
  Check,
  X,
  AlertTriangle,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react";
import Sidebar from "../components/adminDashboard/Sidebar";
import Topbar from "../components/layout/Topbar";
import { getUsers, getRoles, updateUserRole, deleteUser } from "../services/adminService";
import { getMe } from "../services/authService";

// ── Helpers ───────────────────────────────────────────────────────────────────

function getRoleBadgeClass(role) {
  const r = (role ?? "").toLowerCase();
  if (r.includes("admin"))      return "bg-purple-100 text-purple-700";
  if (r.includes("dean"))       return "bg-blue-100 text-blue-700";
  if (r.includes("head"))       return "bg-indigo-100 text-indigo-700";
  return "bg-gray-100 text-gray-600";
}

function StatMini({ icon, label, value, color }) {
  return (
    <div className="flex items-center gap-2">
      <span className={color}>{icon}</span>
      <span className="text-xs text-gray-500">{label}</span>
      <span className="text-xs font-semibold text-gray-700">{value}</span>
    </div>
  );
}

// ── Delete confirmation modal ─────────────────────────────────────────────────

function DeleteModal({ user, onConfirm, onCancel, loading }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[200]">
      <div className="bg-white rounded-2xl shadow-xl w-[420px] p-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-gray-900">Delete User</h2>
            <p className="text-xs text-gray-500">This action cannot be undone</p>
          </div>
        </div>
        <p className="text-sm text-gray-600 mb-6">
          You are about to permanently delete{" "}
          <span className="font-semibold text-gray-900">{user.name}</span>
          {" "}({user.email}). All their answers and submissions will also be removed.
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-60"
          >
            {loading ? "Deleting…" : "Delete User"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Toast ─────────────────────────────────────────────────────────────────────

function Toast({ message, type = "success", onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3000);
    return () => clearTimeout(t);
  }, [onDone]);

  const styles = {
    success: "bg-green-600",
    error:   "bg-red-600",
  };

  const icons = {
    success: <CheckCircle2 className="w-4 h-4" />,
    error:   <XCircle className="w-4 h-4" />,
  };

  return (
    <div
      className={`fixed bottom-6 right-6 z-[300] flex items-center gap-3 px-5 py-3 rounded-xl text-white text-sm font-medium shadow-lg
        ${styles[type]} animate-fade-in-up`}
      style={{ animation: "fadeInUp 0.2s ease-out" }}
    >
      {icons[type]}
      {message}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function UserManagementPage() {
  const [users, setUsers]               = useState([]);
  const [roles, setRoles]               = useState([]);
  const [currentUser, setCurrentUser]   = useState(null);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);
  const [search, setSearch]             = useState("");
  const [filterRole, setFilterRole]     = useState("ALL");
  const [roleDropOpen, setRoleDropOpen] = useState(false);
  const roleDropRef                     = useRef(null);

  // Inline edit state
  const [editingId, setEditingId]       = useState(null);
  const [editRoleId, setEditRoleId]     = useState(null);
  const [saveLoading, setSaveLoading]   = useState(false);
  const [saveError, setSaveError]       = useState(null);

  // Delete state
  const [deleteTarget, setDeleteTarget]   = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Toast state
  const [toast, setToast] = useState(null); // { message, type }
  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  // ── Load data ───────────────────────────────────────────────────────────────
  useEffect(() => {
    Promise.all([
      getUsers(),
      getRoles(),
      getMe(),
    ])
      .then(([u, r, me]) => { setUsers(u); setRoles(r); setCurrentUser(me.user); })
      .catch(() => setError("Failed to load users"))
      .finally(() => setLoading(false));
  }, []);

  // Close role filter dropdown on outside click
  useEffect(() => {
    function handle(e) {
      if (roleDropRef.current && !roleDropRef.current.contains(e.target)) {
        setRoleDropOpen(false);
      }
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  // ── Derived data ────────────────────────────────────────────────────────────
  const uniqueRoles = ["ALL", ...roles.map((r) => r.name)];

  const filtered = users.filter((u) => {
    if (currentUser && u.id === currentUser.id) return false;
    const matchSearch =
      search === "" ||
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole =
      filterRole === "ALL" || u.role === filterRole;
    return matchSearch && matchRole;
  });

  // Summary stats
  const totalUsers    = users.length;
  const totalAnswers  = users.reduce((s, u) => s + (u.total_answers  ?? 0), 0);
  const totalPending  = users.reduce((s, u) => s + (u.pending_count  ?? 0), 0);
  const totalApproved = users.reduce((s, u) => s + (u.approved_count ?? 0), 0);

  // ── Handlers ────────────────────────────────────────────────────────────────
  function startEdit(user) {
    const matchedRole = roles.find((r) => r.name === user.role);
    setEditingId(user.id);
    setEditRoleId(matchedRole?.id ?? null);
    setSaveError(null);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditRoleId(null);
    setSaveError(null);
  }

  async function confirmEdit(userId) {
    if (!editRoleId) return;
    setSaveLoading(true);
    setSaveError(null);
    try {
      await updateUserRole(userId, editRoleId);
      const newRoleName = roles.find((r) => r.id === editRoleId)?.name ?? "";
      setUsers((prev) =>
        prev.map((u) => u.id === userId ? { ...u, role: newRoleName } : u)
      );
      setEditingId(null);
    } catch {
      setSaveError("Failed to save. Try again.");
    } finally {
      setSaveLoading(false);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    const deletedName = deleteTarget.name;
    setDeleteLoading(true);
    try {
      await deleteUser(deleteTarget.id);
      setUsers((prev) => prev.filter((u) => u.id !== deleteTarget.id));
      setDeleteTarget(null);
      showToast(`${deletedName} was deleted successfully.`);
    } catch {
      setDeleteTarget(null);
      showToast("Failed to delete user. Please try again.", "error");
    } finally {
      setDeleteLoading(false);
    }
  }

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />

        <main className="flex-1 overflow-y-auto px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              User Management
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              View, filter, and manage roles for all registered users.
            </p>
          </div>

          {/* Summary stat cards */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            {[
              { icon: <Users className="w-5 h-5 text-blue-600" />,       label: "Total Users",      value: totalUsers,    bg: "bg-blue-50"   },
              { icon: <Clock className="w-5 h-5 text-orange-500" />,     label: "Pending Reviews",  value: totalPending,  bg: "bg-orange-50" },
              { icon: <CheckCircle2 className="w-5 h-5 text-green-600"/>,label: "Approved Answers", value: totalApproved, bg: "bg-green-50"  },
              { icon: <XCircle className="w-5 h-5 text-gray-400" />,     label: "Total Answers",    value: totalAnswers,  bg: "bg-gray-50"   },
            ].map((c) =>
              loading ? (
                <div key={c.label} className="bg-white rounded-2xl border border-gray-100 p-5 h-28 animate-pulse">
                  <div className="w-10 h-10 bg-gray-100 rounded-xl mb-3" />
                  <div className="w-24 h-3 bg-gray-100 rounded mb-2" />
                  <div className="w-16 h-6 bg-gray-100 rounded" />
                </div>
              ) : (
                <div key={c.label} className="bg-white rounded-2xl border border-gray-100 p-5">
                  <div className={`w-10 h-10 rounded-xl ${c.bg} flex items-center justify-center mb-3`}>
                    {c.icon}
                  </div>
                  <p className="text-xs text-gray-500 mb-1">{c.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{c.value.toLocaleString()}</p>
                </div>
              )
            )}
          </div>

          {/* Toolbar */}
          <div className="flex items-center gap-3 mb-5">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or email…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2 w-72 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              />
            </div>

            {/* Role filter */}
            <div className="relative" ref={roleDropRef}>
              <button
                onClick={() => setRoleDropOpen((o) => !o)}
                className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition-colors"
              >
                <span className="text-gray-700">
                  {filterRole === "ALL" ? "All Roles" : filterRole}
                </span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>
              {roleDropOpen && (
                <div className="absolute top-full mt-1 left-0 w-52 bg-white border border-gray-200 rounded-xl shadow-lg py-1 z-50">
                  {uniqueRoles.map((r) => (
                    <button
                      key={r}
                      onClick={() => { setFilterRole(r); setRoleDropOpen(false); }}
                      className={`block w-full text-left px-4 py-2 text-sm transition-colors ${
                        filterRole === r
                          ? "bg-blue-50 text-blue-700 font-medium"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {r === "ALL" ? "All Roles" : r}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <span className="ml-auto text-xs text-gray-400">
              {filtered.length} user{filtered.length !== 1 ? "s" : ""}
            </span>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
              {error}
            </div>
          )}

          {/* Table */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  {["User", "Email", "Role", "Answers", "Status Breakdown", "Actions"].map((h) => (
                    <th
                      key={h}
                      className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-6 py-3"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="border-b border-gray-50">
                      {Array.from({ length: 6 }).map((_, j) => (
                        <td key={j} className="px-6 py-4">
                          <div className="h-4 bg-gray-100 rounded animate-pulse w-3/4" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-sm text-gray-400">
                      No users found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((user) => {
                    const isEditing = editingId === user.id;
                    return (
                      <tr
                        key={user.id}
                        className="border-b border-gray-50 last:border-none hover:bg-gray-50/60 transition-colors"
                      >
                        {/* User */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-700 shrink-0">
                              {user.name?.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-sm font-medium text-gray-900">
                              {user.name}
                            </span>
                          </div>
                        </td>

                        {/* Email */}
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {user.email}
                        </td>

                        {/* Role — inline edit */}
                        <td className="px-6 py-4">
                          {isEditing ? (
                            <select
                              value={editRoleId ?? ""}
                              onChange={(e) => setEditRoleId(Number(e.target.value))}
                              className="text-sm border border-blue-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              {roles.map((r) => (
                                <option key={r.id} value={r.id}>{r.name}</option>
                              ))}
                            </select>
                          ) : (
                            <span className={`inline-flex items-center text-xs font-semibold px-3 py-1 rounded-full ${getRoleBadgeClass(user.role)}`}>
                              {user.role ?? "—"}
                            </span>
                          )}
                        </td>

                        {/* Total answers */}
                        <td className="px-6 py-4 text-sm text-gray-700 font-medium">
                          {user.total_answers ?? 0}
                        </td>

                        {/* Status breakdown */}
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1">
                            <StatMini
                              icon={<CheckCircle2 className="w-3.5 h-3.5" />}
                              label="Approved"
                              value={user.approved_count ?? 0}
                              color="text-green-500"
                            />
                            <StatMini
                              icon={<Clock className="w-3.5 h-3.5" />}
                              label="Pending"
                              value={user.pending_count ?? 0}
                              color="text-orange-400"
                            />
                            <StatMini
                              icon={<XCircle className="w-3.5 h-3.5" />}
                              label="Rejected"
                              value={user.rejected_count ?? 0}
                              color="text-red-400"
                            />
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4">
                          {isEditing ? (
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => confirmEdit(user.id)}
                                disabled={saveLoading}
                                title="Save"
                                className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-60"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                              <button
                                onClick={cancelEdit}
                                disabled={saveLoading}
                                title="Cancel"
                                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 transition-colors"
                              >
                                <X className="w-4 h-4" />
                              </button>
                              {saveError && (
                                <span className="text-xs text-red-500">{saveError}</span>
                              )}
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => startEdit(user)}
                                title="Edit role"
                                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => setDeleteTarget(user)}
                                title="Delete user"
                                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      {/* Delete confirmation modal */}
      {deleteTarget && (
        <DeleteModal
          user={deleteTarget}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={deleteLoading}
        />
      )}

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onDone={() => setToast(null)}
        />
      )}
    </div>
  );
}