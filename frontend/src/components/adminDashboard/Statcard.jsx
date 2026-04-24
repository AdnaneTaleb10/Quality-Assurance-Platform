export default function StatCard({ icon, label, value, badge, badgeColor }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col gap-3 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
          {icon}
        </div>
        {badge && (
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-full ${badgeColor}`}
          >
            {badge}
          </span>
        )}
      </div>
      <div>
        <p className="text-xs text-gray-500 mb-1">{label}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
}