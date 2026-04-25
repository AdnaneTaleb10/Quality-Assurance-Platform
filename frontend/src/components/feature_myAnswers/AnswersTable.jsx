import TableRow from "../feature_myAnswers/TableRow";

const data = [
  // ajoute beaucoup de données pour tester le scroll
  ...Array.from({ length: 20 }, (_, i) => ({
    id: i,
    code: `INF-QA-2024-${i}`,
    answer: i % 2 === 0 ? "Yes" : "No",
    file: "document.pdf",
    status: ["Approved", "Pending", "Rejected"][i % 3],
  })),
];

const AnswersTable = () => {
  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden">
      
      {/* HEADER (fixe) */}
      <div className="grid grid-cols-4 px-6 py-4 bg-[#F9FAFB] border-b border-[#E5E7EB] sticky top-0 z-10">
        <span className="text-[12px] font-medium text-[#9CA3AF] uppercase tracking-wide">
          Question Code
        </span>
        <span className="text-[12px] font-medium text-[#9CA3AF] uppercase tracking-wide">
          Answer
        </span>
        <span className="text-[12px] font-medium text-[#9CA3AF] uppercase tracking-wide">
          Proof File Name
        </span>
        <span className="text-[12px] font-medium text-[#9CA3AF] uppercase tracking-wide">
          Validation Status
        </span>
      </div>

      {/* BODY SCROLLABLE */}
      <div className="max-h-[400px] overflow-y-auto">
        {data.map((item) => (
          <TableRow key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default AnswersTable;