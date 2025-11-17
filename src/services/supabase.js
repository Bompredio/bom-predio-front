import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

let supabaseClient = null

if (!url || !key) {
  console.warn('⚠️ Supabase não configurado. Defina VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no Vercel.')
  supabaseClient = null
} else {
  supabaseClient = createClient(url, key)
}

export const supabase = supabaseClient
