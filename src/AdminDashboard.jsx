import React, { useEffect, useState } from 'react';

const AdminDashboard = ({ onLogout }) => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPlan, setFilterPlan] = useState('All');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  
  // Tab State with Local Storage persistence
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('adminTab') || 'dashboard';
  });

  // Coach States
  const [coaches, setCoaches] = useState([]);
  const [showCoachModal, setShowCoachModal] = useState(false);
  const [newCoach, setNewCoach] = useState({ name: '', specialty: '', experience: '', image: '' });

  // Plan States
  const [plans, setPlans] = useState([]);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [newPlan, setNewPlan] = useState({ name: '', price: '', duration: '1', durationUnit: 'month' });

  // --- FETCH DATA ---
  useEffect(() => {
    // 1. Fetch Users
    fetch('http://127.0.0.1:5000/api/users')
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(err => console.error("Error fetching users:", err));

    // 2. Fetch Coaches
    fetch('http://127.0.0.1:5000/api/coaches')
      .then(res => res.json())
      .then(data => setCoaches(data))
      .catch(err => console.error("Error fetching coaches:", err));

    // 3. Fetch Plans
    fetch('http://127.0.0.1:5000/api/plans')
      .then(res => res.json())
      .then(data => setPlans(data))
      .catch(err => console.log("Plans route not ready yet"));
      
    localStorage.setItem('adminTab', activeTab);
  }, [activeTab]);


  // --- COACH FUNCTIONS ---
  const handleDeleteCoach = async (id) => {
    if (window.confirm("Remove this coach from the team?")) {
      const res = await fetch(`http://127.0.0.1:5000/api/coaches/${id}`, { method: 'DELETE' });
      if (res.ok) setCoaches(coaches.filter(c => c._id !== id));
    }
  };

  const handleAddCoach = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://127.0.0.1:5000/api/coaches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCoach)
      });
      if (res.ok) {
        const data = await res.json();
        setCoaches([...coaches, data.coach]);
        setShowCoachModal(false);
        setNewCoach({ name: '', specialty: '', experience: '', image: '' });
      }
    } catch (err) { console.error("Error adding coach:", err); }
  };

  // --- PLAN FUNCTIONS ---
  const handleAddPlan = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://127.0.0.1:5000/api/plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPlan)
      });
      if (res.ok) {
        const data = await res.json();
        setPlans([...plans, data]);
        setShowPlanModal(false);
        setNewPlan({ name: '', price: '', duration: '1', durationUnit: 'month' });
      }
    } catch (err) { console.error("Error adding plan:", err); }
  };

  const handleDeletePlan = async (id) => {
      if(window.confirm("Delete this membership plan?")) {
        try {
            const res = await fetch(`http://127.0.0.1:5000/api/plans/${id}`, { method: 'DELETE' });
            if(res.ok) setPlans(plans.filter(p => p._id !== id));
        } catch(err) { console.error(err); }
      }
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => resolve(fileReader.result);
      fileReader.onerror = (error) => reject(error);
    });
  };

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'pending' ? 'active' : 'pending';
    const res = await fetch(`http://127.0.0.1:5000/api/users/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });
    if (res.ok) setUsers(users.map(u => u._id === id ? { ...u, status: newStatus } : u));
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to remove ${name}?`)) {
      try {
        const res = await fetch(`http://127.0.0.1:5000/api/users/${id}`, { method: 'DELETE' });
        if (res.ok) setUsers(users.filter(u => u._id !== id));
      } catch (err) { console.error("Delete error:", err); }
    }
  };

  // Filter & Sort Logic
  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlan = filterPlan === 'All' || u.plan === filterPlan;
    return matchesSearch && matchesPlan;
  });

  const recentMembers = [...users]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  return (
    <div className="flex min-h-screen bg-slate-950 text-white font-sans overflow-hidden">
      
      {/* --- SIDEBAR --- */}
      <div className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col p-6 fixed h-full z-20">
        <h1 className="text-xl font-black text-orange-500 tracking-tighter mb-10 italic">LONGLONG GYM</h1>
        <nav className="flex-1 space-y-2">
          <button onClick={() => { setActiveTab('dashboard'); localStorage.setItem('adminTab', 'dashboard'); }} className={`w-full text-left px-4 py-3 rounded-xl font-bold transition ${activeTab === 'dashboard' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}>📊 Dashboard</button>
          <button onClick={() => setActiveTab('members')} className={`w-full text-left px-4 py-3 rounded-xl font-bold transition ${activeTab === 'members' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}>👥 Members List</button>
          <button onClick={() => setActiveTab('coaches')} className={`w-full text-left px-4 py-3 rounded-xl font-bold transition ${activeTab === 'coaches' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}>💪 Coaches</button>
          <button onClick={() => setActiveTab('plans')} className={`w-full text-left px-4 py-3 rounded-xl font-bold transition ${activeTab === 'plans' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}>🏷️ Plans</button>
        </nav>
        <button onClick={onLogout} className="bg-red-600/10 text-red-500 hover:bg-red-600 hover:text-white px-4 py-3 rounded-xl font-bold transition">Logout</button>
      </div>

      {/* --- MAIN CONTENT --- */}
      <main className={`flex-1 ml-64 p-10 transition-all duration-300 ${selectedUser ? 'mr-80' : ''}`}>
        
        {activeTab === 'dashboard' ? (
          <div className="animate-in fade-in duration-500">
            <header className="mb-10"><h2 className="text-3xl font-black uppercase tracking-tight">Gym Overview</h2></header>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10 text-white">
              <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl"><p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2">Total Members</p><p className="text-4xl font-black">{users.length}</p></div>
              <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl"><p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2">Pending</p><p className="text-4xl font-black text-yellow-500">{users.filter(u => u.status === 'pending').length}</p></div>
              <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl"><p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2">Coaches</p><p className="text-4xl font-black text-orange-500">{coaches.length}</p></div>
              <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl"><p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2">Records</p><p className="text-4xl font-black text-green-500">{users.length + coaches.length}</p></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-slate-900 p-8 rounded-[40px] border border-slate-800 shadow-xl">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-white">Recent Members</h3>
                  <button onClick={() => setActiveTab('members')} className="text-[10px] font-black text-orange-500 hover:underline uppercase tracking-widest">View All</button>
                </div>
                <div className="space-y-3">
                  {recentMembers.map((member) => (
                    <div key={member._id} className="flex items-center justify-between p-4 bg-slate-800/40 rounded-2xl border border-slate-800/50">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full overflow-hidden border border-orange-500 bg-slate-800 flex items-center justify-center">
                           {member.profileImage ? (
                               <img src={member.profileImage} className="w-full h-full object-cover" alt="Profile" />
                           ) : (
                               <span className="font-black text-orange-500 text-[10px] italic">{member.name.charAt(0)}</span>
                           )}
                        </div>
                        <p className="font-bold text-sm text-slate-200">{member.name}</p>
                      </div>
                      <p className="text-[10px] text-slate-500 italic">{new Date(member.createdAt).toLocaleDateString()}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-8">
                <div className="bg-slate-900 p-8 rounded-[40px] border border-slate-800">
                  <h3 className="text-xl font-bold mb-6 text-white">System Health</h3>
                  <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-2xl flex items-center gap-4 mb-4">
                     <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                     <p className="text-green-500 text-sm font-bold uppercase tracking-tight">Database Connected: Stable</p>
                  </div>
                  <p className="text-slate-500 text-sm italic">Vault monitoring is active.</p>
                </div>
              </div>
            </div>
          </div>
        ) : activeTab === 'plans' ? (
          <div className="animate-in fade-in duration-500">
             <header className="mb-8 flex justify-between items-center">
               <div><h2 className="text-3xl font-black uppercase tracking-tight">Membership Plans</h2><p className="text-slate-500 font-medium">Manage pricing.</p></div>
               <button onClick={() => setShowPlanModal(true)} className="bg-orange-600 px-6 py-3 rounded-xl font-black text-white">+ Add New Plan</button>
             </header>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {plans.map(plan => (
                   <div key={plan._id} className="bg-slate-900 border border-slate-800 p-8 rounded-[32px] relative group hover:border-orange-500 transition">
                       <h3 className="text-2xl font-black text-white mb-2">{plan.name}</h3>
                       <p className="text-4xl font-black text-orange-500 mb-2">₱{plan.price}</p>
                       <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-8">Valid {plan.duration} {plan.durationUnit}(s)</p>
                       <button onClick={() => handleDeletePlan(plan._id)} className="w-full py-3 bg-red-600/10 text-red-500 rounded-xl font-black text-xs uppercase hover:bg-red-600 hover:text-white transition">Delete Plan</button>
                   </div>
                ))}
             </div>
          </div>
        ) : activeTab === 'coaches' ? (
          <div className="animate-in fade-in duration-500">
            <header className="mb-8 flex justify-between items-center">
              <div><h2 className="text-3xl font-black uppercase tracking-tight">Gym Coaches</h2><p className="text-slate-500 font-medium">Manage trainers.</p></div>
              <button onClick={() => setShowCoachModal(true)} className="bg-orange-600 px-6 py-3 rounded-xl font-black text-white">+ Add New Coach</button>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {coaches.map(coach => (
                  <div key={coach._id} className="bg-slate-900 border border-slate-800 p-6 rounded-3xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4"><span className="text-[10px] font-black uppercase px-2 py-1 bg-green-500/10 text-green-500 rounded-md">{coach.status || 'Available'}</span></div>
                    <div className="w-16 h-16 bg-slate-800 rounded-2xl mb-4 overflow-hidden border border-slate-700"><img src={coach.image || 'https://via.placeholder.com/150'} alt={coach.name} className="w-full h-full object-cover" /></div>
                    <h3 className="text-xl font-bold mb-1 text-white">{coach.name}</h3>
                    <p className="text-orange-500 font-bold text-sm mb-4 uppercase tracking-wider">{coach.specialty}</p>
                    <button onClick={() => handleDeleteCoach(coach._id)} className="mt-6 w-full py-2 bg-red-600/10 text-red-500 text-[10px] font-black uppercase rounded-lg hover:bg-red-600 hover:text-white transition">Remove Coach</button>
                  </div>
                ))}
            </div>
          </div>
        ) : (
          <div className="animate-in fade-in duration-500">
            <header className="mb-10 flex justify-between items-end">
              <div><h2 className="text-3xl font-black uppercase tracking-tight text-white">Member Management</h2></div>
              <input type="text" placeholder="Search..." className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm" onChange={(e) => setSearchTerm(e.target.value)} />
            </header>
            <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
              <table className="w-full text-left">
                <thead className="bg-slate-800/50 text-slate-400 text-[10px] uppercase font-black tracking-widest">
                  <tr><th className="p-5">Member</th><th className="p-5">Plan</th><th className="p-5 text-center">Status</th><th className="p-5 text-right">Actions</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-white">
                  {filteredUsers.map(u => (
                    <tr key={u._id} onClick={() => setSelectedUser(u)} className={`hover:bg-slate-800/30 transition cursor-pointer ${selectedUser?._id === u._id ? 'bg-slate-800/50' : ''}`}>
                      <td className="p-5"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full overflow-hidden border border-slate-600 bg-slate-800 flex items-center justify-center">{u.profileImage ? <img src={u.profileImage} className="w-full h-full object-cover" /> : <span className="font-bold text-[10px]">{u.name.charAt(0)}</span>}</div><span className="font-bold text-slate-200">{u.name}</span></div></td>
                      <td className="p-5 text-slate-400">{u.plan}</td>
                      <td className="p-5 text-center"><span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase ${u.status === 'active' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>{u.status}</span></td>
                      <td className="p-5 text-right space-x-2" onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => toggleStatus(u._id, u.status)} className="text-[10px] bg-white text-black px-4 py-2 rounded-lg font-black hover:bg-orange-600 hover:text-white transition uppercase">{u.status === 'pending' ? 'Approve' : 'Suspend'}</button>
                        <button onClick={() => { setUserToDelete(u); setIsDeleteModalOpen(true); }} className="text-[10px] bg-red-600/10 text-red-500 border border-red-600/20 px-4 py-2 rounded-lg font-black hover:bg-red-600 hover:text-white transition uppercase">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* --- SIDE PANELS & MODALS --- */}
      {selectedUser && (
        <aside className="fixed right-0 top-0 w-80 h-full bg-slate-900 border-l border-slate-800 p-8 shadow-2xl animate-in slide-in-from-right duration-300 z-30">
          <button onClick={() => setSelectedUser(null)} className="text-slate-500 hover:text-white mb-6 font-bold flex items-center gap-2">✕ Close Profile</button>
          <div className="w-24 h-24 rounded-3xl overflow-hidden border-2 border-orange-500 bg-slate-800 mx-auto mb-6">{selectedUser.profileImage ? <img src={selectedUser.profileImage} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-4xl font-black text-orange-500">{selectedUser.name.charAt(0)}</div>}</div>
          <h3 className="text-2xl font-black mb-1 text-center">{selectedUser.name}</h3>
          <p className="text-slate-500 text-sm mb-6 text-center">{selectedUser.email}</p>
          <div className="space-y-4">
            <div className="bg-slate-800/50 p-4 rounded-xl"><p className="text-[10px] text-slate-500 uppercase font-black mb-1">Membership Plan</p><p className="font-bold text-orange-500">{selectedUser.plan}</p></div>
            <div className="bg-slate-800/50 p-4 rounded-xl"><p className="text-[10px] text-slate-500 uppercase font-black mb-1">Join Date</p><p className="font-bold text-white">{new Date(selectedUser.createdAt).toLocaleDateString()}</p></div>
          </div>
        </aside>
      )}

      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 text-slate-900">
          <div className="bg-white p-8 rounded-3xl max-w-sm w-full shadow-2xl">
            <h2 className="text-2xl font-black tracking-tight mb-2">Delete Member?</h2>
            <p className="text-slate-500 text-sm mb-6">Are you sure you want to remove <span className="font-bold text-slate-900">{userToDelete?.name}</span>?</p>
            <div className="flex gap-3">
              <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 py-3 font-bold bg-slate-100 rounded-xl hover:bg-slate-200 transition">Cancel</button>
              <button onClick={() => { handleDelete(userToDelete._id, userToDelete.name); setIsDeleteModalOpen(false); }} className="flex-1 py-3 font-bold bg-red-600 text-white rounded-xl hover:bg-red-700 transition">Delete</button>
            </div>
          </div>
        </div>
      )}

      {showCoachModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4 text-slate-900">
          <form onSubmit={handleAddCoach} className="bg-white p-8 rounded-3xl max-w-md w-full shadow-2xl">
            <h2 className="text-2xl font-black tracking-tight mb-6">Add New Gym Coach</h2>
            <div className="space-y-4">
              <input required className="w-full bg-slate-100 rounded-xl px-4 py-3 mt-1 outline-none" placeholder="Coach Name" value={newCoach.name} onChange={(e) => setNewCoach({...newCoach, name: e.target.value})} />
              <input required className="w-full bg-slate-100 rounded-xl px-4 py-3 mt-1 outline-none" placeholder="Specialty" value={newCoach.specialty} onChange={(e) => setNewCoach({...newCoach, specialty: e.target.value})} />
              <input className="w-full bg-slate-100 rounded-xl px-4 py-3 mt-1 outline-none" placeholder="Experience" value={newCoach.experience} onChange={(e) => setNewCoach({...newCoach, experience: e.target.value})} />
              <input type="file" accept="image/*" className="w-full mt-1 text-sm file:mr-4 file:py-1 file:px-4 file:rounded-full file:bg-orange-600 file:text-white" onChange={async (e) => { const file = e.target.files[0]; const base64 = await convertToBase64(file); setNewCoach({...newCoach, image: base64}); }} />
            </div>
            <div className="flex gap-3 mt-8"><button type="button" onClick={() => setShowCoachModal(false)} className="flex-1 py-3 font-bold bg-slate-100 rounded-xl">Cancel</button><button type="submit" className="flex-1 py-3 font-bold bg-orange-600 text-white rounded-xl hover:bg-orange-700">Save Coach</button></div>
          </form>
        </div>
      )}

      {showPlanModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4 text-slate-900">
          <form onSubmit={handleAddPlan} className="bg-white p-8 rounded-[40px] max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <h2 className="text-2xl font-black tracking-tight mb-6 uppercase italic">Create Membership Plan</h2>
            <div className="space-y-4">
              <input required className="w-full bg-slate-100 rounded-xl px-4 py-3 mt-1 outline-none font-bold" placeholder="e.g. Bronze Access" value={newPlan.name} onChange={(e) => setNewPlan({...newPlan, name: e.target.value})} />
              <input required type="number" className="w-full bg-slate-100 rounded-xl px-4 py-3 mt-1 outline-none font-bold text-orange-600" placeholder="0.00" value={newPlan.price} onChange={(e) => setNewPlan({...newPlan, price: e.target.value})} />
              <div className="flex gap-4">
                 <input required type="number" className="w-full bg-slate-100 rounded-xl px-4 py-3 mt-1 outline-none" value={newPlan.duration} onChange={(e) => setNewPlan({...newPlan, duration: e.target.value})} />
                 <select className="w-full bg-slate-100 rounded-xl px-4 py-3 mt-1 outline-none" value={newPlan.durationUnit} onChange={(e) => setNewPlan({...newPlan, durationUnit: e.target.value})}>
                    <option value="month">Month(s)</option>
                    <option value="year">Year(s)</option>
                    <option value="day">Day(s)</option>
                    <option value="week">Week(s)</option>
                 </select>
              </div>
            </div>
            <div className="flex gap-3 mt-8"><button type="button" onClick={() => setShowPlanModal(false)} className="flex-1 py-3 font-bold bg-slate-100 rounded-xl">Cancel</button><button type="submit" className="flex-1 py-3 font-bold bg-orange-600 text-white rounded-xl hover:bg-orange-700">Save Plan</button></div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;