import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Categories from '../components/Categories';

const LandingPage = () => {
  return (
    <div 
      className="landing-page" 
      style={{ 
        minHeight: '100vh', 
        background: '#ffffff',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* 1. Header Navigation Menu */}
      <Navbar />

      {/* 2. Wide Top Hero Banner */}
      <Hero />

      {/* 3. Interactive 7-Column Category Grid */}
      <Categories />
    </div>
  );
};

export default LandingPage;