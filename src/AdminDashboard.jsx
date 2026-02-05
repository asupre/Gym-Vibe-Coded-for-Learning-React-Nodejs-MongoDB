import React, { useEffect, useState } from 'react';

const AdminDashboard = ({ onLogout }) => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); // New: For Search
  const [filterPlan, setFilterPlan] = useState('All'); // For Plan Filtering
const [selectedUser, setSelectedUser] = useState(null); // For the Side Profile View
const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // Custom Delete Modal
const [userToDelete, setUserToDelete] = useState(null);
const [activeTab, setActiveTab] = useState(() => {
  // Check if we saved a tab preference before; if not, default to dashboard
  return localStorage.getItem('adminTab') || 'dashboard';
}); // 'members' or 'coaches'
const [coaches, setCoaches] = useState([]);
const [showCoachModal, setShowCoachModal] = useState(false);
const [newCoach, setNewCoach] = useState({ name: '', specialty: '', experience: '', image: '' });

const handleDeleteCoach = async (id) => {
  if (window.confirm("Remove this coach from the team?")) {
    const res = await fetch(`http://127.0.0.1:5000/api/coaches/${id}`, {
      method: 'DELETE'
    });
    if (res.ok) {
      setCoaches(coaches.filter(c => c._id !== id));
    }
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
      // This updates the UI immediately without refreshing
      setCoaches([...coaches, data.coach]); 
      setShowCoachModal(false); 
      setNewCoach({ name: '', specialty: '', experience: '' }); // Reset
    } else {
      alert("Failed to add coach. Check server console.");
    }
  } catch (err) {
    console.error("Error adding coach:", err);
  }
};

const convertToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      resolve(fileReader.result);
    };
    fileReader.onerror = (error) => {
      reject(error);
    };
  });
};

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
}, []); // Empty brackets mean "Run this once when the page loads"
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
  const filteredUsers = users.filter(u => {
  const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase());
  const matchesPlan = filterPlan === 'All' || u.plan === filterPlan;
  return matchesSearch && matchesPlan;
});

// Sort users by date (newest first) and take the first 5
const recentMembers = [...users]
  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  .slice(0, 5);

  return (
  <div className="flex min-h-screen bg-slate-950 text-white font-sans overflow-hidden">
    {/* --- SIDEBAR --- */}
    <div className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col p-6 fixed h-full z-20">
      <h1 className="text-xl font-black text-orange-500 tracking-tighter mb-10 italic">LONGLONG GYM</h1>
      <nav className="flex-1 space-y-2">
  <button 
    onClick={() => {
    setActiveTab('dashboard');
    localStorage.setItem('adminTab', 'dashboard');
  }}
    className={`w-full text-left px-4 py-3 rounded-xl font-bold transition ${activeTab === 'dashboard' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
  >
    📊 Dashboard
  </button>
  <button 
    onClick={() => setActiveTab('members')}
    className={`w-full text-left px-4 py-3 rounded-xl font-bold transition ${activeTab === 'members' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
  >
    Members List
  </button>
  <button 
    onClick={() => setActiveTab('coaches')}
    className={`w-full text-left px-4 py-3 rounded-xl font-bold transition ${activeTab === 'coaches' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
  >
    Coaches
  </button>
</nav>
      <button onClick={onLogout} className="bg-red-600/10 text-red-500 hover:bg-red-600 hover:text-white px-4 py-3 rounded-xl font-bold transition">Logout</button>
    </div>

    {/* --- MAIN CONTENT --- */}
<main className={`flex-1 ml-64 p-10 transition-all duration-300 ${selectedUser ? 'mr-80' : ''}`}>
  {activeTab === 'dashboard' ? (
    /* --- ANALYTICS DASHBOARD VIEW --- */
    <div className="animate-in fade-in duration-500">
      <header className="mb-10">
        <h2 className="text-3xl font-black uppercase tracking-tight">Gym Overview</h2>
        <p className="text-slate-500 font-medium">Real-time analytics for LongLong Gym.</p>
      </header>

      {/* BIG STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl text-white">
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2">Total Members</p>
          <p className="text-4xl font-black">{users.length}</p>
        </div>
        <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl text-white">
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2">Pending Approvals</p>
          <p className="text-4xl font-black text-yellow-500">
            {users.filter(u => u.status === 'pending').length}
          </p>
        </div>
        <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl text-white">
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2">Active Coaches</p>
          <p className="text-4xl font-black text-orange-500">{coaches.length}</p>
        </div>
        <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl text-white">
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2">Total Records</p>
          <p className="text-4xl font-black text-green-500">{users.length + coaches.length}</p> 
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* RECENT MEMBERS LIST */}
        <div className="bg-slate-900 p-8 rounded-[40px] border border-slate-800 shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-white">Recent Members</h3>
            <button 
              onClick={() => setActiveTab('members')} 
              className="text-[10px] font-black text-orange-500 hover:underline uppercase tracking-widest"
            >
              View All
            </button>
          </div>
          <div className="space-y-3">
            {users.slice(0, 5).map((member) => (
              <div key={member._id} className="flex items-center justify-between p-4 bg-slate-800/40 rounded-2xl border border-slate-800/50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-orange-600/20 rounded-full flex items-center justify-center font-black text-orange-500 text-[10px] italic">
                    {member.name.charAt(0)}
                  </div>
                  <p className="font-bold text-sm text-slate-200">{member.name}</p>
                </div>
                <p className="text-[10px] text-slate-500 italic">
                  {new Date(member.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* SYSTEM HEALTH & PLAN DISTRIBUTION */}
        <div className="space-y-8">
          <div className="bg-slate-900 p-8 rounded-[40px] border border-slate-800">
            <h3 className="text-xl font-bold mb-6 text-white">System Health</h3>
            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-2xl flex items-center gap-4 mb-4">
               <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
               <p className="text-green-500 text-sm font-bold uppercase tracking-tight">Database Connected: Stable</p>
            </div>
            <p className="text-slate-500 text-sm italic">Vault monitoring is active.</p>
          </div>

          <div className="bg-slate-900 p-8 rounded-[40px] border border-slate-800">
            <h3 className="text-xl font-bold mb-6 text-white">Plan Distribution</h3>
            <div className="space-y-4">
              {['Platinum', 'Gold', 'Silver'].map(plan => {
                const count = users.filter(u => u.plan === plan).length;
                const percentage = users.length > 0 ? (count / users.length) * 100 : 0;
                return (
                  <div key={plan}>
                    <div className="flex justify-between text-[10px] font-black mb-2 uppercase tracking-widest">
                      <span className="text-slate-400">{plan}</span>
                      <span className="text-white">{count} Members</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-orange-600 h-full transition-all duration-1000" 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : activeTab === 'coaches' ? (
    /* --- COACHES VIEW --- */
    <div className="animate-in fade-in duration-500">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black uppercase tracking-tight">Gym Coaches</h2>
          <p className="text-slate-500 font-medium">Manage your professional trainers and staff.</p>
        </div>
        <button 
          onClick={() => setShowCoachModal(true)}
          className="bg-orange-600 px-6 py-3 rounded-xl font-black hover:bg-orange-500 transition shadow-lg shadow-orange-900/20 active:scale-95 text-white"
        >
          + Add New Coach
        </button>
      </header>

      {coaches.length === 0 ? (
        <div className="bg-slate-900/50 border-2 border-dashed border-slate-800 rounded-3xl p-20 text-center">
          <p className="text-slate-500 font-bold text-lg">No coaches added yet.</p>
          <p className="text-slate-600 text-sm">Click the button above to start building your team.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coaches.map(coach => (
            <div key={coach._id} className="bg-slate-900 border border-slate-800 p-6 rounded-3xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4">
                 <span className="text-[10px] font-black uppercase px-2 py-1 bg-green-500/10 text-green-500 rounded-md">
                   {coach.status || 'Available'}
                 </span>
              </div>
              <div className="w-16 h-16 bg-slate-800 rounded-2xl mb-4 overflow-hidden border border-slate-700">
                <img src={coach.image || 'https://via.placeholder.com/150'} alt={coach.name} className="w-full h-full object-cover" />
              </div>
              <h3 className="text-xl font-bold mb-1 text-white">{coach.name}</h3>
              <p className="text-orange-500 font-bold text-sm mb-4 uppercase tracking-wider">{coach.specialty}</p>
              <div className="flex items-center gap-2 text-slate-500 text-xs italic">
                <span>Experience:</span>
                <span className="text-slate-300 font-bold">{coach.experience || 'N/A'}</span>
              </div>
              <button 
                onClick={() => handleDeleteCoach(coach._id)}
                className="mt-6 w-full py-2 bg-red-600/10 text-red-500 text-[10px] font-black uppercase rounded-lg hover:bg-red-600 hover:text-white transition"
              >
                Remove Coach
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  ) : (
    /* --- MEMBERS VIEW --- */
    <div className="animate-in fade-in duration-500">
      <header className="mb-10 flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black uppercase tracking-tight text-white">Member Management</h2>
          <div className="flex gap-2 mt-4">
            {['All', 'Silver', 'Gold', 'Platinum'].map(plan => (
              <button 
                key={plan}
                onClick={() => setFilterPlan(plan)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold border transition ${filterPlan === plan ? 'bg-orange-600 border-orange-600 text-white' : 'border-slate-800 text-slate-500 hover:border-slate-600'}`}
              >
                {plan}
              </button>
            ))}
          </div>
        </div>
        <div className="relative w-72">
          <input 
            type="text"
            placeholder="Search by name..."
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm transition-all text-white"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

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
          <tbody className="divide-y divide-slate-800 text-white">
            {filteredUsers.map(u => (
              <tr key={u._id} onClick={() => setSelectedUser(u)} className={`hover:bg-slate-800/30 transition cursor-pointer ${selectedUser?._id === u._id ? 'bg-slate-800/50' : ''}`}>
                <td className="p-5 font-bold">{u.name}</td>
                <td className="p-5 text-slate-400">{u.plan}</td>
                <td className="p-5 text-center">
                  <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase ${u.status === 'active' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                    {u.status}
                  </span>
                </td>
                <td className="p-5 text-right space-x-2" onClick={(e) => e.stopPropagation()}>
                  <button onClick={() => toggleStatus(u._id, u.status)} className="text-[10px] bg-white text-black px-4 py-2 rounded-lg font-black hover:bg-orange-600 hover:text-white transition uppercase">
                    {u.status === 'pending' ? 'Approve' : 'Suspend'}
                  </button>
                  <button onClick={() => { setUserToDelete(u); setIsDeleteModalOpen(true); }} className="text-[10px] bg-red-600/10 text-red-500 border border-red-600/20 px-4 py-2 rounded-lg font-black hover:bg-red-600 hover:text-white transition uppercase">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )}
</main>



    {/* --- PROFILE SIDE PANEL --- */}
    {selectedUser && (
      <aside className="fixed right-0 top-0 w-80 h-full bg-slate-900 border-l border-slate-800 p-8 shadow-2xl animate-in slide-in-from-right duration-300 z-30">
        <button onClick={() => setSelectedUser(null)} className="text-slate-500 hover:text-white mb-6 font-bold flex items-center gap-2">
          ✕ Close Profile
        </button>
        <div className="w-20 h-20 bg-orange-600 rounded-2xl flex items-center justify-center text-3xl font-black mb-4">
          {selectedUser.name.charAt(0)}
        </div>
        <h3 className="text-2xl font-black mb-1">{selectedUser.name}</h3>
        <p className="text-slate-500 text-sm mb-6">{selectedUser.email}</p>
        
        <div className="space-y-4">
          <div className="bg-slate-800/50 p-4 rounded-xl">
            <p className="text-[10px] text-slate-500 uppercase font-black mb-1">Membership Plan</p>
            <p className="font-bold text-orange-500">{selectedUser.plan}</p>
          </div>
          <div className="bg-slate-800/50 p-4 rounded-xl">
            <p className="text-[10px] text-slate-500 uppercase font-black mb-1">Join Date</p>
            <p className="font-bold text-white">{new Date(selectedUser.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
      </aside>
    )}

    {/* --- CUSTOM DELETE MODAL --- */}
    {isDeleteModalOpen && (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white text-slate-900 p-8 rounded-3xl max-w-sm w-full shadow-2xl">
          <h2 className="text-2xl font-black tracking-tight mb-2">Delete Member?</h2>
          <p className="text-slate-500 text-sm mb-6">Are you sure you want to remove <span className="font-bold text-slate-900">{userToDelete?.name}</span>? This action cannot be undone.</p>
          <div className="flex gap-3">
            <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 py-3 font-bold bg-slate-100 rounded-xl hover:bg-slate-200 transition">Cancel</button>
            <button 
              onClick={() => { handleDelete(userToDelete._id, userToDelete.name); setIsDeleteModalOpen(false); }}
              className="flex-1 py-3 font-bold bg-red-600 text-white rounded-xl hover:bg-red-700 transition"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    )}

    {showCoachModal && (
  <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
    <form onSubmit={handleAddCoach} className="bg-white text-slate-900 p-8 rounded-3xl max-w-md w-full shadow-2xl">
      <h2 className="text-2xl font-black tracking-tight mb-6">Add New Gym Coach</h2>
      
      <div className="space-y-4">
        <div>
          <label className="text-[10px] font-black uppercase text-slate-400">Full Name</label>
          <input 
            required
            className="w-full bg-slate-100 border-none rounded-xl px-4 py-3 mt-1 focus:ring-2 focus:ring-orange-500 outline-none"
            placeholder="Coach Name"
            value={newCoach.name}
            onChange={(e) => setNewCoach({...newCoach, name: e.target.value})}
          />
        </div>
        <div>
          <label className="text-[10px] font-black uppercase text-slate-400">Specialty</label>
          <input 
            required
            className="w-full bg-slate-100 border-none rounded-xl px-4 py-3 mt-1 focus:ring-2 focus:ring-orange-500 outline-none"
            placeholder="e.g. Bodybuilding, Boxing"
            value={newCoach.specialty}
            onChange={(e) => setNewCoach({...newCoach, specialty: e.target.value})}
          />
        </div>
        <div>
          <label className="text-[10px] font-black uppercase text-slate-400">Experience</label>
          <input 
            className="w-full bg-slate-100 border-none rounded-xl px-4 py-3 mt-1 focus:ring-2 focus:ring-orange-500 outline-none"
            placeholder="e.g. 3 Years"
            value={newCoach.experience}
            onChange={(e) => setNewCoach({...newCoach, experience: e.target.value})}
          />
        </div>
      </div>
      <div>
  <label className="text-[10px] font-black uppercase text-slate-400">Coach Photo</label>
  <input 
    type="file"
    accept="image/*"
    className="w-full bg-slate-100 border-none rounded-xl px-4 py-3 mt-1 text-sm file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-black file:bg-orange-600 file:text-white hover:file:bg-orange-700"
    onChange={async (e) => {
      const file = e.target.files[0];
      const base64 = await convertToBase64(file);
      setNewCoach({...newCoach, image: base64});
    }}
  />

</div>


      <div className="flex gap-3 mt-8">
        <button type="button" onClick={() => setShowCoachModal(false)} className="flex-1 py-3 font-bold bg-slate-100 rounded-xl">Cancel</button>
        <button type="submit" className="flex-1 py-3 font-bold bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition">Save Coach</button>
      </div>
    </form>
  </div>
)}

  </div>
);
};


export default AdminDashboard;