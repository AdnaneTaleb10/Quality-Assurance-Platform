import React, { useState } from 'react';

const RoleBadge = ({ role }) => {
  const roleStyles = {
    'Admin': 'bg-red-50 text-red-700 border border-red-200',
    'User': 'bg-gray-100 text-gray-700 border border-gray-200',
    'Head of Department': 'bg-blue-50 text-blue-700 border border-blue-200',
    'Dean': 'bg-purple-50 text-purple-700 border border-purple-200',
  };
  
  return (
    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${roleStyles[role] || 'bg-gray-50 text-gray-500 border border-gray-100'}`}>
      {role}
    </span>
  );
};

const UserTable = ({ users, setUsers, filterRole, searchQuery }) => {
  // L'ÉTAT LOCAL users A ÉTÉ SUPPRIMÉ
  const [openMenuId, setOpenMenuId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [tempData, setTempData] = useState({});

  const startEdit = (user) => {
    setEditingId(user.id);
    setTempData(user);
    setOpenMenuId(null);
  };

  const saveEdit = () => {
    setUsers(users.map(u => (u.id === editingId ? tempData : u)));
    setEditingId(null);
  };

  const deleteUser = (id) => {
    setUsers(users.filter(user => user.id !== id));
    setOpenMenuId(null);
  };

  const filteredUsers = users.filter(user => {
    const matchesRole = filterRole === 'ALL' || user.role === filterRole;
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRole && matchesSearch;
  });

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50/50">
            <th className="text-left p-4 text-[11px] uppercase text-gray-400 font-semibold">ID</th>
            <th className="text-left p-4 text-[11px] uppercase text-gray-400 font-semibold">Full Name</th>
            <th className="text-left p-4 text-[11px] uppercase text-gray-400 font-semibold">Email</th>
            <th className="text-left p-4 text-[11px] uppercase text-gray-400 font-semibold">Role</th>
            <th className="text-right p-4 text-[11px] uppercase text-gray-400 font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
              <td className="p-4 text-[13px] text-gray-400 font-mono">{user.id}</td>
              <td className="p-4">
                {editingId === user.id ? (
                  <input 
                    className="border border-blue-500 rounded px-2 py-1 w-full text-[14px] focus:ring-2 focus:ring-blue-200 outline-none" 
                    value={tempData.name} 
                    onChange={(e) => setTempData({...tempData, name: e.target.value})} 
                  />
                ) : <span className="text-[14px] font-medium text-gray-900">{user.name}</span>}
              </td>
              <td className="p-4 text-[14px] text-gray-600">{user.email}</td>
              <td className="p-4">
                {editingId === user.id ? (
                    <select 
                    className="w-full h-[38px] px-3 bg-white border border-[#1E56A0] rounded-md text-sm font-medium text-gray-700 shadow-sm focus:outline-none focus:ring-1 focus:ring-[#164685] transition-colors"
                    value={tempData.role} 
                    onChange={(e) => setTempData({...tempData, role: e.target.value})}
                    >
                    {['Admin', 'User', 'Head of Department', 'Dean'].map(r => (
                        <option key={r} value={r}>{r}</option>
                    ))}
                    </select>
                ) : <RoleBadge role={user.role} />}
              </td>
              <td className="p-4 text-right relative">
                {editingId === user.id ? (
                  <button onClick={saveEdit} className="text-blue-600 font-bold text-xs bg-blue-50 px-3 py-1.5 rounded hover:bg-blue-100 transition-colors">SAVE</button>
                ) : (
                  <button onClick={() => setOpenMenuId(openMenuId === user.id ? null : user.id)} className="text-gray-400 hover:text-gray-600 transition-colors p-2">•••</button>
                )}
                {openMenuId === user.id && (
                <div className="absolute right-4 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50 py-1">
                    <button onClick={() => startEdit(user)} className="flex items-center gap-2 w-full px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors">
                      <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                      Modifie
                    </button>
                    <div className="h-px bg-gray-100 mx-2"></div>
                    <button onClick={() => deleteUser(user.id)} className="flex items-center gap-2 w-full px-5 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                      Delete
                    </button>
                </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;