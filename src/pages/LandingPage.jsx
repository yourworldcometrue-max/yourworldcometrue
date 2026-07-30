import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Categories from '../components/Categories';
import Trending from '../components/Trending';
import Footer from '../components/Footer';
import travelIntroVid from '../assets/categories/travel-intro.mp4';
import '../styles/landing.css';

const LandingPage = () => {
  const [showVideo, setShowVideo] = useState(false);

  return (
    <div className="landing-page">
      <Navbar />
      <main className="page-main">
        <Hero />
        <Categories onTravelClick={() => setShowVideo(true)} />
        <Trending />
      </main>
      <Footer />

      {showVideo && (
        <div className="video-modal-overlay" onClick={() => setShowVideo(false)}>
          <div className="video-player-container" onClick={(e) => e.stopPropagation()}>
            <button
              className="video-close-btn"
              onClick={() => setShowVideo(false)}
              aria-label="Close video"
            >
              ✕
            </button>
            <video src={travelIntroVid} controls autoPlay style={{ width: '100%', display: 'block' }} />
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
