import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import '../styles/auth.css';

const RealEstateAdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    if (signInError) {
      setMessage(`Couldn't sign you in: ${signInError.message}`);
      setLoading(false);
      return;
    }

    // Confirm this user is actually registered as a business admin
    const { data: adminRows, error: adminError } = await supabase
      .from('real_estate_admins')
      .select('business_id, real_estate_businesses(name, slug)')
      .eq('user_id', signInData.user.id);

    if (adminError || !adminRows || adminRows.length === 0) {
      setMessage('This account is not set up as a real estate admin. Contact support if this seems wrong.');
      await supabase.auth.signOut();
      setLoading(false);
      return;
    }

    navigate('/realestate/admin/dashboard');
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <Link to="/" className="back-to-home-btn">← Back to home</Link>
      <div className="auth-card">
        <h2>Real Estate Admin</h2>
        <p className="auth-subtitle">Sign in to manage your property listings</p>

        {message && <div className="auth-alert">{message}</div>}

        <form onSubmit={handleLoginSubmit} className="auth-form">
          <div className="form-group">
            <label>Email address</label>
            <input type="email" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>

          <button type="submit" disabled={loading} className="auth-submit-btn">
            {loading ? 'Verifying…' : 'Sign in'}
          </button>
        </form>

        <p className="auth-switch">Not a business admin? <Link to="/realestate" className="auth-inline-link">Browse properties instead</Link></p>
      </div>
    </div>
  );
};

export default RealEstateAdminLogin;
