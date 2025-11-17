import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../services/supabase'

// Mock usado caso Supabase não esteja configurado ou a tabela 'profiles' esteja vazia
const MOCK_ADMINS = [
  {
    id: 'a1',
    company_name: 'Administradora Central',
    city: 'Lisboa',
    price_avg: '€1.10/fração',
    rating_avg: 4.7,
    description: 'Gestão completa de condomínios, contabilidade e suporte 24/7.'
  },
  {
    id: 'a2',
    company_name: 'Gestão & Companhia',
    city: 'Porto',
    price_avg: '€0.95/fração',
    rating_avg: 4.5,
    description: 'Soluções personalizadas e assembleias digitais.'
  },
  {
    id: 'a3',
    company_name: 'CondoFácil Lda',
    city: 'Lisboa',
    price_avg: '€1.00/fração',
    rating_avg: 4.6,
    description: 'Transparência e relatórios mensais detalhados.'
  },
]

export default function Marketplace() {
  const [admins, setAdmins] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    async function loadAdmins() {
      setLoading(true)

      // Se supabase existir, tenta carregar administradoras reais
      if (supabase && supabase.from) {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('id, company_name, city, price_avg, rating_avg, description')
            .eq('verified', true)
            .order('rating_avg', { ascending: false })

          if (error) {
            console.warn('Erro carregando administradoras:', error)
            if (active) setAdmins(MOCK_ADMINS)
          } else {
            if (active) setAdmins(data?.length ? data : MOCK_ADMINS)
          }
        } catch (err) {
          console.error(err)
          if (active) setAdmins(MOCK_ADMINS)
        }
      } else {
        // Sem Supabase: usar mock
        if (active) setAdmins(MOCK_ADMINS)
      }

      if (active) setLoading(false)
    }

    loadAdmins()
    return () => { active = false }
  }, [])

  return (
    <div>

      {/* HERO / INTRO */}
      <section className="card" style={{ marginBottom: 20 }}>
        <h2 style={{ marginBottom: 6 }}>Encontre Administradoras</h2>
        <p className="muted" style={{ marginBottom: 12 }}>
          Compare preços, avaliações e serviços de administradoras de condomínio certificadas.
        </p>
        <Link to="/request" className="btn btn-primary">
          Avaliar / Comparar meu condomínio
        </Link>
      </section>

      {/* LISTAGEM */}
      <section>
        {loading ? (
          <div className="card">Carregando administradoras...</div>
        ) : (
          <div style={{ display: 'grid', gap: 14 }}>
            {admins.map(admin => (
              <article
                key={admin.id}
                className="card"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                }}
              >
                <div style={{ maxWidth: '70%' }}>
                  <h3 style={{ margin: 0 }}>{admin.company_name}</h3>

                  <div className="muted" style={{ marginTop: 2 }}>
                    {admin.city} • {admin.price_avg} • {admin.rating_avg} ★
                  </div>

                  <p style={{ marginTop: 10 }}>{admin.description}</p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <Link
                    to={`/admin/${admin.id}`}
                    className="btn"
                    style={{ whiteSpace: 'nowrap' }}
                  >
                    Ver perfil
                  </Link>

                  <Link
                    to="/request"
                    className="btn btn-primary"
                    style={{ whiteSpace: 'nowrap' }}
                  >
                    Comparar administradoras
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
