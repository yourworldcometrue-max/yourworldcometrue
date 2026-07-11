import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Categories from '../components/Categories'; 
import Trending from '../components/Trending';
import DealsPage from './DealsPage'; // <-- Import your new deals page layout

// 1. IMPORT YOUR ACTUAL TRAVEL INTRO VIDEO FILE
import travelIntroVid from '../assets/categories/travel-intro.mp4';

const LandingPage = ({ onNavigate }) => {
  const [showVideo, setShowVideo] = useState(false);
  const [currentView, setCurrentView] = useState('home'); // <-- Track whether to show home grid or deals view

  // If the user triggered the Offers & Deals page view, display it exclusively
  if (currentView === 'deals') {
    return (
      <div className="landing-page">
        <Navbar onNavigate={onNavigate} />
        <DealsPage onBack={() => setCurrentView('home')} />
      </div>
    );
  }

  return (
    <div className="landing-page">
      <Navbar onNavigate={onNavigate} />
      <Hero />
      
      {/* Connected both travel modal click and deals page navigation view toggle */}
      <Categories 
        onTravelClick={() => setShowVideo(true)} 
        onDealsClick={() => setCurrentView('deals')}
      />
      
      <Trending />

      {/* POPUP VIDEO PLAYER MODAL OVERLAY */}
      {showVideo && (
        <div 
          className="video-modal-overlay" 
          onClick={() => setShowVideo(false)} 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
          }}
        >
          <div 
            className="video-player-container" 
            onClick={(e) => e.stopPropagation()} 
            style={{
              position: 'relative',
              width: '90%',
              maxWidth: '800px',
              backgroundColor: '#000',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)'
            }}
          >
            {/* Close Button ✕ */}
            <button 
              onClick={() => setShowVideo(false)}
              style={{
                position: 'absolute',
                top: '15px',
                right: '15px',
                background: 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                color: '#fff',
                fontSize: '1.2rem',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10,
                fontWeight: 'bold'
              }}
            >
              ✕
            </button>

            {/* 2. PLUGS IN YOUR OWN TRAVEL VIDEO */}
            <video 
              src={travelIntroVid} 
              controls 
              autoPlay 
              style={{ width: '100%', display: 'block' }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;