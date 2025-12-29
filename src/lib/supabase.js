import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Supabase credentials not found. Running in local-only mode.\n' +
    'To enable cloud features, add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.'
  );
}

// Create Supabase client (or null if credentials missing)
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Check if Supabase is configured
export const isSupabaseConfigured = () => !!supabase;

// Export for direct database access
export default supabase;

