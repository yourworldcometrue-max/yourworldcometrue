import { createClient } from '@supabase/supabase-js';

// These grab the secure environmental tokens from your .env.local file
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Initialize and export the backend engine instance
export const supabase = createClient(supabaseUrl, supabaseAnonKey);