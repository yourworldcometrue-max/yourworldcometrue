import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient'; // Imported Supabase Client
import '/src/styles/navbar.css';

export default function Navbar({ onNavigate }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Added Authentication States
  const [user, setUser] = useState(null);
  const [firstName, setFirstName] = useState("");

  // Added state listener loop to catch active login sessions
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      handleUserSession(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      handleUserSession(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleUserSession = (currentUser) => {
    setUser(currentUser);
    if (currentUser) {
      const emailPrefix = currentUser.email.split('@')[0];
      setFirstName(emailPrefix.charAt(0).toUpperCase() + emailPrefix.slice(1));
    } else {
      setFirstName("");
    }
  };

  // UPDATED: Now clears out view metrics and forces redirect out of the Deals view on logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    handleNav('landing');
    window.location.reload(); // Instantly wipes any lingering cache/state arrays from the screen
  };

  const handleNav = (page) => {
    if (onNavigate) onNavigate(page);
    setMenuOpen(false);
    setSearchOpen(false);
  };

  // Triggers the Google Search in a new browser tab
  const executeGoogleSearch = (e) => {
    if (e) e.preventDefault(); // Prevents the page from refreshing on submit
    if (!searchQuery.trim()) return;
    
    const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;
    window.open(googleSearchUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <nav className="site-navbar">
      {/* MAIN NAVBAR ROW CONTAINER */}
      <div className="navbar-container">
        
        {/* LOGO SECTION */}
        <div 
          className="navbar-logo" 
          onClick={() => handleNav('landing')} 
          style={{ cursor: 'pointer' }}
        >
          yourworldcometrue.com
        </div>

        {/* DESKTOP SEARCH CONTAINER */}
        <div className="navbar-search-wrapper desktop-only">
          <form onSubmit={executeGoogleSearch} className="search-box-relative">
            <input
              type="text"
              placeholder="Search for products, brands, and more..."
              className="search-input-field"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button 
              type="submit"
              className="search-icon-right" 
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            >
              🔍
            </button>
          </form>
        </div>

        {/* ACTIONS & NAVIGATION LINKS */}
        <div className="navbar-desktop-actions">
          {/* Mobile-only Search Button Glass */}
          <button 
            onClick={() => { setSearchOpen(!searchOpen); setMenuOpen(false); }} 
            className="mobile-search-glass-trigger"
            aria-label="Toggle Search"
          >
            🔍
          </button>

          <div className="navbar-links-desktop">
            <a href="#home" onClick={() => handleNav('landing')}>Home</a>
            <a href="/shop">Shop</a>
            <a href="/categories" onClick={() => handleNav('landing')}>Categories</a>
            <a href="/deals">Deals</a>
            
            {/* CONDITIONAL AUTH INTEGRATION FOR DESKTOP */}
            {user ? (
              <span style={{ color: '#334155', fontWeight: '600', marginLeft: '10px' }}>
                👋 Hi, {firstName}!
              </span>
            ) : (
              <button 
                onClick={() => handleNav('login')} 
                className="login-link" 
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              >
                Login
              </button>
            )}
          </div>

          {user ? (
            <button 
              onClick={handleLogout} 
              className="signup-button-pill" 
              style={{ border: 'none', cursor: 'pointer', backgroundColor: '#ef4444' }}
            >
              Logout
            </button>
          ) : (
            <button 
              onClick={() => handleNav('signup')} 
              className="signup-button-pill" 
              style={{ border: 'none', cursor: 'pointer' }}
            >
              Sign Up
            </button>
          )}
        </div>

        {/* MOBILE & TABLET THREE-LINE HAMBURGER TRIGGER */}
        <button 
          onClick={() => { setMenuOpen(!menuOpen); setSearchOpen(false); }} 
          className="mobile-hamburger-trigger"
          aria-label="Toggle Menu"
        >
          <div className={`hamburger-bar ${menuOpen ? 'rotate-top' : ''}`}></div>
          <div className={`hamburger-bar ${menuOpen ? 'hide-middle' : ''}`}></div>
          <div className={`hamburger-bar ${menuOpen ? 'rotate-bottom' : ''}`}></div>
        </button>

      </div>

      {/* MOBILE EXPANDED SEARCH BAR OVERLAY */}
      {searchOpen && (
        <div className="mobile-search-overlay-bar">
          <form onSubmit={executeGoogleSearch} className="search-box-relative w-full">
            <input
              type="text"
              placeholder="Search for products, brands..."
              className="search-input-field for-mobile"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
            {searchQuery ? (
              <button 
                type="button"
                onClick={() => setSearchQuery('')} 
                className="search-clear-action-btn"
              >
                ✕
              </button>
            ) : (
              <button 
                type="submit"
                className="search-icon-right"
                style={{ right: '16px', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              >
                🔍
              </button>
            )}
          </form>
        </div>
      )}

      {/* MOBILE & TABLET EXPANDABLE DROPDOWN LINK DRAWER */}
      {menuOpen && (
        <div className="mobile-menu-drawer">
          <a href="#home" onClick={() => handleNav('landing')}>Home</a>
          <a href="/shop" onClick={() => setMenuOpen(false)}>Shop</a>
          <a href="/categories" onClick={() => handleNav('landing')}>Categories</a>
          <a href="/deals" onClick={() => setMenuOpen(false)}>Deals</a>
          
          {/* CONDITIONAL AUTH INTEGRATION FOR MOBILE DRAWER */}
          {user ? (
            <div style={{ padding: '14px 1.5rem', fontSize: '0.95rem', fontWeight: '600', color: '#0f172a', borderBottom: '1px solid #f1f5f9' }}>
              👋 Hi, {firstName}!
            </div>
          ) : (
            <button 
              onClick={() => handleNav('login')} 
              style={{ textAlign: 'left', background: 'none', border: 'none', padding: '14px 1.5rem', fontSize: '0.95rem', fontWeight: '500', color: '#334155', cursor: 'pointer', borderBottom: '1px solid #f1f5f9', width: '100%' }}
            >
              Login
            </button>
          )}

          <div className="mobile-drawer-footer">
            {user ? (
              <button 
                onClick={handleLogout} 
                className="mobile-signup-pill-link"
                style={{ width: '100%', border: 'none', cursor: 'pointer', backgroundColor: '#ef4444' }}
              >
                Logout
              </button>
            ) : (
              <button 
                onClick={() => handleNav('signup')} 
                className="mobile-signup-pill-link"
                style={{ width: '100%', border: 'none', cursor: 'pointer' }}
              >
                Sign Up
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}