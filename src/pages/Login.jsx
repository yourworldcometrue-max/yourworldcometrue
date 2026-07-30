import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import '../styles/auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setMessage(`Couldn't sign you in: ${error.message}`);
    } else {
      setMessage('Welcome back.');
      navigate('/');
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/complete-profile` },
    });
    if (error) setMessage(`Google login failed: ${error.message}`);
  };

  return (
    <div className="auth-container">
      <Link to="/" className="back-to-home-btn">← Back to home</Link>
      <div className="auth-card">
        <h2>Welcome back</h2>
        <p className="auth-subtitle">Log in to pick up where you left off</p>

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

          <div className="auth-forgot-row">
            <Link to="/forgot-password" className="auth-inline-link">Forgot password?</Link>
          </div>

          <button type="submit" disabled={loading} className="auth-submit-btn">
            {loading ? 'Verifying…' : 'Sign in'}
          </button>
        </form>

        <div className="auth-divider"><span>or continue with</span></div>

        <div className="social-auth-grid social-auth-grid-single">
          <button onClick={handleGoogleLogin} className="social-btn social-btn-google">
            <span className="social-btn-icon" aria-hidden="true">G</span>
            Continue with Google
          </button>
        </div>

        <p className="auth-switch">New here? <Link to="/signup" className="auth-inline-link">Create an account</Link></p>
      </div>
    </div>
  );
};

export default Login;
