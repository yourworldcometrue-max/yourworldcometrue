import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import '../styles/auth.css';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [alternateEmail, setAlternateEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const { data, error: authError } = await supabase.auth.signUp({ email, password });

    if (authError) {
      setMessage(`${authError.message}`);
      setLoading(false);
      return;
    }

    if (data.user) {
      const { error: profileError } = await supabase.from('profiles').insert([
        {
          id: data.user.id,
          username: username.toLowerCase().trim(),
          full_name: fullName,
          alternate_email: alternateEmail.trim() || null,
          updated_at: new Date(),
        },
      ]);

      if (profileError) {
        setMessage(`Account created, but profile setup failed: ${profileError.message}`);
      } else {
        setMessage('Account created — check your inbox to verify your email.');
        setEmail('');
        setPassword('');
        setUsername('');
        setFullName('');
        setAlternateEmail('');
      }
    }
    setLoading(false);
  };

  const handleGoogleSignup = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/complete-profile` },
    });
    if (error) setMessage(`Google sign-up failed: ${error.message}`);
  };

  return (
    <div className="auth-container">
      <Link to="/" className="back-to-home-btn">← Back to home</Link>
      <div className="auth-card">
        <h2>Join Your World Come True</h2>
        <p className="auth-subtitle">Sign up with Google, or fill in your details below</p>

        {message && <div className="auth-alert">{message}</div>}

        <div className="social-auth-grid social-auth-grid-single">
          <button onClick={handleGoogleSignup} className="social-btn social-btn-google">
            <span className="social-btn-icon" aria-hidden="true">G</span>
            Continue with Google
          </button>
        </div>

        <div className="auth-divider"><span>or sign up with details</span></div>

        <form onSubmit={handleSignupSubmit} className="auth-form">
          <div className="form-group">
            <label>Username</label>
            <input type="text" placeholder="e.g. jordan_96" value={username} onChange={(e) => setUsername(e.target.value)} required />
          </div>

          <div className="form-group">
            <label>Full name</label>
            <input type="text" placeholder="Your name" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
          </div>

          <div className="form-group">
            <label>Email address</label>
            <input type="email" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <div className="form-group">
            <label>Alternate email <span className="field-optional">(for account recovery)</span></label>
            <input type="email" placeholder="backup@example.com" value={alternateEmail} onChange={(e) => setAlternateEmail(e.target.value)} />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>

          <button type="submit" disabled={loading} className="auth-submit-btn">
            {loading ? 'Creating account…' : 'Sign up'}
          </button>
        </form>

        <p className="auth-switch">Already have an account? <Link to="/login" className="auth-inline-link">Log in</Link></p>
      </div>
    </div>
  );
};

export default Signup;
