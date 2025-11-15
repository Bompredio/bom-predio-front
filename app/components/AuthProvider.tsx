'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { User, Session } from '@supabase/supabase-js'

interface Profile {
  id: string
  email: string
  full_name: string
  user_type: 'condomino' | 'sindico' | 'administrador' | 'prestador'
  phone?: string
  avatar_url?: string
}

interface AuthContextType {
  user: User | null
  session: Session | null
  profile: Profile | null
  signOut: () => Promise<void>
  loading: boolean
  error: string | null
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProfile = async (userId: string) => {
    try {
      console.log('🔄 Buscando perfil para usuário:', userId)
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()
      
      if (error) {
        console.error('❌ Erro ao buscar perfil:', error)
        setError(`Erro ao carregar perfil: ${error.message}`)
        setProfile(null)
      } else {
        console.log('✅ Perfil carregado:', data)
        setProfile(data)
        setError(null)
      }
    } catch (error: any) {
      console.error('❌ Erro em fetchProfile:', error)
      setError(`Erro: ${error.message}`)
      setProfile(null)
    }
  }

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id)
    }
  }

  useEffect(() => {
    const getSession = async () => {
      try {
        console.log('🔄 Obtendo sessão...')
        setLoading(true)
        setError(null)
        
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('❌ Erro ao obter sessão:', error)
          setError(`Erro de autenticação: ${error.message}`)
          return
        }

        console.log('✅ Sessão:', session)
        setSession(session)
        setUser(session?.user ?? null)
        
        if (session?.user) {
          await fetchProfile(session.user.id)
        } else {
          setProfile(null)
        }
      } catch (error: any) {
        console.error('❌ Erro em getSession:', error)
        setError(`Erro: ${error.message}`)
      } finally {
        setLoading(false)
      }
    }

    getSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Mudança de estado de auth:', event, session)
        setSession(session)
        setUser(session?.user ?? null)
        
        if (session?.user) {
          await fetchProfile(session.user.id)
        } else {
          setProfile(null)
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
      setError(null)
    } catch (error: any) {
      console.error('❌ Erro ao fazer logout:', error)
      setError(`Erro ao sair: ${error.message}`)
    }
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      profile, 
      signOut, 
      loading,
      error,
      refreshProfile 
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
