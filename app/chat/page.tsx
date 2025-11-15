'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useAuth } from '../components/AuthProvider'

interface Mensagem {
  id: string
  remetente_id: string
  destinatario_id: string
  mensagem: string
  created_at: string
  lida: boolean
  remetente: {
    full_name: string
  }
}

export default function Chat() {
  const { user, profile } = useAuth()
  const router = useRouter()
  const [mensagens, setMensagens] = useState<Mensagem[]>([])
  const [novaMensagem, setNovaMensagem] = useState('')
  const [destinatario, setDestinatario] = useState('')
  const [loading, setLoading] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Buscar destinatário da URL de forma segura
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search)
      const destinatarioParam = urlParams.get('destinatario')
      if (destinatarioParam) {
        setDestinatario(destinatarioParam)
      }
    }
  }, [])

  useEffect(() => {
    if (user && destinatario) {
      fetchMensagens()
      subscribeToMessages()
    }
  }, [user, destinatario])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [mensagens])

  const fetchMensagens = async () => {
    if (!destinatario) return

    try {
      const { data, error } = await supabase
        .from('mensagens')
        .select(`
          *,
          remetente:profiles(full_name)
        `)
        .or(`and(remetente_id.eq.${user!.id},destinatario_id.eq.${destinatario}),and(remetente_id.eq.${destinatario},destinatario_id.eq.${user!.id})`)
        .order('created_at', { ascending: true })

      if (error) throw error
      setMensagens(data || [])
    } catch (error) {
      console.error('Erro ao buscar mensagens:', error)
    } finally {
      setLoading(false)
    }
  }

  const subscribeToMessages = () => {
    if (!destinatario) return

    const subscription = supabase
      .channel('mensagens')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'mensagens',
          filter: `or(and(remetente_id=eq.${user!.id},destinatario_id=eq.${destinatario}),and(remetente_id=eq.${destinatario},destinatario_id=eq.${user!.id}))`
        },
        (payload) => {
          setMensagens(prev => [...prev, payload.new as Mensagem])
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }

  const enviarMensagem = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!novaMensagem.trim() || !destinatario) return

    try {
      const { error } = await supabase
        .from('mensagens')
        .insert([
          {
            remetente_id: user!.id,
            destinatario_id: destinatario,
            mensagem: novaMensagem.trim()
          }
        ])

      if (error) throw error
      setNovaMensagem('')
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error)
    }
  }

  if (!user) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2 style={{ color: '#00032E' }}>Faça login para acessar o chat</h2>
        <button 
          onClick={() => router.push('/login')}
          style={{
            padding: '10px 20px',
            background: '#C8A969',
            color: '#00032E',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Fazer Login
        </button>
      </div>
    )
  }

  if (!destinatario) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2 style={{ color: '#00032E' }}>Selecione um destinatário para iniciar o chat</h2>
        <button 
          onClick={() => router.push('/marketplace')}
          style={{
            padding: '10px 20px',
            background: '#C8A969',
            color: '#00032E',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Voltar ao Marketplace
        </button>
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
        maxWidth: '800px', 
        margin: '0 auto',
        background: 'white',
        borderRadius: '15px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        height: '80vh',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header do Chat */}
        <div style={{
          padding: '20px',
          background: '#00032E',
          color: '#C8A969',
          borderRadius: '15px 15px 0 0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h3 style={{ margin: 0 }}>💬 Chat</h3>
          <button 
            onClick={() => router.push('/marketplace')}
            style={{
              background: 'none',
              border: 'none',
              color: '#C8A969',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            ← Voltar
          </button>
        </div>

        {/* Área de Mensagens */}
        <div style={{
          flex: 1,
          padding: '20px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '15px'
        }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <div style={{ fontSize: '2rem', marginBottom: '10px' }}>⏳</div>
              <p>Carregando mensagens...</p>
            </div>
          ) : mensagens.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
              <div style={{ fontSize: '3rem', marginBottom: '20px' }}>💬</div>
              <h3>Nenhuma mensagem ainda</h3>
              <p>Envie a primeira mensagem para iniciar a conversa!</p>
            </div>
          ) : (
            mensagens.map((mensagem) => (
              <div
                key={mensagem.id}
                style={{
                  alignSelf: mensagem.remetente_id === user.id ? 'flex-end' : 'flex-start',
                  background: mensagem.remetente_id === user.id ? '#C8A969' : '#00032E',
                  color: mensagem.remetente_id === user.id ? '#00032E' : '#C8A969',
                  padding: '12px 16px',
                  borderRadius: '15px',
                  maxWidth: '70%',
                  wordWrap: 'break-word'
                }}
              >
                <div style={{ fontSize: '12px', opacity: 0.8, marginBottom: '5px' }}>
                  {mensagem.remetente.full_name}
                </div>
                <div>{mensagem.mensagem}</div>
                <div style={{ fontSize: '10px', opacity: 0.6, textAlign: 'right', marginTop: '5px' }}>
                  {new Date(mensagem.created_at).toLocaleTimeString('pt-PT', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input de Mensagem */}
        <form onSubmit={enviarMensagem} style={{
          padding: '20px',
          borderTop: '1px solid #e0e0e0',
          display: 'flex',
          gap: '10px'
        }}>
          <input
            type="text"
            value={novaMensagem}
            onChange={(e) => setNovaMensagem(e.target.value)}
            placeholder="Digite sua mensagem..."
            style={{
              flex: 1,
              padding: '12px 16px',
              border: '2px solid #00032E',
              borderRadius: '25px',
              fontSize: '16px',
              outline: 'none'
            }}
          />
          <button
            type="submit"
            disabled={!novaMensagem.trim()}
            style={{
              padding: '12px 20px',
              background: novaMensagem.trim() ? '#C8A969' : '#ccc',
              color: '#00032E',
              border: 'none',
              borderRadius: '25px',
              cursor: novaMensagem.trim() ? 'pointer' : 'not-allowed',
              fontWeight: 'bold'
            }}
          >
            Enviar
          </button>
        </form>
      </div>
    </div>
  )
}
