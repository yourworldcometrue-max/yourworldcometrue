/*import { createClient } from '@supabase/supabase-js';

// These grab the secure environmental tokens from your .env.local file
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Initialize and export the backend engine instance
export const supabase = createClient(supabaseUrl, supabaseAnonKey);*/

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://azunhpwewhkczdumkfpk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF6dW5ocHdld2hrY3pkdW1rZnBrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM1NzA1NjUsImV4cCI6MjA5OTE0NjU2NX0.8GNQke68NHF4B9mqGQJp1P9d0099PkhXI9zrNwzvyyM'; // Paste your full copied anon key starting with eyJ...

export const supabase = createClient(supabaseUrl, supabaseAnonKey);