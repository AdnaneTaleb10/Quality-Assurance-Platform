// pages/Dashboardpage.jsx
import { useEffect, useState } from "react";
import {
  CheckCircle2,
  ClipboardList,
  MessageSquareText,
  AlertTriangle,
} from "lucide-react";
import Sidebar from "../components/adminDashboard/Sidebar";
import Topbar from "../components/layout/Topbar";
import StatCard from "../components/adminDashboard/Statcard";
import RecentValidations from "../components/adminDashboard/validation/Recentvalidations";
import { getStats } from "../services/adminService";

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getStats()
      .then(setStats)
      .catch(() => setError("Failed to load stats"))
      .finally(() => setLoading(false));
  }, []);

  const statCards = stats
    ? [
        {
          icon: <CheckCircle2 className="w-5 h-5 text-blue-600" />,
          label: "Completion Rate",
          value: `${stats.completion_rate}%`,
          badge: null,
          badgeColor: "",
        },
        {
          icon: <ClipboardList className="w-5 h-5 text-orange-500" />,
          label: "Pending Validations",
          value: String(stats.pending_validations),
          badge: stats.pending_validations > 0 ? "Action Required" : null,
          badgeColor: "bg-orange-100 text-orange-600",
        },
        {
          icon: <MessageSquareText className="w-5 h-5 text-blue-600" />,
          label: "Total Answers",
          value: stats.total_answers.toLocaleString(),
          badge: null,
          badgeColor: "",
        },
        {
          icon: <AlertTriangle className="w-5 h-5 text-red-500" />,
          label: "Critical Alerts",
          value: String(stats.critical_alerts).padStart(2, "0"),
          badge: null,
          badgeColor: "",
        },
      ]
    : [];

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />

        <main className="flex-1 overflow-y-auto px-8 py-8">
          {/* Page header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              Infrastructure Dashboard
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Monitoring Institutional Quality Assurance and physical asset
              validations.
            </p>
          </div>

          {/* Stats Grid */}
          {error && (
            <div className="mb-6 px-4 py-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
              {error}
            </div>
          )}

          <div className="grid grid-cols-4 gap-4 mb-8">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-2xl border border-gray-100 p-5 h-28 animate-pulse"
                  >
                    <div className="w-10 h-10 bg-gray-100 rounded-xl mb-3" />
                    <div className="w-24 h-3 bg-gray-100 rounded mb-2" />
                    <div className="w-16 h-6 bg-gray-100 rounded" />
                  </div>
                ))
              : statCards.map((stat) => (
                  <StatCard key={stat.label} {...stat} />
                ))}
          </div>

          {/* Recent Validations — shows last 5 answers */}
          <RecentValidations />
        </main>
      </div>
    </div>
  );
}
