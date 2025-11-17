import React, { useState } from 'react'
import { supabase } from '../services/supabase'
import { useNavigate } from 'react-router-dom'

export default function RequestForm() {
  const [condo, setCondo] = useState('')
  const [city, setCity] = useState('')
  const [fractions, setFractions] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  const navigate = useNavigate()

  async function submit(e) {
    e.preventDefault()
    setErrorMsg('')
    setSuccessMsg('')

    // Validação mínima
    if (!condo.trim() || !city.trim() || !email.trim()) {
      setErrorMsg('Preencha Nome do Condomínio, Cidade e E-mail.')
      return
    }

    setLoading(true)

    // Debug local rápido: garante que supabase existe
    if (!supabase || !supabase.from) {
      console.warn('Supabase não configurado — fallback local ativado.')
      // simula id local e redireciona para comparação
      const fakeId = 'local-' + Date.now()
      setLoading(false)
      navigate(`/compare?leadId=${fakeId}`)
      return
    }

    try {
      // Inserir lead
      const payload = {
        condo_name: condo,
        city,
        fractions_number: fractions ? parseInt(fractions, 10) : null,
        contact_email: email
      }

      console.log('Enviando lead:', payload)

      const { data, error } = await supabase
        .from('leads')
        .insert([payload])
        .select()
        .single()

      if (error) {
        console.error('Erro Supabase:', error)
        setErrorMsg('Erro ao enviar. Tente novamente mais tarde.')
        setLoading(false)
        return
      }

      // sucesso
      setSuccessMsg('Pedido enviado com sucesso! A carregar comparação...')
      // navega para compare com o id retornado
      navigate(`/compare?leadId=${data.id}`)
    } catch (err) {
      console.error('Erro inesperado:', err)
      setErrorMsg('Erro inesperado. Abra o console e verifique os logs.')
      setLoading(false)
    }
  }

  return (
    <div className="card" style={{ maxWidth:720, margin:'0 auto' }}>
      <h2>Comparar Administradoras — Envie os dados do seu condomínio</h2>
      <p className="muted">Preencha os dados básicos para receber uma comparação.</p>

      <form onSubmit={submit} style={{ marginTop:12 }}>
        <div className="form-group">
          <label className="form-label">Nome do Condomínio</label>
          <input className="form-input" value={condo} onChange={e => setCondo(e.target.value)} required />
        </div>

        <div className="form-group">
          <label className="form-label">Cidade</label>
          <input className="form-input" value={city} onChange={e => setCity(e.target.value)} required />
        </div>

        <div className="form-group">
          <label className="form-label">Número de frações</label>
          <input type="number" className="form-input" value={fractions} onChange={e => setFractions(e.target.value)} />
        </div>

        <div className="form-group">
          <label className="form-label">E-mail para contacto</label>
          <input type="email" className="form-input" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>

        <div className="text-center" style={{ marginTop:12 }}>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'A enviar...' : 'Enviar e comparar'}
          </button>
        </div>

        {errorMsg && <p style={{ marginTop:12, color:'#b00020' }}>{errorMsg}</p>}
        {successMsg && <p style={{ marginTop:12, color:'#0a8f3c' }}>{successMsg}</p>}
      </form>
    </div>
  )
}
