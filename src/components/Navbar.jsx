import React, { useState } from 'react';
import '../styles/navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-header-main">
        {/* Logo */}
        <div className="navbar-logo">
          yourworldcometrue<span>.</span>
        </div>

        {/* Action Controls for Mobile Header */}
        <div className="navbar-mobile-controls">
          <button 
            className="mobile-search-toggle" 
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            aria-label="Toggle Search"
          >
            🔍
          </button>
          
          <button 
            className="hamburger-menu" 
            onClick={() => setIsMenuOpen(!isMenuOpen)} 
            aria-label="Toggle Navigation"
          >
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </button>
        </div>
      </div>

      {/* Desktop & Mobile Responsive Search Bar Container */}
      <div className={`navbar-search ${isSearchOpen ? 'search-active' : ''}`}>
        <input type="text" placeholder="Search for products, brands, and more..." />
        {isSearchOpen && (
          <button className="clear-search-btn" onClick={() => setIsSearchOpen(false)}>✕</button>
        )}
        <button className="search-btn">🔍</button>
      </div>

      {/* Navigation Menu Link Drawer */}
      <div className={`navbar-links ${isMenuOpen ? 'active' : ''}`}>
        <a href="/">Home</a>
        <a href="/shop">Shop</a>
        <a href="/categories">Categories</a>
        <a href="/deals">Deals</a>
        <a href="/login" className="login-link">Login</a>
        <a href="/signup" className="signup-btn">Sign Up</a>
      </div>
    </nav>
  );
};

export default Navbar;