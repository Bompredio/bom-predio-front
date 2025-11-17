import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Indica se Supabase está disponível
export const SUPABASE_AVAILABLE = !!supabaseUrl && !!supabaseAnonKey

let supabase = null

if (SUPABASE_AVAILABLE) {
  supabase = createClient(supabaseUrl, supabaseAnonKey)
} else {
  // Não lançar erro: exporta um "mock" mínimo para evitar crash da app
  console.warn('[Bom Prédio] Supabase não configurado — usando fallback mock.')
  supabase = {
    auth: {
      async getSession() { return { data: { session: null } } },
      onAuthStateChange() { return { data: { subscription: { unsubscribe() {} } } } },
      async signInWithOtp() { return { error: new Error('Supabase não configurado') } },
      async signUp() { return { error: new Error('Supabase não configurado') } },
      async signOut() { return {} },
    },
    from() {
      return {
        select: async () => ({ error: new Error('Supabase não configurado'), data: null }),
        insert: async () => ({ error: new Error('Supabase não configurado'), data: null }),
      }
    }
  }
}

export { supabase }
export default supabase
