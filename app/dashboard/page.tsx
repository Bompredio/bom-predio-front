'use client'

import { useAuth } from '../components/AuthProvider'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Dashboard() {
  const { user, profile, signOut, loading: authLoading, error } = useAuth()
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    } else {
      setLoading(false)
    }
  }, [user, authLoading, router])

  if (authLoading || loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '50vh',
        background: '#f8f9fa'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '20px' }}>⏳</div>
          <h3 style={{ color: '#00032E' }}>Carregando Dashboard...</h3>
          <p style={{ color: '#666' }}>Aguarde um momento</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '50vh',
        background: '#f8f9fa'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '20px' }}>❌</div>
          <h3 style={{ color: '#00032E' }}>Erro ao Carregar</h3>
          <p style={{ color: '#666', marginBottom: '20px' }}>{error}</p>
          <button 
            onClick={() => window.location.reload()}
            style={{
              padding: '10px 20px',
              background: '#C8A969',
              color: '#00032E',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Redirecionará para login
  }

  return (
    <div style={{ 
      background: '#f8f9fa', 
      minHeight: '100vh',
      padding: '20px'
    }}>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto'
      }}>
        {/* Header simplificado para teste */}
        <div style={{ 
          background: 'white',
          borderRadius: '15px',
          padding: '30px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          marginBottom: '30px',
          textAlign: 'center'
        }}>
          <h1 style={{ color: '#00032E', marginBottom: '10px' }}>🎉 Dashboard Funcionando!</h1>
          <p style={{ color: '#666' }}>
            Bem-vindo, {profile?.full_name || user.email}
          </p>
          <p style={{ color: '#C8A969', fontWeight: 'bold' }}>
            Tipo: {profile?.user_type || 'Não definido'}
          </p>
        </div>

        {/* Botões de teste */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px'
        }}>
          <button 
            onClick={() => router.push('/marketplace')}
            style={{
              padding: '20px',
              background: '#C8A969',
              color: '#00032E',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '16px'
            }}
          >
            🏪 Testar Marketplace
          </button>
          
          <button 
            onClick={() => router.push('/debug-supabase')}
            style={{
              padding: '20px',
              background: '#00032E',
              color: '#C8A969',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '16px'
            }}
          >
            🔧 Debug Supabase
          </button>
        </div>
      </div>
    </div>
  )
}
