import React, { useState, useEffect } from 'react';
import { supabase } from '/src/supabaseClient';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
// UPDATED: Imported the password recovery pages
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

function App() {
  // 'landing' is the default view, can switch to 'signup', 'login', 'forgot-password', etc.
  const [currentPage, setCurrentPage] = useState('landing');

  // UPDATED: Listen for the special recovery event when clicking the email link
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        setCurrentPage('reset-password');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

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
          {/* UPDATED: Added onNavigate prop so Signup can redirect user upon success */}
          <Signup onNavigate={setCurrentPage} />
        </div>
      )}

      {currentPage === 'login' && (
        <div className="auth-page-wrapper">
          <button onClick={() => setCurrentPage('landing')} className="back-to-home-btn">
            ⬅️ Back to Home
          </button>
          {/* UPDATED: Added onNavigate prop so Login can redirect user upon success */}
          <Login onNavigate={setCurrentPage} />
        </div>
      )}

      {/* UPDATED: Route condition to render ForgotPassword screen */}
      {currentPage === 'forgot-password' && (
        <div className="auth-page-wrapper">
          <button onClick={() => setCurrentPage('login')} className="back-to-home-btn">
            ⬅️ Back to Login
          </button>
          <ForgotPassword onNavigate={setCurrentPage} />
        </div>
      )}

      {/* UPDATED: Route condition to render ResetPassword screen when link is clicked */}
      {currentPage === 'reset-password' && (
        <div className="auth-page-wrapper">
          <ResetPassword onNavigate={setCurrentPage} />
        </div>
      )}

      {currentPage === 'dashboard' && (
        <Dashboard />
      )}
    </div>
  );
}

export default App;