import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../services/supabase'
import ContactModal from '../components/ContactModal.jsx'

export default function AdminProfile(){
  const { id } = useParams()
  const [admin, setAdmin] = useState(null)
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    let mounted = true
    async function load(){
      setLoading(true)
      if (supabase && supabase.from) {
        try {
          const { data, error } = await supabase.from('profiles').select('*').eq('id', id).single()
          if (!error && mounted) setAdmin(data)
        } catch (err) {
          console.warn(err)
        }
      }
      setLoading(false)
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
        </section>
      </div>

      <ContactModal visible={modalOpen} onClose={() => setModalOpen(false)} profile={admin} />
    </div>
  )
}
