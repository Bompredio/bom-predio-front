'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '../components/AuthProvider'

interface Assembleia {
  id: string
  titulo: string
  descricao: string
  data_agendada: string
  jitsi_room_id: string
  status: string
  condominio: {
    nome: string
  }
}

export default function Assembleias() {
  const { user, profile } = useAuth()
  const [assembleias, setAssembleias] = useState<Assembleia[]>([])
  const [loading, setLoading] = useState(true)
  const [showNovaAssembleia, setShowNovaAssembleia] = useState(false)
  const [novaAssembleia, setNovaAssembleia] = useState({
    titulo: '',
    descricao: '',
    data_agendada: ''
  })

  useEffect(() => {
    if (user) {
      fetchAssembleias()
    }
  }, [user])

  const fetchAssembleias = async () => {
    try {
      let query = supabase
        .from('assembleias')
        .select(`
          *,
          condominio:condominios(nome)
        `)
        .order('data_agendada', { ascending: true })

      // Filtros baseados no tipo de usuário
      if (profile?.user_type === 'sindico') {
        const { data: condominios } = await supabase
          .from('condominios')
          .select('id')
          .eq('sindico_id', profile.id)

        if (condominios) {
          query = query.in('condominio_id', condominios.map(c => c.id))
        }
      } else if (profile?.user_type === 'administrador') {
        const { data: condominios } = await supabase
          .from('condominios')
          .select('id')
          .eq('administradora_id', profile.id)

        if (condominios) {
          query = query.in('condominio_id', condominios.map(c => c.id))
        }
      }

      const { data, error } = await query
      if (error) throw error
      setAssembleias(data || [])
    } catch (error) {
      console.error('Erro ao buscar assembleias:', error)
    } finally {
      setLoading(false)
    }
  }

  const criarAssembleia = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      // Gerar ID único para a sala Jitsi
      const jitsiRoomId = `bompredio-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      
      const { error } = await supabase
        .from('assembleias')
        .insert([
          {
            titulo: novaAssembleia.titulo,
            descricao: novaAssembleia.descricao,
            data_agendada: novaAssembleia.data_agendada,
            jitsi_room_id: jitsiRoomId,
            condominio_id: 'mock-condominio-id' // Em produção, pegar do contexto
          }
        ])

      if (error) throw error

      setNovaAssembleia({ titulo: '', descricao: '', data_agendada: '' })
      setShowNovaAssembleia(false)
      fetchAssembleias()
      
      alert('Assembleia criada com sucesso!')
    } catch (error) {
      console.error('Erro ao criar assembleia:', error)
      alert('Erro ao criar assembleia')
    }
  }

  const entrarNaAssembleia = (jitsiRoomId: string) => {
    // URL do Jitsi Meet - você pode usar um servidor próprio ou o público
    const jitsiUrl = `https://meet.jit.si/${jitsiRoomId}`
    window.open(jitsiUrl, '_blank', 'noopener,noreferrer')
  }

  if (!user) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2 style={{ color: '#00032E' }}>Faça login para acessar as assembleias</h2>
        <a href="/login" style={{
          color: '#C8A969',
          textDecoration: 'none',
          fontWeight: 'bold'
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <h1 style={{ color: '#00032E', margin: 0 }}>Assembleias Virtuais</h1>
            
            {(profile?.user_type === 'sindico' || profile?.user_type === 'administrador') && (
              <button
                onClick={() => setShowNovaAssembleia(true)}
                style={{
                  padding: '12px 24px',
                  background: '#C8A969',
                  color: '#00032E',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                🎥 Nova Assembleia
              </button>
            )}
          </div>

          {/* Modal Nova Assembleia */}
          {showNovaAssembleia && (
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.5)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 1000
            }}>
              <div style={{
                background: 'white',
                padding: '40px',
                borderRadius: '15px',
                width: '90%',
                maxWidth: '500px'
              }}>
                <h3 style={{ color: '#00032E', marginBottom: '20px' }}>Nova Assembleia</h3>
                
                <form onSubmit={criarAssembleia} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', color: '#00032E', fontWeight: 'bold' }}>
                      Título *
                    </label>
                    <input
                      type="text"
                      value={novaAssembleia.titulo}
                      onChange={(e) => setNovaAssembleia({...novaAssembleia, titulo: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '2px solid #00032E',
                        borderRadius: '8px',
                        fontSize: '16px'
                      }}
                      placeholder="Título da assembleia"
                      required
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', color: '#00032E', fontWeight: 'bold' }}>
                      Descrição
                    </label>
                    <textarea
                      value={novaAssembleia.descricao}
                      onChange={(e) => setNovaAssembleia({...novaAssembleia, descricao: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '2px solid #00032E',
                        borderRadius: '8px',
                        fontSize: '16px',
                        minHeight: '100px',
                        resize: 'vertical'
                      }}
                      placeholder="Descrição da assembleia..."
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', color: '#00032E', fontWeight: 'bold' }}>
                      Data e Hora *
                    </label>
                    <input
                      type="datetime-local"
                      value={novaAssembleia.data_agendada}
                      onChange={(e) => setNovaAssembleia({...novaAssembleia, data_agendada: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '2px solid #00032E',
                        borderRadius: '8px',
                        fontSize: '16px'
                      }}
                      required
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end' }}>
                    <button
                      type="button"
                      onClick={() => setShowNovaAssembleia(false)}
                      style={{
                        padding: '12px 24px',
                        background: '#ccc',
                        color: '#333',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer'
                      }}
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      style={{
                        padding: '12px 24px',
                        background: '#C8A969',
                        color: '#00032E',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                      }}
                    >
                      Criar Assembleia
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Lista de Assembleias */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <div style={{ fontSize: '2rem', marginBottom: '20px' }}>⏳</div>
              <p>Carregando assembleias...</p>
            </div>
          ) : assembleias.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
              <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🎥</div>
              <h3>Nenhuma assembleia agendada</h3>
              <p>Quando houver assembleias agendadas, elas aparecerão aqui.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {assembleias.map((assembleia) => (
                <div
                  key={assembleia.id}
                  style={{
                    padding: '25px',
                    border: '2px solid #00032E',
                    borderRadius: '12px',
                    background: 'white'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                    <div>
                      <h3 style={{ color: '#00032E', marginBottom: '10px' }}>{assembleia.titulo}</h3>
                      <p style={{ color: '#666', marginBottom: '10px' }}>
                        <strong>Condomínio:</strong> {assembleia.condominio?.nome || 'Não especificado'}
                      </p>
                      <p style={{ color: '#666', marginBottom: '10px' }}>
                        <strong>Data:</strong> {new Date(assembleia.data_agendada).toLocaleString('pt-PT')}
                      </p>
                      {assembleia.descricao && (
                        <p style={{ color: '#666' }}>{assembleia.descricao}</p>
                      )}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'flex-end' }}>
                      <span style={{
                        padding: '5px 10px',
                        background: assembleia.status === 'agendada' ? '#4CAF50' : 
                                   assembleia.status === 'em_andamento' ? '#FF9800' : '#f44336',
                        color: 'white',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}>
                        {assembleia.status}
                      </span>

                      <button
                        onClick={() => entrarNaAssembleia(assembleia.jitsi_room_id)}
                        style={{
                          padding: '10px 20px',
                          background: '#C8A969',
                          color: '#00032E',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontWeight: 'bold'
                        }}
                      >
                        🎥 Entrar na Assembleia
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
