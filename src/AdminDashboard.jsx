import React, { useEffect, useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Dumbbell, 
  CalendarDays, 
  CreditCard, 
  Package, 
  LogOut 
} from 'lucide-react'; // Professional Icons

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
  // --- STATES (KEEPING YOUR EXISTING LOGIC) ---
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPlan, setFilterPlan] = useState('All');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleteType, setDeleteType] = useState('');
  const [products, setProducts] = useState([]);
  const [showProductModal, setShowProductModal] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', category: 'Supplement', stock: '', image: '' });
  const [activeTab, setActiveTab] = useState(() => localStorage.getItem('adminTab') || 'dashboard');
  const [coaches, setCoaches] = useState([]);
  const [showCoachModal, setShowCoachModal] = useState(false);
  const [isEditingCoach, setIsEditingCoach] = useState(false);
  const [currentCoachId, setCurrentCoachId] = useState(null);
  const [newCoach, setNewCoach] = useState({ name: '', specialty: '', image: '', availableDates: [] });
  const [plans, setPlans] = useState([]);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [newPlan, setNewPlan] = useState({ name: '', price: '', duration: '1', durationUnit: 'month' });
  const [exercises, setExercises] = useState([]);
  const [showExerciseModal, setShowExerciseModal] = useState(false);
  const [newExercise, setNewExercise] = useState({ name: '', muscleGroup: 'Chest', equipment: '', difficulty: 'Beginner', instructions: '', image: '' });
  const [selectedFolder, setSelectedFolder] = useState(null);
  const muscleGroups = ['Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core'];
  const [viewingExercise, setViewingExercise] = useState(null);
  const [isEditingPlan, setIsEditingPlan] = useState(false);
  const [isEditingProduct, setIsEditingProduct] = useState(false);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [currentProduct, setCurrentProduct] = useState(null);

  // --- FETCH FUNCTIONS (KEEPING YOUR LOGIC) ---
  const fetchUsers = () => fetch('http://127.0.0.1:5000/api/users').then(res => res.json()).then(setUsers);
  const fetchCoaches = () => fetch('http://127.0.0.1:5000/api/coaches').then(res => res.json()).then(setCoaches);
  const fetchPlans = () => fetch('http://127.0.0.1:5000/api/plans').then(res => res.json()).then(setPlans);
  const fetchProducts = () => fetch('http://127.0.0.1:5000/api/products').then(res => res.json()).then(setProducts);
  const fetchExercises = () => fetch('http://127.0.0.1:5000/api/exercises').then(res => res.json()).then(setExercises);

  useEffect(() => {
    fetchUsers(); fetchCoaches(); fetchPlans(); fetchProducts(); fetchExercises();
    localStorage.setItem('adminTab', activeTab);
  }, [activeTab]);

  // --- SUBMIT HANDLERS (PLACEHOLDERS FOR YOUR LOGIC) ---
  const openEditPlan = (plan) => { setCurrentPlan(plan); setIsEditingPlan(true); setShowPlanModal(true); };
  const openEditProduct = (product) => { setCurrentProduct(product); setIsEditingProduct(true); setShowProductModal(true); };
  const openEditModal = (coach) => { setIsEditingCoach(true); setCurrentCoachId(coach._id); setNewCoach({...coach, availableDates: coach.availableDates || []}); setShowCoachModal(true); };

  // Nav Items Configuration
  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'members', label: 'Members', icon: Users },
    { id: 'coaches', label: 'Coaches', icon: CalendarDays },
    { id: 'plans', label: 'Plans', icon: CreditCard },
    { id: 'inventory', label: 'Inventory', icon: Package },
    { id: 'exercises', label: 'Exercise Vault', icon: Dumbbell },
  ];

  // Add this logic to calculate recent members from your existing users state
const recentMembers = [...users]
  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  .slice(0, 5);

  return (
    <div className="flex min-h-screen bg-[#020617] text-slate-200 font-sans">
      
      {/* --- SIDEBAR --- */}
      <aside className="w-72 bg-slate-900/50 backdrop-blur-xl border-r border-slate-800/60 flex flex-col fixed h-full z-30">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-600/20">
              <Dumbbell size={24} className="text-white" />
            </div>
            <h1 className="text-xl font-black tracking-tighter italic text-white uppercase">
              LongLong <span className="text-orange-500">Gym</span>
            </h1>
          </div>
          
          <nav className="space-y-1.5">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold text-sm transition-all duration-200 group ${
                  activeTab === item.id 
                  ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/20' 
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-100'
                }`}
              >
                <item.icon size={20} className={activeTab === item.id ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'} />
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-8">
          <button 
            onClick={onLogout} 
            className="w-full flex items-center justify-center gap-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white px-4 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all duration-300 border border-red-500/20"
          >
            <LogOut size={16} />
            Logout Session
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className={`flex-1 ml-72 p-12 transition-all duration-500 ${selectedUser ? 'mr-96' : ''}`}>
        <div className="max-w-7xl mx-auto">
          {activeTab === 'dashboard' && <OverviewTab users={users} coaches={coaches} recentMembers={recentMembers} onNavigate={setActiveTab} />}
          {activeTab === 'members' && <MembersTab users={users} searchTerm={searchTerm} onSearch={setSearchTerm} onSelect={setSelectedUser} onStatusToggle={() => {}} onDeleteClick={(u) => { setItemToDelete(u); setDeleteType('member'); setIsDeleteModalOpen(true); }} />}
          {activeTab === 'plans' && <PlansTab plans={plans} onAddClick={() => { setIsEditingPlan(false); setShowPlanModal(true); }} onEditClick={openEditPlan} onDeleteClick={(plan) => { setItemToDelete(plan); setDeleteType('plan'); setIsDeleteModalOpen(true); }} />}
          {activeTab === 'coaches' && <CoachesTab coaches={coaches} onAddClick={() => { setIsEditingCoach(false); setShowCoachModal(true); }} onEditClick={openEditModal} onDeleteClick={(coach) => { setItemToDelete(coach); setDeleteType('coach'); setIsDeleteModalOpen(true); }} />}
          {activeTab === 'inventory' && <InventoryTab products={products} onAddClick={() => { setIsEditingProduct(false); setShowProductModal(true); }} onEditClick={openEditProduct} onDeleteClick={(p) => { setItemToDelete(p); setDeleteType('product'); setIsDeleteModalOpen(true); }} />}
          {activeTab === 'exercises' && <ExercisesTab selectedFolder={selectedFolder} setSelectedFolder={setSelectedFolder} exercises={exercises} muscleGroups={muscleGroups} onAddClick={() => setShowExerciseModal(true)} onViewClick={setViewingExercise} onDeleteClick={(ex) => { setItemToDelete(ex); setDeleteType('exercise'); setIsDeleteModalOpen(true); }} />}
        </div>
      </main>

      {/* --- MODALS (KEEPING YOUR EXISTING CONNECTIONS) --- */}
      <MemberDetailSidebar selectedUser={selectedUser} onClose={() => setSelectedUser(null)} onVerify={() => {}} />
      <DeleteConfirmModal show={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={() => {}} title={`Remove ${deleteType}?`} itemName={itemToDelete?.name} />
      <CoachModal show={showCoachModal} onClose={() => setShowCoachModal(false)} isEditing={isEditingCoach} newCoach={newCoach} setNewCoach={setNewCoach} onSubmit={() => {}} toggleDate={() => {}} updateDateHours={() => {}} convertToBase64={() => {}} />
      <PlanModal show={showPlanModal} onClose={() => setShowPlanModal(false)} onSubmit={() => {}} newPlan={newPlan} setNewPlan={setNewPlan} isEditing={isEditingPlan} currentPlan={currentPlan} />
      <ProductModal show={showProductModal} onClose={() => setShowProductModal(false)} onSubmit={() => {}} newProduct={newProduct} setNewProduct={setNewProduct} convertToBase64={() => {}} isEditing={isEditingProduct} currentProduct={currentProduct} />
      <ExerciseModal show={showExerciseModal} onClose={() => setShowExerciseModal(false)} onSubmit={() => {}} newExercise={newExercise} setNewExercise={setNewExercise} convertToBase64={() => {}} />
      <ExerciseViewModal exercise={viewingExercise} onClose={() => setViewingExercise(null)} />
    </div>
  );
};

export default AdminDashboard;