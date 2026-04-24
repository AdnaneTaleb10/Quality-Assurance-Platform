import { CheckCircle2, ClipboardList, MessageSquareText, AlertTriangle } from "lucide-react";
import Sidebar from "../components/adminDashboard/Sidebar";
import Topbar from "../components/layout/Topbar";
import StatCard from "../components/adminDashboard/Statcard";
import RecentValidations from "../components/adminDashboard/Recentvalidations";

const stats = [
  {
    icon: <CheckCircle2 className="w-5 h-5 text-blue-600" />,
    label: "Completion Rate",
    value: "94.2%",
    badge: "+12%",
    badgeColor: "bg-green-100 text-green-600",
  },
  {
    icon: <ClipboardList className="w-5 h-5 text-orange-500" />,
    label: "Pending Validations",
    value: "28",
    badge: "Action Required",
    badgeColor: "bg-orange-100 text-orange-600",
  },
  {
    icon: <MessageSquareText className="w-5 h-5 text-blue-600" />,
    label: "Total Answers",
    value: "1,402",
    badge: null,
  },
  {
    icon: <AlertTriangle className="w-5 h-5 text-red-500" />,
    label: "Critical Alerts",
    value: "03",
    badge: null,
  },
];

export default function DashboardPage() {
  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />

        {/* Main content */}
        <main className="flex-1 overflow-y-auto px-8 py-8">
          {/* Page header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              Infrastructure Dashboard
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Monitoring Institutional Quality Assurance and physical asset validations.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            {stats.map((stat) => (
              <StatCard key={stat.label} {...stat} />
            ))}
          </div>

          {/* Recent Validations Table */}
          <RecentValidations />
        </main>
      </div>
    </div>
  );
}