import React, { useState } from 'react';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';

function App() {
  // 'landing' is the default view, can switch to 'signup' or 'login'
  const [currentPage, setCurrentPage] = useState('landing');

  return (
    <div className="App">
      {currentPage === 'landing' && (
        <LandingPage onNavigate={setCurrentPage} />
      )}
      
      {currentPage === 'signup' && (
        <div className="auth-page-wrapper">
          {/* Back button to return to the home screen easily */}
          <button onClick={() => setCurrentPage('landing')} className="back-to-home-btn">
            ⬅️ Back to Home
          </button>
          <Signup />
        </div>
      )}

      {currentPage === 'login' && (
        <div className="auth-page-wrapper">
          <button onClick={() => setCurrentPage('landing')} className="back-to-home-btn">
            ⬅️ Back to Home
          </button>
          <Login />
        </div>
      )}

      {currentPage === 'dashboard' && (
        <Dashboard />
      )}
    </div>
  );
}

export default App;