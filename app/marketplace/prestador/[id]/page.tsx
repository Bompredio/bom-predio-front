'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/app/components/AuthProvider'
import Link from 'next/link'

interface Prestador {
  id: string
  nome_empresa: string
  tipo_servico: string
  descricao: string
  telefone: string
  email_contato: string
  avaliacao_media: number
  total_avaliacoes: number
}

interface Avaliacao {
  id: string
  pontuacao: number
  comentario: string
  created_at: string
  avaliador: {
    full_name: string
  }
}

export default function PrestadorProfile() {
  const params = useParams()
  const { user } = useAuth()
  const [prestador, setPrestador] = useState<Prestador | null>(null)
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      fetchPrestador()
      fetchAvaliacoes()
    }
  }, [params.id])

  const fetchPrestador = async () => {
    try {
      const { data, error } = await supabase
        .from('prestadores')
        .select('*')
        .eq('id', params.id)
        .single()

      if (error) throw error
      setPrestador(data)
    } catch (error) {
      console.error('Erro ao buscar prestador:', error)
    }
  }

  const fetchAvaliacoes = async () => {
    try {
      const { data, error } = await supabase
        .from('avaliacoes')
        .select(`
          *,
          avaliador:profiles(full_name)
        `)
        .eq('avaliado_id', params.id)

      if (error) throw error
      setAvaliacoes(data || [])
    } catch (error) {
      console.error('Erro ao buscar avaliações:', error)
    } finally {
      setLoading(false)
    }
  }

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
          <p style={{ color: '#00032E' }}>Carregando perfil...</p>
        </div>
      </div>
    )
  }

  if (!prestador) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2 style={{ color: '#00032E' }}>Prestador não encontrado</h2>
        <Link href="/marketplace" style={{
          color: '#C8A969',
          textDecoration: 'none',
          fontWeight: 'bold'
        }}>
          Voltar ao Marketplace
        </Link>
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
        maxWidth: '1000px', 
        margin: '0 auto'
      }}>
        <div style={{ 
          background: 'white',
          borderRadius: '15px',
          padding: '40px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          marginBottom: '30px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '30px' }}>
            <div>
              <h1 style={{ 
                color: '#00032E',
                marginBottom: '10px'
              }}>{prestador.nome_empresa}</h1>
              
              <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                <div style={{ 
                  padding: '10px 20px', 
                  background: '#C8A969', 
                  color: '#00032E',
                  borderRadius: '20px',
                  fontWeight: 'bold'
                }}>
                  {prestador.tipo_servico}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
                    ⭐ {prestador.avaliacao_media || 'N/A'}
                  </span>
                  <span style={{ color: '#666' }}>
                    ({prestador.total_avaliacoes || 0} avaliações)
                  </span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '15px' }}>
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
                    textDecoration: 'none',
                    display: 'inline-block'
                  }}
                >
                  💬 Iniciar Chat
                </Link>
              )}
              <Link 
                href="/marketplace"
                style={{
                  padding: '12px 20px',
                  background: '#C8A969',
                  color: '#00032E',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  textDecoration: 'none',
                  display: 'inline-block'
                }}
              >
                ← Voltar
              </Link>
            </div>
          </div>

          {prestador.descricao && (
            <div style={{ marginBottom: '30px' }}>
              <h3 style={{ color: '#00032E', marginBottom: '15px' }}>Sobre a Empresa</h3>
              <p style={{ lineHeight: '1.6', fontSize: '16px' }}>{prestador.descricao}</p>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
            <div>
              <h3 style={{ color: '#00032E', marginBottom: '20px' }}>Informações de Contato</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {prestador.telefone && (
                  <div>
                    <strong>Telefone:</strong> {prestador.telefone}
                  </div>
                )}
                {prestador.email_contato && (
                  <div>
                    <strong>E-mail:</strong> {prestador.email_contato}
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 style={{ color: '#00032E', marginBottom: '20px' }}>Avaliações</h3>
              {avaliacoes.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  {avaliacoes.map((avaliacao) => (
                    <div 
                      key={avaliacao.id}
                      style={{
                        padding: '15px',
                        background: '#f8f9fa',
                        borderRadius: '8px',
                        border: '1px solid #e0e0e0'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                        <strong>{avaliacao.avaliador.full_name}</strong>
                        <span>⭐ {avaliacao.pontuacao}/5</span>
                      </div>
                      <p style={{ margin: 0, color: '#666' }}>{avaliacao.comentario}</p>
                      <div style={{ fontSize: '12px', color: '#999', marginTop: '5px' }}>
                        {new Date(avaliacao.created_at).toLocaleDateString('pt-PT')}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: '#666' }}>Nenhuma avaliação ainda.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
