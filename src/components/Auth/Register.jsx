import React, { useState } from 'react'
import { supabase } from '../../services/supabase'

export default function Register(){
  const [email,setEmail]=useState(''); const [name,setName]=useState(''); const [msg,setMsg]=useState(''); const [loading,setLoading]=useState(false)
  async function handle(e){ e.preventDefault(); setLoading(true); const { error } = await supabase.auth.signUp({ email, options:{ data:{ full_name:name } } }); setLoading(false); if(error) setMsg(error.message); else setMsg('Conta criada — verifique o e-mail.'); }
  return (
    <form onSubmit={handle} className="card" style={{maxWidth:420, margin:'0 auto'}}>
      <h3>Registar</h3>
      <div className="form-group"><label className="form-label">Nome</label><input className="form-input" value={name} onChange={e=>setName(e.target.value)} /></div>
      <div className="form-group"><label className="form-label">E-mail</label><input className="form-input" value={email} onChange={e=>setEmail(e.target.value)} /></div>
      <div className="text-center"><button className="btn btn-primary" disabled={loading}>{loading?'A criar...':'Criar conta'}</button></div>
      {msg && <p className="muted" style={{marginTop:12}}>{msg}</p>}
    </form>
  )
}
