import { useState } from 'react';

// Added { onLoginSuccess } as a prop to communicate with App.jsx
function LandingPage({ onLoginSuccess }) {
  const [showModal, setShowModal] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = {
      email: e.target.email.value,
      password: e.target.password.value,
      ...( !isLogin && { 
        name: e.target.name.value, // Matches your Schema 'name'
        plan: e.target.plan.value 
      })
    };

    if (isLogin) {
      try {
        // Changed to 127.0.0.1 to avoid local DNS 'Server Down' issues
        const response = await fetch('http://127.0.0.1:5000/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            email: formData.email, 
            password: formData.password 
          })
        });

        const data = await response.json();

        if (response.ok) {
          onLoginSuccess(data.user); // This "unlocks" the dashboard in App.jsx
        } else {
          alert(data.message);
        }
      } catch (err) {
        alert("Connection failed! Is 'node src/server.js' running?");
      }
    } else {
      try {
        const response = await fetch('http://127.0.0.1:5000/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        const data = await response.json();
        alert(data.message);
        if (response.ok) setIsLogin(true); // Switch to login view after success
      } catch (err) {
        alert("Registration failed! Check your terminal.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6 font-sans">
      <h1 className="text-6xl font-black mb-4 tracking-tighter text-orange-500 italic">LONGLONG GYM</h1>
      <p className="text-slate-400 mb-8 text-lg">Your journey to official membership starts here.</p>
      
      <button 
        onClick={() => { setShowModal(true); setIsLogin(true); }}
        className="px-10 py-4 bg-orange-600 hover:bg-orange-700 rounded-full font-bold transition-all shadow-lg hover:shadow-orange-500/20"
      >
        Access Dashboard
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-white text-slate-900 p-8 rounded-3xl w-full max-w-md relative shadow-2xl animate-in fade-in zoom-in duration-300">
            
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-slate-300 hover:text-slate-600 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>

            <div className="flex gap-6 mb-8 border-b border-slate-100">
              <button 
                onClick={() => setIsLogin(true)}
                className={`pb-3 text-sm font-bold uppercase tracking-widest transition-all ${isLogin ? 'border-b-2 border-orange-600 text-orange-600' : 'text-slate-400'}`}
              >
                Login
              </button>
              <button 
                onClick={() => setIsLogin(false)}
                className={`pb-3 text-sm font-bold uppercase tracking-widest transition-all ${!isLogin ? 'border-b-2 border-orange-600 text-orange-600' : 'text-slate-400'}`}
              >
                Register
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {!isLogin && (
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Name</label>
                  <input name="name" placeholder="Juan Dela Cruz" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-600 outline-none transition-all" required />
                </div>
              )}
              
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Email</label>
                <input name="email" type="email" placeholder="juan@gym.com" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-600 outline-none" required />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Password</label>
                <input name="password" type="password" placeholder="••••••••" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-600 outline-none" required />
              </div>

              {!isLogin && (
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Membership Plan</label>
                  <select name="plan" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer outline-none">
                    <option value="Silver">Silver (Entry Level)</option>
                    <option value="Gold">Gold (Most Popular)</option>
                    <option value="Platinum">Platinum (Full Access)</option>
                  </select>
                </div>
              )}

              <button type="submit" className="w-full bg-slate-950 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg active:scale-[0.98]">
                {isLogin ? "Sign In to Dashboard" : "Complete Registration"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default LandingPage;