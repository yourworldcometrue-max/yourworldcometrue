import React, { useState } from 'react';
import { supabase } from '/src/supabaseClient';
import '/src/styles/auth.css';

export default function ResetPassword({ onNavigate }) {
  const [newPassword, setNewPassword] = useState('');
  // ADDED: State for confirming the second password input field
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // ADDED: Individual eye visibility controls for opening/closing the text values
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    // ADDED: Condition checks to assure both values match perfectly
    if (newPassword !== confirmPassword) {
      setMessage('❌ Passwords do not match. Please try again.');
      setLoading(false);
      return;
    }

    // Updates the password for the active recovery session
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      setMessage(`❌ Error: ${error.message}`);
    } else {
      setMessage('🎉 Password updated successfully! Redirecting to login...');
      setTimeout(() => {
        if (onNavigate) onNavigate('login');
      }, 2500);
    }
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Set New Password<span>.com</span></h2>
        <p className="auth-subtitle">Type your brand new secure password below</p>

        {message && <div className="auth-alert">{message}</div>}

        <form onSubmit={handlePasswordUpdate} className="auth-form">
          {/* Input field 1: New Password */}
          <div className="form-group" style={{ position: 'relative' }}>
            <label>New Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <span 
              onClick={() => setShowPassword(!showPassword)}
              style={{ position: 'absolute', right: '12px', top: '38px', cursor: 'pointer', fontSize: '1.1rem' }}
            >
              {showPassword ? '👁️' : '🙈'}
            </span>
          </div>

          {/* ADDED: Input field 2: Confirm New Password */}
          <div className="form-group" style={{ position: 'relative' }}>
            <label>Confirm New Password</label>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <span 
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              style={{ position: 'absolute', right: '12px', top: '38px', cursor: 'pointer', fontSize: '1.1rem' }}
            >
              {showConfirmPassword ? '👁️' : '🙈'}
            </span>
          </div>

          <button type="submit" disabled={loading} className="auth-submit-btn">
            {loading ? 'Updating...' : 'Confirm'}
          </button>
        </form>
      </div>
    </div>
  );
}