import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import '../styles/auth.css';

// Shown right after a Google sign-in/sign-up, since Google only hands us
// name + email automatically — username and a recovery email need asking.
export default function CompleteProfile() {
  const [checkingUser, setCheckingUser] = useState(true);
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [alternateEmail, setAlternateEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const loadUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        navigate('/login');
        return;
      }

      // If a profile with a username already exists, there's nothing left to complete
      const { data: existing } = await supabase
        .from('profiles')
        .select('username, full_name, alternate_email')
        .eq('id', user.id)
        .maybeSingle();

      if (existing?.username) {
        navigate('/');
        return;
      }

      setFullName(existing?.full_name || user.user_metadata?.full_name || '');
      setCheckingUser(false);
    };
    loadUser();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/login');
      return;
    }

    const { error } = await supabase.from('profiles').upsert({
      id: user.id,
      username: username.toLowerCase().trim(),
      full_name: fullName,
      alternate_email: alternateEmail.trim() || null,
      updated_at: new Date(),
    });

    if (error) {
      setMessage(`Couldn't save your profile: ${error.message}`);
      setLoading(false);
      return;
    }

    navigate('/');
  };

  if (checkingUser) {
    return (
      <div className="auth-container">
        <div className="auth-card"><p className="auth-subtitle">Loading…</p></div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Almost there</h2>
        <p className="auth-subtitle">Just a username, and a recovery email if you'd like one</p>

        {message && <div className="auth-alert">{message}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Username</label>
            <input type="text" placeholder="e.g. jordan_96" value={username} onChange={(e) => setUsername(e.target.value)} required />
          </div>

          <div className="form-group">
            <label>Full name</label>
            <input type="text" placeholder="Your name" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
          </div>

          <div className="form-group">
            <label>Alternate email <span className="field-optional">(for account recovery)</span></label>
            <input type="email" placeholder="backup@example.com" value={alternateEmail} onChange={(e) => setAlternateEmail(e.target.value)} />
          </div>

          <button type="submit" disabled={loading} className="auth-submit-btn">
            {loading ? 'Saving…' : 'Save and continue'}
          </button>
        </form>
      </div>
    </div>
  );
}
