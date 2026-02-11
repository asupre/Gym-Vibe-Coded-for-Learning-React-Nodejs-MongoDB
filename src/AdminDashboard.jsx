import React, { useEffect, useState } from 'react';

const AdminDashboard = ({ onLogout }) => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPlan, setFilterPlan] = useState('All');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);


  
// Product States
const [products, setProducts] = useState([]);
const [showProductModal, setShowProductModal] = useState(false);
const [newProduct, setNewProduct] = useState({ name: '', price: '', category: 'Supplement', stock: '', image: '' });
  
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

  const [exercises, setExercises] = useState([]);
const [showExerciseModal, setShowExerciseModal] = useState(false);
const [newExercise, setNewExercise] = useState({ name: '', muscleGroup: 'Chest', equipment: '', difficulty: 'Beginner', instructions: '', image: '' });
const [selectedFolder, setSelectedFolder] = useState(null); // null means show all folders
const muscleGroups = ['Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core'];
const [viewingExercise, setViewingExercise] = useState(null);

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

      fetch('http://127.0.0.1:5000/api/products').then(res => res.json()).then(setProducts).catch(() => {});

      fetch('http://127.0.0.1:5000/api/exercises').then(res => res.json()).then(setExercises);
      
    localStorage.setItem('adminTab', activeTab);
  }, [activeTab]);


// --- PRODUCT FUNCTIONS ---
const handleAddProduct = async (e) => {
  e.preventDefault();
  const res = await fetch('http://127.0.0.1:5000/api/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newProduct)
  });
  if (res.ok) {
    const data = await res.json();
    setProducts([...products, data]);
    setShowProductModal(false);
    setNewProduct({ name: '', price: '', category: 'Supplement', stock: '', image: '' });
  }
};

const handleDeleteProduct = async (id) => {
  if (window.confirm("Remove this product from inventory?")) {
    const res = await fetch(`http://127.0.0.1:5000/api/products/${id}`, { method: 'DELETE' });
    if (res.ok) setProducts(products.filter(p => p._id !== id));
  }
};

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

  // --- EXERCISE FUNCTIONS ---
// --- EXERCISE SAVE FUNCTION ---
const handleAddExercise = async (e) => {
  e.preventDefault(); // Prevents the page from refreshing
  try {
    const res = await fetch('http://127.0.0.1:5000/api/exercises', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newExercise)
    });

    if (res.ok) {
      const data = await res.json();
      // 1. Add the new exercise to the list on your screen
      setExercises([...exercises, data]); 
      // 2. Close the modal window
      setShowExerciseModal(false); 
      // 3. Reset the form so it's empty for next time
      setNewExercise({ 
        name: '', 
        muscleGroup: 'Chest', 
        equipment: '', 
        difficulty: 'Beginner', 
        instructions: '', 
        image: '' 
      });
      alert("Exercise added to the Vault successfully!");
    } else {
      const errorData = await res.json();
      alert("Error: " + errorData.message);
    }
  } catch (err) {
    console.error("Save Error:", err);
    alert("Could not connect to the server.");
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
          <button onClick={() => { setActiveTab('dashboard'); localStorage.setItem('adminTab', 'dashboard'); }} className={`w-full text-left px-4 py-3 rounded-xl font-bold transition ${activeTab === 'dashboard' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}> Dashboard</button>
          <button onClick={() => setActiveTab('members')} className={`w-full text-left px-4 py-3 rounded-xl font-bold transition ${activeTab === 'members' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}> Members List</button>
          <button onClick={() => setActiveTab('coaches')} className={`w-full text-left px-4 py-3 rounded-xl font-bold transition ${activeTab === 'coaches' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}> Coaches</button>
          <button onClick={() => setActiveTab('plans')} className={`w-full text-left px-4 py-3 rounded-xl font-bold transition ${activeTab === 'plans' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}> Plans</button>
          <button onClick={() => setActiveTab('inventory')} className={`w-full text-left px-4 py-3 rounded-xl font-bold transition ${activeTab === 'inventory' ? 'bg-orange-600' : 'text-slate-400 hover:bg-slate-800'}`}>
            
   Inventory
</button>
<button onClick={() => setActiveTab('exercises')} className={`w-full text-left px-4 py-3 rounded-xl font-bold transition ${activeTab === 'exercises' ? 'bg-orange-600' : 'text-slate-400 hover:bg-slate-800'}`}>
   Exercises
</button>
        </nav>
        <button onClick={onLogout} className="bg-red-600/10 text-red-500 hover:bg-red-600 hover:text-white px-4 py-3 rounded-xl font-bold transition">Logout</button>
      </div>

      <main className={`flex-1 ml-64 p-10 transition-all duration-300 ${selectedUser ? 'mr-80' : ''}`}>

  {/* 1. DASHBOARD TAB */}
  {activeTab === 'dashboard' && (
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
                    {member.profileImage ? <img src={member.profileImage} className="w-full h-full object-cover" alt="Profile" /> : <span className="font-black text-orange-500 text-[10px] italic">{member.name.charAt(0)}</span>}
                  </div>
                  <p className="font-bold text-sm text-slate-200">{member.name}</p>
                </div>
                <p className="text-[10px] text-slate-500 italic">{new Date(member.createdAt).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-slate-900 p-8 rounded-[40px] border border-slate-800">
          <h3 className="text-xl font-bold mb-6 text-white">System Health</h3>
          <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-2xl flex items-center gap-4 mb-4">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <p className="text-green-500 text-sm font-bold uppercase tracking-tight">Database Connected: Stable</p>
          </div>
        </div>
      </div>
    </div>
  )}

  {/* 2. PLANS TAB */}
  {activeTab === 'plans' && (
    <div className="animate-in fade-in duration-500">
      <header className="mb-8 flex justify-between items-center">
        <div><h2 className="text-3xl font-black uppercase tracking-tight text-white">Membership Plans</h2><p className="text-slate-500 font-medium">Manage pricing.</p></div>
        <button onClick={() => setShowPlanModal(true)} className="bg-orange-600 px-6 py-3 rounded-xl font-black text-white uppercase text-xs">+ Add New Plan</button>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map(plan => (
          <div key={plan._id} className="bg-slate-900 border border-slate-800 p-8 rounded-[32px] hover:border-orange-500 transition">
            <h3 className="text-2xl font-black text-white mb-2">{plan.name}</h3>
            <p className="text-4xl font-black text-orange-500 mb-2">₱{plan.price}</p>
            <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-8">Valid {plan.duration} {plan.durationUnit}(s)</p>
            <button onClick={() => handleDeletePlan(plan._id)} className="w-full py-3 bg-red-600/10 text-red-500 rounded-xl font-black text-xs uppercase hover:bg-red-600 hover:text-white transition">Delete Plan</button>
          </div>
        ))}
      </div>
    </div>
  )}

  {/* 3. COACHES TAB */}
  {activeTab === 'coaches' && (
    <div className="animate-in fade-in duration-500">
      <header className="mb-8 flex justify-between items-center">
        <div><h2 className="text-3xl font-black uppercase tracking-tight text-white">Gym Coaches</h2><p className="text-slate-500 font-medium">Manage trainers.</p></div>
        <button onClick={() => setShowCoachModal(true)} className="bg-orange-600 px-6 py-3 rounded-xl font-black text-white uppercase text-xs">+ Add New Coach</button>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {coaches.map(coach => (
          <div key={coach._id} className="bg-slate-900 border border-slate-800 p-6 rounded-3xl relative overflow-hidden group">
            <div className="w-16 h-16 bg-slate-800 rounded-2xl mb-4 overflow-hidden border border-slate-700"><img src={coach.image || 'https://via.placeholder.com/150'} alt={coach.name} className="w-full h-full object-cover" /></div>
            <h3 className="text-xl font-bold mb-1 text-white">{coach.name}</h3>
            <p className="text-orange-500 font-bold text-sm mb-4 uppercase tracking-wider">{coach.specialty}</p>
            <button onClick={() => handleDeleteCoach(coach._id)} className="mt-6 w-full py-2 bg-red-600/10 text-red-500 text-[10px] font-black uppercase rounded-lg hover:bg-red-600 hover:text-white transition">Remove Coach</button>
          </div>
        ))}
      </div>
    </div>
  )}

  {/* 4. MEMBERS TAB */}
  {activeTab === 'members' && (
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
              <tr key={u._id} onClick={() => setSelectedUser(u)} className="hover:bg-slate-800/30 transition cursor-pointer">
                <td className="p-5"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full overflow-hidden border border-slate-600 bg-slate-800 flex items-center justify-center">{u.profileImage ? <img src={u.profileImage} className="w-full h-full object-cover" /> : <span className="font-bold text-[10px]">{u.name.charAt(0)}</span>}</div><span className="font-bold text-slate-200">{u.name}</span></div></td>
                <td className="p-5 text-slate-400">{u.plan}</td>
                <td className="p-5 text-center"><span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase ${u.status === 'active' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>{u.status}</span></td>
                <td className="p-5 text-right space-x-2" onClick={(e) => e.stopPropagation()}>
                  <button 
    onClick={() => {
      
        handleDelete(u._id, u.name);
      
    }} 
    className="text-[10px] bg-red-600/10 text-red-500 border border-red-600/20 px-4 py-2 rounded-lg font-black hover:bg-red-600 hover:text-white transition uppercase"
  >
    Delete
  </button>
                  <button onClick={() => toggleStatus(u._id, u.status)} className="text-[10px] bg-white text-black px-4 py-2 rounded-lg font-black uppercase tracking-widest">{u.status === 'pending' ? 'Approve' : 'Suspend'}</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )}

  {/* 5. INVENTORY TAB */}
  {activeTab === 'inventory' && (
    <div className="animate-in fade-in duration-500">
      <header className="mb-8 flex justify-between items-center text-white">
        <div>
          <h2 className="text-3xl font-black uppercase tracking-tight">Gym Shop</h2>
          <p className="text-slate-500 font-medium tracking-tight uppercase text-[10px]">Manage supplements and merchandise.</p>
        </div>
        <button onClick={() => setShowProductModal(true)} className="bg-orange-600 px-6 py-3 rounded-xl font-black hover:bg-orange-500 shadow-lg text-white uppercase text-xs">
          + Add Product
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {products.map(product => (
          <div key={product._id} className="bg-slate-900 border border-slate-800 p-4 rounded-[32px] group hover:border-orange-500 transition relative">
            <div className="w-full h-40 bg-slate-800 rounded-2xl mb-4 overflow-hidden">
              {product.image ? (
                <img src={product.image} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" alt={product.name} />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-600 italic text-xs uppercase">No Image</div>
              )}
            </div>
            <h3 className="font-bold text-white uppercase tracking-tight">{product.name}</h3>
            <div className="flex justify-between items-end mt-4">
              <div>
                <p className="text-orange-500 font-black text-lg">₱{product.price}</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Stock: {product.stock}</p>
              </div>
              <button onClick={() => handleDeleteProduct(product._id)} className="bg-red-600/10 text-red-500 p-2 rounded-lg hover:bg-red-600 hover:text-white transition">🗑️</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )}

  {activeTab === 'exercises' && (
  <div className="animate-in fade-in duration-500">
    <header className="mb-8 flex justify-between items-center text-white">
      <div>
        <h2 className="text-3xl font-black uppercase tracking-tight">
          {selectedFolder ? `${selectedFolder} Folder` : "Exercise Vault"}
        </h2>
        <p className="text-slate-500 font-medium text-[10px] uppercase">
          {selectedFolder ? `Managing ${selectedFolder} movements` : "Select a muscle group to manage"}
        </p>
      </div>
      <div className="flex gap-4">
        {selectedFolder && (
          <button onClick={() => setSelectedFolder(null)} className="px-6 py-3 rounded-xl font-black bg-slate-800 text-white uppercase text-xs">
            ← Back to Folders
          </button>
        )}
        <button onClick={() => setShowExerciseModal(true)} className="bg-orange-600 px-6 py-3 rounded-xl font-black hover:bg-orange-500 shadow-lg text-white uppercase text-xs">
          + Add Exercise
        </button>
      </div>
    </header>

    {/* --- FOLDER VIEW (Show if no folder is selected) --- */}
    {!selectedFolder ? (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {muscleGroups.map((group) => (
          <div 
            key={group} 
            onClick={() => setSelectedFolder(group)}
            className="bg-slate-900 border border-slate-800 p-8 rounded-[40px] cursor-pointer group hover:border-orange-500 transition-all duration-500 relative overflow-hidden"
          >
            <div className="relative z-10">
              <span className="text-4xl mb-4 block">📁</span>
              <h3 className="text-2xl font-black text-white uppercase italic">{group}</h3>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-2">
                {exercises.filter(ex => ex.muscleGroup === group).length} Exercises
              </p>
            </div>
            {/* Background Glow Effect */}
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-orange-600/10 rounded-full blur-3xl group-hover:bg-orange-600/20 transition-all"></div>
          </div>
        ))}
      </div>
    ) : (
      /* --- EXERCISE LIST VIEW (Show inside the folder) --- */
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in slide-in-from-right-4 duration-500">
        {exercises
          .filter(ex => ex.muscleGroup === selectedFolder)
          .map(ex => (
            <div 
  key={ex._id} 
  className="bg-slate-900 border border-slate-800 p-6 rounded-[32px] hover:border-orange-500 transition group shadow-2xl flex flex-col"
>
  {/* TOP: CLICKABLE IMAGE AREA */}
  <div 
    onClick={() => setViewingExercise(ex)} 
    className="w-full h-48 bg-slate-800 rounded-2xl mb-4 overflow-hidden border border-slate-700 cursor-zoom-in relative"
  >
    {ex.image ? (
      <img src={ex.image} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" alt={ex.name} />
    ) : (
      <div className="w-full h-full flex items-center justify-center text-slate-600 font-black italic">NO GIF/IMAGE</div>
    )}
    {/* Hover Overlay */}
    <div className="absolute inset-0 bg-orange-600/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
      <span className="text-white font-black text-[10px] uppercase tracking-widest bg-slate-950/80 px-4 py-2 rounded-full">🔍 Tap to Zoom</span>
    </div>
  </div>

  {/* MIDDLE: INFO */}
  <div className="flex-1">
    <h3 className="text-xl font-black text-white mb-1 uppercase tracking-tight italic">{ex.name}</h3>
    <p className="text-orange-500 text-[10px] font-black uppercase tracking-[3px] mb-4">{ex.difficulty}</p>
  </div>
  
  {/* BOTTOM: ACTIONS (Row of buttons) */}
  <div className="flex gap-2 mt-auto">
    <button 
      onClick={() => setViewingExercise(ex)}
      className="flex-1 py-3 bg-white text-black rounded-xl font-black text-[10px] uppercase hover:bg-orange-600 hover:text-white transition shadow-xl"
    >
      View Focus
    </button>

    {/* Only keep this part in AdminDashboard.jsx */}
    <button 
      onClick={async (e) => {
        e.stopPropagation(); // Prevents opening the modal while deleting
        if(window.confirm(`Remove ${ex.name} from the vault?`)) {
          await fetch(`http://127.0.0.1:5000/api/exercises/${ex._id}`, { method: 'DELETE' });
          setExercises(exercises.filter(e => e._id !== ex._id));
        }
      }}
      className="px-4 py-3 bg-red-600/10 text-red-500 rounded-xl font-black text-[10px] uppercase hover:bg-red-600 hover:text-white transition"
    >
      🗑️
    </button>
  </div>
</div>
          ))}
      </div>
    )}
  </div>
)}

</main>

     {/* --- SIDE PANELS & MODALS (ALL INSIDE THE RETURN) --- */}
      
      {selectedUser && (
  <aside className="fixed right-0 top-0 w-80 h-full bg-slate-900 border-l border-slate-800 p-8 shadow-2xl animate-in slide-in-from-right duration-300 z-30 overflow-y-auto">
    <button onClick={() => setSelectedUser(null)} className="text-slate-500 hover:text-white mb-6 font-bold flex items-center gap-2">✕ Close</button>
    
    <p className="text-[10px] font-black uppercase text-orange-500 tracking-[3px] mb-6 text-center">Verification Vault</p>
    
    <div className="space-y-6">
      {/* 1. REPLACE TEXT INFO WITH THE TICKET IMAGE */}
      <div className="bg-black/40 border border-slate-800 rounded-2xl p-2 overflow-hidden">
        <p className="text-[10px] text-slate-500 uppercase font-black mb-2 px-2">Uploaded Payment Ticket</p>
        {selectedUser.paymentTicket ? (
          <img 
            src={selectedUser.paymentTicket} 
            className="w-full h-auto rounded-xl shadow-2xl border border-slate-700 hover:scale-105 transition cursor-zoom-in" 
            alt="Ticket" 
            onClick={() => window.open(selectedUser.paymentTicket)} 
          />
        ) : (
          <div className="h-48 flex flex-col items-center justify-center text-slate-600 border-2 border-dashed border-slate-800 rounded-xl">
             <span className="text-2xl mb-2">🚫</span>
             <p className="text-[10px] font-bold uppercase italic">No Ticket Uploaded</p>
          </div>
        )}
      </div>

      {/* 2. KEEP JOIN DATE */}
      <div className="bg-slate-800/50 p-4 rounded-xl">
        <p className="text-[10px] text-slate-500 uppercase font-black mb-1">Join Date</p>
        <p className="font-bold text-white text-sm">{new Date(selectedUser.createdAt).toLocaleDateString()}</p>
      </div>

      {/* 3. VERIFICATION ACTIONS */}
      {selectedUser.status === 'pending' && (
        <button 
          onClick={() => {
            toggleStatus(selectedUser._id, 'pending'); // This calls your existing toggleStatus to make them 'active'
            setSelectedUser(null);
          }}
          className="w-full bg-green-600 text-white font-black py-4 rounded-xl uppercase text-xs tracking-widest hover:bg-green-500 shadow-lg shadow-green-900/20"
        >
          Verify & Activate
        </button>
      )}
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
            <h2 className="text-2xl font-black tracking-tight mb-6 text-slate-900">Add New Gym Coach</h2>
            <div className="space-y-4">
              <input required className="w-full bg-slate-100 rounded-xl px-4 py-3 mt-1 outline-none text-slate-900" placeholder="Coach Name" value={newCoach.name} onChange={(e) => setNewCoach({...newCoach, name: e.target.value})} />
              <input required className="w-full bg-slate-100 rounded-xl px-4 py-3 mt-1 outline-none text-slate-900" placeholder="Specialty" value={newCoach.specialty} onChange={(e) => setNewCoach({...newCoach, specialty: e.target.value})} />
              <input className="w-full bg-slate-100 rounded-xl px-4 py-3 mt-1 outline-none text-slate-900" placeholder="Experience" value={newCoach.experience} onChange={(e) => setNewCoach({...newCoach, experience: e.target.value})} />
              <input type="file" accept="image/*" className="w-full mt-1 text-sm file:mr-4 file:py-1 file:px-4 file:rounded-full file:bg-orange-600 file:text-white" onChange={async (e) => { const file = e.target.files[0]; const base64 = await convertToBase64(file); setNewCoach({...newCoach, image: base64}); }} />
            </div>
            <div className="flex gap-3 mt-8"><button type="button" onClick={() => setShowCoachModal(false)} className="flex-1 py-3 font-bold bg-slate-100 rounded-xl">Cancel</button><button type="submit" className="flex-1 py-3 font-bold bg-orange-600 text-white rounded-xl hover:bg-orange-700">Save Coach</button></div>
          </form>
        </div>
      )}

      {showPlanModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4 text-slate-900">
          <form onSubmit={handleAddPlan} className="bg-white p-8 rounded-[40px] max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <h2 className="text-2xl font-black tracking-tight mb-6 uppercase italic text-slate-900">Create Membership Plan</h2>
            <div className="space-y-4">
              <input required className="w-full bg-slate-100 rounded-xl px-4 py-3 mt-1 outline-none font-bold text-slate-900" placeholder="e.g. Bronze Access" value={newPlan.name} onChange={(e) => setNewPlan({...newPlan, name: e.target.value})} />
              <input required type="number" className="w-full bg-slate-100 rounded-xl px-4 py-3 mt-1 outline-none font-bold text-orange-600" placeholder="0.00" value={newPlan.price} onChange={(e) => setNewPlan({...newPlan, price: e.target.value})} />
              <div className="flex gap-4">
                 <input required type="number" className="w-full bg-slate-100 rounded-xl px-4 py-3 mt-1 outline-none text-slate-900" value={newPlan.duration} onChange={(e) => setNewPlan({...newPlan, duration: e.target.value})} />
                 <select className="w-full bg-slate-100 rounded-xl px-4 py-3 mt-1 outline-none text-slate-900" value={newPlan.durationUnit} onChange={(e) => setNewPlan({...newPlan, durationUnit: e.target.value})}>
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

      {/* --- ADD PRODUCT MODAL --- */}
      {showProductModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4 text-slate-900">
          <form onSubmit={handleAddProduct} className="bg-white p-8 rounded-[40px] max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <h2 className="text-2xl font-black tracking-tight mb-6 uppercase italic text-slate-900">Add New Product</h2>
            <div className="space-y-4 text-slate-900">
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Product Name</label>
                <input required className="w-full bg-slate-100 rounded-xl px-4 py-3 mt-1 outline-none font-bold" placeholder="e.g. Whey Protein" value={newProduct.name} onChange={(e) => setNewProduct({...newProduct, name: e.target.value})} />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Price (PHP)</label>
                  <input required type="number" className="w-full bg-slate-100 rounded-xl px-4 py-3 mt-1 outline-none font-bold text-orange-600" placeholder="0" value={newProduct.price} onChange={(e) => setNewProduct({...newProduct, price: e.target.value})} />
                </div>
                <div className="flex-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Stock</label>
                  <input required type="number" className="w-full bg-slate-100 rounded-xl px-4 py-3 mt-1 outline-none" placeholder="0" value={newProduct.stock} onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Category</label>
                <select className="w-full bg-slate-100 rounded-xl px-4 py-3 mt-1 outline-none font-bold" value={newProduct.category} onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}>
                  <option value="Supplement">Supplement</option>
                  <option value="Gear">Gym Gear</option>
                  <option value="Drinks">Drinks</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Product Image</label>
                <input type="file" accept="image/*" className="w-full mt-1 text-xs file:bg-orange-600 file:border-none file:px-4 file:py-2 file:rounded-lg file:text-white file:font-black" 
                  onChange={async (e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const base64 = await convertToBase64(file);
                      setNewProduct({...newProduct, image: base64});
                    }
                  }} 
                />
              </div>
            </div>
            <div className="flex gap-3 mt-8">
              <button type="button" onClick={() => setShowProductModal(false)} className="flex-1 py-3 font-bold bg-slate-100 rounded-xl">Cancel</button>
              <button type="submit" className="flex-1 py-3 font-bold bg-orange-600 text-white rounded-xl hover:bg-orange-700">Save Product</button>
            </div>
          </form>
        </div>
      )}

      {/* --- ADD EXERCISE MODAL --- */}
      {showExerciseModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4 text-slate-900">
          <form onSubmit={handleAddExercise} className="bg-white p-8 rounded-[40px] max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200 overflow-y-auto max-h-[90vh]">
            <h2 className="text-2xl font-black tracking-tight mb-6 uppercase italic text-slate-900">New Vault Exercise</h2>
            
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Exercise Name</label>
                <input 
                  required 
                  className="w-full bg-slate-100 rounded-xl px-4 py-3 mt-1 outline-none font-bold text-slate-900" 
                  placeholder="e.g. Bench Press" 
                  value={newExercise.name} 
                  onChange={(e) => setNewExercise({...newExercise, name: e.target.value})} 
                />
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Muscle Group</label>
                  <select 
                    className="w-full bg-slate-100 rounded-xl px-4 py-3 mt-1 outline-none font-bold text-slate-900"
                    value={newExercise.muscleGroup}
                    onChange={(e) => setNewExercise({...newExercise, muscleGroup: e.target.value})}
                  >
                    <option value="Chest">Chest</option>
                    <option value="Back">Back</option>
                    <option value="Legs">Legs</option>
                    <option value="Shoulders">Shoulders</option>
                    <option value="Arms">Arms</option>
                    <option value="Core">Core/Abs</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Difficulty</label>
                  <select 
                    className="w-full bg-slate-100 rounded-xl px-4 py-3 mt-1 outline-none font-bold text-slate-900"
                    value={newExercise.difficulty}
                    onChange={(e) => setNewExercise({...newExercise, difficulty: e.target.value})}
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Instructions</label>
                <textarea 
                  className="w-full bg-slate-100 rounded-xl px-4 py-3 mt-1 outline-none text-slate-900 text-sm h-24 resize-none" 
                  placeholder="Step by step guide..." 
                  value={newExercise.instructions} 
                  onChange={(e) => setNewExercise({...newExercise, instructions: e.target.value})}
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Exercise GIF / Image</label>
                <input 
                  type="file" 
                  accept="image/*" 
                  className="w-full mt-1 text-xs file:bg-orange-600 file:border-none file:px-4 file:py-2 file:rounded-lg file:text-white file:font-black cursor-pointer"
                  onChange={async (e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const base64 = await convertToBase64(file);
                      setNewExercise({...newExercise, image: base64});
                    }
                  }} 
                />
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button type="button" onClick={() => setShowExerciseModal(false)} className="flex-1 py-3 font-bold bg-slate-100 rounded-xl">Cancel</button>
              <button type="submit" className="flex-1 py-3 font-bold bg-orange-600 text-white rounded-xl hover:bg-orange-700 shadow-lg">Save to Vault</button>
            </div>
          </form>
        </div>
      )}

      {/* --- EXERCISE VIEW MODAL (BIGGER VERSION) --- */}
{viewingExercise && (
  <div className="fixed inset-0 bg-black/95 backdrop-blur-xl z-[200] flex items-center justify-center p-4 md:p-10 animate-in fade-in zoom-in duration-300">
    
    {/* Close Button */}
    <button 
      onClick={() => setViewingExercise(null)} 
      className="absolute top-8 right-8 text-white/50 hover:text-orange-500 transition-all text-4xl z-[210]"
    >
      ✕
    </button>

    <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      
      {/* LEFT: BIG IMAGE/GIF */}
      <div className="rounded-[40px] overflow-hidden border-4 border-slate-800 shadow-[0_0_50px_rgba(234,88,12,0.2)] bg-slate-900">
        {viewingExercise.image ? (
          <img src={viewingExercise.image} className="w-full h-auto object-contain" alt={viewingExercise.name} />
        ) : (
          <div className="aspect-video flex items-center justify-center text-slate-700 font-black">NO MEDIA</div>
        )}
      </div>

      {/* RIGHT: DETAILS */}
      <div className="text-white">
        <div className="mb-8">
          <p className="text-orange-500 font-black text-xs uppercase tracking-[4px] mb-2">Technique Guide</p>
          <h2 className="text-6xl font-black uppercase italic tracking-tighter leading-none mb-4">
            {viewingExercise.name}
          </h2>
          <div className="flex gap-3">
             <span className="bg-slate-800 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-slate-700">{viewingExercise.muscleGroup}</span>
             <span className="bg-orange-600 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">{viewingExercise.difficulty}</span>
          </div>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-[40px]">
          <h4 className="text-sm font-black uppercase tracking-widest text-slate-500 mb-4">How to Perform:</h4>
          <p className="text-lg text-slate-300 leading-relaxed font-medium italic">
            {viewingExercise.instructions || "Contact your Personal Trainer for specific coaching cues and form correction for this movement."}
          </p>
        </div>

        <button 
          onClick={() => setViewingExercise(null)}
          className="mt-10 px-10 py-4 bg-white text-black font-black uppercase rounded-2xl hover:bg-orange-600 hover:text-white transition-all shadow-2xl"
        >
          Got it, let's work!
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
};




export default AdminDashboard;