import React, { useState, useEffect } from 'react';

const Navbar = ({ onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Directly track screen width via JavaScript to force layout updates
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 868);
    };
    
    // Set initial size
    handleResize();
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      <style>{`
        .my-navbar-container {
          display: flex !important;
          flex-direction: row !important;
          justify-content: space-between !important;
          align-items: center !important;
          padding: 0.6rem 2rem !important;
          background-color: #ffffff !important;
          border-bottom: 1px solid #f1f5f9 !important;
          box-sizing: border-box !important;
          width: 100% !important;
          position: relative !important;
        }

        .my-navbar-logo {
          font-size: 1.35rem !important;
          font-weight: 700 !important;
          color: #1e293b !important;
          cursor: pointer !important;
          white-space: nowrap !important;
        }

        .my-navbar-logo span {
          color: #4f46e5 !important;
        }

        .my-search-wrapper {
          display: flex !important;
          align-items: center !important;
          position: relative !important;
          width: 100% !important;
          max-width: 360px !important;
          margin: 0 1.5rem !important;
        }

        .my-search-input {
          width: 100% !important;
          padding: 0.45rem 2.2rem 0.45rem 1.25rem !important;
          border: 1px solid #cbd5e1 !important;
          border-radius: 9999px !important;
          background-color: #f8fafc !important;
          font-size: 0.88rem !important;
          outline: none !important;
          color: #334155 !important;
        }

        .my-search-icon {
          position: absolute !important;
          right: 14px !important;
          color: #64748b !important;
          font-size: 0.9rem !important;
          cursor: pointer !important;
        }

        /* Desktop Menu Style */
        .my-nav-items-row {
          display: flex !important;
          flex-direction: row !important;
          align-items: center !important;
          gap: 1.5rem !important;
          margin: 0 !important;
          padding: 0 !important;
          list-style: none !important;
        }

        /* Mobile/Tablet Dropdown Override Menu */
        .my-nav-items-row.mobile-active {
          display: flex !important;
          flex-direction: column !important;
          position: absolute !important;
          top: 100% !important;
          left: 0 !important;
          width: 100% !important;
          background-color: #ffffff !important;
          padding: 1.5rem 0 !important;
          gap: 1.25rem !important;
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1) !important;
          border-top: 1px solid #f1f5f9 !important;
          z-index: 2000 !important;
        }

        .my-nav-items-row li {
          list-style: none !important;
          font-size: 0.95rem !important;
          color: #475569 !important;
          font-weight: 500 !important;
          cursor: pointer !important;
          white-space: nowrap !important;
        }

        .my-nav-items-row.mobile-active li {
          width: 100% !important;
          text-align: center !important;
          padding: 0.25rem 0 !important;
        }

        .my-signup-button {
          background-color: #0f172a !important;
          color: #ffffff !important;
          border: none !important;
          padding: 0.5rem 1.4rem !important;
          border-radius: 9999px !important;
          font-weight: 600 !important;
          font-size: 0.88rem !important;
          cursor: pointer;
        }

        /* The 3-lines menu graphic icon container */
        .my-menu-hamburger {
          display: flex !important;
          flex-direction: column !important;
          justify-content: space-between !important;
          width: 22px !important;
          height: 15px !important;
          cursor: pointer !important;
        }

        .my-menu-hamburger span {
          width: 100% !important;
          height: 2px !important;
          background-color: #0f172a !important;
          border-radius: 2px !important;
        }
      `}</style>

      <nav className="my-navbar-container">
        {/* Left Side Brand Logo */}
        <div className="my-navbar-logo" onClick={() => onNavigate('landing')}>
          yourworldcometrue<span>.com</span>
        </div>

        {/* Center Section: Search bar automatically morphs into a single lens icon on mobile layout */}
        <div className="my-search-wrapper" style={{ maxWidth: isMobile ? 'fit-content' : '360px', margin: isMobile ? '0' : '0 1.5rem' }}>
          {!isMobile && (
            <input 
              type="text" 
              placeholder="Search for products, brands, and more..." 
              className="my-search-input"
            />
          )}
          <span className="my-search-icon" style={{ position: isMobile ? 'static' : 'absolute', fontSize: isMobile ? '1.3rem' : '0.9rem' }}>🔍</span>
        </div>

        {/* Right Navigation Menu - Toggles view cleanly based on size and state */}
        {(!isMobile || mobileMenuOpen) && (
          <ul className={`my-nav-items-row ${isMobile ? 'mobile-active' : ''}`}>
            <li onClick={() => { onNavigate('landing'); setMobileMenuOpen(false); }}>Home</li>
            <li>Shop</li>
            <li>Categories</li>
            <li>Deals</li>
            <li onClick={() => { onNavigate('login'); setMobileMenuOpen(false); }}>Login</li>
            <li>
              <button className="my-signup-button" onClick={() => { onNavigate('signup'); setMobileMenuOpen(false); }}>
                Sign Up
              </button>
            </li>
          </ul>
        )}

        {/* Rightmost 3 lines Hamburger Icon handles viewport toggle actions for tablets and mobile devices */}
        {isMobile && (
          <div className="my-menu-hamburger" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;