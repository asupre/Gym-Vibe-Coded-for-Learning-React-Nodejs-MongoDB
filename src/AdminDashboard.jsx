import React, { useEffect, useState } from 'react';
import CoachModal from './components/CoachModal';
import MemberDetailSidebar from './components/MembersModal';
import PlanModal from './components/PlanModal';
import ProductModal from './components/ProductModal';
import ExerciseModal from './components/ExercisesModal';
import ExerciseViewModal from './components/ExerciseViewModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';

const AdminDashboard = ({ onLogout }) => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPlan, setFilterPlan] = useState('All');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);



const [itemToDelete, setItemToDelete] = useState(null); // Stores the object (Coach, Plan, etc.)
const [deleteType, setDeleteType] = useState(''); // 'member', 'coach', 'plan', 'product', 'exercise'

  
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
  const [isEditingCoach, setIsEditingCoach] = useState(false);
const [currentCoachId, setCurrentCoachId] = useState(null);
const [newCoach, setNewCoach] = useState({ 
  name: '', 
  specialty: '', 
  image: '', 
  availableDates: [] // Use this name now
});



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
      setCoaches([...coaches, data.coach || data]);
      setShowCoachModal(false);
      setNewCoach({ name: '', specialty: '', image: '', availableDates: [] });
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
    
      try {
        const res = await fetch(`http://127.0.0.1:5000/api/users/${id}`, { method: 'DELETE' });
        if (res.ok) setUsers(users.filter(u => u._id !== id));
      } catch (err) { console.error("Delete error:", err); }
    
  };

  const toggleDate = (dateString) => {
  // Ensure we have an array to work with
  let currentDates = [...(newCoach.availableDates || [])];
  
  // Check if this date is already selected
  const existingIndex = currentDates.findIndex(d => d.date === dateString);

  if (existingIndex > -1) {
    // If it exists, remove it (Deselect)
    currentDates.splice(existingIndex, 1);
  } else {
    // If it doesn't exist, add it with a default time
    currentDates.push({ date: dateString, hours: '08:00 AM - 05:00 PM' });
  }

  setNewCoach({ ...newCoach, availableDates: currentDates });
};

// Helper to update the hours of a specific date already in the list
const updateDateHours = (dateString, newHours) => {
  const updated = newCoach.availableDates.map(d => 
    d.date === dateString ? { ...d, hours: newHours } : d
  );
  setNewCoach({ ...newCoach, availableDates: updated });
};


// --- OPEN MODAL FOR EDITING ---
const openEditModal = (coach) => {
  setIsEditingCoach(true);
  setCurrentCoachId(coach._id);
  
  // Important: We load 'availableDates' into the state
  setNewCoach({
    name: coach.name,
    specialty: coach.specialty,
    image: coach.image,
    availableDates: coach.availableDates || [] 
  });
  
  setShowCoachModal(true);
};

// --- UPDATE COACH FUNCTION ---
const handleUpdateCoach = async (e) => {
  e.preventDefault();
  try {
    const res = await fetch(`http://127.0.0.1:5000/api/coaches/${currentCoachId}`, {
      method: 'PUT', // We use PUT to update
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCoach)
    });
    
    if (res.ok) {
      const updatedData = await res.json();
      // Update the coaches list on screen immediately
      setCoaches(coaches.map(c => c._id === currentCoachId ? updatedData : c));
      setShowCoachModal(false);
      setIsEditingCoach(false);
      alert("Coach schedule updated!");
    }
  } catch (err) {
    console.error("Update Error:", err);
  }
};

const handleUniversalDelete = async () => {
  if (!itemToDelete) return;

  const routes = {
    member: `http://127.0.0.1:5000/api/users/${itemToDelete._id}`,
    coach: `http://127.0.0.1:5000/api/coaches/${itemToDelete._id}`,
    plan: `http://127.0.0.1:5000/api/plans/${itemToDelete._id}`,
    product: `http://127.0.0.1:5000/api/products/${itemToDelete._id}`,
    exercise: `http://127.0.0.1:5000/api/exercises/${itemToDelete._id}`
  };

  try {
    const res = await fetch(routes[deleteType], { method: 'DELETE' });
    if (res.ok) {
      // Update the correct list in your state
      if (deleteType === 'member') setUsers(users.filter(u => u._id !== itemToDelete._id));
      if (deleteType === 'coach') setCoaches(coaches.filter(c => c._id !== itemToDelete._id));
      if (deleteType === 'plan') setPlans(plans.filter(p => p._id !== itemToDelete._id));
      if (deleteType === 'product') setProducts(products.filter(p => p._id !== itemToDelete._id));
      if (deleteType === 'exercise') setExercises(exercises.filter(e => e._id !== itemToDelete._id));
      
      setIsDeleteModalOpen(false);
    }
  } catch (err) {
    console.error("Delete failed:", err);
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
            <button onClick={() => { setItemToDelete(plan); setDeleteType('plan'); setIsDeleteModalOpen(true); }} className="w-full py-3 bg-red-600/10 text-red-500 rounded-xl font-black text-xs uppercase hover:bg-red-600 hover:text-white transition">🗑️</button>
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
       <button 
  onClick={() => {
    setIsEditingCoach(false); // Make sure we are NOT in edit mode
    setNewCoach({ name: '', specialty: '', image: '', availability: [] }); // Reset form
    setShowCoachModal(true);
  }} 
  className="bg-orange-600 px-6 py-3 rounded-xl font-black text-white uppercase text-xs"
>
  + Add New Coach
</button>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {coaches.map(coach => (
  <div key={coach._id} className="bg-slate-900 border border-slate-800 p-6 rounded-[32px] relative group hover:border-orange-500/50 transition-all">
    
    {/* Coach Image */}
    <div className="w-16 h-16 bg-slate-800 rounded-2xl mb-4 overflow-hidden border border-slate-700">
      <img src={coach.image || 'https://via.placeholder.com/150'} alt={coach.name} className="w-full h-full object-cover" />
    </div>

    {/* Coach Info */}
    <h3 className="text-xl font-black text-white mb-1 uppercase italic tracking-tighter">{coach.name}</h3>
    <p className="text-orange-500 font-black text-[10px] uppercase tracking-[3px] mb-4">{coach.specialty}</p>
    
    {/* --- NEW: DISPLAYING THE CALENDAR DATES & HOURS --- */}
    <div className="space-y-2 mb-6 bg-black/20 p-3 rounded-xl border border-slate-800/50">
      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Duty Schedule</p>
      {coach.availableDates && coach.availableDates.length > 0 ? (
        coach.availableDates.slice(0, 3).map((slot, i) => (
          <div key={i} className="flex justify-between items-center text-[10px] font-bold">
            <span className="text-slate-300">
              {new Date(slot.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
            <span className="text-orange-500 italic">{slot.hours}</span>
          </div>
        ))
      ) : (
        <p className="text-[10px] text-slate-600 italic">No dates set yet.</p>
      )}
      {coach.availableDates?.length > 3 && (
        <p className="text-[9px] text-slate-500 text-center pt-1">+ {coach.availableDates.length - 3} more days</p>
      )}
    </div>

    {/* Actions */}
    <div className="flex gap-2">
      <button 
        onClick={() => openEditModal(coach)}
        className="flex-1 py-3 bg-white text-black text-[10px] font-black uppercase rounded-xl hover:bg-orange-600 hover:text-white transition shadow-xl"
      >
        Edit Schedule
      </button>
      <button onClick={() => { setItemToDelete(coach); setDeleteType('coach'); setIsDeleteModalOpen(true); }}>🗑️</button>
    </div>
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
  onClick={(e) => {
    e.stopPropagation(); // Prevents opening the Verification Sidebar
    setItemToDelete(u);   // Set the member as the item to delete
    setDeleteType('member');
    setIsDeleteModalOpen(true);
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
              <button onClick={() => { setItemToDelete(product); setDeleteType('product'); setIsDeleteModalOpen(true); }}>🗑️</button>
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
    {/* Inside the exercise .map loop */}
<button 
  onClick={(e) => {
    e.stopPropagation(); // Prevents opening the "View Focus" modal
    setItemToDelete(ex);
    setDeleteType('exercise');
    setIsDeleteModalOpen(true);
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
      
     <MemberDetailSidebar 
  selectedUser={selectedUser}
  onClose={() => setSelectedUser(null)}
  onVerify={(id, status) => {
    toggleStatus(id, status);
    setSelectedUser(null);
  }}
/>

      <DeleteConfirmModal 
  show={isDeleteModalOpen}
  onClose={() => setIsDeleteModalOpen(false)}
  onConfirm={handleUniversalDelete}
  title={`Remove ${deleteType}?`}
  itemName={itemToDelete?.name} // This works for all because all your objects have a 'name'
/>

      
      <CoachModal 
  show={showCoachModal}
  onClose={() => setShowCoachModal(false)}
  isEditing={isEditingCoach}
  newCoach={newCoach}
  setNewCoach={setNewCoach}
  onSubmit={isEditingCoach ? handleUpdateCoach : handleAddCoach}
  toggleDate={toggleDate}
  updateDateHours={updateDateHours}
  convertToBase64={convertToBase64}
/>
      <PlanModal 
  show={showPlanModal}
  onClose={() => setShowPlanModal(false)}
  onSubmit={handleAddPlan}
  newPlan={newPlan}
  setNewPlan={setNewPlan}
/>

      <ProductModal 
  show={showProductModal}
  onClose={() => setShowProductModal(false)}
  onSubmit={handleAddProduct}
  newProduct={newProduct}
  setNewProduct={setNewProduct}
  convertToBase64={convertToBase64}
/>

      {/* Add Exercise Modal */}
<ExerciseModal 
  show={showExerciseModal}
  onClose={() => setShowExerciseModal(false)}
  onSubmit={handleAddExercise}
  newExercise={newExercise}
  setNewExercise={setNewExercise}
  convertToBase64={convertToBase64}
/>

{/* View Focus Modal */}
<ExerciseViewModal 
  exercise={viewingExercise}
  onClose={() => setViewingExercise(null)}
/>
    </div>
  );
};




export default AdminDashboard;