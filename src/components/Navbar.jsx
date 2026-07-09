import React, { useState } from 'react';
import '/src/styles/navbar.css';

export default function Navbar({ onNavigate }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleNav = (page) => {
    if (onNavigate) onNavigate(page);
    setMenuOpen(false);
    setSearchOpen(false);
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
            <a href="/categories">Categories</a>
            <a href="/deals">Deals</a>
            <button 
              onClick={() => handleNav('login')} 
              className="login-link" 
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            >
              Login
            </button>
          </div>
          <button 
            onClick={() => handleNav('signup')} 
            className="signup-button-pill" 
            style={{ border: 'none', cursor: 'pointer' }}
          >
            Sign Up
          </button>
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
          <div className="search-box-relative w-full">
            <input
              type="text"
              placeholder="Search for products, brands..."
              className="search-input-field for-mobile"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')} 
                className="search-clear-action-btn"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      )}

      {/* MOBILE & TABLET EXPANDABLE DROPDOWN LINK DRAWER */}
      {menuOpen && (
        <div className="mobile-menu-drawer">
          <a href="#home" onClick={() => handleNav('landing')}>Home</a>
          <a href="/shop" onClick={() => setMenuOpen(false)}>Shop</a>
          <a href="/categories" onClick={() => setMenuOpen(false)}>Categories</a>
          <a href="/deals" onClick={() => setMenuOpen(false)}>Deals</a>
          <button 
            onClick={() => handleNav('login')} 
            style={{ textAlign: 'left', background: 'none', border: 'none', padding: '14px 1.5rem', fontSize: '0.95rem', fontWeight: '500', color: '#334155', cursor: 'pointer', borderBottom: '1px solid #f1f5f9', width: '100%' }}
          >
            Login
          </button>
          <div className="mobile-drawer-footer">
            <button 
              onClick={() => handleNav('signup')} 
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