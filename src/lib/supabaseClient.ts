import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let supabase: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient {
  if (!supabase) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    console.log('getSupabaseClient env vars:', { url, anonKey });

    if (!url || !anonKey) {
      console.error('Missing env vars. NEXT_PUBLIC_SUPABASE_URL:', url, 'NEXT_PUBLIC_SUPABASE_ANON_KEY:', anonKey);
      throw new Error('Supabase environment variables are not set. Please configure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.');
    }

    supabase = createClient(url, anonKey);
  }

  return supabase;
}
