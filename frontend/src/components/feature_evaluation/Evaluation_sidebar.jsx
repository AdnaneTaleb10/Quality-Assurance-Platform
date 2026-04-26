// components/feature_evaluation/Evaluation_sidebar.jsx
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ClipboardCheck,
  MessageSquare,
  LogOut,
  Loader2,
} from "lucide-react";
import { logout } from "../../services/authService";
import { getNextQuestion } from "../../services/evaluationService";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { label: "Evaluation", icon: ClipboardCheck, path: "/evaluation" },
  { label: "My Answers", icon: MessageSquare, path: "/my-answers" },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loadingEval, setLoadingEval] = useState(false);

  const isActive = (path) => {
    if (path === "/evaluation")
      return location.pathname.startsWith("/evaluation");
    return location.pathname === path;
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (_) {}
    navigate("/login", { replace: true });
  };

  const handleNav = async (path) => {
    // All nav items except Evaluation navigate directly
    console.log("handleNav called with:", path); // ← add this

    if (path !== "/evaluation") {
      navigate(path);
      return;
    }

    // For Evaluation: fetch the first unanswered question then redirect to it.
    // Never navigate to /evaluation directly — that route doesn't exist.
    setLoadingEval(true);
    try {
      const { next_question_id } = await getNextQuestion();
      if (next_question_id) {
        navigate(`/evaluation/${next_question_id}`);
      } else {
        // All questions answered
        navigate("/evaluation/done");
      }
    } catch {
      navigate("/evaluation/done");
    } finally {
      setLoadingEval(false);
    }
  };

  return (
    <aside className="w-56 h-full bg-white border-r border-gray-100 flex flex-col">
      {/* Logo */}
      <div className="flex-shrink-0 px-5 py-5 border-b border-gray-100">
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
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1 min-h-0">
        {navItems.map(({ label, icon: Icon, path }) => {
          const active = isActive(path);
          const isEval = path === "/evaluation";
          const loading = isEval && loadingEval;

          return (
            <button
              key={label}
              onClick={() => handleNav(path)}
              disabled={loading}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-60 ${
                active
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Icon className="w-4 h-4" />
              )}
              {label}
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="flex-shrink-0 px-3 py-4 border-t border-gray-100">
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
