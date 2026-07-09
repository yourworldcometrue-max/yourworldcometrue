import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Categories from '../components/Categories'; // <-- Make sure this import is here!
import Trending from '../components/Trending';

const LandingPage = ({ onNavigate }) => {
  return (
    <div className="landing-page">
      <Navbar onNavigate={onNavigate} />
      <Hero />
      
      {/* ADD THIS LINE BACK IN: This brings back your 8 category blocks with images! */}
      <Categories />
      
      <Trending />
    </div>
  );
};

export default LandingPage;