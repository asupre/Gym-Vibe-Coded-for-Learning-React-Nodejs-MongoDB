import React from 'react';

const Dashboard = ({ user, onLogout }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-3xl font-bold text-orange-500">LongLong Gym Vault</h1>
            <p className="text-slate-400">Welcome back, {user.name}!</p>
          </div>
          <button 
            onClick={onLogout}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition"
          >
            Logout
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Status Card */}
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
            <h3 className="text-slate-400 text-sm uppercase mb-2">Membership Status</h3>
            <p className={`text-2xl font-bold ${user.status === 'active' ? 'text-green-500' : 'text-yellow-500'}`}>
              {user.status.toUpperCase()}
            </p>
          </div>

          {/* Role Card */}
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
            <h3 className="text-slate-400 text-sm uppercase mb-2">Account Type</h3>
            <p className="text-2xl font-bold text-blue-500">{user.role.toUpperCase()}</p>
          </div>

          {/* Quick Action */}
          <div className="bg-orange-600 p-6 rounded-2xl cursor-pointer hover:bg-orange-500 transition">
            <h3 className="text-white text-sm uppercase mb-2">My QR Code</h3>
            <p className="text-xl font-bold">Tap to View</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;