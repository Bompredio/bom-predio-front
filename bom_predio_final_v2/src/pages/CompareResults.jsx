import React, { useState } from 'react'
import CondoForm from '../components/forms/CondoForm'
import CardAdmin from '../components/cards/CardAdmin'
import WhyModal from '../components/overlays/WhyModal'
import '../styles/globals.css'

const ADMINS = [
  {id:'a1',company_name:'Admin Premium Lisboa',city:'Lisboa',price_avg:1200,price_str:'€1.200/ano',rating_avg:4.8,services:['Limpeza','Manutenção'],score:0.92,breakdown:{price:0.3,rating:0.2,complexity:0.15,location:0.1,services:0.15,tech:0.1}},
  {id:'a2',company_name:'Gestão Total Condomínios',city:'Porto',price_avg:980,price_str:'€980/ano',rating_avg:4.5,services:['ERP','Contabilidade'],score:0.85,breakdown:{price:0.25,rating:0.2,complexity:0.15,location:0.1,services:0.2,tech:0.1}},
  {id:'a3',company_name:'CondoFácil Lda',city:'Lisboa',price_avg:1000,price_str:'€1.000/ano',rating_avg:4.6,services:['Transparência','Relatórios'],score:0.88,breakdown:{price:0.28,rating:0.22,complexity:0.1,location:0.12,services:0.18,tech:0.1}}
]

export default function CompareResults(){
  const [queryData, setQueryData] = useState(null)   // dados do formulário
  const [results, setResults] = useState([])         // resultados filtrados
  const [whyProfile, setWhyProfile] = useState(null)

  async function handleFormSubmit(formData) {
    // Simulação de "matching" — implementa lógica simples:
    //  - filtrar por cidade (se existir)
    //  - ordenar por proximidade de orçamento (se informado) e rating
    const city = (formData.city||'').toLowerCase()
    const budget = formData.budget_per_fraction ? Number(formData.budget_per_fraction) : null

    let matched = ADMINS.filter(a => {
      if (city && city.length>0) {
        return a.city.toLowerCase().includes(city)
      }
      return true
    })

    // if budget present — score by closeness to budget (lower price is better if budget small)
    if (budget) {
      matched = matched.map(a => {
        // priceAvg in € per year in mocks — convert simple distance
        const priceDiff = Math.abs(a.price_avg - budget)
        return { ...a, _priority: (1 / (1 + priceDiff)) * 0.6 + (a.rating_avg / 5) * 0.4 }
      })
    } else {
      matched = matched.map(a => ({ ...a, _priority: a.rating_avg }))
    }

    matched.sort((x,y) => (y._priority || 0) - (x._priority || 0))

    // store
    setQueryData(formData)
    setResults(matched)
  }

  return (
    <div className="container" style={{paddingTop:16}}>
      <h2>Comparar Administradoras</h2>

      {!queryData ? (
        <div style={{marginTop:12}}>
          <p style={{color:'var(--text-secondary)'}}>Para encontrar as administradoras mais adequadas, preencha as informações do seu condomínio.</p>
          <div style={{marginTop:12}} className="card">
            <CondoForm onSubmit={handleFormSubmit} />
          </div>
        </div>
      ) : (
        <div style={{marginTop:12}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:12}}>
            <div>
              <strong>Comparação — o seu condomínio</strong>
              <div style={{color:'var(--text-secondary)'}}>Cidade: {queryData.city} · {queryData.fractions_number} frações</div>
            </div>
            <div>
              <button className="btn" onClick={()=>{ setQueryData(null); setResults([]) }}>Alterar dados</button>
            </div>
          </div>

          <div style={{marginTop:12,display:'grid',gap:12}}>
            {results.length === 0 ? (
              <div className="card">Nenhuma administradora encontrada — ajuste a cidade ou tente novamente.</div>
            ) : results.map(r => (
              <div key={r.id}>
                <CardAdmin admin={{
                  id:r.id,
                  company_name:r.company_name,
                  city:r.city,
                  price_avg:r.price_str,
                  rating_avg:r.rating_avg,
                  description: r.description || '',
                  services: r.services || [],
                  score: Math.round((r.score||0)*100)
                }} onProfileClick={()=>window.location.href=`/admin/${r.id}`} onContactClick={()=>setWhyProfile(r)} />
                {/* note: onContactClick reused to open Why modal here for demo */}
              </div>
            ))}
          </div>
        </div>
      )}

      <WhyModal visible={!!whyProfile} onClose={()=>setWhyProfile(null)} profile={whyProfile} />
    </div>
  )
}
