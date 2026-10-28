import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

/**
 * Supabase client. Only the public (publishable/anon) key is ever used in the
 * browser — all write access is enforced server-side by row-level security.
 * If the env vars are missing the client is null and the site falls back to
 * the bundled sample data, so a misconfigured deploy never shows a blank page.
 */
export const supabase = url && key ? createClient(url, key) : null
export const hasSupabase = Boolean(supabase)
