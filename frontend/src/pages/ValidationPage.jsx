import { useState } from "react";
import Sidebar from "../components/adminDashboard/Sidebar";
import Topbar from "../components/layout/Topbar";
import ValidationTable from "../components/adminDashboard/validation/ValidationTable";
import ValidationFilters from "../components/adminDashboard/validation/ValidationFilters";


export default function ValidationPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Topbar />

        <main className="flex-1 px-8 py-8">
          <h1 className="text-3xl font-bold mb-6">Validation Queue</h1>

          <ValidationFilters
            search={search}
            setSearch={setSearch}
            status={status}
            setStatus={setStatus}
          />

          <ValidationTable search={search} status={status} />
        </main>
      </div>
    </div>
  );
}