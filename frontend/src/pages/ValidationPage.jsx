// pages/ValidationPage.jsx
import { useState } from "react";
import Sidebar from "../components/adminDashboard/Sidebar";
import Topbar from "../components/layout/Topbar";
import ValidationTable from "../components/adminDashboard/validation/ValidationTable";
import ValidationFilters from "../components/adminDashboard/validation/ValidationFilters";
import { useRole } from "../hooks/useRole";

export default function ValidationPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const { readOnly } = useRole();

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Topbar />

        <main className="flex-1 px-8 py-8 overflow-y-auto">
          <div className="flex items-center gap-3 mb-6">
            <h1 className="text-3xl font-bold">Validation Queue</h1>
            {readOnly && (
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-amber-100 text-amber-700 border border-amber-200">
                Read-only
              </span>
            )}
          </div>

          <ValidationFilters
            search={search}
            setSearch={setSearch}
            status={status}
            setStatus={setStatus}
          />

          <ValidationTable search={search} status={status} readOnly={readOnly} />
        </main>
      </div>
    </div>
  );
}