import React, { useState } from 'react';
// 1. FIXED PATH: Point straight to the root src directory
import { supabase } from '/src/supabaseClient';
// 2. FIXED PATH: Point straight to the root styles directory
import '/src/styles/auth.css';

// UPDATED: Destructured onNavigate from props here
const Login = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(`❌ ${error.message}`);
    } else {
      setMessage('✨ Login successful! Welcome back.');
      // UPDATED: Automatically kick user back to the landing view upon successful login
      if (onNavigate) {
        onNavigate('landing');
      }
    }
    setLoading(false);
  };

  const handleSocialLogin = async (provider) => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: provider,
    });
    if (error) setMessage(`❌ ${provider} login failed: ${error.message}`);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Welcome Back<span>.com</span></h2>
        <p className="auth-subtitle">Log in to interact with your global community</p>
        
        {message && <div className="auth-alert">{message}</div>}

        <form onSubmit={handleLoginSubmit} className="auth-form">
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

          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>

          {/* UPDATED: Embedded Forgot Password utility link right under the input field */}
          <div style={{ textAlign: 'right', marginTop: '-10px', marginBottom: '20px' }}>
            <span 
              onClick={() => onNavigate && onNavigate('forgot-password')} 
              style={{ 
                color: '#2563eb', 
                cursor: 'pointer', 
                fontSize: '0.85rem', 
                fontWeight: '500',
                textDecoration: 'underline'
              }}
            >
              Forgot Password?
            </span>
          </div>

          <button type="submit" disabled={loading} className="auth-submit-btn">
            {loading ? 'Verifying...' : 'Sign In'}
          </button>
        </form>

        <div className="auth-divider">
          <span>or connect via</span>
        </div>

        <div className="social-auth-grid">
          <button onClick={() => handleSocialLogin('google')} className="social-btn google-btn">
            Google
          </button>
          <button onClick={() => handleSocialLogin('facebook')} className="social-btn facebook-btn">
            Facebook
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;