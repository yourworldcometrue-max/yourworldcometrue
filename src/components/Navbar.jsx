import React, { useState } from 'react';
import '../styles/navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        yourworldcometrue<span>.</span>
      </div>

      <div className="navbar-search">
        <input type="text" placeholder="Search for products, brands, and more..." />
        <button className="search-btn">🔍</button>
      </div>

      {/* The links container dynamically adds the 'active' class when open */}
      <div className={`navbar-links ${isMenuOpen ? 'active' : ''}`}>
        <a href="/">Home</a>
        <a href="/shop">Shop</a>
        <a href="/categories">Categories</a>
        <a href="/deals">Deals</a>
        <a href="/login" className="login-link">Login</a>
        <a href="/signup" className="signup-btn">Sign Up</a>
      </div>

      {/* Hamburger Menu Icon for Mobile */}
      <button className="hamburger-menu" onClick={toggleMenu} aria-label="Toggle navigation">
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </button>
    </nav>
  );
};

export default Navbar;