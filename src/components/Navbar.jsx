import React, { useState } from 'react';
import '/src/styles/navbar.css';

export default function Navbar({ onNavigate }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <nav className="site-navbar">
      {/* MAIN NAVBAR ROW CONTAINER */}
      <div className="navbar-container">
        
        {/* LOGO SECTION */}
        <div 
          className="navbar-logo" 
          onClick={() => onNavigate && onNavigate('landing')} 
          style={{ cursor: 'pointer' }}
        >
          yourworldcometrue.com
        </div>

        {/* SEARCH CONTAINER */}
        <div className="navbar-search-wrapper">
          <div className="search-box-relative">
            <input
              type="text"
              placeholder="Search for products, brands, and more..."
              className="search-input-field"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <span className="search-icon-right">🔍</span>
          </div>
        </div>

        {/* DESKTOP NAVIGATION LINKS & ACTIONS SECTION */}
        <div className="navbar-desktop-actions">
          <div className="navbar-links-desktop">
            <a href="#home" onClick={() => onNavigate && onNavigate('landing')}>Home</a>
            <a href="/shop">Shop</a>
            <a href="/categories">Categories</a>
            <a href="/deals">Deals</a>
            {/* Login button calls state change instead of a broken href link */}
            <button 
              onClick={() => onNavigate && onNavigate('login')} 
              className="login-link" 
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            >
              Login
            </button>
          </div>
          {/* Sign Up button calls state change */}
          <button 
            onClick={() => onNavigate && onNavigate('signup')} 
            className="signup-button-pill" 
            style={{ border: 'none', cursor: 'pointer' }}
          >
            Sign Up
          </button>
        </div>

        {/* MOBILE & TABLET THREE-LINE HAMBURGER TRIGGER */}
        <button 
          onClick={() => setMenuOpen(!menuOpen)} 
          className="mobile-hamburger-trigger"
          aria-label="Toggle Menu"
        >
          <div className={`hamburger-bar ${menuOpen ? 'rotate-top' : ''}`}></div>
          <div className={`hamburger-bar ${menuOpen ? 'hide-middle' : ''}`}></div>
          <div className={`hamburger-bar ${menuOpen ? 'rotate-bottom' : ''}`}></div>
        </button>

      </div>

      {/* MOBILE & TABLET EXPANDABLE DROPDOWN LINK DRAWER */}
      {menuOpen && (
        <div className="mobile-menu-drawer">
          <a href="#home" onClick={() => { onNavigate && onNavigate('landing'); setMenuOpen(false); }}>Home</a>
          <a href="/shop" onClick={() => setMenuOpen(false)}>Shop</a>
          <a href="/categories" onClick={() => setMenuOpen(false)}>Categories</a>
          <a href="/deals" onClick={() => setMenuOpen(false)}>Deals</a>
          <button 
            onClick={() => { onNavigate && onNavigate('login'); setMenuOpen(false); }} 
            style={{ textAlign: 'left', background: 'none', border: 'none', padding: '14px 1.5rem', fontSize: '0.95rem', fontWeight: '500', color: '#334155', cursor: 'pointer', borderBottom: '1px solid #f1f5f9' }}
          >
            Login
          </button>
          <div className="mobile-drawer-footer">
            <button 
              onClick={() => { onNavigate && onNavigate('signup'); setMenuOpen(false); }} 
              className="mobile-signup-pill-link"
              style={{ width: '100%', border: 'none', cursor: 'pointer' }}
            >
              Sign Up
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}