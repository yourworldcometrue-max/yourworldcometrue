import React, { useState } from 'react';
import { supabase } from '/src/supabaseClient';
import '../styles/auth.css';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    // 1. Core authentication account registration with Supabase
    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      setMessage(`❌ ${authError.message}`);
      setLoading(false);
      return;
    }

    // 2. Link account with custom application metadata row (Username profile)
    if (data.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: data.user.id,
            username: username.toLowerCase().trim(),
            full_name: fullName,
            updated_at: new Date(),
          },
        ]);

      if (profileError) {
        setMessage(`❌ Profile creation issue: ${profileError.message}`);
      } else {
        setMessage('✨ Account registered! Check your email inbox for a verification confirmation link.');
        // Optional clearing of state values on execution success
        setEmail('');
        setPassword('');
        setUsername('');
        setFullName('');
      }
    }
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Join yourworldcometrue<span>.com</span></h2>
        <p className="auth-subtitle">Create a global profile handle to start interacting</p>
        
        {message && <div className="auth-alert">{message}</div>}

        <form onSubmit={handleSignupSubmit} className="auth-form">
          <div className="form-group">
            <label>Choose Username</label>
            <input 
              type="text" 
              placeholder="e.g., vlogger_96" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              required 
            />
          </div>

          <div className="form-group">
            <label>Full Name</label>
            <input 
              type="text" 
              placeholder="Your Name" 
              value={fullName} 
              onChange={(e) => setFullName(e.target.value)} 
              required 
            />
          </div>

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

          <button type="submit" disabled={loading} className="auth-submit-btn">
            {loading ? 'Processing...' : 'Sign Up Globally ✨'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;