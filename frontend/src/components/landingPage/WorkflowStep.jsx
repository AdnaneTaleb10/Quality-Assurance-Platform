export default function WorkflowStep({ number, title, description }) {
  return (
    <div className="flex items-start gap-5">

      {/* NUMBER BOX */}
      <div className="w-14 h-10 flex items-center justify-center rounded-md bg-[#00346F] text-white font-semibold text-sm">
        {number}
      </div>

      {/* CONTENT */}
      <div>
        <h3 className="text-[#0F172A] font-semibold text-base">
          {title}
        </h3>

        <p className="text-[#64748B] text-sm mt-1 leading-relaxed">
          {description}
        </p>
      </div>

    </div>
  );
}