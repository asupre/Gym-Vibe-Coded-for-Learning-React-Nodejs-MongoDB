import React, { useState } from 'react';
import AdminDashboard from './AdminDashboard';
import UserDashboard from './UserDashboard';
import LandingPage from './LandingPage'; // Import your landing page

const App = () => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('currentUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const handleLoginSuccess = (userData) => {
    localStorage.setItem('currentUser', JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('adminTab'); 
    setUser(null);
  };

  // --- ROUTING LOGIC ---
  
  // 1. If Admin is logged in
  if (user && user.role === 'admin') {
    return <AdminDashboard onLogout={handleLogout} />;
  }

  // 2. If Member is logged in
  if (user && user.role === 'member') {
    return <UserDashboard user={user} onLogout={handleLogout} />;
  }

  // 3. DEFAULT: Show Landing Page if no one is logged in
  return <LandingPage onLoginSuccess={handleLoginSuccess} />;
};

export default App;