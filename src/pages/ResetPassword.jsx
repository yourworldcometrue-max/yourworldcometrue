import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import '../styles/auth.css';

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match. Please try again.');
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      setMessage(`${error.message}`);
    } else {
      setMessage('Password updated. Redirecting to login…');
      setTimeout(() => navigate('/login'), 2200);
    }
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Set a new password</h2>
        <p className="auth-subtitle">Choose a new secure password for your account</p>

        {message && <div className="auth-alert">{message}</div>}

        <form onSubmit={handlePasswordUpdate} className="auth-form">
          <div className="form-group form-group-icon">
            <label>New password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <button type="button" className="field-icon-btn" onClick={() => setShowPassword((s) => !s)} aria-label="Toggle password visibility">
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>

          <div className="form-group form-group-icon">
            <label>Confirm new password</label>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button type="button" className="field-icon-btn" onClick={() => setShowConfirmPassword((s) => !s)} aria-label="Toggle password visibility">
              {showConfirmPassword ? '🙈' : '👁️'}
            </button>
          </div>

          <button type="submit" disabled={loading} className="auth-submit-btn">
            {loading ? 'Updating…' : 'Confirm'}
          </button>
        </form>
      </div>
    </div>
  );
}
