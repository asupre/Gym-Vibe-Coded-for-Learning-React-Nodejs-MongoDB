import React, { useState, useEffect } from 'react';
import AdminDashboard from './AdminDashboard';
import UserDashboard from './UserDashboard';

const App = () => {
  // --- FIX 1: CHECK BROWSER MEMORY ON LOAD ---
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('currentUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [isRegistering, setIsRegistering] = useState(false);
  
  const [plans, setPlans] = useState([]); 
  const [selectedPlan, setSelectedPlan] = useState(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Fetch plans for the dropdown
  useEffect(() => {
    fetch('http://127.0.0.1:5000/api/plans')
      .then(res => res.json())
      .then(data => {
        setPlans(data);
        if (data.length > 0) setSelectedPlan(data[0].name);
      })
      .catch(err => console.error("Error fetching plans:", err));
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://127.0.0.1:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      
      if (res.ok) {
        // --- FIX 2: SAVE USER TO BROWSER MEMORY ---
        localStorage.setItem('currentUser', JSON.stringify(data.user));
        setUser(data.user);
      } else {
        alert(data.message);
      }
    } catch (err) { console.error(err); }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://127.0.0.1:5000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, plan: selectedPlan })
      });
      const data = await res.json();
      if (res.ok) {
        alert("Registration Successful! Please Login.");
        setIsRegistering(false);
      } else {
        alert(data.message);
      }
    } catch (err) { console.error(err); }
  };

  const handleLogout = () => {
    // --- FIX 3: CLEAR BROWSER MEMORY ON LOGOUT ---
    localStorage.removeItem('currentUser');
    localStorage.removeItem('adminTab'); 
    setUser(null);
    setName('');
    setEmail('');
    setPassword('');
  };

  // --- ROUTING ---
  if (user && user.role === 'admin') {
    return <AdminDashboard onLogout={handleLogout} />;
  }

  if (user && user.role === 'member') {
    return <UserDashboard user={user} onLogout={handleLogout} />;
  }

  // --- LOGIN / REGISTER FORM ---
  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 font-sans text-slate-900">
      <div className="max-w-5xl w-full bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        
        {/* LEFT SIDE: BRANDING */}
        <div className="md:w-1/2 bg-slate-900 relative p-12 flex flex-col justify-between text-white">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800')] bg-cover opacity-40"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-slate-900/50"></div>
          <div className="relative z-10">
            <h1 className="text-4xl font-black italic tracking-tighter">LONGLONG <span className="text-orange-600">GYM</span></h1>
            <p className="text-slate-300 mt-2 text-sm font-medium">Forging Champions since 2026.</p>
          </div>
        </div>

        {/* RIGHT SIDE: FORMS */}
        <div className="md:w-1/2 p-12 flex flex-col justify-center">
          <h2 className="text-3xl font-black mb-2 uppercase tracking-tight">
            {isRegistering ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p className="text-slate-500 text-sm mb-8 font-medium">
            {isRegistering ? 'Choose your plan.' : 'Enter your credentials.'}
          </p>

          <form onSubmit={isRegistering ? handleRegister : handleLogin} className="space-y-4">
            
            {isRegistering && (
              <input required type="text" placeholder="Full Name" className="w-full bg-slate-100 px-6 py-4 rounded-xl font-bold outline-none focus:ring-2 focus:ring-orange-500" value={name} onChange={e => setName(e.target.value)} />
            )}
            
            <input required type="email" placeholder="Email Address" className="w-full bg-slate-100 px-6 py-4 rounded-xl font-bold outline-none focus:ring-2 focus:ring-orange-500" value={email} onChange={e => setEmail(e.target.value)} />
            
            <input required type="password" placeholder="Password" className="w-full bg-slate-100 px-6 py-4 rounded-xl font-bold outline-none focus:ring-2 focus:ring-orange-500" value={password} onChange={e => setPassword(e.target.value)} />

            {isRegistering && (
              <div className="mt-6">
                <p className="text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Select Membership Tier</p>
                {plans.length === 0 ? (
                  <div className="p-4 bg-red-50 text-red-500 rounded-xl text-xs font-bold text-center">System Warning: No plans found.</div>
                ) : (
                  <div className="grid grid-cols-2 gap-3 max-h-48 overflow-y-auto pr-2">
                    {plans.map(plan => (
                      <div key={plan._id} onClick={() => setSelectedPlan(plan.name)} className={`cursor-pointer p-4 rounded-xl border-2 transition-all ${selectedPlan === plan.name ? 'border-orange-600 bg-orange-50' : 'border-slate-100 hover:border-slate-300'}`}>
                        <p className="font-black text-slate-900 text-xs uppercase mb-1">{plan.name}</p>
                        <p className="text-orange-600 font-bold text-sm">₱{plan.price}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <button type="submit" className="w-full bg-slate-900 text-white font-black uppercase tracking-widest py-4 rounded-xl mt-4 hover:bg-orange-600 transition-all shadow-xl">
              {isRegistering ? 'Join Now' : 'Login'}
            </button>
          </form>

          <p className="mt-8 text-center text-xs font-bold text-slate-400 cursor-pointer hover:text-orange-600 transition uppercase tracking-wide" onClick={() => setIsRegistering(!isRegistering)}>
            {isRegistering ? "← Back to Login" : "No account? Register Here →"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default App;