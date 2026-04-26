// components/adminDashboard/validation/ValidationFilters.jsx
import { Search, Filter } from "lucide-react";

const STATUS = ["ALL", "PENDING", "APPROVED", "REJECTED"];

export default function ValidationFilters({
  search,
  setSearch,
  status,
  setStatus,
}) {
  return (
    <div className="flex flex-wrap items-center gap-3 mb-6">
      <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2 flex-1 max-w-sm">
        <Search className="w-4 h-4 text-gray-400" />
        <input
          placeholder="Search by user or question..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="outline-none w-full text-sm bg-transparent"
        />
      </div>

      <div className="flex gap-2 items-center">
        <Filter className="w-4 h-4 text-gray-400" />
        {STATUS.map((s) => (
          <button
            key={s}
            onClick={() => setStatus(s)}
            className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
              status === s
                ? "bg-blue-900 text-white border-blue-900"
                : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
            }`}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}