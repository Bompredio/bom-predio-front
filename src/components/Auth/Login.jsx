import React, { useState } from 'react'
import { supabase } from '../../services/supabase'

export default function Login(){
  const [email,setEmail]=useState(''); const [msg,setMsg]=useState(''); const [loading,setLoading]=useState(false)
  async function handle(e){ e.preventDefault(); setLoading(true); const { error } = await supabase.auth.signInWithOtp({ email }); setLoading(false); if(error) setMsg(error.message); else setMsg('Link enviado para o e-mail.'); }
  return (
    <form onSubmit={handle} className="card" style={{maxWidth:420, margin:'0 auto'}}>
      <h3>Entrar</h3>
      <div className="form-group"><label className="form-label">E-mail</label><input className="form-input" value={email} onChange={e=>setEmail(e.target.value)} /></div>
      <div className="text-center"><button className="btn btn-primary" disabled={loading}>{loading?'A enviar...':'Enviar link'}</button></div>
      {msg && <p className="muted" style={{marginTop:12}}>{msg}</p>}
    </form>
  )
}
