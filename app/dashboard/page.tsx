 'úse client'

import { useAuth } from '../components/AuthProvider'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function Dashboard() {
  const { user, profile, signOut } = useAuth()
  const [stats, setStats] = useState({
    totalCondominios: 0,
    totalServicos: 0,
    receitaMensal: 0,
    proximasAssembleias: 0
  })

  useEffect(() => {
    if (profile) {
      fetchDashboardData()
    }
  }, [profile])

  const fetchDashboardData = async () => {
    // Buscar dados do dashboard baseado no tipo de usuário
    const { data: condominios } = await supabase
      .from('condominios')
      .select('*')
      .eq(profile.user_type === 'administrador' ? 'administradora_id' : 'sindico_id', profile.id)

    const { data: servicos } = await supabase
      .from('servicos')
      .select('*')
      .eq('status', 'pendente')

    const { data: transacoes } = await supabase
      .from('transacoes')
      .select('valor')
      .eq('status', 'pago')

    const receita = transacoes?.reduce((acc, curr) => acc + parseFloat(curr.valor), 0) || 0

    setStats({
      totalCondominios: condominios?.length || 0,
      totalServicos: servicos?.length || 0,
      receitaMensal: receita,
      proximasAssembleias: 3 // Mock por enquanto
    })
  }

  if (!user) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Por favor, faça login para acessar o dashboard</h2>
        <a href="/login" style={{
          padding: '10px 20px',
          background: '#C8A969',
          color: '#00032E',
          textDecoration: 'none',
          borderRadius: '5px',
          display: 'inline-block',
          marginTop: '10px'
        }}>
          Fazer Login
        </a>
      </div>
    )
  }

  return (
    <div style={{ 
      background: '#f8f9fa', 
      minHeight: '100vh',
      padding: '20px'
    }}>
      <div style={{ 
        maxWidth: '1400px', 
        margin: '0 auto'
      }}>
        {/* Header do Dashboard */}
        <div style={{ 
          background: 'white',
          borderRadius: '15px',
          padding: '30px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          marginBottom: '30px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h1 style={{ color: '#00032E', margin: 0 }}>Dashboard - Bom Prédio</h1>
            <p style={{ color: '#666', margin: '5px 0 0 0' }}>
              Bem-vindo, {profile?.full_name || user.email}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <span style={{ color: '#00032E', fontWeight: 'bold' }}>
              {profile?.user_type === 'administrador' ? '👔 Administrador' : 
               profile?.user_type === 'sindico' ? '🏢 Síndico' :
               profile?.user_type === 'prestador' ? '🔧 Prestador' : '👤 Condômino'}
            </span>
            <button 
              onClick={signOut}
              style={{
                padding: '8px 16px',
                background: '#00032E',
                color: '#C8A969',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Sair
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '25px',
          marginBottom: '30px'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #00032E 0%, #1a237e 100%)',
            padding: '25px',
            borderRadius: '12px',
            color: 'white',
            textAlign: 'center'
          }}>
            <h3 style={{ color: '#C8A969', margin: '0 0 15px 0' }}>Condomínios</h3>
            <p style={{ fontSize: '2.5rem', margin: 0, fontWeight: 'bold' }}>
              {stats.totalCondominios}
            </p>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #00032E 0%, #1a237e 100%)',
            padding: '25px',
            borderRadius: '12px',
            color: 'white',
            textAlign: 'center'
          }}>
            <h3 style={{ color: '#C8A969', margin: '0 0 15px 0' }}>Serviços Pendentes</h3>
            <p style={{ fontSize: '2.5rem', margin: 0, fontWeight: 'bold' }}>
              {stats.totalServicos}
            </p>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #00032E 0%, #1a237e 100%)',
            padding: '25px',
            borderRadius: '12px',
            color: 'white',
            textAlign: 'center'
          }}>
            <h3 style={{ color: '#C8A969', margin: '0 0 15px 0' }}>Receita Mensal</h3>
            <p style={{ fontSize: '2.5rem', margin: 0, fontWeight: 'bold' }}>
              €{stats.receitaMensal}
            </p>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #00032E 0%, #1a237e 100%)',
            padding: '25px',
            borderRadius: '12px',
            color: 'white',
            textAlign: 'center'
          }}>
            <h3 style={{ color: '#C8A969', margin: '0 0 15px 0' }}>Próximas Assembleias</h3>
            <p style={{ fontSize: '2.5rem', margin: 0, fontWeight: 'bold' }}>
              {stats.proximasAssembleias}
            </p>
          </div>
        </div>

        {/* Ações Rápidas */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '25px'
        }}>
          {/* Gestão de Condomínios */}
          <div style={{
            background: 'white',
            padding: '25px',
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ color: '#00032E', marginBottom: '20px' }}>Gestão de Condomínios</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button style={{
                padding: '15px',
                background: '#00032E',
                color: '#C8A969',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                textAlign: 'left',
                fontWeight: 'bold'
              }}>
                📊 Gestão Financeira
              </button>
              <button style={{
                padding: '15px',
                background: '#00032E',
                color: '#C8A969',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                textAlign: 'left',
                fontWeight: 'bold'
              }}>
                📄 Documentos
              </button>
              <button style={{
                padding: '15px',
                background: '#00032E',
                color: '#C8A969',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                textAlign: 'left',
                fontWeight: 'bold'
              }}>
                🗣️ Comunicação
              </button>
            </div>
          </div>

          {/* Marketplace */}
          <div style={{
            background: 'white',
            padding: '25px',
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ color: '#00032E', marginBottom: '20px' }}>Marketplace</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button style={{
                padding: '15px',
                background: '#C8A969',
                color: '#00032E',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                textAlign: 'left',
                fontWeight: 'bold'
              }}>
                🔍 Encontrar Prestadores
              </button>
              <button style={{
                padding: '15px',
                background: '#C8A969',
                color: '#00032E',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                textAlign: 'left',
                fontWeight: 'bold'
              }}>
                💰 Solicitar Orçamentos
              </button>
              <button style={{
                padding: '15px',
                background: '#C8A969',
                color: '#00032E',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                textAlign: 'left',
                fontWeight: 'bold'
              }}>
                ⭐ Avaliações
              </button>
            </div>
          </div>

          {/* Assembleias & Chat */}
          <div style={{
            background: 'white',
            padding: '25px',
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ color: '#00032E', marginBottom: '20px' }}>Comunicação</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button style={{
                padding: '15px',
                background: 'linear-gradient(135deg, #00032E 0%, #1a237e 100%)',
                color: '#C8A969',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                textAlign: 'left',
                fontWeight: 'bold'
              }}>
                🎥 Nova Assembleia
              </button>
              <button style={{
                padding: '15px',
                background: 'linear-gradient(135deg, #00032E 0%, #1a237e 100%)',
                color: '#C8A969',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                textAlign: 'left',
                fontWeight: 'bold'
              }}>
                💬 Chat Online
              </button>
              <button style={{
                padding: '15px',
                background: 'linear-gradient(135deg, #00032E 0%, #1a237e 100%)',
                color: '#C8A969',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                textAlign: 'left',
                fontWeight: 'bold'
              }}>
                📢 Anúncios
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
