import { useNavigate } from "react-router-dom";
import { CheckCircle2, LayoutDashboard, ClipboardCheck, LogOut } from "lucide-react";
import Topbar from "../components/layout/Topbar";
import { logout } from "../services/authService";

export default function EvaluationDone() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try { await logout(); } catch (_) {}
    navigate("/login");
  };

  return (
    <div className="flex flex-col h-screen bg-[#F5F7FA] font-sans">
      <Topbar />
      <div className="flex flex-1 overflow-hidden">

        {/* Inline simple sidebar — no getNextQuestion call here */}
        <aside className="w-56 h-full bg-white border-r border-gray-100 flex flex-col">
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

          <nav className="flex-1 px-3 py-4 space-y-1">
            <button
              onClick={() => navigate("/dashboard")}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </button>
            <button
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium bg-blue-50 text-blue-700"
            >
              <ClipboardCheck className="w-4 h-4" />
              Evaluation
            </button>
          </nav>

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

        <main className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-sm px-6">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              All questions answered!
            </h2>
            <p className="text-sm text-gray-500 mb-8">
              You have completed all the questions assigned to your role.
              Your answers are pending review by the admin.
            </p>
            <button
              onClick={() => navigate("/dashboard")}
              className="bg-[#1E56A0] hover:bg-[#1a4a8a] text-white text-sm font-medium px-6 py-2.5 rounded-xl transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}