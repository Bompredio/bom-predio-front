import React, { useEffect, useState } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { supabase } from '../services/supabase'

function useQuery() {
  return new URLSearchParams(useLocation().search)
}

export default function CompareResults() {
  const q = useQuery()
  const leadId = q.get('leadId')

  const [lead, setLead] = useState(null)
  const [admins, setAdmins] = useState([])

  useEffect(() => {
    async function load() {
      const { data: leadData } = await supabase.from('leads')
        .select('*').eq('id', leadId).single()

      setLead(leadData)

      const { data: adminData } = await supabase.from('profiles')
        .select('*').eq('city', leadData.city)

      setAdmins(adminData)
    }
    load()
  }, [leadId])

  return (
    <div>
      <div className="card" style={{ marginBottom:20 }}>
        <h2>Comparação — {lead?.condo_name}</h2>
        <p className="muted">Cidade: {lead?.city}</p>
      </div>

      <div style={{ display:'grid', gap:15 }}>
        {admins?.map(a => (
          <article key={a.id} className="card">
            <h3>{a.company_name}</h3>
            <p>{a.description}</p>
            <Link to={`/admin/${a.id}`} className="btn btn-primary">Ver perfil</Link>
          </article>
        ))}
      </div>
    </div>
  )
}
