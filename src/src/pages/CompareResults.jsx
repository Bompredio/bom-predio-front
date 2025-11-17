import React, { useEffect, useState } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { supabase } from '../services/supabase'

function useQuery() {
  return new URLSearchParams(useLocation().search)
}

export default function CompareResults(){
  const q = useQuery()
  const leadId = q.get('leadId')
  const [lead, setLead] = useState(null)
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    async function load(){
      setLoading(true)
      let leadData = null
      if (supabase && supabase.from && leadId && !leadId.startsWith('local-')) {
        try {
          const { data: ldata, error: lerr } = await supabase.from('leads').select('*').eq('id', leadId).single()
          if (!lerr) leadData = ldata
        } catch (err) { console.warn(err) }
      }
      if (!leadData) {
        leadData = { id: leadId, city: 'Lisboa', condo_name: 'o seu condomínio' }
      }
      if (!mounted) return
      setLead(leadData)

      let admins = []
      if (supabase && supabase.from) {
        try {
          const { data, error } = await supabase.from('profiles').select('id,company_name,city,price_avg,rating_avg,description').eq('verified', true).limit(100)
          admins = data || []
        } catch (err) {
          admins = []
        }
      }
      if (!admins || admins.length === 0) {
        admins = [
          { id: 'a1', company_name: 'Administradora Central', city: 'Lisboa', price_avg: '€1.10/fração', rating_avg: 4.7, description: 'Gestão completa.' },
          { id: 'a2', company_name: 'Gestão & Companhia', city: 'Porto', price_avg: '€0.95/fração', rating_avg: 4.5, description: 'Soluções personalizadas.' },
          { id: 'a3', company_name: 'CondoFácil Lda', city: 'Lisboa', price_avg: '€1.00/fração', rating_avg: 4.6, description: 'Transparência e relatórios.' },
        ]
      }

      let filtered = admins
      if (leadData.city) {
        filtered = admins.filter(a => (a.city || '').toLowerCase() === (leadData.city || '').toLowerCase())
      }
      filtered.sort((x,y) => (y.rating_avg || 0) - (x.rating_avg || 0))

      if (mounted) {
        setMatches(filtered)
        setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [leadId])

  if (loading) return <div className="card">A gerar comparação...</div>
  return (
    <div>
      <div className="card">
        <h2>Comparação para: {lead?.condo_name || 'o seu condomínio'}</h2>
        <p className="muted">Baseado na cidade: {lead?.city || '—'}. Aqui estão administradoras recomendadas.</p>
      </div>

      <section style={{ marginTop:12, display:'grid', gap:12 }}>
        {matches.map(m => (
          <article key={m.id} className="card" style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <div>
              <h3 style={{ margin:0 }}>{m.company_name}</h3>
              <div className="muted">{m.city} · {m.price_avg} · {m.rating_avg} ★</div>
              <p style={{ marginTop:8 }}>{m.description}</p>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              <Link to={`/admin/${m.id}`} className="btn">Ver perfil</Link>
              <a className="btn btn-primary" href={`mailto:contact@example.com?subject=Pedido de informação sobre ${encodeURIComponent(m.company_name)}&body=Olá,%0D%0ATenho interesse em receber uma proposta para o meu condomínio (lead ${lead?.id}).`}>Contactar</a>
            </div>
          </article>
        ))}
      </section>
    </div>
  )
}
