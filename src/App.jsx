import React, { useState, useEffect } from 'react'
import { supabase } from './services/supabase'

function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Verificar se Supabase está configurado
    if (!supabase) {
      setError('Configuração do Supabase não encontrada. Verifique as variáveis de ambiente.')
      setLoading(false)
      return
    }

    // Verificar sessão atual
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('Erro ao obter sessão:', error)
        setError('Erro de autenticação: ' + error.message)
      } else {
        setSession(session)
      }
      setLoading(false)
    }).catch(err => {
      console.error('Erro inesperado:', err)
      setError('Erro inesperado: ' + err.message)
      setLoading(false)
    })

    // Ouvir mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setLoading(false)
    })

    return () => subscription?.unsubscribe()
  }, [])

  // Tela de loading
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <div>🔄 Carregando Bom Prédio...</div>
      </div>
    )
  }

  // Tela de erro
  if (error) {
    return (
      <div style={{ 
        padding: '20px',
        maxWidth: '600px',
        margin: '50px auto',
        backgroundColor: '#fee',
        border: '1px solid #fcc',
        borderRadius: '8px'
      }}>
        <h2 style={{ color: '#c33' }}>❌ Erro de Configuração</h2>
        <p>{error}</p>
        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#fff', borderRadius: '5px' }}>
          <strong>Para corrigir:</strong>
          <ol style={{ marginTop: '10px', marginLeft: '20px' }}>
            <li>Verifique se as variáveis VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY estão configuradas no Vercel</li>
            <li>Certifique-se de que os valores estão corretos e sem espaços</li>
            <li>Recarregue a página após as correções</li>
          </ol>
        </div>
      </div>
    )
  }

  return (
    <div className="App">
      <div className="container">
        <header style={{ 
          padding: '20px 0', 
          borderBottom: '1px solid var(--border-color)',
          backgroundColor: 'white',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h1 style={{ color: 'var(--primary-color)', margin: 0 }}>🏢 Bom Prédio</h1>
          <p style={{ margin: '5px 0 0 0', color: 'var(--text-secondary)' }}>Marketplace de Condomínios</p>
        </header>
        
        <main style={{ padding: '40px 0' }}>
          {!session ? (
            <div className="card" style={{ maxWidth: '400px', margin: '0 auto' }}>
              <h2 className="text-center" style={{ marginBottom: '20px' }}>
                Bem-vindo ao Bom Prédio
              </h2>
              <p className="text-center" style={{ marginBottom: '30px', color: 'var(--text-secondary)' }}>
                Escolha o tipo de conta:
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <button className="btn btn-primary">
                  Sou Condomínio
                </button>
                <button className="btn btn-primary">
                  Sou Administradora
                </button>
                <button className="btn btn-primary">
                  Sou Prestador de Serviços
                </button>
              </div>

              <div style={{ marginTop: '30px', padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '5px' }}>
                <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>
                  <strong>Debug:</strong> Supabase configurado com sucesso ✅
                </p>
              </div>
            </div>
          ) : (
            <div className="card">
              <h2>Dashboard</h2>
              <p>Bem-vindo, {session.user.email}!</p>
              <button 
                className="btn btn-secondary mt-4"
                onClick={() => supabase.auth.signOut()}
              >
                Sair
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default App
