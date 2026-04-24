export default function Topbar() {
  return (
    <header className="h-14 bg-white border-b border-gray-100 flex items-center justify-between px-6">
      {/* Logo */}
      <div className="flex items-center">
        <img src="/favicon.svg" alt="QA Platform Logo" className="h-5" />
      </div>

      {/* Right section (Avatar only) */}
      <div className="flex items-center">
        <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
          <img
            src="https://i.pravatar.cc/32"
            alt="User avatar"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </header>
  );
}