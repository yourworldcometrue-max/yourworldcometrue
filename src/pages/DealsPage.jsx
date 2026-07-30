import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MediaUpload from '../components/MediaUpload';
import { supabase } from '../supabaseClient';
import '../styles/deals.css';

export default function DealsPage() {
  const [dealsItems, setDealsItems] = useState([]);
  const [caption, setCaption] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchDeals();
  }, []);

  const fetchDeals = async () => {
    try {
      const { data, error } = await supabase
        .from('deals')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) setDealsItems(data);
    } catch (error) {
      console.error('Error fetching deals:', error.message);
    }
  };

  const handleNewDeal = async (secureUrl, resourceType) => {
    setUploading(true);
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        alert('Please log in to post an offer or deal.');
        return;
      }

      const newDealData = {
        user_id: user.id,
        user_email: user.email,
        caption: caption || 'Exclusive limited-time offer!',
        media_url: secureUrl,
        media_type: resourceType,
      };

      const { data, error } = await supabase.from('deals').insert([newDealData]).select();
      if (error) throw error;

      if (data && data[0]) {
        setDealsItems([data[0], ...dealsItems]);
      }
      setCaption('');
    } catch (error) {
      console.error('Error saving deal:', error.message);
      alert('Failed to save deal.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="landing-page">
      <Navbar />
      <main className="page-main">
        <div className="deals-page-container container">
          <Link to="/" className="back-to-home-btn back-to-home-btn-light">← Back to home</Link>

          <div className="deal-composer">
            <h4>Post an offer or deal</h4>
            <p className="deal-composer-sub">Share discounts, limited-time prices, or exclusive codes.</p>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Describe the offer (e.g. 'Flat 50% off with code DEALS50')…"
              className="deal-textarea"
              disabled={uploading}
            />
            <MediaUpload onUploadSuccess={handleNewDeal} />
          </div>

          <div className="deals-feed">
            <h3>Active offers & deals</h3>

            {dealsItems.length === 0 ? (
              <p className="deals-empty">No deals listed yet. Share the first one.</p>
            ) : (
              dealsItems.map((deal) => (
                <div key={deal.id} className="deal-card">
                  <span className="deal-badge">Deal by {deal.user_email || 'a verified partner'}</span>

                  {deal.media_type === 'image' && <img src={deal.media_url} alt="Deal" />}
                  {deal.media_type === 'video' && <video src={deal.media_url} controls />}

                  <p className="deal-caption">{deal.caption}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
