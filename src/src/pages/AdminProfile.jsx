import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../services/supabase'

export default function AdminProfile(){
  const { id } = useParams()
  const [admin, setAdmin] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    async function load(){
      setLoading(true)
      if (supabase && supabase.from) {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', id)
            .single()
          if (error) {
            console.warn('Erro ao carregar perfil:', error)
            if (mounted) setAdmin(null)
          } else {
            if (mounted) setAdmin(data)
          }
        } catch (err) {
          console.error(err)
          if (mounted) setAdmin(null)
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
      <p className="muted">Tente outra administradora ou volte ao marketplace.</p>
      <Link to="/" className="btn">Voltar ao Marketplace</Link>
    </div>
  )

  return (
    <div className="card">
      <header style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div>
          <h2 style={{ margin:0 }}>{admin.company_name}</h2>
          <div className="muted">{admin.city} · {admin.price_avg} · {admin.rating_avg} ★</div>
        </div>
        <div>
          <Link to="/request" className="btn btn-primary">Avaliar/Comparar meu condomínio</Link>
        </div>
      </header>

      <section style={{ marginTop:16 }}>
        <h3>Sobre</h3>
        <p>{admin.description}</p>
        <h4 style={{ marginTop:12 }}>Serviços</h4>
        <pre style={{ whiteSpace:'pre-wrap' }}>{JSON.stringify(admin.services || [], null, 2)}</pre>
      </section>
    </div>
  )
}
