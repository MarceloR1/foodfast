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
  // Provide a more robust dummy object to prevent crashes on chained calls
  const dummy: any = {
    from: () => dummy,
    select: () => dummy,
    order: () => dummy,
    limit: () => dummy,
    eq: () => dummy,
    single: () => dummy,
    insert: () => dummy,
    update: () => dummy,
    delete: () => dummy,
    upsert: () => dummy,
    // Add Promise support for final calls
    then: (resolve: any) => resolve({ data: [], error: null }),
    catch: () => dummy,
  };
  supabaseInstance = dummy;
}

export const supabase = supabaseInstance;
