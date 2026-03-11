import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

let supabaseInstance: any;

try {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase credentials missing.');
  }
  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
} catch (e) {
  console.error('Supabase: Initialization failed!', e);
  // Provide a dummy object to prevent crashes on calls
  supabaseInstance = {
    from: () => ({
      select: () => ({
        order: () => Promise.resolve({ data: [], error: null }),
        limit: () => Promise.resolve({ data: [], error: null }),
      })
    })
  };
}

export const supabase = supabaseInstance;
