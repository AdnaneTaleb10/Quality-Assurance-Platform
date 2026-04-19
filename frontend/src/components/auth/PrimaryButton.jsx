export default function PrimaryButton({ children }) {
  return (
    <button
      type="submit"
      className="w-full bg-[#2B6CB0] hover:bg-[#23568d] text-white text-[12px] font-semibold uppercase py-2.5 rounded-md transition"
    >
      {children}
    </button>
  );
}