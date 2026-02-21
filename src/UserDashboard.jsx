import React, { useState, useEffect } from 'react';
import UserVaultTab from './components/tabs/user-tabs/UserVaultTab';
import UserSupplementsTab from './components/tabs/user-tabs/UserSupplementsTab';
import UserCoachesTab from './components/tabs/user-tabs/UserCoachesTab';
import TicketModal from './components/user-modals/TicketModal';
import ExerciseFocusModal from './components/user-modals/ExerciseFocusModal';

const UserDashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [coaches, setCoaches] = useState([]);
  const [products, setProducts] = useState([]);
  const [userProfile, setUserProfile] = useState(user.profileImage || '');
  const [showTicketModal, setShowTicketModal] = useState(false);

  const [exercises, setExercises] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(null); 
  const [viewingExercise, setViewingExercise] = useState(null); 
  const muscleGroups = ['Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core'];

  useEffect(() => {
    fetch('http://127.0.0.1:5000/api/coaches').then(res => res.json()).then(setCoaches);
    fetch('http://127.0.0.1:5000/api/products').then(res => res.json()).then(setProducts).catch(err => console.error(err));
    fetch('http://127.0.0.1:5000/api/exercises').then(res => res.json()).then(setExercises).catch(err => console.error(err));
  }, []);

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => resolve(fileReader.result);
      fileReader.onerror = (error) => reject(error);
    });
  };

  const handleProfileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const base64 = await convertToBase64(file);
    setUserProfile(base64);
    try {
      const res = await fetch(`http://127.0.0.1:5000/api/users/${user._id}/profile`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profileImage: base64 })
      });
      if (res.ok) {
        const updatedUser = { ...user, profileImage: base64 };
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        alert("Profile picture saved!");
      }
    } catch (err) { console.error(err); }
  };

  const handleTicketUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const base64 = await convertToBase64(file);
    try {
      const res = await fetch(`http://127.0.0.1:5000/api/users/${user._id}/ticket`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentTicket: base64 })
      });
      if (res.ok) {
        alert("Ticket sent! Wait for Admin approval.");
        setShowTicketModal(false);
      }
    } catch (err) { console.error(err); }
  };

  const handleTabChange = (targetTab) => {
    if (targetTab === 'dashboard' || targetTab === 'settings') {
      setActiveTab(targetTab);
      return;
    }
    if (user.status === 'pending') {
      setShowTicketModal(true);
    } else {
      setActiveTab(targetTab);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#020617] text-white font-sans relative">
      
      {/* --- TOP RIGHT PROFILE AREA --- */}
      <div className="fixed top-8 right-12 flex items-center gap-4 z-30 bg-slate-900/60 backdrop-blur-md p-2 pr-6 rounded-full border border-slate-800 shadow-2xl">
        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-orange-500 bg-slate-800 shadow-lg">
          {userProfile ? <img src={userProfile} className="w-full h-full object-cover" alt="User" /> : <div className="w-full h-full flex items-center justify-center font-black text-orange-500 text-xs">{user.name.charAt(0)}</div>}
        </div>
        <div className="text-right">
          <p className="text-[10px] font-black uppercase text-orange-500 tracking-widest leading-none mb-1">Member</p>
          <p className="text-xs font-bold text-white leading-none">{user.name}</p>
        </div>
      </div>

      {/* --- SIDEBAR --- */}
      <div className="w-64 bg-slate-900/50 backdrop-blur-xl border-r border-slate-800 flex flex-col p-6 fixed h-full z-20">
        <div className="mb-10 px-2">
          <h1 className="text-xl font-black text-orange-500 tracking-tighter italic">LONGLONG <span className="text-white">GYM</span></h1>
        </div>
        <nav className="flex-1 space-y-1">
          <button onClick={() => handleTabChange('dashboard')} className={`w-full text-left px-4 py-3 rounded-xl font-bold transition flex items-center gap-3 ${activeTab === 'dashboard' ? 'bg-orange-600 shadow-lg' : 'text-slate-400 hover:bg-slate-800'}`}> Dashboard</button>
          <button onClick={() => handleTabChange('coaches')} className={`w-full text-left px-4 py-3 rounded-xl font-bold transition flex items-center gap-3 ${activeTab === 'coaches' ? 'bg-orange-600' : 'text-slate-400 hover:bg-slate-800'}`}> Personal Trainers</button>
          <button onClick={() => handleTabChange('supplements')} className={`w-full text-left px-4 py-3 rounded-xl font-bold transition flex items-center gap-3 ${activeTab === 'supplements' ? 'bg-orange-600' : 'text-slate-400 hover:bg-slate-800'}`}> Supplement Shop</button>
          <button onClick={() => handleTabChange('exercises')} className={`w-full text-left px-4 py-3 rounded-xl font-bold transition flex items-center gap-3 ${activeTab === 'exercises' ? 'bg-orange-600' : 'text-slate-400 hover:bg-slate-800'}`}> Workout Vault</button>
          <button onClick={() => handleTabChange('settings')} className={`w-full text-left px-4 py-3 rounded-xl font-bold transition flex items-center gap-3 ${activeTab === 'settings' ? 'bg-orange-600 shadow-lg' : 'text-slate-400 hover:bg-slate-800'}`}> Settings</button>
        </nav>
        <button onClick={onLogout} className="bg-red-600/10 text-red-500 hover:bg-red-600 hover:text-white px-4 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition mt-auto">Logout System</button>
      </div>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 ml-64 p-12">
        {activeTab === 'dashboard' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="mb-12">
              <h2 className="text-5xl font-black uppercase tracking-tighter mb-2">Hello, <span className="text-orange-600">{user.name}</span>!</h2>
              <p className="text-slate-500 font-medium text-lg italic">Your fitness journey starts here at LongLong Vault.</p>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div onClick={() => handleTabChange('coaches')} className="group relative h-80 rounded-[40px] overflow-hidden border border-slate-800 cursor-pointer shadow-2xl hover:border-orange-500/50 transition-all duration-500">
                <img src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800" className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-110 transition duration-700" alt="Coaches" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
                <div className="absolute bottom-8 left-8">
                  <h3 className="text-3xl font-black uppercase mb-2 text-white">Expert Coaching</h3>
                  <span className="inline-block bg-orange-600 px-6 py-2 rounded-full font-black text-[10px] uppercase tracking-widest group-hover:bg-white group-hover:text-black transition-colors text-white">Explore Trainers →</span>
                </div>
              </div>
              <div onClick={() => handleTabChange('exercises')} className="group relative h-80 rounded-[40px] overflow-hidden border border-slate-800 cursor-pointer shadow-2xl hover:border-orange-500/50 transition-all duration-500">
                <img src="https://images.unsplash.com/photo-1593095191071-82b0fdd67611?w=800" className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:scale-110 transition duration-700" alt="Supplements" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
                <div className="absolute bottom-8 left-8">
                  <h3 className="text-3xl font-black uppercase mb-2 text-white italic">Workout Vault</h3>
                  <span className="inline-block bg-orange-600 px-6 py-2 rounded-full font-black text-[10px] uppercase tracking-widest group-hover:bg-white group-hover:text-black transition-colors text-white">Learn Techniques →</span>
                </div>
              </div>
            </div>
            <div className="mt-8 bg-slate-900/50 border border-slate-800 p-8 rounded-[40px] flex items-center justify-between">
              <div>
                <p className="text-orange-500 font-black text-[10px] uppercase tracking-[4px] mb-2">Current Status</p>
                <h4 className="text-2xl font-bold uppercase tracking-tight">{user.plan} Member - <span className={user.status === 'active' ? 'text-green-500' : 'text-yellow-500'}>{user.status}</span></h4>
              </div>
              <button onClick={() => handleTabChange('settings')} className="bg-slate-800 hover:bg-slate-700 px-8 py-3 rounded-2xl font-bold text-sm transition text-white">Account Settings</button>
            </div>
          </div>
        )}

        {activeTab === 'coaches' && (
  <UserCoachesTab 
    coaches={coaches} 
    onBack={() => setActiveTab('dashboard')} 
  />
)}

        {activeTab === 'supplements' && (
  <UserSupplementsTab 
    products={products} 
    onBack={() => setActiveTab('dashboard')} 
  />
)}

        {activeTab === 'exercises' && (
  <UserVaultTab 
    selectedFolder={selectedFolder}
    setSelectedFolder={setSelectedFolder}
    exercises={exercises}
    muscleGroups={muscleGroups}
    setViewingExercise={setViewingExercise}
  />
)}

        {/* --- SETTINGS TAB --- */}
        {activeTab === 'settings' && (
          <div className="animate-in slide-in-from-bottom-4 duration-500">
             <h2 className="text-4xl font-black mb-10 uppercase italic text-white">Account <span className="text-orange-600">Settings</span></h2>
             <div className="bg-slate-900/50 border border-slate-800 p-10 rounded-[40px] max-w-xl shadow-2xl">
                <div className="flex flex-col md:flex-row items-center gap-8 mb-10">
                    <div className="w-32 h-32 rounded-3xl overflow-hidden border-2 border-orange-500 bg-slate-800 shadow-lg shadow-orange-900/20">
                         {userProfile ? <img src={userProfile} className="w-full h-full object-cover" alt="" /> : <div className="w-full h-full flex items-center justify-center text-4xl font-black italic text-orange-500">{user.name.charAt(0)}</div>}
                    </div>
                    <div className="flex-1 text-white">
                        <h4 className="text-xl font-bold mb-2 uppercase italic tracking-tighter">Identify Yourself</h4>
                        <p className="text-slate-500 text-xs mb-4 leading-relaxed tracking-tight">Select a clear photo for staff identification.</p>
                        <input type="file" accept="image/*" className="text-xs file:bg-orange-600 file:border-none file:px-4 file:py-2 file:rounded-lg file:text-white file:font-black cursor-pointer" onChange={handleProfileUpload} />
                    </div>
                </div>
                <div className="space-y-4 border-t border-slate-800 pt-8 text-white">
                    <div className="bg-slate-800/30 p-4 rounded-2xl">
                        <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest block mb-1">Display Name</label>
                        <p className="text-white font-bold">{user.name}</p>
                    </div>
                </div>
             </div>
          </div>
        )}
      </main>

     {/* --- ALL MODALS --- */}
<TicketModal 
  show={showTicketModal} 
  onClose={() => setShowTicketModal(false)} 
  onUpload={handleTicketUpload} 
/>

<ExerciseFocusModal 
  exercise={viewingExercise} 
  onClose={() => setViewingExercise(null)} 
/>

    </div>
  );
};

export default UserDashboard;