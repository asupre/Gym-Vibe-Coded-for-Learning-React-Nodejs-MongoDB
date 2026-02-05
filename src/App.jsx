import { useState, useEffect } from 'react'; // Added useEffect
import LandingPage from './LandingPage';
import Dashboard from './Dashboard';
import AdminDashboard from './AdminDashboard';

function App() {
  // 1. Initialize state by checking localStorage first
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('gymUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // 2. The Login Success handler
  const handleLoginSuccess = (userData) => {
    setUser(userData);
    localStorage.setItem('gymUser', JSON.stringify(userData)); // Save to memory
  };

  // 3. The Logout handler
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('gymUser'); // Wipe memory
  };

  return (
    <div>
      {user ? (
        user.role === 'admin' ? (
          <AdminDashboard onLogout={handleLogout} />
        ) : (
          <Dashboard user={user} onLogout={handleLogout} />
        )
      ) : (
        <LandingPage onLoginSuccess={handleLoginSuccess} />
      )}
    </div>
  );
}

export default App;