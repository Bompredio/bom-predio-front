import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../services/supabase'

export default function CondoForm(){
  const navigate = useNavigate()
  const [form, setForm] = useState({ condo_name:'', city:'', fractions_number:'', building_age:'', has_parking:false, monthly_fee:'', contact_email:'' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const onChange = (e)=>{
    const { name, value, type, checked } = e.target
    setForm(prev=> ({...prev,[name]: type==='checkbox' ? checked : value}))
  }

  const onSubmit = async (e)=>{
    e.preventDefault()
    setError(null)
    setLoading(true)
    try{
      const payload = {
        condo_name: form.condo_name,
        city: form.city,
        fractions_number: Number(form.fractions_number||0),
        building_age: form.building_age,
        has_parking: form.has_parking,
        monthly_fee: Number(form.monthly_fee||0),
        contact_email: form.contact_email,
        created_at: new Date().toISOString()
      }
      if(!supabase){
        // fallback: generate a fake id and redirect
        const fakeId = Math.floor(Math.random()*90000)+10000
        navigate(`/compare?leadId=${fakeId}`)
        return
      }
      const { data, error } = await supabase.from('leads').insert([payload])
      if(error){
        setError('Erro ao enviar: '+error.message)
        setLoading(false)
        return
      }
      const lead = data?.[0] ?? null
      if(lead?.id) navigate(`/compare?leadId=${lead.id}`)
      else navigate('/compare')
    }catch(err){
      console.error(err)
      setError('Erro inesperado')
    }finally{ setLoading(false) }
  }

  return (
    <form onSubmit={onSubmit} style={{maxWidth:720}}>
      <div className='form-row'>
        <label>Nome do condomínio
          <input className='input' name='condo_name' value={form.condo_name} onChange={onChange} required />
        </label>
      </div>
      <div className='form-row'>
        <label>Cidade
          <input className='input' name='city' value={form.city} onChange={onChange} required />
        </label>
      </div>
      <div className='form-row'>
        <label>Número de frações
          <input className='input' name='fractions_number' type='number' value={form.fractions_number} onChange={onChange} />
        </label>
      </div>
      <div className='form-row'>
        <label>Tem estacionamento?
          <input name='has_parking' type='checkbox' checked={form.has_parking} onChange={onChange} />
        </label>
      </div>
      <div className='form-row'>
        <label>Email para contacto
          <input className='input' name='contact_email' type='email' value={form.contact_email} onChange={onChange} required />
        </label>
      </div>
      {error && <div style={{color:'crimson'}}>{error}</div>}
      <div style={{marginTop:12}}>
        <button className='btn btn-primary' type='submit'>{loading ? 'A enviar...' : 'Enviar e comparar'}</button>
      </div>
    </form>
  )
}
