import React, { useState } from 'react'
import { supabase } from '../services/supabase'

export default function ContactModal({ visible, onClose, profile }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState(null)

  if (!visible) return null

  async function handleSend(e) {
    e.preventDefault()
    setStatus(null)
    if (!name || !email) {
      setStatus({ ok: false, text: 'Nome e e-mail são obrigatórios.' })
      return
    }
    setLoading(true)

    // Se supabase configurado, insere em inquiries
    if (supabase) {
      try {
        const payload = {
          profile_id: profile?.id || null,
          name, email, phone, message
        }
        const { data, error } = await supabase.from('inquiries').insert([payload]).select().single()
        if (error) {
          console.error('Erro ao gravar inquiry:', error)
          setStatus({ ok: false, text: 'Erro ao enviar. Tente novamente.' })
        } else {
          setStatus({ ok: true, text: 'Mensagem enviada! A administradora será contactada.' })
        }
      } catch (err) {
        console.error(err)
        setStatus({ ok: false, text: 'Erro inesperado.' })
      } finally {
        setLoading(false)
      }
    } else {
      // Fallback: abrir mailto
      const subject = encodeURIComponent(`Pedido de contacto para ${profile?.company_name || 'administradora'}`)
      const body = encodeURIComponent(`Nome: ${name}\nTelefone: ${phone}\n\n${message}`)
      window.location.href = `mailto:${profile?.contact_email || 'contact@example.com'}?subject=${subject}&body=${body}`
      setLoading(false)
      setStatus({ ok: true, text: 'Abrindo cliente de email...' })
    }
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0,0,0,0.35)', zIndex: 9999
    }}>
      <div style={{ width: 'min(720px,95%)', background:'#fff', borderRadius:8, padding:20 }}>
        <h3>Contactar {profile?.company_name || ''}</h3>
        <form onSubmit={handleSend}>
          <div style={{ marginBottom:10 }}>
            <label>Nome</label>
            <input required className="form-input" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div style={{ marginBottom:10 }}>
            <label>E-mail</label>
            <input required type="email" className="form-input" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div style={{ marginBottom:10 }}>
            <label>Telefone</label>
            <input className="form-input" value={phone} onChange={e => setPhone(e.target.value)} />
          </div>
          <div style={{ marginBottom:10 }}>
            <label>Mensagem</label>
            <textarea className="form-input" rows={4} value={message} onChange={e => setMessage(e.target.value)} />
          </div>

          <div style={{ display:'flex', gap:10 }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'A enviar...' : 'Enviar mensagem'}
            </button>
            <button type="button" className="btn" onClick={onClose}>Fechar</button>
          </div>

          {status && <p style={{ marginTop:12, color: status.ok ? '#0a8f3c' : '#b00020' }}>{status.text}</p>}
        </form>
      </div>
    </div>
  )
}
