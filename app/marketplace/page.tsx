'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '../components/AuthProvider'
import Link from 'next/link'

interface Prestador {
  id: string
  nome_empresa: string
  tipo_servico: string
  descricao: string
  avaliacao_media: number
  total_avaliacoes: number
  telefone: string
  email_contato: string
}

export default function Marketplace() {
  const { user, profile } = useAuth()
  const [prestadores, setPrestadores] = useState<Prestador[]>([])
  const [loading, setLoading] = useState(true)
  const [filtro, setFiltro] = useState<string>('todos')

  useEffect(() => {
    fetchPrestadores()
  }, [])

  const fetchPrestadores = async () => {
    try {
      const { data, error } = await supabase
        .from('prestadores')
        .select('*')
        .order('avaliacao_media', { ascending: false })

      if (error) throw error
      setPrestadores(data || [])
    } catch (error) {
      console.error('Erro ao buscar prestadores:', error)
    } finally {
      setLoading(false)
    }
  }

  const servicosFiltrados = filtro === 'todos' 
    ? prestadores 
    : prestadores.filter(p => p.tipo_servico === filtro)

  const tiposServico = [
    { value: 'todos', label: 'Todos os Serviços' },
    { value: 'limpeza', label: '🧹 Limpeza' },
    { value: 'elevadores', label: '🛗 Elevadores' },
    { value: 'seguranca', label: '🚨 Segurança' },
    { value: 'jardinagem', label: '🌿 Jardinagem' },
    { value: 'hidraulica', label: '🔧 Hidráulica' },
    { value: 'incendio', label: '🔥 Incêndio' },
    { value: 'desentupimento', label: '💧 Desentupimento' }
  ]

  if (loading) {
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
          <p style={{ color: '#00032E' }}>Carregando prestadores...</p>
        </div>
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
        maxWidth: '1200px', 
        margin: '0 auto'
      }}>
        <div style={{ 
          background: 'white',
          borderRadius: '15px',
          padding: '40px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          marginBottom: '30px'
        }}>
          <h1 style={{ 
            marginBottom: '10px', 
            color: '#00032E',
            fontSize: '2.5rem'
          }}>Marketplace de Serviços</h1>
          <p style={{ 
            color: '#666', 
            marginBottom: '30px',
            fontSize: '1.2rem'
          }}>Encontre os melhores prestadores para o seu condomínio em Portugal</p>

          {/* Filtros */}
          <div style={{ marginBottom: '30px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '10px', 
              color: '#00032E', 
              fontWeight: 'bold' 
            }}>
              Filtrar por tipo de serviço:
            </label>
            <select 
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              style={{
                padding: '12px 20px',
                border: '2px solid #00032E',
                borderRadius: '8px',
                fontSize: '16px',
                background: 'white',
                minWidth: '250px'
              }}
            >
              {tiposServico.map(servico => (
                <option key={servico.value} value={servico.value}>
                  {servico.label}
                </option>
              ))}
            </select>
          </div>

          {/* Lista de Prestadores */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '25px'
          }}>
            {servicosFiltrados.map((prestador) => (
              <div 
                key={prestador.id}
                style={{
                  padding: '30px',
                  border: '2px solid #00032E',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  background: 'white'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#00032E'
                  e.currentTarget.style.color = '#C8A969'
                  e.currentTarget.style.transform = 'translateY(-5px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'white'
                  e.currentTarget.style.color = '#00032E'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                <h3 style={{ marginBottom: '15px', fontSize: '1.4rem' }}>
                  {prestador.nome_empresa}
                </h3>
                
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  marginBottom: '15px'
                }}>
                  <span style={{
                    padding: '5px 10px',
                    background: '#C8A969',
                    color: '#00032E',
                    borderRadius: '20px',
                    fontSize: '14px',
                    fontWeight: 'bold'
                  }}>
                    {prestador.tipo_servico}
                  </span>
                  
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 'bold' }}>
                      ⭐ {prestador.avaliacao_media || 'N/A'}
                    </div>
                    <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>
                      {prestador.total_avaliacoes || 0} avaliações
                    </div>
                  </div>
                </div>

                {prestador.descricao && (
                  <p style={{ 
                    marginBottom: '20px', 
                    lineHeight: '1.5',
                    opacity: 0.8
                  }}>
                    {prestador.descricao}
                  </p>
                )}

                <div style={{ display: 'flex', gap: '10px' }}>
                  <Link 
                    href={`/marketplace/prestador/${prestador.id}`}
                    style={{
                      flex: 1,
                      padding: '12px 20px',
                      background: '#C8A969',
                      color: '#00032E',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      textAlign: 'center',
                      textDecoration: 'none',
                      display: 'inline-block'
                    }}
                  >
                    Ver Perfil
                  </Link>
                  
                  {user && (
                    <Link
                      href={`/chat?destinatario=${prestador.id}`}
                      style={{
                        padding: '12px 20px',
                        background: '#00032E',
                        color: '#C8A969',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        textAlign: 'center',
                        textDecoration: 'none',
                        display: 'inline-block'
                      }}
                    >
                      💬 Chat
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>

          {servicosFiltrados.length === 0 && (
            <div style={{ 
              textAlign: 'center', 
              padding: '40px',
              color: '#666'
            }}>
              <h3>Nenhum prestador encontrado</h3>
              <p>Tente alterar o filtro ou verifique mais tarde.</p>
            </div>
          )}
        </div>

        {/* Estatísticas do Mercado */}
        <div style={{
          background: 'linear-gradient(135deg, #00032E 0%, #1a237e 100%)',
          borderRadius: '15px',
          padding: '40px',
          color: 'white',
          textAlign: 'center'
        }}>
          <h2 style={{ color: '#C8A969', marginBottom: '30px' }}>Mercado Português de Condomínios</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '30px' }}>
            <div>
              <div style={{ fontSize: '2rem', color: '#C8A969', fontWeight: 'bold' }}>1.87B €</div>
              <div>Volume Total Anual</div>
            </div>
            <div>
              <div style={{ fontSize: '2rem', color: '#C8A969', fontWeight: 'bold' }}>6.347</div>
              <div>Empresas Ativas</div>
            </div>
            <div>
              <div style={{ fontSize: '2rem', color: '#C8A969', fontWeight: 'bold' }}>250k</div>
              <div>Condomínios</div>
            </div>
            <div>
              <div style={{ fontSize: '2rem', color: '#C8A969', fontWeight: 'bold' }}>44%</div>
              <div>Concentração Lisboa</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
