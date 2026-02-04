import { useState } from 'react';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    plan: 'Silver' // Default plan
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    console.log("Sending to Backend:", formData);
    
    // This is the "Bridge" call to our Node.js server
    try {
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      alert(data.message);
    } catch (err) {
      console.error("Error connecting to server:", err);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-slate-100 p-4">
      <form onSubmit={handleRegister} className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md space-y-6">
        <h2 className="text-2xl font-bold text-center text-slate-800">Create Account</h2>
        
        <input name="name" placeholder="Full Name" onChange={handleChange} className="w-full p-2 border rounded" required />
        <input name="email" type="email" placeholder="Email" onChange={handleChange} className="w-full p-2 border rounded" required />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} className="w-full p-2 border rounded" required />

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-600">Choose Your Plan</label>
          <select name="plan" onChange={handleChange} className="w-full p-2 border rounded bg-white">
            <option value="Silver">Silver (₱1,000/mo)</option>
            <option value="Gold">Gold (₱2,000/mo)</option>
            <option value="Platinum">Platinum (₱3,500/mo)</option>
          </select>
        </div>

        <button type="submit" className="w-full bg-slate-900 text-white py-2 rounded-md font-bold hover:bg-slate-800 transition-all">
          Sign Up
        </button>
      </form>
    </div>
  );
}

export default Register;