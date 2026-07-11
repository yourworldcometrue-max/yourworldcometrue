import React, { useState, useEffect } from 'react';
import MediaUpload from '../components/MediaUpload';
import { supabase } from '../supabaseClient';

export default function DealsPage({ onBack }) {
  const [dealsItems, setDealsItems] = useState([]);
  const [caption, setCaption] = useState("");
  const [uploading, setUploading] = useState(false);

  // Fetch all existing deals from Supabase automatically on mount
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
      console.error("Error fetching deals:", error.message);
    }
  };

  const handleNewDeal = async (secureUrl, resourceType) => {
    setUploading(true);
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        alert("Please log in to upload offers and deals!");
        return;
      }

      const newDealData = {
        user_id: user.id,
        user_email: user.email,
        caption: caption || "Exclusive limited-time offer!",
        media_url: secureUrl,
        media_type: resourceType,
      };

      const { data, error } = await supabase
        .from('deals')
        .insert([newDealData])
        .select();

      if (error) throw error;

      if (data && data[0]) {
        setDealsItems([data[0], ...dealsItems]);
      }
      setCaption(""); 
      alert("New Deal shared successfully!");

    } catch (error) {
      console.error("Error saving deal to Supabase:", error.message);
      alert("Failed to save deal.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="deals-page-container" style={{ maxWidth: '600px', margin: '20px auto', padding: '0 15px' }}>
      
      {/* Back Button to return to home grid */}
      <button 
        onClick={onBack} 
        style={{ marginBottom: '20px', padding: '8px 16px', background: '#cbd5e1', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '500', color: '#334155' }}
      >
        ⬅️ Back to Categories
      </button>

      {/* CREATE DEAL BOX */}
      <div className="upload-section-wrapper" style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', marginBottom: '30px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
        <h4 style={{ margin: '0 0 4px 0', color: '#1e293b' }}>Post an Offer or Deal</h4>
        <p style={{ margin: '0 0 12px 0', fontSize: '0.85rem', color: '#64748b' }}>Share discounts, limited-time prices, or exclusive codes.</p>
        <textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Describe the offer (e.g., 'Flat 50% off on all items using code DEALS50!')..."
          style={{ width: '100%', minHeight: '80px', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', resize: 'none', marginBottom: '12px', fontSize: '0.95rem', fontFamily: 'inherit' }}
          disabled={uploading}
        />
        <MediaUpload onUploadSuccess={handleNewDeal} />
      </div>

      {/* OFFERS & DEALS LIVE STREAM FEED */}
      <div className="deals-feed-wrapper">
        <h3 style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '8px', color: '#0f172a' }}>🔥 Active Offers & Deals</h3>
        
        {dealsItems.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#64748b', marginTop: '20px' }}>No deals listed yet. Share the first one!</p>
        ) : (
          dealsItems.map((deal) => (
            <div key={deal.id} className="deal-card" style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', marginBottom: '20px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
              
              <div style={{ fontSize: '0.8rem', color: '#e11d48', marginBottom: '10px', fontWeight: '600', backgroundColor: '#ffe4e6', display: 'inline-block', padding: '2px 8px', borderRadius: '4px' }}>
                🏷️ DEAL BY: {deal.user_email || "Verified Partner"}
              </div>

              {/* IMAGE DEALS */}
              {deal.media_type === 'image' && (
                <img src={deal.media_url} alt="Deal flyer" style={{ width: '100%', borderRadius: '8px', maxHeight: '400px', objectFit: 'cover' }} />
              )}

              {/* VIDEO DEALS */}
              {deal.media_type === 'video' && (
                <video src={deal.media_url} controls style={{ width: '100%', borderRadius: '8px', maxHeight: '400px', backgroundColor: '#000' }} />
              )}

              <p style={{ marginTop: '12px', color: '#1e293b', fontSize: '0.95rem', lineHeight: '1.5', background: '#f8fafc', padding: '12px', borderRadius: '8px', borderLeft: '4px solid #e11d48' }}>
                {deal.caption}
              </p>
            </div>
          ))
        )}
      </div>

    </div>
  );
}