/*import React from 'react';

const AiAgentModal = ({ isOpen, onClose, onSelectOption }) => {
  if (!isOpen) return null;

  const options = [
    {
      id: 'chat',
      icon: '💬',
      title: 'Chat Assistant',
      desc: 'Ask questions, get recommendations & support',
    },
    {
      id: 'image-to-image',
      icon: '🎨',
      title: 'Image to Image',
      desc: 'Transform, remix, and enhance photos',
    },
    {
      id: 'image-to-video',
      icon: '🎬',
      title: 'Image to Video',
      desc: 'Animate still images into dynamic AI videos',
    },
  ];

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.card} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <span style={styles.badge}>🤖 AI Studio</span>
          <button style={styles.closeBtn} onClick={onClose}>&times;</button>
        </div>

        <h2 style={styles.title}>What would you like to create?</h2>
        <p style={styles.subtitle}>Choose an AI tool to get started:</p>

        <div style={styles.grid}>
          {options.map((opt) => (
            <div
              key={opt.id}
              style={styles.optionCard}
              onClick={() => {
                onSelectOption(opt.id);
                onClose();
              }}
            >
              <div style={styles.iconBox}>{opt.icon}</div>
              <div>
                <div style={styles.optionTitle}>{opt.title}</div>
                <div style={styles.optionDesc}>{opt.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    backdropFilter: 'blur(5px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '24px',
    width: '90%',
    maxWidth: '440px',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  badge: {
    background: '#EEF2FF',
    color: '#4F46E5',
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '700',
  },
  closeBtn: {
    background: 'transparent',
    border: 'none',
    fontSize: '22px',
    cursor: 'pointer',
    color: '#64748B',
  },
  title: {
    margin: '0 0 6px 0',
    fontSize: '18px',
    fontWeight: '700',
    color: '#0F172A',
  },
  subtitle: {
    margin: '0 0 16px 0',
    fontSize: '13px',
    color: '#64748B',
  },
  grid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  optionCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    borderRadius: '10px',
    border: '1px solid #E2E8F0',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  iconBox: {
    fontSize: '22px',
    background: '#F8FAFC',
    padding: '8px',
    borderRadius: '8px',
  },
  optionTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#1E293B',
  },
  optionDesc: {
    fontSize: '12px',
    color: '#64748B',
    marginTop: '2px',
  },
};

export default AiAgentModal;*/


import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../supabaseClient';

const BACKEND_URL = 'https://yourworldcometrue.onrender.com'; // Your Render backend URL

const AiAgentModal = ({ isOpen, onClose, onOpenPricing }) => {
  const [activeTab, setActiveTab] = useState('menu'); // 'menu' | 'chat' | 'image-to-image' | 'image-to-video'
  const [credits, setCredits] = useState(null);
  const [user, setUser] = useState(null);

  // Chat State
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Media State
  const [mediaPrompt, setMediaPrompt] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [mediaLoading, setMediaLoading] = useState(false);
  const [generatedOutput, setGeneratedOutput] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setActiveTab('menu');
      setGeneratedOutput('');
      return;
    }

    supabase.auth.getUser().then(async ({ data }) => {
      if (data?.user) {
        setUser(data.user);
        const { data: profile } = await supabase
          .from('profiles')
          .select('credits, is_subscribed')
          .eq('id', data.user.id)
          .single();

        setCredits(profile?.is_subscribed ? 'Unlimited' : (profile?.credits ?? 3));
      }
    });
  }, [isOpen]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  if (!isOpen) return null;

  // 1. Send Chat Message (Gemini)
  const handleSendChat = async () => {
    if (!chatInput.trim() || chatLoading) return;
    const msg = chatInput.trim();
    setChatInput('');
    setChatMessages((prev) => [...prev, { role: 'user', text: msg }]);
    setChatLoading(true);

    try {
      const res = await fetch(`${BACKEND_URL}/api/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg, userId: user?.id }),
      });
      const data = await res.json();
      if (data.error === 'OUT_OF_CREDITS') {
        alert('Credits exhausted! Please upgrade your plan.');
        if (onOpenPricing) onOpenPricing();
        return;
      }
      setChatMessages((prev) => [...prev, { role: 'ai', text: data.reply || 'No response generated.' }]);
      if (credits !== 'Unlimited' && typeof credits === 'number') setCredits((c) => Math.max(0, c - 1));
    } catch (err) {
      setChatMessages((prev) => [...prev, { role: 'ai', text: 'Error connecting to AI service.' }]);
    } finally {
      setChatLoading(false);
    }
  };

  // 2. Upload file to Supabase & Generate Video/Image
  const handleGenerateMedia = async (endpoint) => {
    if (!selectedFile) {
      alert('Please upload an image first.');
      return;
    }
    setMediaLoading(true);
    setGeneratedOutput('');

    try {
      // Upload to Supabase Storage
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('ai-uploads')
        .upload(fileName, selectedFile);

      if (uploadError) throw new Error(uploadError.message);

      const { data: publicUrlData } = supabase.storage
        .from('ai-uploads')
        .getPublicUrl(fileName);

      const publicUrl = publicUrlData.publicUrl;

      // Call Render Backend
      const res = await fetch(`${BACKEND_URL}/api/ai/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrl: publicUrl,
          prompt: mediaPrompt || 'Cinematic, high quality',
          userId: user?.id,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || data.error || 'Generation failed');

      setGeneratedOutput(data.projectId || 'Job submitted successfully! Processing output...');
      if (credits !== 'Unlimited' && typeof credits === 'number') setCredits((c) => Math.max(0, c - 1));
    } catch (err) {
      alert('Generation error: ' + err.message);
    } finally {
      setMediaLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.card} onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div style={styles.header}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {activeTab !== 'menu' && (
              <button style={styles.backBtn} onClick={() => setActiveTab('menu')}>← Back</button>
            )}
            <span style={styles.badge}>
              {activeTab === 'menu' && '🤖 AI Studio'}
              {activeTab === 'chat' && '💬 AI Chat Assistant'}
              {activeTab === 'image-to-image' && '🎨 Image to Image'}
              {activeTab === 'image-to-video' && '🎬 Image to Video'}
            </span>
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span style={styles.creditPill}>⚡ Credits: {credits ?? '...'}</span>
            <button style={styles.closeBtn} onClick={onClose}>&times;</button>
          </div>
        </div>

        {/* View 1: Main Menu Options */}
        {activeTab === 'menu' && (
          <>
            <h2 style={styles.title}>What would you like to create?</h2>
            <p style={styles.subtitle}>Choose an AI tool to get started:</p>
            <div style={styles.grid}>
              <div style={styles.optionCard} onClick={() => setActiveTab('chat')}>
                <div style={styles.iconBox}>💬</div>
                <div>
                  <div style={styles.optionTitle}>Chat Assistant</div>
                  <div style={styles.optionDesc}>Ask questions, get recommendations & assistance</div>
                </div>
              </div>

              <div style={styles.optionCard} onClick={() => setActiveTab('image-to-image')}>
                <div style={styles.iconBox}>🎨</div>
                <div>
                  <div style={styles.optionTitle}>Image to Image</div>
                  <div style={styles.optionDesc}>Transform, remix, and enhance photos</div>
                </div>
              </div>

              <div style={styles.optionCard} onClick={() => setActiveTab('image-to-video')}>
                <div style={styles.iconBox}>🎬</div>
                <div>
                  <div style={styles.optionTitle}>Image to Video</div>
                  <div style={styles.optionDesc}>Animate still images into dynamic AI videos</div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* View 2: Chat Interface */}
        {activeTab === 'chat' && (
          <div style={{ display: 'flex', flexDirection: 'column', height: '360px' }}>
            <div style={styles.chatArea}>
              {chatMessages.length === 0 && (
                <div style={styles.emptyMsg}>Start a conversation with your AI Assistant...</div>
              )}
              {chatMessages.map((m, idx) => (
                <div key={idx} style={{ margin: '6px 0', textAlign: m.role === 'user' ? 'right' : 'left' }}>
                  <span style={m.role === 'user' ? styles.userBubble : styles.aiBubble}>
                    {m.text}
                  </span>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
            <div style={styles.inputRow}>
              <input
                style={styles.textInput}
                placeholder="Ask anything..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
              />
              <button style={styles.actionBtn} onClick={handleSendChat} disabled={chatLoading}>
                {chatLoading ? '...' : 'Send'}
              </button>
            </div>
          </div>
        )}

        {/* View 3: Media Generator (Image-to-Image & Image-to-Video) */}
        {(activeTab === 'image-to-image' || activeTab === 'image-to-video') && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <input type="file" accept="image/*" onChange={handleFileChange} />

            {previewUrl && (
              <img src={previewUrl} alt="Preview" style={styles.mediaPreview} />
            )}

            <input
              style={styles.textInput}
              placeholder="Enter styling prompt (e.g. cinematic motion, 4k ultra-realistic)..."
              value={mediaPrompt}
              onChange={(e) => setMediaPrompt(e.target.value)}
            />

            <button
              style={styles.actionBtn}
              onClick={() => handleGenerateMedia(activeTab === 'image-to-video' ? 'image-to-video' : 'image-to-image')}
              disabled={mediaLoading}
            >
              {mediaLoading ? 'Generating Media...' : '✨ Generate'}
            </button>

            {generatedOutput && (
              <div style={styles.outputBox}>{generatedOutput}</div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    backdropFilter: 'blur(5px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '24px',
    width: '90%',
    maxWidth: '480px',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '14px',
  },
  badge: {
    background: '#EEF2FF',
    color: '#4F46E5',
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '700',
  },
  creditPill: {
    background: '#FEF3C7',
    color: '#B45309',
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '600',
  },
  backBtn: {
    background: '#F1F5F9',
    border: 'none',
    padding: '4px 8px',
    borderRadius: '8px',
    fontSize: '11px',
    cursor: 'pointer',
  },
  closeBtn: {
    background: 'transparent',
    border: 'none',
    fontSize: '22px',
    cursor: 'pointer',
    color: '#64748B',
  },
  title: { margin: '0 0 6px 0', fontSize: '18px', fontWeight: '700', color: '#0F172A' },
  subtitle: { margin: '0 0 16px 0', fontSize: '13px', color: '#64748B' },
  grid: { display: 'flex', flexDirection: 'column', gap: '10px' },
  optionCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    borderRadius: '10px',
    border: '1px solid #E2E8F0',
    cursor: 'pointer',
  },
  iconBox: { fontSize: '22px', background: '#F8FAFC', padding: '8px', borderRadius: '8px' },
  optionTitle: { fontSize: '14px', fontWeight: '600', color: '#1E293B' },
  optionDesc: { fontSize: '12px', color: '#64748B', marginTop: '2px' },
  chatArea: {
    flex: 1,
    overflowY: 'auto',
    background: '#F8FAFC',
    borderRadius: '10px',
    padding: '12px',
    marginBottom: '10px',
    border: '1px solid #E2E8F0',
  },
  emptyMsg: { textAlign: 'center', color: '#94A3B8', fontSize: '13px', marginTop: '80px' },
  userBubble: {
    background: '#4F46E5',
    color: '#fff',
    padding: '7px 12px',
    borderRadius: '12px 12px 0 12px',
    display: 'inline-block',
    fontSize: '13px',
    maxWidth: '80%',
    textAlign: 'left',
  },
  aiBubble: {
    background: '#FFFFFF',
    color: '#1E293B',
    padding: '7px 12px',
    borderRadius: '12px 12px 12px 0',
    display: 'inline-block',
    fontSize: '13px',
    maxWidth: '80%',
    textAlign: 'left',
    border: '1px solid #E2E8F0',
  },
  inputRow: { display: 'flex', gap: '8px' },
  textInput: {
    flex: 1,
    padding: '9px 12px',
    borderRadius: '8px',
    border: '1px solid #CBD5E1',
    fontSize: '13px',
  },
  actionBtn: {
    background: '#4F46E5',
    color: '#FFFFFF',
    border: 'none',
    padding: '9px 16px',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  mediaPreview: {
    width: '100%',
    maxHeight: '160px',
    objectFit: 'cover',
    borderRadius: '8px',
  },
  outputBox: {
    background: '#F1F5F9',
    padding: '10px',
    borderRadius: '8px',
    fontSize: '12px',
    wordBreak: 'break-all',
  },
};

export default AiAgentModal;