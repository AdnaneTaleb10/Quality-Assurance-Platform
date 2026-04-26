import React from "react";
import {
  LayoutDashboard,
  ClipboardCheck,
  MessageSquare,
  LogOut,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, active: false },
  { label: "Evaluation", icon: ClipboardCheck, active: false },
  { label: "My Answers", icon: MessageSquare, active: true },
];

export default function Sidebar() {
  return (
    // h-screen force la sidebar à prendre toute la hauteur de l'écran
    <aside className="w-56 h-full bg-white border-r border-gray-100 flex flex-col">
      
      {/* Logo (flex-shrink-0 empêche sa réduction) */}
      <div className="flex-shrink-0 px-5 py-5 border-b border-gray-100">
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

      {/* Nav (flex-1 prend tout l'espace disponible et défile si nécessaire) */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1 min-h-0">
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

      {/* Logout Button (flex-shrink-0 garantit qu'il reste en bas) */}
      <div className="flex-shrink-0 px-3 py-4 border-t border-gray-100">
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors">
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}