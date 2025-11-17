import React, { useEffect, useState } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { supabase } from '../services/supabase'

// Mock admins (fallback)
const MOCK_ADMINS = [
  { id: 'a1', company_name: 'Administradora Central', city: 'Lisboa', price_avg: '€1.10/fração', rating_avg: 4.7, description: 'Gestão completa.' },
  { id: 'a2', company_name: 'Gestão & Companhia', city: 'Porto', price_avg: '€0.95/fração', rating_avg: 4.5, description: 'Soluções personalizadas.' },
  { id: 'a3', company_name: 'CondoFácil Lda', city: 'Lisboa', price_avg: '€1.00/fração', rating_avg: 4.6, description: 'Transparência e relatórios.' },
]

function useQuery() {
  return new URLSearchParams(useLocation().search)
}

export default function CompareResults() {
  const q = useQuery()
  const leadId = q.get('leadId')

  const [lead, setLead] = useState(null)
  const [admins, setAdmins] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true

    async function loadAll() {
      setLoading(true)
      setError(null)
      let leadData = null

      // 1) Try to load lead if we have an id and a real supabase client
      if (leadId && supabase && supabase.from && !String(leadId).startsWith('local-')) {
        try {
          const { data: ldata, error: lerr } = await supabase.from('leads').select('*').eq('id', leadId).single()
          if (lerr) {
            console.warn('Lead fetch error:', lerr)
          } else {
            leadData = ldata
          }
        } catch (err) {
          console.warn('Erro fetching lead:', err)
        }
      }

      // 2) If no leadData (either not found or no supabase), try to infer city from query params or fallback
      if (!leadData) {
        // If query contains city param (optional), use it
        const cityFromQuery = q.get('city')
        leadData = {
          id: leadId || `local-${Date.now()}`,
          condo_name: q.get('condo_name') || 'o seu condomínio',
          city: cityFromQuery || 'Lisboa',
        }
        console.info('Usando lead fallback:', leadData)
      }

      // 3) Load admins: prefer supabase if available, else mock
      let adminsData = []
      if (supabase && supabase.from) {
        try {
          // if leadData.city exists, prefer admins in the same city
          const { data: pdata, error: perr } = await supabase
            .from('profiles')
            .select('id,company_name,city,price_avg,rating_avg,description')
            .eq('verified', true)
            .limit(200)
          if (perr) {
            console.warn('Error loading profiles:', perr)
            adminsData = MOCK_ADMINS
          } else {
            adminsData = pdata && pdata.length ? pdata : MOCK_ADMINS
          }
        } catch (err) {
          console.warn('Erro ao carregar administradoras do Supabase:', err)
          adminsData = MOCK_ADMINS
        }
      } else {
        adminsData = MOCK_ADMINS
      }

      // 4) Filter by city if possible
      let filtered = adminsData
      if (leadData?.city) {
        filtered = adminsData.filter(a => (a.city || '').toLowerCase() === (leadData.city || '').toLowerCase())
        if (!filtered.length) {
          // se não houver correspondência direta, manter todos (fallback)
          filtered = adminsData
        }
      }

      // 5) Sort by rating desc (safely)
      filtered.sort((x, y) => (y.rating_avg || 0) - (x.rating_avg || 0))

      if (mounted) {
        setLead(leadData)
        setAdmins(filtered)
        setLoading(false)
      }
    }

    loadAll()

    return () => { mounted = false }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leadId])

  if (loading) return <div className="card">A gerar comparação...</div>
  if (error) return <div className="card" style={{ color: '#b00020' }}>Erro: {error}</div>

  return (
    <div>
      <div className="card" style={{ marginBottom: 12 }}>
        <h2>Comparação — {lead?.condo_name || 'o seu condomínio'}</h2>
        <p className="muted">Cidade: {lead?.city || '—'}</p>
      </div>

      <section style={{ display: 'grid', gap: 12 }}>
        {admins.map(a => (
          <article key={a.id} className="card" style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <div>
              <h3 style={{ margin: 0 }}>{a.company_name}</h3>
              <div className="muted">{a.city} · {a.price_avg} · {a.rating_avg} ★</div>
              <p style={{ marginTop: 8 }}>{a.description}</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <Link to={`/admin/${a.id}`} className="btn">Ver perfil</Link>
              <a className="btn btn-primary" href={`mailto:contact@example.com?subject=Pedido de proposta: ${encodeURIComponent(a.company_name)}&body=Tenho interesse em receber proposta para ${encodeURIComponent(lead?.condo_name || 'o meu condomínio')}.`}>Contactar</a>
            </div>
          </article>
        ))}
      </section>
    </div>
  )
}
