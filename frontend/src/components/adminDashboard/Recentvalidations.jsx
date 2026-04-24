const validations = [
  {
    id: "STR-9021",
    department: "Library - West Wing",
    status: "Validated",
    date: "Oct 24, 2023",
  },
  {
    id: "ELC-4402",
    department: "Science Lab B",
    status: "Pending",
    date: "Oct 23, 2023",
  },
  {
    id: "SFT-1108",
    department: "Main Auditorium",
    status: "In Review",
    date: "Oct 22, 2023",
  },
  {
    id: "HVAC-330",
    department: "Administrative Block",
    status: "Validated",
    date: "Oct 21, 2023",
  },
];

const statusStyles = {
  Validated: "bg-green-100 text-green-700",
  Pending: "bg-orange-100 text-orange-600",
  "In Review": "bg-blue-100 text-blue-700",
};

export default function RecentValidations() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
        <h2 className="text-base font-semibold text-gray-900">
          Recent Validations
        </h2>
        <button className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors">
          View All
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-6 py-3 w-8"></th>
              <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-6 py-3">
                Asset ID
              </th>
              <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-6 py-3">
                Unit / Department
              </th>
              <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-6 py-3">
                Status
              </th>
              <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-6 py-3">
                Date
              </th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {validations.map((v, idx) => (
              <tr
                key={v.id}
                className="border-b border-gray-50 last:border-none hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4 text-gray-300 text-sm">{idx + 1}</td>
                <td className="px-6 py-4">
                  <button className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors">
                    {v.id}
                  </button>
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {v.department}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center text-xs font-semibold px-3 py-1 rounded-full ${
                      statusStyles[v.status]
                    }`}
                  >
                    {v.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{v.date}</td>
                <td className="px-6 py-4"></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}