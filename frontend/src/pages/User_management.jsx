import React, { useState } from 'react';
import StatsCards from '../components/user_management/StatsCard';
import UserTable from '../components/user_management/Usertable';
import Sidebar from '../components/user_management/user_management_sidebar';
import Topbar from '../components/Topbar';

const UserManagementContent = () => {
  const [filterRole, setFilterRole] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [users, setUsers] = useState([
    { id: 'USR-9281', name: 'Dr. Helena Vance', email: 'h.vance@ledger.institutional.edu', role: 'Head of Department' },
    { id: 'USR-8422', name: 'Marcus Thorne', email: 'm.thorne@infrastructure.qa.org', role: 'Admin' },
    { id: 'USR-1102', name: 'Sarah Jenkins', email: 's.jenkins@ledger.institutional.edu', role: 'User' },
    { id: 'USR-7731', name: 'Arthur Pendel', email: 'a.pendel@infrastructure.qa.org', role: 'Dean' },
    { id: 'USR-0023', name: 'Prof. Elena Rossi', email: 'e.rossi@ledger.institutional.edu', role: 'Head of Department' },
  ]);

  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'User' });

  const roles = [
    { label: 'All Roles', value: 'ALL' },
    { label: 'Admin', value: 'Admin' },
    { label: 'User', value: 'User' },
    { label: 'Head of Department', value: 'Head of Department' },
    { label: 'Dean', value: 'Dean' }
  ];

  const handleSaveUser = () => {
    setUsers([...users, { id: `USR-${Math.floor(Math.random()*9000)}`, ...newUser }]);
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-gray-50">
      <Topbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 p-10 overflow-y-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
            <div className="flex gap-3 items-center relative">
              <input type="text" placeholder="Search by name..." className="px-4 py-2 h-[38px] w-64 rounded-md border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E56A0]" onChange={(e) => setSearchQuery(e.target.value)} />
              <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center justify-center gap-2 bg-[#1E56A0] text-white px-5 h-[38px] rounded-md text-sm font-medium shadow hover:bg-[#164685] transition-colors">FILTER BY ROLE</button>
              {isDropdownOpen && (
                <div className="absolute top-full mt-2 right-[145px] w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50">
                  {roles.map((role) => <button key={role.value} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50" onClick={() => { setFilterRole(role.value); setIsDropdownOpen(false); }}>{role.label}</button>)}
                </div>
              )}
              <button onClick={() => setIsModalOpen(true)} className="flex items-center justify-center gap-2 bg-[#1E56A0] text-white px-5 h-[38px] rounded-md text-sm font-medium shadow hover:bg-[#164685]">
                <span className="text-lg">+</span> ADD NEW USER
              </button>
            </div>
          </div>
          <StatsCards />
          {/* LIAISON FAITE ICI */}
          <UserTable users={users} setUsers={setUsers} filterRole={filterRole} searchQuery={searchQuery} />
        </main>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]">
          <div className="bg-white p-8 rounded-lg shadow-xl w-96">
            <h2 className="text-xl font-bold mb-6">Add New User</h2>
            <div className="space-y-4">
              <input type="text" placeholder="Full Name" className="w-full border p-2 rounded" onChange={(e) => setNewUser({...newUser, name: e.target.value})} />
              <input type="email" placeholder="Email" className="w-full border p-2 rounded" onChange={(e) => setNewUser({...newUser, email: e.target.value})} />
              <select className="w-full border p-2 rounded" onChange={(e) => setNewUser({...newUser, role: e.target.value})}>
                <option value="User">User</option><option value="Admin">Admin</option><option value="Head of Department">Head of Department</option><option value="Dean">Dean</option>
              </select>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600">Cancel</button>
              <button onClick={handleSaveUser} className="px-4 py-2 bg-[#1E56A0] text-white rounded">Save User</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default UserManagementContent;