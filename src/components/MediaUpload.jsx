import React, { useState } from 'react';

export default function MediaUpload({ onUploadSuccess }) {
  const [loading, setLoading] = useState(false);

  // Your Cloudinary credentials
  const CLOUD_NAME = "YOUR_ACTUAL_CLOUD_NAME_HERE"; 
  const UPLOAD_PRESET = "yourworldcometrue_preset"; 

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);

    const resourceType = file.type.startsWith('video/') ? 'video' : 'image';

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const data = await response.json();
      
      if (data.secure_url && onUploadSuccess) {
        onUploadSuccess(data.secure_url, resourceType);
      } else {
        alert("Upload failed. Verify your Cloudinary configuration.");
      }
    } catch (error) {
      console.error("Error uploading:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', border: '1px dashed #cbd5e1', borderRadius: '12px', textAlign: 'center', backgroundColor: '#f8fafc' }}>
      <p style={{ margin: '0 0 12px 0', fontSize: '0.9rem', color: '#64748b' }}>
        Share your photos or video reels with everyone
      </p>
      <label style={{ backgroundColor: '#0f172a', color: '#fff', padding: '8px 16px', borderRadius: '9999px', cursor: 'pointer', display: 'inline-block', fontSize: '0.875rem', fontWeight: '600' }}>
        {loading ? "Uploading..." : "📁 Choose Photo / Reel"}
        <input type="file" accept="image/*,video/*" onChange={handleFileChange} disabled={loading} style={{ display: 'none' }} />
      </label>
    </div>
  );
}