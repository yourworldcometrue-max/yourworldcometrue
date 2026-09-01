import React, { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient';

import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import DealsPage from './pages/DealsPage';
import CompleteProfile from './pages/CompleteProfile';
import ComingSoon from './pages/ComingSoon';
import RealEstateAdminLogin from './pages/RealEstateAdminLogin';
import RealEstateAdminDashboard from './pages/RealEstateAdminDashboard';

function App() {
  const navigate = useNavigate();

  // Listen for the password recovery event when the user clicks the email link
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        navigate('/reset-password');
      }
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/deals" element={<DealsPage />} />
        <Route path="/complete-profile" element={<CompleteProfile />} />
        <Route path="/realestate" element={<ComingSoon category="Real Estate" description="Browse property listings from AMMA DEVELOPERS and other builders. We're building this out next." />} />
        <Route path="/realestate/admin" element={<RealEstateAdminLogin />} />
        <Route path="/realestate/admin/dashboard" element={<RealEstateAdminDashboard />} />
        <Route path="/shop" element={<ComingSoon category="Shop Smart" description="Browse and buy from sellers across every category. We're building this out next." />} />
        <Route path="/travel" element={<ComingSoon category="Travel More" description="Plan trips and discover places worth the trip." />} />
        <Route path="/food" element={<ComingSoon category="Eat Healthy" description="Recipes and healthy eating, tailored to you." />} />
        <Route path="/health" element={<ComingSoon category="Live Better" description="Health tips, fitness, and wellness in one place." />} />
        <Route path="/education" element={<ComingSoon category="Learn & Grow" description="Courses, jobs, and skills for your future." />} />
        <Route path="/news" element={<ComingSoon category="Stay Informed" description="News and updates that matter to you." />} />
        <Route path="/finance" element={<ComingSoon category="Manage Finances" description="Smart money tools for a secure future." />} />
        <Route path="*" element={<ComingSoon category="Page not found" description="That page doesn't exist yet." />} />
      </Routes>
    </div>
  );
}

export default App;
