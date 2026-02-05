import React, { useEffect, useState } from 'react';

const AdminDashboard = ({ onLogout }) => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); // New: For Search

  useEffect(() => {
    fetch('http://127.0.0.1:5000/api/users')
      .then(res => res.json())
      .then(data => setUsers(data));
  }, []);
// 1. Ensure this is inside your AdminDashboard component
const toggleStatus = async (id, currentStatus) => {
  const newStatus = currentStatus === 'pending' ? 'active' : 'pending';
  const res = await fetch(`http://127.0.0.1:5000/api/users/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: newStatus })
  });
  if (res.ok) {
    setUsers(users.map(u => u._id === id ? { ...u, status: newStatus } : u));
  }
};

  const handleDelete = async (id, name) => {
  if (window.confirm(`Are you sure you want to remove ${name}?`)) {
    try {
      const res = await fetch(`http://127.0.0.1:5000/api/users/${id}`, {
        method: 'DELETE' // Using the proper DELETE method
      });
      
      if (res.ok) {
        setUsers(users.filter(u => u._id !== id));
      } else {
        alert("Failed to delete user.");
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  }
};

  // FILTER LOGIC: This searches through names as you type
  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-slate-950 text-white font-sans">
      
      {/* --- SIDEBAR --- */}
      <div className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col p-6 fixed h-full">
        <h1 className="text-xl font-black text-orange-500 tracking-tighter mb-10 italic">LONGLONG GYM</h1>
        <nav className="flex-1 space-y-2">
          <button className="w-full text-left px-4 py-3 rounded-xl font-bold bg-orange-600 text-white">Members List</button>
        </nav>
        <button onClick={onLogout} className="bg-red-600/10 text-red-500 hover:bg-red-600 hover:text-white px-4 py-3 rounded-xl font-bold transition">Logout</button>
      </div>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 ml-64 p-10">
        <header className="mb-10 flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-black uppercase tracking-tight text-white">Admin Control</h2>
            <p className="text-slate-500 font-medium">Manage and search gym memberships.</p>
          </div>
          
          {/* SEARCH BAR */}
          <div className="relative w-72">
            <input 
              type="text"
              placeholder="Search by name..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </header>

        {/* TABLE */}
        <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
          <table className="w-full text-left">
            <thead className="bg-slate-800/50 text-slate-400 text-[10px] uppercase font-black tracking-widest">
              <tr>
                <th className="p-5">Name</th>
                <th className="p-5">Plan</th>
                <th className="p-5 text-center">Status</th>
                <th className="p-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredUsers.map(u => (
                <tr key={u._id} className="hover:bg-slate-800/30 transition">
                  <td className="p-5 font-bold text-slate-200">{u.name}</td>
                  <td className="p-5 text-slate-400 font-medium">{u.plan}</td>
                  <td className="p-5">
                    <div className="flex justify-center">
                      <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${u.status === 'active' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                        {u.status}
                      </span>
                    </div>
                  </td>
                  <td className="p-5 text-right space-x-2">
                    <button 
                      onClick={() => toggleStatus(u._id, u.status)}
                      className="text-[10px] bg-white text-black px-4 py-2 rounded-lg font-black hover:bg-orange-500 hover:text-white transition uppercase"
                    >
                      {u.status === 'pending' ? 'Approve' : 'Suspend'}
                    </button>
                    <button 
                      onClick={() => handleDelete(u._id, u.name)}
                      className="text-[10px] bg-red-600/10 text-red-500 border border-red-600/20 px-4 py-2 rounded-lg font-black hover:bg-red-600 hover:text-white transition uppercase"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;