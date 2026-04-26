import { NavLink, useNavigate } from "react-router-dom";
import {
  ClipboardCheck,
  LayoutDashboard,
  ClipboardList,
  Users,
  LogOut,
} from "lucide-react";
import { logout } from "../../services/authService";

const NAV_ITEMS = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    to: "/admin-dashboard",
  },
  {
    label: "Validation",
    icon: ClipboardList,
    to: "/validation",
  },
  {
    label: "Users",
    icon: Users,
    to: "/admin/users",
  },
];

export default function Sidebar() {
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await logout(); // POST /auth/logout → session_destroy()
    } catch {
      // even if the request fails, clear client side and redirect
    } finally {
      navigate("/login", { replace: true });
    }
  }

  return (
    <aside className="w-56 min-h-screen bg-white border-r border-gray-100 flex flex-col">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center">
            <ClipboardCheck className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">QA Portal</p>
            <p className="text-xs text-gray-500">Infrastructure Unit</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map(({ label, icon: Icon, to }) => (
          <NavLink
            key={to}
            to={to}
            // NavLink receives `isActive` from React Router and applies the
            // correct class automatically — no manual pathname comparison needed.
            className={({ isActive }) =>
              `w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`
            }
            // Mark /admin/users as active for all child routes
            // (e.g. /admin/users/42/answers/pending)
            end={to === "/admin-dashboard" || to === "/validation"}
          >
            <Icon className="w-4 h-4" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}
