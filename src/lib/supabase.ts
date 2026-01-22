import { createClient } from '@supabase/supabase-js'

// Get Supabase credentials from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// Log warning in development if credentials are missing
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables not found. Authentication features will not work.')
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key',
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  }
)

// Export a flag to check if Supabase is properly configured
export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey)
