import { useEffect, useState } from "react";
import { User } from "lucide-react";
import { getMe } from "../../services/authService";

export default function Topbar() {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    getMe()
      .then((data) => setUserName(data.user.name))
      .catch(() => {});
  }, []);

  return (
    <header className="h-14 bg-white border-b border-gray-100 flex items-center justify-between px-6">
      {/* Logo */}
      <div className="flex items-center">
        <img src="/favicon.svg" alt="QA Platform Logo" className="h-5" />
      </div>

      {/* Right section */}
      <div className="flex items-center gap-3">
        {userName && (
          <span className="text-sm font-medium text-gray-700">{userName}</span>
        )}
        <div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center">
          <User className="w-4 h-4 text-gray-500" />
        </div>
      </div>
    </header>
  );
}