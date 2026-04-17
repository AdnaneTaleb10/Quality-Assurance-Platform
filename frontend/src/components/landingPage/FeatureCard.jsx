export default function FeatureCard({
  Icon,
  title,
  description,
  borderColor,
}) {
  return (
    <div
      className="w-full bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition border-l-4"
      style={{ borderLeftColor: borderColor }}
    >
      {/* ICON BOX */}
      <div className="w-10 h-10 flex items-center justify-center bg-[#DCE9FF] rounded-md mb-4">
        {Icon && <Icon className="w-5 h-5 text-[#004A99]" />}
      </div>

      {/* TITLE */}
      <h3 className="text-lg font-semibold text-[#0F172A] mb-2">
        {title}
      </h3>

      {/* DESCRIPTION */}
      <p className="text-sm text-[#64748B] leading-relaxed">
        {description}
      </p>
    </div>
  );
}