/*import React, { useState } from 'react';
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

export default LandingPage;*/

import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Categories from '../components/Categories';
import Trending from '../components/Trending';
import Footer from '../components/Footer';
import PricingModal from '../components/PricingModal';
import travelIntroVid from '../assets/categories/travel-intro.mp4';
import '../styles/landing.css';

const LandingPage = () => {
  const [showVideo, setShowVideo] = useState(false);
  const [showPricing, setShowPricing] = useState(false);

  return (
    <div className="landing-page">
      {/* Pass onOpenPricing to Navbar so the button next to AI can trigger it */}
      <Navbar onOpenPricing={() => setShowPricing(true)} />

      {/* Limited-time Discount Banner */}
      <div style={styles.discountBanner}>
        <span>🔥 <strong>Special Launch Offer:</strong> Get 50% OFF Pro AI Unlimited Access!</span>
        <button style={styles.bannerBtn} onClick={() => setShowPricing(true)}>
          Claim Discount — ₹249
        </button>
      </div>

      <main className="page-main">
        <Hero />
        <Categories onTravelClick={() => setShowVideo(true)} />
        <Trending />
      </main>
      
      <Footer />

      {/* Standalone Pricing & Subscription Payment Modal */}
      <PricingModal 
        isOpen={showPricing} 
        onClose={() => setShowPricing(false)} 
      />

      {/* Video Modal */}
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

const styles = {
  discountBanner: {
    background: 'linear-gradient(90deg, #1e1b4b, #4338ca)',
    color: '#ffffff',
    padding: '10px 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '16px',
    fontSize: '0.88rem',
    flexWrap: 'wrap',
  },
  bannerBtn: {
    background: '#fbbf24',
    color: '#0f172a',
    border: 'none',
    padding: '5px 14px',
    borderRadius: '20px',
    fontWeight: '700',
    fontSize: '0.82rem',
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(251, 191, 36, 0.4)',
  },
};

export default LandingPage;
