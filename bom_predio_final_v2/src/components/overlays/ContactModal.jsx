import React, { useState } from 'react'
import Modal from './Modal'
import { supabase } from '../../services/supabase'
export default function ContactModal({ visible, onClose, profile }) {
  const [name,setName]=useState(''); const [email,setEmail]=useState(''); const [msg,setMsg]=useState(''); const [status,setStatus]=useState(null)
  if(!visible) return null
  async function handleSubmit(e){ e.preventDefault(); setStatus('sending');
    const payload = { profile_id: profile?.id, name, email, phone: '', message: msg }
    if(supabase && supabase.from){ try{ const { data, error } = await supabase.from('inquiries').insert([payload])
      if(error) throw error; setStatus('ok'); setName(''); setEmail(''); setMsg('') }catch(e){ console.error(e); setStatus('error') } }
    else { window.location.href = `mailto:${profile?.contact_email||'contact@example.com'}?subject=Contato&body=${encodeURIComponent(msg)}`; setStatus('ok') }
  }
  return (
    <Modal visible={visible} onClose={onClose} title={`Contactar ${profile?.company_name || ''}`}>
      <form onSubmit={handleSubmit}>
        <div style={{display:'grid',gap:8}}>
          <input placeholder="Nome" value={name} onChange={e=>setName(e.target.value)} />
          <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
          <textarea placeholder="Mensagem" value={msg} onChange={e=>setMsg(e.target.value)} />
          <div style={{display:'flex',gap:8,justifyContent:'flex-end'}}>
            <button type="button" onClick={onClose}>Fechar</button>
            <button type="submit">Enviar</button>
          </div>
          {status && <div>{status}</div>}
        </div>
      </form>
    </Modal>
  )
}
