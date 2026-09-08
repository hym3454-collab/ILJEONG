import { createClient } from '@supabase/supabase-js';

const metaEnv = (import.meta as any).env || {};
const supabaseUrl = metaEnv.VITE_SUPABASE_URL || '';
const supabaseAnonKey = metaEnv.VITE_SUPABASE_ANON_KEY || '';

// Create Supabase client if keys are provided, otherwise null for demo mode fallback
export const supabase = supabaseUrl && supabaseAnonKey && supabaseUrl !== 'https://your-project.supabase.co'
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
