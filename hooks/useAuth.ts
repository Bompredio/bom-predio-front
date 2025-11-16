import { create } from 'zustand'
import { supabase, Profile, UserType } from '@/lib/supabase'
import { useEffect, useState } from 'react'

interface AuthState {
  user: any | null
  profile: Profile | null
  isLoading: boolean
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}

export const useAuth = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  isLoading: true,

  signOut: async () => {
    await supabase.auth.signOut()
    set({ user: null, profile: null })
  },

  refreshProfile: async () => {
    const { user } = get()
    if (!user) return

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (!error && profile) {
      set({ profile })
    }
  },
}))

// Hook para usar no React
export const useAuthState = () => {
  const { user, profile, isLoading, signOut, refreshProfile } = useAuth()
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    // Verifica sessão atual
    supabase.auth.getSession().then(({ data: { session } }) => {
      useAuth.setState({ 
        user: session?.user ?? null, 
        isLoading: false 
      })
      setIsInitialized(true)
    })

    // Escuta mudanças de autenticação
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      useAuth.setState({ 
        user: session?.user ?? null, 
        isLoading: false 
      })

      if (session?.user) {
        // Busca perfil do usuário
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()

        useAuth.setState({ profile: profile || null })
      } else {
        useAuth.setState({ profile: null })
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  return {
    user,
    profile,
    isLoading: isLoading || !isInitialized,
    signOut,
    refreshProfile,
    isAuthenticated: !!user,
  }
}
