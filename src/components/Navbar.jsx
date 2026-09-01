/*import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import '../styles/navbar.css';

const NAV_LINKS = [
  { label: 'Shop', to: '/shop' },
  { label: 'Travel', to: '/travel' },
  { label: 'Food', to: '/food' },
  { label: 'Health', to: '/health' },
  { label: 'Deals', to: '/deals' },
];

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data?.user ?? null));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setMenuOpen(false);
    navigate('/');
  };

  return (
    <header className="navbar">
      <div className="navbar-inner container">
        <Link to="/" className="navbar-brand" onClick={() => setMenuOpen(false)}>
          Your World <span>Come True</span>
        </Link>

        <nav className="navbar-links navbar-links-desktop" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <Link key={link.to} to={link.to} className="navbar-link">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="navbar-actions navbar-actions-desktop">
          {user ? (
            <>
              <Link to="/dashboard" className="navbar-link">Dashboard</Link>
              <button className="btn btn-ghost" onClick={handleLogout}>Log out</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost">Log in</Link>
              <Link to="/signup" className="btn btn-primary">Sign up</Link>
            </>
          )}
        </div>

        <button
          className={`navbar-toggle ${menuOpen ? 'is-open' : ''}`}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((o) => !o)}
        >
          <span /><span /><span />
        </button>
      </div>

      <div className={`navbar-mobile ${menuOpen ? 'is-open' : ''}`}>
        <nav className="navbar-mobile-links" aria-label="Mobile">
          {NAV_LINKS.map((link) => (
            <Link key={link.to} to={link.to} className="navbar-mobile-link" onClick={() => setMenuOpen(false)}>
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="navbar-mobile-actions">
          {user ? (
            <>
              <Link to="/dashboard" className="btn btn-primary" onClick={() => setMenuOpen(false)}>Dashboard</Link>
              <button className="btn btn-ghost-inverse" onClick={handleLogout}>Log out</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost-inverse" onClick={() => setMenuOpen(false)}>Log in</Link>
              <Link to="/signup" className="btn btn-primary" onClick={() => setMenuOpen(false)}>Sign up</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;*/

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import AiAgentModal from './AiAgentModal';
import '../styles/navbar.css';

const NAV_LINKS = [
  { label: 'Shop', to: '/shop' },
  { label: 'Travel', to: '/travel' },
  { label: 'Food', to: '/food' },
  { label: 'Health', to: '/health' },
  { label: 'Deals', to: '/deals' },
  { label: 'AI', isAi: true },
];

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data?.user ?? null));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setMenuOpen(false);
    navigate('/');
  };

  const handleSelectAiOption = (optionId) => {
    if (optionId === 'chat') {
      console.log('Selected: Chat');
    } else if (optionId === 'image-to-image') {
      console.log('Selected: Image to Image');
    } else if (optionId === 'image-to-video') {
      console.log('Selected: Image to Video');
    }
  };

  return (
    <>
      <header className="navbar">
        <div className="navbar-inner container">
          <Link to="/" className="navbar-brand" onClick={() => setMenuOpen(false)}>
            Your World <span>Come True</span>
          </Link>

          <nav className="navbar-links navbar-links-desktop" aria-label="Primary">
            {NAV_LINKS.map((link) =>
              link.isAi ? (
                <button
                  key="ai-btn"
                  type="button"
                  className="navbar-link navbar-ai-btn"
                  onClick={() => setIsAiModalOpen(true)}
                >
                  {link.label}
                </button>
              ) : (
                <Link key={link.to} to={link.to} className="navbar-link">
                  {link.label}
                </Link>
              )
            )}
          </nav>

          <div className="navbar-actions navbar-actions-desktop">
            {user ? (
              <>
                <Link to="/dashboard" className="navbar-link">Dashboard</Link>
                <button className="btn btn-ghost" onClick={handleLogout}>Log out</button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-ghost">Log in</Link>
                <Link to="/signup" className="btn btn-primary">Sign up</Link>
              </>
            )}
          </div>

          <button
            className={`navbar-toggle ${menuOpen ? 'is-open' : ''}`}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
          >
            <span /><span /><span />
          </button>
        </div>

        <div className={`navbar-mobile ${menuOpen ? 'is-open' : ''}`}>
          <nav className="navbar-mobile-links" aria-label="Mobile">
            {NAV_LINKS.map((link) =>
              link.isAi ? (
                <button
                  key="ai-btn-mobile"
                  type="button"
                  className="navbar-mobile-link navbar-ai-btn-mobile"
                  onClick={() => {
                    setMenuOpen(false);
                    setIsAiModalOpen(true);
                  }}
                >
                  {link.label}
                </button>
              ) : (
                <Link
                  key={link.to}
                  to={link.to}
                  className="navbar-mobile-link"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>

          <div className="navbar-mobile-actions">
            {user ? (
              <>
                <Link to="/dashboard" className="btn btn-primary" onClick={() => setMenuOpen(false)}>
                  Dashboard
                </Link>
                <button className="btn btn-ghost-inverse" onClick={handleLogout}>Log out</button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-ghost-inverse" onClick={() => setMenuOpen(false)}>
                  Log in
                </Link>
                <Link to="/signup" className="btn btn-primary" onClick={() => setMenuOpen(false)}>
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <AiAgentModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        onSelectOption={handleSelectAiOption}
      />
    </>
  );
};

export default Navbar;
