export default function AuthFooter({ absolute = false }) {
  return (
    <div
      className={`w-full border-t border-[#E2E8F0] bg-[#F7F9FC] py-4 text-center ${
        absolute ? "absolute bottom-0" : ""
      }`}
    >
      <p className="text-[11px] text-[#94A3B8]">
        © 2026 Institutional Excellence Quality Assurance. All rights reserved.
      </p>
    </div>
  );
}