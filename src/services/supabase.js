import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

// Se não houver URL/KEY, exportamos null para evitar chamadas inválidas
if (!url || !key) {
  console.warn('⚠️ Supabase não configurado. Defina VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no Vercel para usar funcionalidades reais.')
  // export null (o resto do app deve checar se supabase existe)
  export const supabase = null
} else {
  export const supabase = createClient(url, key)
}
