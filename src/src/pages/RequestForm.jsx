import React, { useState } from 'react'
import { supabase } from '../services/supabase'
import { useNavigate } from 'react-router-dom'

export default function RequestForm(){
  const [condoName, setCondoName] = useState('')
  const [city, setCity] = useState('')
  const [fractions, setFractions] = useState('')
  const [serviceNeeds, setServiceNeeds] = useState('')
  const [budget, setBudget] = useState('')
  const [contactName, setContactName] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [contactPhone, setContactPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')
  const navigate = useNavigate()

  async function handleSubmit(e){
    e.preventDefault()
    setLoading(true)
    setMsg('')
    if (supabase && supabase.from) {
      const { data, error } = await supabase.from('leads').insert([{
        condo_name: condoName,
        city,
        fractions_number: fractions ? parseInt(fractions) : null,
        service_needs: serviceNeeds,
        budget_estimate: budget,
        contact_name: contactName,
        contact_email: contactEmail,
        contact_phone: contactPhone
      }]).select().single()
      if (error) {
        console.error('Erro ao criar lead:', error)
        setMsg('Ocorreu um erro ao enviar — tente novamente mais tarde.')
        setLoading(false)
      } else {
        navigate(`/compare?leadId=${data.id}`)
        return
      }
    } else {
      const fakeId = 'local-' + Date.now()
      navigate(`/compare?leadId=${fakeId}`)
      return
    }
  }

  return (
    <div className="card" style={{ maxWidth:720, margin:'0 auto' }}>
      <h2>Comparar administradoras — Envie os dados do seu condomínio</h2>
      <p className="muted">Preencha os dados básicos para receber uma comparação entre administradoras recomendadas.</p>

      <form onSubmit={handleSubmit} style={{ marginTop:12 }}>
        <div className="form-group">
          <label className="form-label">Nome do Condomínio</label>
          <input className="form-input" value={condoName} onChange={e => setCondoName(e.target.value)} required />
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
          <label className="form-label">Serviços necessários (breve descrição)</label>
          <textarea className="form-input" value={serviceNeeds} onChange={e => setServiceNeeds(e.target.value)} rows={4} />
        </div>
        <div className="form-group">
          <label className="form-label">Orçamento estimado / faixa</label>
          <input className="form-input" value={budget} onChange={e => setBudget(e.target.value)} />
        </div>

        <h4>Contacto</h4>
        <div className="form-group">
          <label className="form-label">Nome</label>
          <input className="form-input" value={contactName} onChange={e => setContactName(e.target.value)} required />
        </div>
        <div className="form-group">
          <label className="form-label">E-mail</label>
          <input type="email" className="form-input" value={contactEmail} onChange={e => setContactEmail(e.target.value)} required />
        </div>
        <div className="form-group">
          <label className="form-label">Telefone</label>
          <input className="form-input" value={contactPhone} onChange={e => setContactPhone(e.target.value)} />
        </div>

        <div className="text-center">
          <button className="btn btn-primary" disabled={loading}>{loading ? 'A enviar...' : 'Enviar e comparar'}</button>
        </div>

        {msg && <p style={{ marginTop:12, color:'#b00020' }}>{msg}</p>}
      </form>
    </div>
  )
}
