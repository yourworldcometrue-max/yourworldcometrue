import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/footer.css';

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <p className="footer-logo">Your World <span>Come True</span></p>
          <p className="footer-tagline">Everything you need, nothing you don't.</p>
        </div>

        <div className="footer-links">
          <div className="footer-col">
            <p className="footer-col-title">Explore</p>
            <Link to="/shop">Shop</Link>
            <Link to="/travel">Travel</Link>
            <Link to="/food">Food</Link>
            <Link to="/health">Health</Link>
          </div>
          <div className="footer-col">
            <p className="footer-col-title">More</p>
            <Link to="/education">Learn</Link>
            <Link to="/news">News</Link>
            <Link to="/finance">Finance</Link>
            <Link to="/deals">Deals</Link>
          </div>
          <div className="footer-col">
            <p className="footer-col-title">Account</p>
            <Link to="/login">Log in</Link>
            <Link to="/signup">Sign up</Link>
          </div>
        </div>
      </div>
      <div className="footer-bottom container">
        <p>© {year} Your World Come True</p>
      </div>
    </footer>
  );
};

export default Footer;
