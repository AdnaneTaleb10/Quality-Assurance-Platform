// pages/UsersListPage.jsx
import Sidebar from "../components/adminDashboard/Sidebar";
import Topbar from "../components/layout/Topbar";
import UsersTable from "../components/adminDashboard/users/UsersTable";

export default function UsersListPage() {
  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />

        <main className="flex-1 overflow-y-auto px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              Users
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Browse all platform users and inspect their submissions.
            </p>
          </div>

          <UsersTable />
        </main>
      </div>
    </div>
  );
}