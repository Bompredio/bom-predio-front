import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../services/supabase'

const MOCK_ADMINS = [
  { id: 'a1', company_name: 'Administradora Central', city: 'Lisboa', price_avg: '€1.10/fração', rating_avg: 4.7, description: 'Gestão completa de condomínios, contabilidade e suporte 24/7.' },
  { id: 'a2', company_name: 'Gestão & Companhia', city: 'Porto', price_avg: '€0.95/fração', rating_avg: 4.5, description: 'Soluções personalizadas e assembleias digitais.' },
  { id: 'a3', company_name: 'CondoFácil Lda', city: 'Lisboa', price_avg: '€1.00/fração', rating_avg: 4.6, description: 'Transparência e relatórios mensais detalhados.' },
]

export default function Marketplace(){
  const [admins, setAdmins] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    async function loadAdmins(){
      setLoading(true)
      if (supabase && supabase.from) {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('id, company_name, city, price_avg, rating_avg, description')
            .eq('verified', true)
            .limit(50)
          if (error) {
            console.warn('Erro a carregar administradoras:', error)
            if (mounted) setAdmins(MOCK_ADMINS)
          } else {
            if (mounted) setAdmins((data && data.length) ? data : MOCK_ADMINS)
          }
        } catch (err) {
          console.error(err)
          if (mounted) setAdmins(MOCK_ADMINS)
        }
      } else {
        setAdmins(MOCK_ADMINS)
      }
      if (mounted) setLoading(false)
    }
    loadAdmins()
    return () => { mounted = false }
  }, [])

  return (
    <div>
      <section className="card" style={{ marginBottom:20 }}>
        <h2>Encontre Administradoras</h2>
        <p className="muted">Compare avaliações e preço médio para escolher a administradora ideal para o seu condomínio.</p>
        <div style={{ marginTop:12 }}>
          <Link to="/request" className="btn btn-primary">Avaliar/Comparar o meu condomínio</Link>
        </div>
      </section>

      <section>
        {loading ? (
          <div className="card">A carregar administradoras...</div>
        ) : (
          <div style={{ display:'grid', gap:12 }}>
            {admins.map(a => (
              <article key={a.id} className="card" style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <div>
                  <h3 style={{ margin:0 }}>{a.company_name}</h3>
                  <div className="muted">{a.city} · {a.price_avg} · {a.rating_avg} ★</div>
                  <p style={{ marginTop:8 }}>{a.description}</p>
                </div>
                <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                  <Link to={`/admin/${a.id}`} className="btn">Ver perfil</Link>
                  <Link to="/request" className="btn btn-primary">Avaliar o meu condomínio</Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
