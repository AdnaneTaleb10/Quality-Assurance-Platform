const TableRow = ({ item }) => {

  const answer = String(item.answer).toLowerCase();
  const status = String(item.status).toLowerCase();

  const STATUS_STYLES = {
    approved: "bg-[#ECFDF5] text-[#059669]",
    pending: "bg-[#F5F3FF] text-[#7C3AED]",
    rejected: "bg-[#FEF2F2] text-[#DC2626]",
  };

  const ANSWER_STYLES = {
    yes: "bg-[#ECFDF5] text-[#059669]",
    no: "bg-[#EFF6FF] text-[#2563EB]",
  };

  const statusClass = STATUS_STYLES[status] || "bg-gray-100 text-gray-500";
  const answerClass = ANSWER_STYLES[answer] || "bg-gray-100 text-gray-500";

  return (
    <div className="grid grid-cols-4 items-center px-6 py-4 border-b border-[#F3F4F6] last:border-none hover:bg-[#F9FAFB] transition">
      
      {/* CODE */}
      <span className="text-[14px] font-medium text-[#2563EB]">
        {item.code || "-"}
      </span>

      {/* ANSWER */}
      <span
        className={`px-3 py-1 text-[12px] font-medium rounded-full w-fit capitalize ${answerClass}`}
      >
        {item.answer || "N/A"}
      </span>

      {/* FILE */}
      <div className="flex items-center gap-2 text-[14px] text-[#374151]">
        <span className="text-[16px]">📄</span>
        <span className="truncate">
          {item.file || "No file"}
        </span>
      </div>

      {/* STATUS */}
      <span
        className={`px-3 py-1 text-[12px] font-medium rounded-full w-fit capitalize ${statusClass}`}
      >
        {item.status || "Unknown"}
      </span>
    </div>
  );
};

export default TableRow;