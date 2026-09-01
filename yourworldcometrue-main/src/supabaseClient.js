import { createClient } from '@supabase/supabase-js';

// Fallback configuration: checks environment variables first, then defaults to strings
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://azunhpwewhkczdumkfpk.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_NBGjSlITaaueezEC2423Rw_Dpqek...'; // paste full key here

export const supabase = createClient(supabaseUrl, supabaseAnonKey);