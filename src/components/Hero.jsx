import React from 'react';
import '../styles/hero.css';
import heroBanner from '../assets/hero.jpg'; 

const Hero = () => {
  return (
    <section 
      className="hero-section" 
      style={{ backgroundImage: `url(${heroBanner})` }}
    >
      <div className="hero-container">
        {/* The background banner image itself contains your typography elements */}
      </div>
    </section>
  );
};

export default Hero;