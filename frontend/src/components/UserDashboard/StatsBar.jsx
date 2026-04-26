// components/dashboard/StatsBar.jsx
import { Layers, Users2, BookCheck } from "lucide-react";

const STATS = [
  {
    key: "total_domains",
    label: "Total Domains",
    icon: Layers,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    key: "active_champs",
    label: "Active Champs",
    icon: Users2,
    color: "text-indigo-600",
    bg: "bg-indigo-50",
  },
  {
    key: "verified_refs",
    label: "Verified Refs",
    icon: BookCheck,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
];

export default function StatsBar({ stats, loading }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
      {STATS.map(({ key, label, icon: Icon, color, bg }) => (
        <div
          key={key}
          className="bg-white border border-gray-100 rounded-2xl shadow-sm px-6 py-5 flex items-center gap-4"
        >
          <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center shrink-0`}>
            <Icon className={`w-5 h-5 ${color}`} />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium">{label}</p>
            <p className={`text-2xl font-bold ${color} leading-tight`}>
              {loading ? (
                <span className="inline-block w-8 h-6 bg-gray-100 rounded animate-pulse" />
              ) : (
                String(stats?.[key] ?? 0).padStart(2, "0")
              )}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}