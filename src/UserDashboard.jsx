import React, { useState, useEffect } from 'react';

const UserDashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [coaches, setCoaches] = useState([]);
  const [products, setProducts] = useState([]); // --- NEW: PRODUCTS STATE ---
  const [userProfile, setUserProfile] = useState(user.profileImage || '');
  const [showTicketModal, setShowTicketModal] = useState(false);

  useEffect(() => {
    // Fetch Coaches
    fetch('http://127.0.0.1:5000/api/coaches')
      .then(res => res.json())
      .then(data => setCoaches(data));

    // --- NEW: FETCH PRODUCTS FROM DATABASE ---
    fetch('http://127.0.0.1:5000/api/products')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error("Error fetching products:", err));
  }, []);

  // Helper to convert desktop image to string
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
        alert("Profile picture saved to server!");
      } else {
        alert("Failed to save to server.");
      }
    } catch (err) {
      console.error(err);
    }
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

// 3. Create a helper function to check access
const requestAccess = (tabName) => {
  if (user.status === 'pending') {
    setShowTicketModal(true);
  } else {
    setActiveTab(tabName);
  }
};

// This function decides if the user is allowed to switch tabs
const handleTabChange = (targetTab) => {
  // 1. If the user is trying to go to Dashboard or Settings, ALWAYS allow it
  if (targetTab === 'dashboard' || targetTab === 'settings') {
    setActiveTab(targetTab);
    return;
  }

  // 2. If they want restricted tabs (Trainers/Shop), check their status
  if (user.status === 'pending') {
    setShowTicketModal(true); // Block them and show the modal
  } else {
    setActiveTab(targetTab); // They are active, let them in!
  }
};

  return (
    <div className="flex min-h-screen bg-[#020617] text-white font-sans relative">
      
      {/* --- TOP RIGHT PROFILE AREA --- */}
      <div className="fixed top-8 right-12 flex items-center gap-4 z-30 bg-slate-900/60 backdrop-blur-md p-2 pr-6 rounded-full border border-slate-800 shadow-2xl">
        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-orange-500 bg-slate-800 shadow-lg">
          {userProfile ? (
            <img src={userProfile} className="w-full h-full object-cover" alt="User" />
          ) : (
            <div className="w-full h-full flex items-center justify-center font-black text-orange-500 text-xs">{user.name.charAt(0)}</div>
          )}
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
          <button onClick={() => setActiveTab('dashboard')} className={`w-full text-left px-4 py-3 rounded-xl font-bold transition flex items-center gap-3 ${activeTab === 'dashboard' ? 'bg-orange-600 shadow-lg shadow-orange-900/20' : 'text-slate-400 hover:bg-slate-800'}`}>
            🏠 Dashboard
          </button>
          <button onClick={() => handleTabChange('coaches')} className={`w-full text-left px-4 py-3 rounded-xl font-bold transition flex items-center gap-3 ${activeTab === 'coaches' ? 'bg-orange-600' : 'text-slate-400 hover:bg-slate-800'}`}>
            💪 Personal Trainers
          </button>
          <button onClick={() => handleTabChange('supplements')} className={`w-full text-left px-4 py-3 rounded-xl font-bold transition flex items-center gap-3 ${activeTab === 'supplements' ? 'bg-orange-600' : 'text-slate-400 hover:bg-slate-800'}`}>
            💊 Supplement Shop
          </button>
          <button onClick={() => setActiveTab('settings')} className={`w-full text-left px-4 py-3 rounded-xl font-bold transition flex items-center gap-3 ${activeTab === 'settings' ? 'bg-orange-600 shadow-lg' : 'text-slate-400 hover:bg-slate-800'}`}>
            ⚙️ Settings
          </button>
        </nav>

        <button onClick={onLogout} className="bg-red-600/10 text-red-500 hover:bg-red-600 hover:text-white px-4 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition mt-auto">
          Logout System
        </button>
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
              <div onClick={() => requestAccess('coaches')} className="group relative h-80 rounded-[40px] overflow-hidden border border-slate-800 cursor-pointer shadow-2xl hover:border-orange-500/50 transition-all duration-500">
                <img src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800" className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-110 transition duration-700" alt="Coaches" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
                <div className="absolute bottom-8 left-8 right-8">
                  <h3 className="text-3xl font-black uppercase mb-2 text-white">Expert Coaching</h3>
                  <p className="text-slate-300 text-sm mb-4 leading-relaxed">Transform your physique with our certified professional trainers.</p>
                  <span className="inline-block bg-orange-600 px-6 py-2 rounded-full font-black text-[10px] uppercase tracking-widest group-hover:bg-white group-hover:text-black transition-colors">Explore Trainers →</span>
                </div>
              </div>

              <div onClick={() => requestAccess('supplements')} className="group relative h-80 rounded-[40px] overflow-hidden border border-slate-800 cursor-pointer shadow-2xl hover:border-orange-500/50 transition-all duration-500">
                <img src="https://images.unsplash.com/photo-1593095191071-82b0fdd67611?w=800" className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:scale-110 transition duration-700" alt="Supplements" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
                <div className="absolute bottom-8 left-8 right-8">
                  <h3 className="text-3xl font-black uppercase mb-2 text-white">Vault Shop</h3>
                  <p className="text-slate-300 text-sm mb-4 leading-relaxed">Fuel your gains with our premium supplement inventory.</p>
                  <span className="inline-block bg-orange-600 px-6 py-2 rounded-full font-black text-[10px] uppercase tracking-widest group-hover:bg-white group-hover:text-black transition-colors">Shop Inventory →</span>
                </div>
              </div>
            </div>

            <div className="mt-8 bg-slate-900/50 border border-slate-800 p-8 rounded-[40px] flex items-center justify-between">
              <div>
                <p className="text-orange-500 font-black text-[10px] uppercase tracking-[4px] mb-2">Current Status</p>
                <h4 className="text-2xl font-bold uppercase tracking-tight">{user.plan} Member - <span className={user.status === 'active' ? 'text-green-500' : 'text-yellow-500'}>{user.status}</span></h4>
              </div>
              <button onClick={() => setActiveTab('settings')} className="bg-slate-800 hover:bg-slate-700 px-8 py-3 rounded-2xl font-bold text-sm transition text-white">Account Settings</button>
            </div>
          </div>
        )}

        {activeTab === 'coaches' && (
          <div className="animate-in fade-in duration-500">
             <h2 className="text-4xl font-black mb-8 uppercase italic tracking-tighter">Our <span className="text-orange-600">Trainers</span></h2>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {coaches.map(coach => (
                  <div key={coach._id} className="bg-slate-900 border border-slate-800 p-6 rounded-[32px] hover:border-orange-500/50 transition duration-500 group">
                    <div className="w-full h-56 rounded-2xl overflow-hidden mb-4 border border-slate-800 shadow-xl">
                      <img src={coach.image || 'https://via.placeholder.com/300'} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" alt={coach.name} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-1">{coach.name}</h3>
                    <p className="text-orange-500 text-xs font-black uppercase tracking-widest mb-6">{coach.specialty}</p>
                    <button className="w-full py-3 bg-white text-black rounded-xl font-black text-[10px] uppercase hover:bg-orange-600 hover:text-white transition">Book This Trainer</button>
                  </div>
                ))}
             </div>
             <button onClick={() => setActiveTab('dashboard')} className="mt-10 text-slate-500 font-bold hover:text-white transition italic">← Back to Dashboard</button>
          </div>
        )}

        {/* --- DYNAMIC SUPPLEMENT SHOP --- */}
        {activeTab === 'supplements' && (
          <div className="animate-in fade-in duration-500">
             <h2 className="text-4xl font-black mb-8 uppercase italic tracking-tighter">Vault <span className="text-orange-600">Supplements</span></h2>
             
             {products.length === 0 ? (
               <div className="bg-slate-900/50 border-2 border-dashed border-slate-800 rounded-3xl p-20 text-center">
                 <p className="text-slate-500 font-bold">The shop is being restocked. Check back soon!</p>
               </div>
             ) : (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                 {products.map(product => (
                   <div key={product._id} className="bg-slate-900 border border-slate-800 rounded-[32px] overflow-hidden group hover:border-orange-500/50 transition duration-500 shadow-2xl">
                     <div className="h-60 bg-slate-800 relative overflow-hidden">
                       {product.image ? (
                         <img src={product.image} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" alt={product.name} />
                       ) : (
                         <div className="w-full h-full flex items-center justify-center text-slate-600 font-black uppercase">No Photo</div>
                       )}
                       <div className="absolute top-4 left-4">
                         <span className="bg-orange-600 text-white px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-lg">
                           {product.category}
                         </span>
                       </div>
                     </div>
                     <div className="p-8">
                       <h3 className="text-2xl font-black text-white mb-1 uppercase tracking-tight">{product.name}</h3>
                       <p className="text-orange-500 text-3xl font-black mb-6 italic">₱{product.price}</p>
                       <div className="flex items-center justify-between">
                         <span className={`text-[10px] font-black uppercase tracking-widest ${product.stock > 0 ? 'text-green-500' : 'text-red-500'}`}>
                           {product.stock > 0 ? `In Stock: ${product.stock}` : 'Out of Stock'}
                         </span>
                         <button className="bg-white text-black px-5 py-2 rounded-xl font-black text-[10px] uppercase hover:bg-orange-600 hover:text-white transition active:scale-95 shadow-xl">
                           Order Now
                         </button>
                       </div>
                     </div>
                   </div>
                 ))}
               </div>
             )}
             <button onClick={() => setActiveTab('dashboard')} className="mt-10 text-slate-500 font-bold hover:text-white transition italic">← Back to Dashboard</button>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="animate-in slide-in-from-bottom-4 duration-500">
             <h2 className="text-4xl font-black mb-10 uppercase italic">Account <span className="text-orange-600">Settings</span></h2>
             <div className="bg-slate-900/50 border border-slate-800 p-10 rounded-[40px] max-w-xl shadow-2xl">
                <div className="flex flex-col md:flex-row items-center gap-8 mb-10">
                    <div className="w-32 h-32 rounded-3xl overflow-hidden border-2 border-orange-500 bg-slate-800 shadow-lg shadow-orange-900/20">
                         {userProfile ? <img src={userProfile} className="w-full h-full object-cover" alt="" /> : <div className="w-full h-full flex items-center justify-center text-4xl font-black italic">{user.name.charAt(0)}</div>}
                    </div>
                    <div className="flex-1">
                        <h4 className="text-xl font-bold mb-2">Identify Yourself</h4>
                        <p className="text-slate-500 text-xs mb-4 leading-relaxed tracking-tight">Select a clear photo from your computer. This helps our staff identify you at the gym.</p>
                        <input
                            type="file"
                            accept="image/*"
                            className="text-xs file:bg-orange-600 file:border-none file:px-4 file:py-2 file:rounded-lg file:text-white file:font-black cursor-pointer hover:file:bg-orange-500 transition-colors"
                            onChange={handleProfileUpload}
                        />
                    </div>
                </div>
                <div className="space-y-4 border-t border-slate-800 pt-8">
                    <div className="bg-slate-800/30 p-4 rounded-2xl">
                        <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest block mb-1">Display Name</label>
                        <p className="text-white font-bold">{user.name}</p>
                    </div>
                </div>
             </div>
          </div>
        )}
        {showTicketModal && (
  <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-[100] p-6">
    <div className="bg-white text-slate-900 p-10 rounded-[40px] max-w-md w-full shadow-2xl text-center">
      <div className="w-20 h-20 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">🎫</div>
      <h2 className="text-3xl font-black uppercase mb-2">Access Locked</h2>
      <p className="text-slate-500 mb-8 font-medium">To access Trainers and the Shop, please upload a photo of your Gym Ticket or Receipt for verification.</p>
      
      <input 
        type="file" 
        accept="image/*" 
        className="hidden" 
        id="ticket-upload" 
        onChange={handleTicketUpload}
      />
      <label htmlFor="ticket-upload" className="block w-full bg-orange-600 text-white font-black py-4 rounded-2xl cursor-pointer hover:bg-orange-700 transition mb-4 uppercase tracking-widest">
        Select Ticket Photo
      </label>
      <button onClick={() => setShowTicketModal(false)} className="text-slate-400 font-bold text-sm uppercase hover:text-slate-900">Close</button>
    </div>
  </div>
)}
      </main>
    </div>
  );
};


export default UserDashboard;