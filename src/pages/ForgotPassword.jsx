import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import '../styles/auth.css';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSendResetEmail = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const currentDomain = window.location.origin;
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${currentDomain}/`,
    });

    if (error) {
      setMessage(`${error.message}`);
    } else {
      setMessage(`Recovery link sent — check the inbox for ${email}.`);
    }
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <Link to="/login" className="back-to-home-btn">← Back to login</Link>
      <div className="auth-card">
        <h2>Reset your password</h2>
        <p className="auth-subtitle">We'll send a secure recovery link to your email</p>

        {message && <div className="auth-alert">{message}</div>}

        <form onSubmit={handleSendResetEmail} className="auth-form">
          <div className="form-group">
            <label>Email address</label>
            <input type="email" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <button type="submit" disabled={loading} className="auth-submit-btn">
            {loading ? 'Sending…' : 'Send recovery link'}
          </button>
        </form>
      </div>
    </div>
  );
}
