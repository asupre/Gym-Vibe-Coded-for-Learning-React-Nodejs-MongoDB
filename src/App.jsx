import { useState } from 'react';
import LandingPage from './LandingPage';
import Dashboard from './Dashboard';

function App() {
  const [user, setUser] = useState(null);

  // When a user logs in, we save their data in 'user' state
  const handleLoginSuccess = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <div>
      {user ? (
        <Dashboard user={user} onLogout={handleLogout} />
      ) : (
        <LandingPage onLoginSuccess={handleLoginSuccess} />
      )}
    </div>
  );
}

export default App;