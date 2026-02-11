import React, { useState, useEffect } from 'react';

function LandingPage({ onLoginSuccess }) {
  const [showModal, setShowModal] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [plans, setPlans] = useState([]);

  // Fetch your dynamic plans from the backend
  useEffect(() => {
    fetch('http://127.0.0.1:5000/api/plans')
      .then(res => res.json())
      .then(data => setPlans(data))
      .catch(err => console.error("Error fetching plans:", err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      email: e.target.email.value,
      password: e.target.password.value,
      ...(!isLogin && { 
        name: e.target.name.value, 
        plan: e.target.plan.value 
      })
    };

    const endpoint = isLogin ? 'login' : 'register';
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();

      if (response.ok) {
        if (isLogin) {
          onLoginSuccess(data.user);
        } else {
          alert("Registration successful! Switching to login.");
          setIsLogin(true);
        }
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert("Server connection failed.");
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans selection:bg-orange-500/30">
      {/* --- NAVIGATION --- */}
      <nav className="flex justify-between items-center px-12 py-8 fixed w-full z-40 bg-[#020617]/80 backdrop-blur-md border-b border-slate-800/50">
        <h1 className="text-2xl font-black italic tracking-tighter text-orange-500">LONGLONG <span className="text-white font-black">GYM</span></h1>
        <button 
          onClick={() => { setShowModal(true); setIsLogin(true); }}
          className="bg-white text-black px-6 py-2 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-orange-600 hover:text-white transition-all shadow-xl shadow-white/5 active:scale-95"
        >
          Member Login
        </button>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1600')] bg-cover bg-center opacity-20 grayscale scale-110 animate-pulse-slow"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-[#020617]/50"></div>
        
        <div className="relative z-10 animate-in fade-in slide-in-from-bottom-10 duration-1000">
          <p className="text-orange-500 font-black text-xs uppercase tracking-[8px] mb-6">Established 2026</p>
          <h2 className="text-[120px] font-black uppercase italic tracking-tighter leading-[0.8] mb-8">
            ENTER THE <br /> <span className="text-orange-600">VAULT.</span>
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto mb-12 text-lg font-medium leading-relaxed italic">
            Stop making excuses. Start making history. Join the most advanced fitness community in the region.
          </p>
          <div className="flex gap-4 justify-center">
            <button 
              onClick={() => { setShowModal(true); setIsLogin(false); }}
              className="bg-orange-600 hover:bg-orange-500 text-white px-12 py-5 rounded-2xl font-black uppercase tracking-widest transition-all shadow-2xl shadow-orange-900/40 active:scale-95"
            >
              Start Training Now
            </button>
          </div>
        </div>
      </section>

      {/* --- FEATURES GRID --- */}
      <section className="py-32 px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: "Workout Vault", desc: "Access 100+ professional exercise techniques with full focus modes.", icon: "🏋️" },
            { title: "Expert Coaching", desc: "Book sessions with certified trainers focused on your specific goals.", icon: "💪" },
            { title: "Supp Shop", desc: "Fuel your gains with our exclusive inventory of premium supplements.", icon: "💊" }
          ].map((f, i) => (
            <div key={i} className="bg-slate-900/50 border border-slate-800 p-10 rounded-[40px] hover:border-orange-500 transition-all group">
              <div className="text-4xl mb-6 group-hover:scale-110 transition duration-500">{f.icon}</div>
              <h3 className="text-2xl font-black uppercase mb-3 tracking-tight italic">{f.title}</h3>
              <p className="text-slate-500 leading-relaxed font-medium">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* --- AUTH MODAL --- */}
      {showModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 z-[100] animate-in fade-in duration-300">
          <div className="bg-white text-slate-900 p-12 rounded-[50px] w-full max-w-md relative shadow-2xl shadow-orange-500/10">
            <button onClick={() => setShowModal(false)} className="absolute top-8 right-8 text-slate-300 hover:text-orange-600 transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>

            <div className="flex gap-8 mb-10 border-b border-slate-100">
              {['Login', 'Register'].map((tab) => (
                <button 
                  key={tab}
                  onClick={() => setIsLogin(tab === 'Login')}
                  className={`pb-4 text-[10px] font-black uppercase tracking-[3px] transition-all ${
                    (isLogin && tab === 'Login') || (!isLogin && tab === 'Register') 
                    ? 'border-b-4 border-orange-600 text-orange-600' 
                    : 'text-slate-300'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {!isLogin && (
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Full Name</label>
                  <input name="name" className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-orange-600 font-bold" required />
                </div>
              )}
              
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email Address</label>
                <input name="email" type="email" className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-orange-600 font-bold" required />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Secure Password</label>
                <input name="password" type="password" className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-orange-600 font-bold" required />
              </div>

              {!isLogin && (
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select Membership Plan</label>
                  <select name="plan" className="w-full p-4 bg-slate-50 rounded-2xl cursor-pointer outline-none font-black text-orange-600 uppercase italic">
                    {plans.map(plan => (
                      <option key={plan._id} value={plan.name}>{plan.name} - ₱{plan.price}</option>
                    ))}
                  </select>
                </div>
              )}

              <button type="submit" className="w-full bg-slate-950 text-white py-5 rounded-[24px] font-black uppercase tracking-[4px] text-xs hover:bg-orange-600 transition-all shadow-xl active:scale-95 mt-4">
                {isLogin ? "Authenticate →" : "Join The Vault →"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default LandingPage;