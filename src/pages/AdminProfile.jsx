// src/pages/AdminProfile.jsx
import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../services/supabase'
import ContactModal from '../components/ContactModal.jsx'

// Fallback mocks id => must match the mock ids used elsewhere (a1, a2, a3...)
const MOCK_ADMINS = [
  { id: 'a1', company_name: 'Administradora Central', city: 'Lisboa', price_avg: '€1.10/fração', rating_avg: 4.7, description: 'Gestão completa de condomínios.', contact_email: 'info@administradoracentral.pt' },
  { id: 'a2', company_name: 'Gestão & Companhia', city: 'Porto', price_avg: '€0.95/fração', rating_avg: 4.5, description: 'Soluções personalizadas.', contact_email: 'contacto@gestao-companhia.pt' },
  { id: 'a3', company_name: 'CondoFácil Lda', city: 'Lisboa', price_avg: '€1.00/fração', rating_avg: 4.6, description: 'Transparência e relatórios.', contact_email: 'geral@condofacil.pt' }
]

export default function AdminProfile(){
  const { id } = useParams()
  const [admin, setAdmin] = useState(null)
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true

    async function load(){
      setLoading(true)
      setError(null)

      // 1) se supabase estiver configurado, tenta carregar do DB
      if (supabase && supabase.from) {
        try {
          const { data, error } = await supabase.from('profiles').select('*').eq('id', id).single()
          if (error && error.code !== 'PGRST116') {
            // se houver erro mas não for "no rows" (PostgREST code varies), regista
            console.warn('Supabase error fetching profile:', error)
          }
          if (data && mounted) {
            setAdmin(data)
            setLoading(false)
            return
          }
        } catch (err) {
          console.warn('Erro ao buscar profile no supabase:', err)
        }
      }

      // 2) fallback: procura entre mocks
      const found = MOCK_ADMINS.find(p => String(p.id) === String(id))
      if (found && mounted) {
        setAdmin(found)
        setLoading(false)
        return
      }

      // 3) fallback final: não encontrado
      if (mounted) {
        setAdmin(null)
        setLoading(false)
      }
    }

    load()
    return () => { mounted = false }
  }, [id])

  if (loading) return <div className="card">A carregar perfil...</div>

  if (!admin) return (
    <div className="card">
      <h3>Administradora não encontrada</h3>
      <p className="muted">Volte ao marketplace.</p>
      <Link to="/" className="btn">Voltar</Link>
    </div>
  )

  return (
    <div>
      <div className="card">
        <header style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div>
            <h2 style={{ margin:0 }}>{admin.company_name}</h2>
            <div className="muted">{admin.city} · {admin.price_avg} · {admin.rating_avg} ★</div>
          </div>
        </header>

        <section style={{ marginTop:12 }}>
          <h3>Sobre</h3>
          <p>{admin.description}</p>

          <div style={{ marginTop:12 }}>
            <strong>Contacto:</strong>
            <div style={{ marginTop:8 }}>
              {admin.contact_email ? (
                <div>
                  <div><a href={`mailto:${admin.contact_email}`}>{admin.contact_email}</a></div>
                  <div style={{ marginTop:8 }}>
                    <button className="btn btn-primary" onClick={() => setModalOpen(true)}>Contactar</button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="muted">E-mail não disponível</div>
                  <div style={{ marginTop:8 }}>
                    <button className="btn btn-primary" onClick={() => setModalOpen(true)}>Contactar</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>

      <ContactModal visible={modalOpen} onClose={() => setModalOpen(false)} profile={admin} />
    </div>
  )
}
