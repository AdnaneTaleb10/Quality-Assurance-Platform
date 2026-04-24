import React from "react";
import {
  LayoutDashboard,
  ClipboardCheck,
  MessageSquare,
  LogOut,
  Plus, // Importation de l'icône Plus
} from "lucide-react";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, active: false },
  { label: "Evaluation", icon: ClipboardCheck, active: true },
  { label: "My Answers", icon: MessageSquare, active: false },
];

export default function Sidebar() {
  return (
    <aside className="w-56 min-h-screen bg-white border-r border-gray-100 flex flex-col">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center">
            <ClipboardCheck className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">QA Portal</p>
            <p className="text-xs text-gray-500">Infrastructure Unit</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const IconComponent = item.icon;

          return (
            <button
              key={item.label}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                item.active
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <IconComponent className="w-4 h-4" />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* New Evaluation Button */}
      <div className="px-3 py-2">
        <button className="w-full flex items-center justify-center gap-2 bg-[#1E56A0] text-white px-5 py-2.5 rounded-md text-sm font-medium shadow hover:bg-[#164685] transition-colors">
          <Plus className="w-4 h-4" />
          New Evaluation
        </button>
      </div>

      {/* Logout Button */}
      <div className="px-3 py-4 border-t border-gray-100">
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors">
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}