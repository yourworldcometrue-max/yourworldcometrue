import React, { useState } from 'react';
import MediaUpload from '../components/MediaUpload';
// Import your Supabase client setup here if you have one (e.g., import { supabase } from '../supabaseClient')

export default function Dashboard() {
  const [feedItems, setFeedItems] = useState([]);

  // This function triggers as soon as Cloudinary finishes handling the file upload
  const handleNewMedia = async (secureUrl, resourceType) => {
    const newPost = {
      url: secureUrl,
      type: resourceType,
      caption: "Check out my new post!", // We can add a text input for this later!
      created_at: new Date().toISOString(),
    };

    // 1. Instantly show it on the UI feed state
    setFeedItems([newPost, ...feedItems]);

    // 2. TODO: Save this text record to your Supabase 'posts' table here later
    console.log("Ready to send to Supabase:", newPost);
  };

  return (
    <div className="dashboard-container" style={{ maxWidth: '600px', margin: '20px auto', padding: '0 15px' }}>
      
      {/* MEDIA UPLOAD AREA */}
      <div className="upload-section-wrapper" style={{ marginBottom: '30px' }}>
        <MediaUpload onUploadSuccess={handleNewMedia} />
      </div>

      {/* DYNAMIC INTERACTION FEED AREA */}
      <div className="social-feed-wrapper">
        <h3 style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '8px', color: '#1e293b' }}>Community Feed</h3>
        
        {feedItems.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#64748b', marginTop: '20px' }}>No posts yet. Be the first to share something!</p>
        ) : (
          feedItems.map((post, index) => (
            <div key={index} className="feed-card" style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', marginBottom: '20px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
              
              {/* RENDER IMAGE POST */}
              {post.type === 'image' && (
                <img src={post.url} alt="User upload" style={{ width: '100%', borderRadius: '8px', maxHeight: '500px', objectFit: 'cover' }} />
              )}

              {/* RENDER VIDEO REEL POST */}
              {post.type === 'video' && (
                <video src={post.url} controls style={{ width: '100%', borderRadius: '8px', maxHeight: '500px', backgroundColor: '#000' }} />
              )}

              <p style={{ marginTop: '12px', color: '#334155', fontSize: '0.95rem' }}>{post.caption}</p>
            </div>
          ))
        )}
      </div>

    </div>
  );
}