import React, { useEffect, useState, useCallback } from 'react';
import { 
  LayoutDashboard, Users, Dumbbell, CalendarDays, 
  CreditCard, Package, LogOut, Menu, X 
} from 'lucide-react';

// Modals
import CoachModal from './components/CoachModal';
import MemberDetailSidebar from './components/MembersModal';
import PlanModal from './components/PlanModal';
import ProductModal from './components/ProductModal';
import ExerciseModal from './components/ExercisesModal';
import ExerciseViewModal from './components/ExerciseViewModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';

// Tabs
import OverviewTab from './components/tabs/admin-tabs/OverviewTab';
import PlansTab from './components/tabs/admin-tabs/PlansTab';
import CoachesTab from './components/tabs/admin-tabs/CoachesTab';
import MembersTab from './components/tabs/admin-tabs/MembersTab';
import InventoryTab from './components/tabs/admin-tabs/InventoryTab';
import ExercisesTab from './components/tabs/admin-tabs/ExercisesTab';

const AdminDashboard = ({ onLogout }) => {
  // --- STATES ---
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleteType, setDeleteType] = useState('');
  
  const [products, setProducts] = useState([]);
  const [showProductModal, setShowProductModal] = useState(false);
  const [isEditingProduct, setIsEditingProduct] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', category: 'Supplement', stock: '', image: '' });

  const [activeTab, setActiveTab] = useState(() => localStorage.getItem('adminTab') || 'dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [coaches, setCoaches] = useState([]);
  const [showCoachModal, setShowCoachModal] = useState(false);
  const [isEditingCoach, setIsEditingCoach] = useState(false);
  const [currentCoachId, setCurrentCoachId] = useState(null);
  const [newCoach, setNewCoach] = useState({ name: '', specialty: '', image: '', availableDates: [] });

  const [plans, setPlans] = useState([]);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [isEditingPlan, setIsEditingPlan] = useState(false);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [newPlan, setNewPlan] = useState({ name: '', price: '', duration: '1', durationUnit: 'month' });

  const [exercises, setExercises] = useState([]);
  const [showExerciseModal, setShowExerciseModal] = useState(false);
  const [newExercise, setNewExercise] = useState({ name: '', muscleGroup: 'Chest', equipment: '', difficulty: 'Beginner', instructions: '', image: '' });
  const [viewingExercise, setViewingExercise] = useState(null);
  const [selectedFolder, setSelectedFolder] = useState(null);

  // --- FETCH LOGIC ---
  const fetchData = useCallback(async () => {
    const endpoints = ['users', 'coaches', 'plans', 'products', 'exercises'];
    try {
      const results = await Promise.all(
        endpoints.map(ep => fetch(`http://127.0.0.1:5000/api/${ep}`).then(res => res.json()))
      );
      setUsers(results[0]);
      setCoaches(results[1]);
      setPlans(results[2]);
      setProducts(results[3]);
      setExercises(results[4]);
    } catch (err) {
      console.error("Data Fetch Error:", err);
    }
  }, []);

  useEffect(() => {
    fetchData();
    localStorage.setItem('adminTab', activeTab);
  }, [activeTab, fetchData]);

  // --- HANDLERS ---
  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'pending' ? 'active' : 'pending';
    try {
      const res = await fetch(`http://127.0.0.1:5000/api/users/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setUsers(prev => prev.map(u => u._id === id ? { ...u, status: newStatus } : u));
        if (selectedUser?._id === id) setSelectedUser(prev => ({ ...prev, status: newStatus }));
      }
    } catch (err) { console.error(err); }
  };

  const handleUniversalDelete = async () => {
    if (!itemToDelete) return;
    const routeMap = { member: 'users', coach: 'coaches', plan: 'plans', product: 'products', exercise: 'exercises' };
    try {
      const res = await fetch(`http://127.0.0.1:5000/api/${routeMap[deleteType]}/${itemToDelete._id}`, { method: 'DELETE' });
      if (res.ok) {
        await fetchData();
        setIsDeleteModalOpen(false);
        setItemToDelete(null);
      }
    } catch (err) { console.error(err); }
  };

  const openEditPlan = (plan) => { setCurrentPlan(plan); setIsEditingPlan(true); setShowPlanModal(true); };
  const openEditProduct = (product) => { setCurrentProduct(product); setIsEditingProduct(true); setShowProductModal(true); };
  const openEditCoach = (coach) => { setIsEditingCoach(true); setCurrentCoachId(coach._id); setNewCoach({...coach}); setShowCoachModal(true); };

  const handleTabChange = (id) => { setActiveTab(id); setIsSidebarOpen(false); };

  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'members', label: 'Members', icon: Users },
    { id: 'coaches', label: 'Coaches', icon: CalendarDays },
    { id: 'plans', label: 'Plans', icon: CreditCard },
    { id: 'inventory', label: 'Inventory', icon: Package },
    { id: 'exercises', label: 'Exercise Vault', icon: Dumbbell },
  ];

  const recentMembers = [...users].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);

  // --- CONSTANTS ---
const muscleGroups = ['Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core']; // 👈 Add this line



  return (
    <div className="flex min-h-screen bg-[#020617] text-slate-200 font-sans">
      
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-slate-900/80 backdrop-blur-lg border-b border-slate-800 z-50 flex items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <Dumbbell size={20} className="text-orange-500" />
          <h1 className="text-sm font-black tracking-tighter uppercase italic text-white">LL <span className="text-orange-500">GYM</span></h1>
        </div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 bg-slate-800 rounded-lg text-orange-500">
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`w-72 bg-slate-900 lg:bg-slate-900/50 backdrop-blur-xl border-r border-slate-800/60 flex flex-col fixed h-full z-[100] transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="lg:hidden flex justify-end p-4 absolute right-0 top-0">
          <button onClick={() => setIsSidebarOpen(false)} className="p-3 bg-slate-800 rounded-2xl text-orange-500 shadow-xl border border-slate-700 active:scale-95 transition-all">
            <X size={24} strokeWidth={3} />
          </button>
        </div>
        <div className="p-8">
          <div className="hidden lg:flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-600/20">
              <Dumbbell size={24} className="text-white" />
            </div>
            <h1 className="text-xl font-black tracking-tighter italic text-white uppercase">LongLong <span className="text-orange-500">Gym</span></h1>
          </div>
          <nav className="space-y-1.5 mt-16 lg:mt-0">
            {navItems.map((item) => (
              <button key={item.id} onClick={() => handleTabChange(item.id)} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold text-sm transition-all duration-200 ${activeTab === item.id ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/20' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-100'}`}>
                <item.icon size={20} /> {item.label}
              </button>
            ))}
          </nav>
        </div>
        <div className="mt-auto p-8">
          <button onClick={onLogout} className="w-full flex items-center justify-center gap-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white px-4 py-4 rounded-2xl font-black text-xs uppercase tracking-widest border border-red-500/20 transition-all">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-12 lg:ml-72 mt-16 lg:mt-0 overflow-x-hidden transition-all duration-500">
        <div className="max-w-7xl mx-auto">
          {activeTab === 'dashboard' && <OverviewTab users={users} coaches={coaches} recentMembers={recentMembers} onNavigate={setActiveTab} />}
          
          {activeTab === 'members' && (
            <div className="flex flex-col xl:flex-row gap-8 relative">
              <div className="flex-1 min-w-0"> 
                <MembersTab users={users} searchTerm={searchTerm} onSearch={setSearchTerm} onSelect={setSelectedUser} onStatusToggle={toggleStatus} onDeleteClick={(u) => { setItemToDelete(u); setDeleteType('member'); setIsDeleteModalOpen(true); }} />
              </div>
              {selectedUser && (
                <>
                  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 xl:hidden" onClick={() => setSelectedUser(null)} />
                  <div className={`fixed inset-y-0 right-0 w-[85%] sm:w-96 bg-[#0B1120] border-l border-slate-800 p-6 z-50 transition-transform duration-300 xl:static xl:w-96 xl:z-auto xl:translate-x-0 ${selectedUser ? 'translate-x-0' : 'translate-x-full'}`}>
                     <MemberDetailSidebar selectedUser={selectedUser} onClose={() => setSelectedUser(null)} onVerify={toggleStatus} />
                  </div>
                </>
              )}
            </div>
          )}

          {activeTab === 'plans' && <PlansTab plans={plans} onAddClick={() => { setIsEditingPlan(false); setShowPlanModal(true); }} onEditClick={openEditPlan} onDeleteClick={(p) => { setItemToDelete(p); setDeleteType('plan'); setIsDeleteModalOpen(true); }} />}
          {activeTab === 'coaches' && <CoachesTab coaches={coaches} onAddClick={() => { setIsEditingCoach(false); setShowCoachModal(true); }} onEditClick={openEditCoach} onDeleteClick={(c) => { setItemToDelete(c); setDeleteType('coach'); setIsDeleteModalOpen(true); }} />}
          {activeTab === 'inventory' && <InventoryTab products={products} onAddClick={() => { setIsEditingProduct(false); setShowProductModal(true); }} onEditClick={openEditProduct} onDeleteClick={(p) => { setItemToDelete(p); setDeleteType('product'); setIsDeleteModalOpen(true); }} />}
          {activeTab === 'exercises' && <ExercisesTab exercises={exercises} onAddClick={() => setShowExerciseModal(true)} onViewClick={setViewingExercise} onDeleteClick={(e) => { setItemToDelete(e); setDeleteType('exercise'); setIsDeleteModalOpen(true); }} selectedFolder={selectedFolder} setSelectedFolder={setSelectedFolder} muscleGroups={muscleGroups} />}
        </div>
      </main>

      {/* --- MODALS --- */}
      <DeleteConfirmModal show={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={handleUniversalDelete} title={`Remove ${deleteType}?`} itemName={itemToDelete?.name} />
      
      <CoachModal show={showCoachModal} onClose={() => setShowCoachModal(false)} isEditing={isEditingCoach} newCoach={newCoach} setNewCoach={setNewCoach} onSubmit={fetchData} />
      
      <PlanModal show={showPlanModal} onClose={() => setShowPlanModal(false)} isEditing={isEditingPlan} currentPlan={currentPlan} newPlan={newPlan} setNewPlan={setNewPlan} onSubmit={fetchData} />
      
      <ProductModal show={showProductModal} onClose={() => setShowProductModal(false)} isEditing={isEditingProduct} currentProduct={currentProduct} newProduct={newProduct} setNewProduct={setNewProduct} onSubmit={fetchData} />
      
      <ExerciseModal show={showExerciseModal} onClose={() => setShowExerciseModal(false)} newExercise={newExercise} setNewExercise={setNewExercise} onSubmit={fetchData} />
      
      <ExerciseViewModal exercise={viewingExercise} onClose={() => setViewingExercise(null)} />
    </div>
  );
};

export default AdminDashboard;