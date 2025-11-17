import React, { useEffect, useState } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { supabase } from '../services/supabase'
import ContactModal from '../components/ContactModal.jsx'

// fallback admins (caso o Supabase não esteja configurado ou não retorne dados)
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
  const [contactProfile, setContactProfile] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    let mounted = true

    async function loadAll() {
      setLoading(true)
      setError(null)

      // 1) carregar lead real do Supabase, se existir e supabase estiver configurado
      let leadData = null
      if (leadId && supabase && supabase.from && !String(leadId).startsWith('local-')) {
        try {
          const { data: ldata, error: lerr } = await supabase.from('leads').select('*').eq('id', leadId).single()
          if (lerr) {
            console.warn('Lead fetch error:', lerr)
          } else {
            leadData = ldata
          }
        } catch (err) {
          console.warn('Erro a buscar lead:', err)
        }
      }

      // 2) fallback: inferir um lead temporário (mantém app funcionando)
      if (!leadData) {
        const cityFromQuery = q.get('city')
        leadData = {
          id: leadId || `local-${Date.now()}`,
          condo_name: q.get('condo_name') || 'o seu condomínio',
          city: cityFromQuery || 'Lisboa',
        }
        console.info('Usando lead fallback:', leadData)
      }

      // 3) carregar administradoras (preferir supabase)
      let adminsData = []
      if (supabase && supabase.from) {
        try {
          const { data: pdata, error: perr } = await supabase
            .from('profiles')
            .select('id,company_name,city,price_avg,rating_avg,description,contact_email')
            .eq('verified', true)
            .limit(500)
          if (perr) {
            console.warn('Erro ao carregar perfis:', perr)
            adminsData = MOCK_ADMINS
          } else {
            adminsData = pdata && pdata.length ? pdata : MOCK_ADMINS
          }
        } catch (err) {
          console.warn('Erro a carregar profiles:', err)
          adminsData = MOCK_ADMINS
        }
      } else {
        adminsData = MOCK_ADMINS
      }

      // 4) Filtrar por cidade (se existir)
      let filtered = adminsData
      if (leadData?.city) {
        filtered = adminsData.filter(a => (a.city || '').toLowerCase() === (leadData.city || '').toLowerCase())
        if (!filtered.length) {
          // se não houver match por cidade, manter todos (mais útil que mostrar vazio)
          filtered = adminsData
        }
      }

      // 5) ordenar por rating (desc)
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

  // abrir modal de contacto para uma administradora (passa perfil e leadId para vinculamento no backend)
  function openContactModal(profile) {
    setContactProfile({ ...profile, leadId: lead?.id })
    setModalOpen(true)
  }

  if (loading) return <div className="card">A gerar comparação...</div>
  if (error) return <div className="card" style={{ color: '#b00020' }}>Erro: {error}</div>

  return (
    <div>
      <div className="card" style={{ marginBottom: 12 }}>
        <h2>Comparação — {lead?.condo_name || 'o seu condomínio'}</h2>
        <p className="muted">Cidade: {lead?.city || '—'}</p>
        <p className="muted" style={{ fontSize: 13, marginTop: 8 }}>
          (Este resultado foi gerado com base na cidade. Para ver a estrutura da marketplace usada como referência, consulte o documento do projeto.)
        </p>
        {/* link para o PDF com a estrutura (arquivo enviado) */}
        <p style={{ marginTop: 8 }}>
          <a href="sandbox:/mnt/data/Estrutura da marketplace.pdf" target="_blank" rel="noreferrer">Ver estrutura da marketplace (PDF)</a>
        </p>
      </div>

      <section style={{ display: 'grid', gap: 12 }}>
        {admins.map(a => (
          <article key={a.id} className="card" style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <div style={{ maxWidth: '68%' }}>
              <h3 style={{ margin: 0 }}>{a.company_name}</h3>
              <div className="muted" style={{ marginTop: 4 }}>{a.city} · {a.price_avg} · {a.rating_avg} ★</div>
              <p style={{ marginTop: 8 }}>{a.description}</p>
            </div>

            <div style={{ display:'flex', flexDirection:'column', gap: 8, alignItems: 'flex-end' }}>
              <Link to={`/admin/${a.id}`} className="btn" style={{ marginBottom: 6 }}>Ver perfil</Link>

              {/* se tiver contact_email, prefira abrir modal (grava inquiry no supabase quando disponível) */}
              <button
                className="btn btn-primary"
                onClick={() => openContactModal(a)}
              >
                Contactar
              </button>
            </div>
          </article>
        ))}
      </section>

      {/* Contact modal: registra a inquiry e/ou abre mailto como fallback */}
      <ContactModal
        visible={modalOpen}
        onClose={() => { setModalOpen(false); setContactProfile(null) }}
        profile={contactProfile}
      />
    </div>
  )
}
