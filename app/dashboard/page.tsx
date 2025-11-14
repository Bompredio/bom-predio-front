'use client'

import { useAuth } from '../components/AuthProvider'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function Dashboard() {
  const { user, profile, signOut, loading: authLoading } = useAuth()
  const [stats, setStats] = useState({
    totalCondominios: 0,
    totalServicos: 0,
    receitaMensal: 0,
    proximasAssembleias: 0
  })
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    } else if (profile) {
      fetchDashboardData()
    }
  }, [user, profile, authLoading, router])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      let condominiosCount = 0
      let servicosCount = 0
      let receitaTotal = 0

      // Diferentes queries baseadas no tipo de usuário
      if (profile?.user_type === 'administrador') {
        // Buscar condomínios administrados
        const { data: condominios, error } = await supabase
          .from('condominios')
          .select('*')
          .eq('administradora_id', profile.id)

        if (!error) condominiosCount = condominios?.length || 0

        // Buscar serviços da administradora
        const { data: servicos } = await supabase
          .from('servicos')
          .select('*')
          .eq('administradora_id', profile.id)

        servicosCount = servicos?.length || 0

      } else if (profile?.user_type === 'sindico') {
        // Buscar condomínios onde é síndico
        const { data: condominios } = await supabase
          .from('condominios')
          .select('*')
          .eq('sindico_id', profile.id)

        condominiosCount = condominios?.length || 0

        // Buscar serviços do condomínio
        const { data: servicos } = await supabase
          .from('servicos')
          .select('*')
          .eq('condominio_id', condominios?.[0]?.id)

        servicosCount = servicos?.length || 0

      } else if (profile?.user_type === 'prestador') {
        // Buscar serviços do prestador
        const { data: servicos } = await supabase
          .from('servicos')
          .select('*')
          .eq('prestador_id', profile.id)

        servicosCount = servicos?.length || 0

        // Calcular receita dos serviços
        const { data: transacoes } = await supabase
          .from('transacoes')
          .select('valor')
          .eq('status', 'pago')
          .in('servico_id', servicos?.map(s => s.id) || [])

        receitaTotal = transacoes?.reduce((acc, curr) => acc + parseFloat(curr.valor), 0) || 0
      }

      // Buscar assembleias futuras
      const { data: assembleias } = await supabase
        .from('assembleias')
        .select('*')
        .gte('data_agendada', new Date().toISOString())
        .order('data_agendada', { ascending: true })

      setStats({
        totalCondominios: condominiosCount,
        totalServicos: servicosCount,
        receitaMensal: receitaTotal,
        proximasAssembleias: assembleias?.length || 0
      })

    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

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
          <div style={{ fontSize: '2rem', marginBottom: '20px' }}>⏳</div>
          <p style={{ color: '#00032E' }}>Carregando...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Redirecionará para login
  }

  const getUserTypeLabel = () => {
    switch (profile?.user_type) {
      case 'administrador': return '👔 Administrador'
      case 'sindico': return '🏢 Síndico'
      case 'prestador': return '🔧 Prestador de Serviços'
      default: return '👤 Condômino'
    }
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
            <h1 style={{ color: '#00032E', margin: 0, fontSize: '2rem' }}>Dashboard - Bom Prédio</h1>
            <p style={{ color: '#666', margin: '5px 0 0 0' }}>
              Bem-vindo, <strong>{profile?.full_name || user.email}</strong>
            </p>
            <p style={{ color: '#C8A969', margin: '2px 0 0 0', fontWeight: 'bold' }}>
              {getUserTypeLabel()}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <button 
              onClick={() => router.push('/profile')}
              style={{
                padding: '8px 16px',
                background: '#00032E',
                color: '#C8A969',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Meu Perfil
            </button>
            <button 
              onClick={handleSignOut}
              style={{
                padding: '8px 16px',
                background: '#C8A969',
                color: '#00032E',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontWeight: 'bold'
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
            <h3 style={{ color: '#C8A969', margin: '0 0 15px 0' }}>Serviços Ativos</h3>
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
            <h3 style={{ color: '#C8A969', margin: '0 0 15px 0' }}>Receita</h3>
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
            <h3 style={{ color: '#C8A969', margin: '0 0 15px 0' }}>Assembleias</h3>
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
          {/* Gestão */}
          <div style={{
            background: 'white',
            padding: '25px',
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ color: '#00032E', marginBottom: '20px', borderBottom: '2px solid #C8A969', paddingBottom: '10px' }}>
              Gestão
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button style={{
                padding: '15px',
                background: '#00032E',
                color: '#C8A969',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                textAlign: 'left',
                fontWeight: 'bold',
                fontSize: '16px'
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
                fontWeight: 'bold',
                fontSize: '16px'
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
                fontWeight: 'bold',
                fontSize: '16px'
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
            <h3 style={{ color: '#00032E', marginBottom: '20px', borderBottom: '2px solid #C8A969', paddingBottom: '10px' }}>
              Marketplace
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button 
                onClick={() => router.push('/marketplace')}
                style={{
                  padding: '15px',
                  background: '#C8A969',
                  color: '#00032E',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontWeight: 'bold',
                  fontSize: '16px'
                }}
              >
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
                fontWeight: 'bold',
                fontSize: '16px'
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
                fontWeight: 'bold',
                fontSize: '16px'
              }}>
                ⭐ Avaliações
              </button>
            </div>
          </div>

          {/* Comunicação */}
          <div style={{
            background: 'white',
            padding: '25px',
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ color: '#00032E', marginBottom: '20px', borderBottom: '2px solid #C8A969', paddingBottom: '10px' }}>
              Comunicação
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button style={{
                padding: '15px',
                background: 'linear-gradient(135deg, #00032E 0%, #1a237e 100%)',
                color: '#C8A969',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                textAlign: 'left',
                fontWeight: 'bold',
                fontSize: '16px'
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
                fontWeight: 'bold',
                fontSize: '16px'
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
                fontWeight: 'bold',
                fontSize: '16px'
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
