import React, { useState } from 'react';
import { supabase } from '/src/supabaseClient';
import '/src/styles/auth.css'; 

export default function ForgotPassword({ onNavigate }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSendResetEmail = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    // Dynamically captures the current running domain (localhost:5174 OR your Vercel URL)
    const currentDomain = window.location.origin; 

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${currentDomain}/`, // Dynamically routes the email link back to the source environment
    });

    if (error) {
      setMessage(`❌ ${error.message}`);
    } else {
      setMessage(`✨ Recovery link sent! Check the inbox for ${email}.`);
    }
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-page-wrapper">
        {/* ADDED: Back button to return to the login screen easily */}
        <button 
          onClick={() => onNavigate && onNavigate('login')} 
          className="back-to-home-btn"
          style={{ marginBottom: '20px' }}
        >
          ⬅️ Back to Login
        </button>

        <div className="auth-card">
          <h2>Reset Password<span>.com</span></h2>
          <p className="auth-subtitle">Get a secure recovery link for your account</p>

          {message && <div className="auth-alert">{message}</div>}

          <form onSubmit={handleSendResetEmail} className="auth-form">
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button type="submit" disabled={loading} className="auth-submit-btn">
              {loading ? 'Sending Link...' : 'Send Recovery Link'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}