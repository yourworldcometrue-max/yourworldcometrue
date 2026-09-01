import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/hero.css';
import heroBanner from '../assets/hero.jpg';

const Hero = () => {
  return (
    <section className="hero-section">
      <div className="hero-media" style={{ backgroundImage: `url(${heroBanner})` }} />
      <div className="hero-contour" aria-hidden="true" />
      <div className="hero-container container">
        <p className="hero-eyebrow">Your world, one place</p>
        <h1 className="hero-title">
          Everything you need,<br />nothing you don't.
        </h1>
        <p className="hero-subtitle">
          Shop, travel, eat well, and grow — all under one roof, built around how you actually live.
        </p>
        <div className="hero-actions">
          <Link to="/shop" className="btn btn-primary btn-lg">Start exploring</Link>
          <Link to="/signup" className="btn btn-ghost btn-lg">Create an account</Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
