import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

const BACKEND_URL = 'https://yourworldcometrue.onrender.com'; // Your Render backend URL

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const PricingModal = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleCheckout = async (amountInRupees, planType) => {
    const { data: authData } = await supabase.auth.getUser();
    const user = authData?.user;

    if (!user) {
      alert('Please log in first to purchase a plan.');
      return;
    }

    setLoading(true);
    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) {
      alert('Failed to connect to Razorpay.');
      setLoading(false);
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
      if (!data.success) throw new Error(data.error || 'Order creation failed');

      const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.order.amount,
        currency: data.order.currency,
        name: 'Your World Come True',
        description: planType === 'subscription' ? 'Monthly Pro Plan' : '50 Credits Top-Up',
        order_id: data.order.id,
        prefill: { email: user.email },
        theme: { color: '#0F172A' },
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
            alert('Payment Successful! Your plan is active.');
            onClose();
            window.location.reload();
          } else {
            alert('Payment verification failed.');
          }
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={modalStyles.overlay} onClick={onClose}>
      <div style={modalStyles.card} onClick={(e) => e.stopPropagation()}>
        <div style={modalStyles.header}>
          <h2 style={{ margin: 0, fontSize: '20px', color: '#0F172A' }}>Plans & Pricing</h2>
          <button style={modalStyles.closeBtn} onClick={onClose}>&times;</button>
        </div>
        <p style={{ color: '#64748B', fontSize: '13px', marginTop: '4px' }}>
          Choose the plan that suits your creative needs.
        </p>

        <div style={modalStyles.grid}>
          {/* Credit Pack */}
          <div style={modalStyles.planCard}>
            <div style={modalStyles.planTitle}>Credit Top-Up</div>
            <div style={modalStyles.price}>₹99</div>
            <div style={modalStyles.planDesc}>50 AI Generation Credits</div>
            <button 
              style={modalStyles.btnOutline} 
              onClick={() => handleCheckout(99, 'credit_pack_50')}
              disabled={loading}
            >
              Buy 50 Credits
            </button>
          </div>

          {/* Unlimited Subscription */}
          <div style={{ ...modalStyles.planCard, borderColor: '#4F46E5', background: '#F8FAFC' }}>
            <div style={{ ...modalStyles.planTitle, color: '#4F46E5' }}>Pro Unlimited</div>
            <div style={modalStyles.price}>₹499 <span style={{ fontSize: '12px', color: '#64748B' }}>/mo</span></div>
            <div style={modalStyles.planDesc}>Unlimited AI Chat & Video Generations</div>
            <button 
              style={modalStyles.btnFilled} 
              onClick={() => handleCheckout(499, 'subscription')}
              disabled={loading}
            >
              Subscribe Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const modalStyles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    backdropFilter: 'blur(5px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10000,
  },
  card: {
    background: '#ffffff',
    borderRadius: '16px',
    padding: '24px',
    width: '90%',
    maxWidth: '520px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  closeBtn: {
    background: 'transparent',
    border: 'none',
    fontSize: '22px',
    cursor: 'pointer',
    color: '#64748B',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
    marginTop: '20px',
  },
  planCard: {
    border: '1px solid #E2E8F0',
    borderRadius: '12px',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  planTitle: { fontWeight: '700', fontSize: '15px' },
  price: { fontSize: '22px', fontWeight: '800', margin: '10px 0 6px 0', color: '#0F172A' },
  planDesc: { fontSize: '12px', color: '#64748B', marginBottom: '16px' },
  btnOutline: {
    background: 'transparent',
    border: '1px solid #0F172A',
    color: '#0F172A',
    padding: '8px',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  btnFilled: {
    background: '#4F46E5',
    border: 'none',
    color: '#ffffff',
    padding: '8px',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
  },
};

export default PricingModal;