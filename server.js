import express from 'express';
import cors from 'cors';
import { GoogleGenAI } from '@google/genai';
import { Client as MagicHourClient } from 'magic-hour';
import { createClient } from '@supabase/supabase-js';
import Razorpay from 'razorpay';
import crypto from 'crypto';

const app = express();

// Configure CORS for local development (any port), production, and Vercel preview URLs
const allowedOrigins = [
  'https://yourworldcometrue.com',
  'https://www.yourworldcometrue.com',
  'https://yourworldcometrue-max-yourworldcometrue-yourworldcometrue.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (
      origin.startsWith('http://localhost:') || 
      allowedOrigins.includes(origin) || 
      origin.endsWith('.vercel.app')
    ) {
      return callback(null, true);
    }
    return callback(new Error('Blocked by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Handle preflight requests for all endpoints (Express 5 compatible)
app.options(/(.*)/, cors());

app.use(express.json());

// Initialize Clients
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const magicHour = new MagicHourClient({ token: process.env.MAGIC_HOUR_API_KEY });
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET || '',
});

// Middleware: Check if user has credits or active subscription
async function checkCredits(req, res, next) {
  const { userId } = req.body;
  if (!userId) {
    return res.status(401).json({ error: 'User ID is required' });
  }

  const { data: profile, error } = await supabaseAdmin
    .from('profiles')
    .select('credits, is_subscribed')
    .eq('id', userId)
    .single();

  if (error || !profile) {
    return res.status(404).json({ error: 'User profile not found' });
  }

  if (!profile.is_subscribed && (profile.credits === null || profile.credits <= 0)) {
    return res.status(402).json({ 
      error: 'OUT_OF_CREDITS', 
      message: 'Free credits exhausted. Please subscribe to continue.' 
    });
  }

  req.userProfile = profile;
  next();
}

// Helper: Deduct 1 credit for non-subscribers
async function deductCredit(userId, profile) {
  if (!profile.is_subscribed && profile.credits > 0) {
    await supabaseAdmin
      .from('profiles')
      .update({ credits: profile.credits - 1 })
      .eq('id', userId);
  }
}

// Health check endpoint
app.get('/', (req, res) => {
  res.send('AI Backend Server is Live & Running!');
});

// 1. AI Chat Endpoint
app.post('/api/ai/chat', checkCredits, async (req, res) => {
  try {
    const { message, userId } = req.body;
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: message,
    });

    await deductCredit(userId, req.userProfile);
    res.json({ reply: response.text });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Image to Video Endpoint
app.post('/api/ai/image-to-video', checkCredits, async (req, res) => {
  try {
    const { imageUrl, prompt, userId } = req.body;
    const job = await magicHour.v1.imageToVideo.create({
      name: 'User Video',
      endSeconds: 5.0,
      resolution: '720p',
      assets: { imageFilePath: imageUrl },
      style: { prompt: prompt || 'high quality cinematic motion' },
    });

    await deductCredit(userId, req.userProfile);
    res.json({ success: true, projectId: job.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Create Payment Order (Razorpay)
app.post('/api/payment/create-order', async (req, res) => {
  try {
    const { amount, planType, userId } = req.body;
    const order = await razorpay.orders.create({
      amount: (amount || 499) * 100, // Convert ₹ to paise
      currency: 'INR',
      receipt: `rcpt_${userId || 'guest'}_${Date.now()}`,
      notes: { planType: planType || 'subscription', userId: userId || '' },
    });
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Verify Payment & Activate Plan
app.post('/api/payment/verify', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, userId, planType } = req.body;

    const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '');
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const generatedSignature = hmac.digest('hex');

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Invalid payment signature' });
    }

    // Payment validated! Activate subscription in Supabase
    if (planType === 'subscription') {
      await supabaseAdmin
        .from('profiles')
        .update({ is_subscribed: true })
        .eq('id', userId);
    } else {
      // If credit pack, add 50 credits
      const { data: profile } = await supabaseAdmin.from('profiles').select('credits').eq('id', userId).single();
      await supabaseAdmin
        .from('profiles')
        .update({ credits: (profile?.credits || 0) + 50 })
        .eq('id', userId);
    }

    res.json({ success: true, message: 'Payment verified and account upgraded!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server listening on port ${PORT}`);
});