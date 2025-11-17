import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../services/supabase'

const MOCK_ADMINS = [
  { id:'a1', company_name:'Administradora Central', city:'Lisboa', price_avg:'€1.10/fração', rating_avg:4.7, description:'Gestão completa de condomínios.' },
  { id:'a2', company_name:'Gestão & Companhia', city:'Porto', price_avg:'€0.95/fração', rating_avg:4.5, description:'Soluções personalizadas.' },
  { id:'a3', company_name:'CondoFácil Lda', city:'Lisboa', price_avg:'€1.00/fração', rating_avg:4.6, description:'Transparência e relatórios.' }
]

export default function Marketplace() {
  const [admins, setAdmins] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [cityFilter, setCityFilter] = useState('')
  const [cities, setCities] = useState([])

  useEffect(() => {
    let mounted = true
    async function load(){
      setLoading(true)
      let data = []
      if (supabase && supabase.from) {
        try {
          const { data: profiles, error } = await supabase.from('profiles').select('id,company_name,city,price_avg,rating_avg,description,contact_email').eq('verified', true).limit(500)
          if (!error && profiles) data = profiles
        } catch (err) {
          console.warn(err)
        }
      }

      if (!data || data.length === 0) data = MOCK_ADMINS

      // derive cities
      const uniqueCities = Array.from(new Set((data.map(d => d.city || '').filter(Boolean)).map(c => c.trim())))
      if (mounted) {
        setAdmins(data)
        setCities(uniqueCities)
        setLoading(false)
      }
    }
    load()
    return () => mounted = false
  }, [])

  const filtered = admins.filter(a => {
    const q = query.trim().toLowerCase()
    if (cityFilter && a.city?.toLowerCase() !== cityFilter.toLowerCase()) return false
    if (!q) return true
    return (a.company_name || '').toLowerCase().includes(q) || (a.description || '').toLowerCase().includes(q)
  })

  return (
    <div>
      <section className="card" style={{ marginBottom: 20 }}>
        <h2>Encontre Administradoras</h2>
        <p className="muted">Compare preços, avaliações e serviços.</p>

        <div style={{ display:'flex', gap:10, marginTop:12, flexWrap:'wrap' }}>
          <input className="form-input" placeholder="Procurar por nome ou serviço" value={query} onChange={e => setQuery(e.target.value)} />
          <select className="form-input" value={cityFilter} onChange={e => setCityFilter(e.target.value)}>
            <option value="">Todas as cidades</option>
            {cities.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </section>

      {loading ? <div className="card">Carregando...</div> : (
        <div style={{ display:'grid', gap:14 }}>
          {filtered.map(a => (
            <article key={a.id} className="card" style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <div style={{ maxWidth:'70%' }}>
                <h3 style={{ margin:0 }}>{a.company_name}</h3>
                <div className="muted">{a.city} • {a.price_avg} • {a.rating_avg} ★</div>
                <p style={{ marginTop:8 }}>{a.description}</p>
              </div>

              <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                <Link to={`/admin/${a.id}`} className="btn">Ver perfil</Link>
                <button className="btn btn-primary" onClick={() => {
                  // abrir perfil com modal, mas simplesmente redireciona para perfil e abre modal
                  window.location.href = `/admin/${a.id}`
                }}>Contactar</button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
