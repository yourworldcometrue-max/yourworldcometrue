import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import '../styles/auth.css';

const RealEstateAdminDashboard = () => {
  const [business, setBusiness] = useState(null);
  const [checking, setChecking] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAccess = async () => {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;

      if (!user) {
        navigate('/realestate/admin');
        return;
      }

      const { data: adminRows } = await supabase
        .from('real_estate_admins')
        .select('business_id, real_estate_businesses(name, slug)')
        .eq('user_id', user.id);

      if (!adminRows || adminRows.length === 0) {
        navigate('/realestate/admin');
        return;
      }

      setBusiness(adminRows[0].real_estate_businesses);
      setChecking(false);
    };

    checkAccess();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/realestate/admin');
  };

  if (checking) {
    return <div className="auth-container"><p>Checking access…</p></div>;
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>{business?.name} Dashboard</h2>
        <p className="auth-subtitle">You're signed in as an admin for {business?.name}.</p>
        <p style={{ marginTop: '1rem', color: '#666' }}>
          Property listing management (add / edit / delete, with photo upload) is being built next.
        </p>
        <button onClick={handleLogout} className="auth-submit-btn" style={{ marginTop: '1.5rem' }}>
          Log out
        </button>
      </div>
    </div>
  );
};

export default RealEstateAdminDashboard;
