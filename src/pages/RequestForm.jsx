import React, { useState } from 'react'
import { supabase } from '../services/supabase'
import { useNavigate } from 'react-router-dom'

export default function RequestForm() {
  const [condo, setCondo] = useState('')
  const [city, setCity] = useState('')
  const [fractions, setFractions] = useState('')
  const [email, setEmail] = useState('')

  const navigate = useNavigate()

  async function submit(e) {
    e.preventDefault()

    const { data, error } = await supabase.from('leads').insert([{
      condo_name: condo,
      city,
      fractions_number: fractions,
      contact_email: email
    }]).select().single()

    if (!error) navigate(`/compare?leadId=${data.id}`)
    else alert("Erro ao enviar")
  }

  return (
    <div className="card">
      <h2>Comparar Administradoras</h2>

      <form onSubmit={submit}>
        <input required className="form-input" placeholder="Nome do condomínio"
          value={condo} onChange={e => setCondo(e.target.value)} />
        <input required className="form-input" placeholder="Cidade"
          value={city} onChange={e => setCity(e.target.value)} />
        <input className="form-input" placeholder="Nº de frações"
          value={fractions} onChange={e => setFractions(e.target.value)} />
        <input required type="email" className="form-input" placeholder="Email"
          value={email} onChange={e => setEmail(e.target.value)} />

        <button className="btn btn-primary" style={{ marginTop:10 }}>
          Enviar
        </button>
      </form>
    </div>
  )
}
