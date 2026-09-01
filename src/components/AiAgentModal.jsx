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


import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const BACKEND_URL = 'https://yourworldcometrue.onrender.com';

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const AiAgentModal = ({ isOpen, onClose, onSelectOption }) => {
  const [credits, setCredits] = useState(null);
  const [user, setUser] = useState(null);
  const [loadingPayment, setLoadingPayment] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

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

  if (!isOpen) return null;

  const handlePayment = async (amountInRupees = 499, planType = 'subscription') => {
    if (!user) {
      alert('Please log in first to purchase or subscribe.');
      return;
    }

    setLoadingPayment(true);

    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) {
      alert('Failed to connect to payment gateway. Please check your connection.');
      setLoadingPayment(false);
      return;
    }

    try {
      const res = await fetch(`${BACKEND_URL}/api/payment/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: amountInRupees,
          planType,
          userId: user.id,
        }),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Failed to create order');

      const options = {
        key: 'rzp_test_YourKeyHere', // Replace with your Razorpay Key ID
        amount: data.order.amount,
        currency: data.order.currency,
        name: 'Your World Come True',
        description: planType === 'subscription' ? 'Unlimited AI Monthly Plan' : '50 AI Credits Pack',
        order_id: data.order.id,
        prefill: { email: user.email },
        theme: { color: '#4F46E5' },
        handler: async (response) => {
          const verifyRes = await fetch(`${BACKEND_URL}/api/payment/verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              userId: user.id,
              planType,
            }),
          });

          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            alert('🎉 Payment successful! Your account has been upgraded.');
            setCredits(planType === 'subscription' ? 'Unlimited' : ((credits || 0) + 50));
          } else {
            alert('Payment verification failed.');
          }
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (err) {
      alert('Payment error: ' + err.message);
    } finally {
      setLoadingPayment(false);
    }
  };

  const handleSelect = (optionId) => {
    if (!user) {
      alert('Please log in first to use AI Studio.');
      return;
    }
    if (credits === 0) {
      handlePayment(499, 'subscription');
      return;
    }
    onSelectOption(optionId);
    onClose();
  };

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
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span style={styles.creditPill}>⚡ Credits: {credits ?? '...'}</span>
            <button
              style={styles.upgradeBtn}
              onClick={() => handlePayment(499, 'subscription')}
              disabled={loadingPayment}
            >
              {loadingPayment ? '...' : '💎 Upgrade'}
            </button>
            <button style={styles.closeBtn} onClick={onClose}>&times;</button>
          </div>
        </div>

        <h2 style={styles.title}>What would you like to create?</h2>
        <p style={styles.subtitle}>Choose an AI tool to get started:</p>

        <div style={styles.grid}>
          {options.map((opt) => (
            <div
              key={opt.id}
              style={styles.optionCard}
              onClick={() => handleSelect(opt.id)}
            >
              <div style={styles.iconBox}>{opt.icon}</div>
              <div>
                <div style={styles.optionTitle}>{opt.title}</div>
                <div style={styles.optionDesc}>{opt.desc}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={styles.pricingBanner}>
          <div>
            <div style={{ fontWeight: 600, fontSize: '13px', color: '#1E293B' }}>Unlimited AI Access</div>
            <div style={{ fontSize: '11px', color: '#64748B' }}>₹499 / mo or ₹99 for 50 credits</div>
          </div>
          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              style={styles.packBtn}
              onClick={() => handlePayment(99, 'credit_pack_50')}
              disabled={loadingPayment}
            >
              +50 Credits (₹99)
            </button>
            <button
              style={styles.subBtn}
              onClick={() => handlePayment(499, 'subscription')}
              disabled={loadingPayment}
            >
              Subscribe (₹499)
            </button>
          </div>
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
  creditPill: {
    background: '#FEF3C7',
    color: '#B45309',
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '600',
  },
  upgradeBtn: {
    background: 'linear-gradient(135deg, #6366f1, #a855f7)',
    color: '#ffffff',
    border: 'none',
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '11px',
    fontWeight: '600',
    cursor: 'pointer',
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
  pricingBanner: {
    marginTop: '16px',
    padding: '12px 14px',
    background: '#F8FAFC',
    borderRadius: '10px',
    border: '1px solid #E2E8F0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '8px',
  },
  packBtn: {
    background: '#E2E8F0',
    color: '#1E293B',
    border: 'none',
    padding: '6px 10px',
    borderRadius: '8px',
    fontSize: '11px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  subBtn: {
    background: '#0F172A',
    color: '#FFFFFF',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '8px',
    fontSize: '11px',
    fontWeight: '600',
    cursor: 'pointer',
  },
};

export default AiAgentModal;