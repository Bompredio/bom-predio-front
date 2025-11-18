import React, { useState } from 'react'
import WeightSliderGroup from '../components/forms/WeightSliderGroup'
import CardAdmin from '../components/cards/CardAdmin'
import WhyModal from '../components/overlays/WhyModal'
import '../styles/globals.css'

const ADMINS = [
  {id:'a1',company_name:'Admin Premium Lisboa',city:'Lisboa',price_avg:'€1.200/ano',rating_avg:4.8,services:['Limpeza','Manutenção'],score:0.92,breakdown:{price:0.3,rating:0.2,complexity:0.15,location:0.1,services:0.15,tech:0.1}},
  {id:'a2',company_name:'Gestão Total Condomínios',city:'Porto',price_avg:'€980/ano',rating_avg:4.5,services:['ERP','Contabilidade'],score:0.85,breakdown:{price:0.25,rating:0.2,complexity:0.15,location:0.1,services:0.2,tech:0.1}},
  {id:'a3',company_name:'CondoFácil Lda',city:'Lisboa',price_avg:'€1.000/ano',rating_avg:4.6,services:['Transparência','Relatórios'],score:0.88,breakdown:{price:0.28,rating:0.22,complexity:0.1,location:0.12,services:0.18,tech:0.1}}
]

export default function CompareResults(){
  const [weights,setWeights] = useState({price:0.3,rating:0.2,complexity:0.15,location:0.1,services:0.15,tech:0.1})
  const [selected,setSelected] = useState(ADMINS.slice(0,2).map(a=>a.id))
  const [whyProfile,setWhyProfile] = useState(null)

  const toggle = (id)=>{
    setSelected(prev=>{
      if(prev.includes(id)) return prev.filter(x=>x!==id)
      if(prev.length>=3) return prev
      return [...prev,id]
    })
  }

  const onChange = (k,v)=> setWeights(prev=>({...prev,[k]:v}))

  // compute weighted score for selected admins
  const scored = ADMINS.map(a=>{
    const score = ( (weights.price * (1 - (Number(a.price_avg.replace(/[^0-9.]/g,'')||1000)/1200))) +
                    (weights.rating * (a.rating_avg/5)) +
                    (weights.services * (a.services.length/5)) +
                    (weights.location * (a.city==='Lisboa'?1:0.8)) )
    return {...a,computedScore: score}
  }).sort((x,y)=> y.computedScore - x.computedScore)

  return (
    <div className="container">
      <h2>Comparar Administradoras</h2>

      <section style={{display:'grid',gridTemplateColumns:'320px 1fr',gap:20,alignItems:'start',marginTop:12}}>
        <div className="card">
          <h4>Painel de pesos</h4>
          <WeightSliderGroup weights={weights} onChange={onChange} />
          <div style={{display:'flex',gap:8,marginTop:12}}>
            <button className="btn" onClick={()=>setWeights({price:0.3,rating:0.2,complexity:0.15,location:0.1,services:0.15,tech:0.1})}>Reset</button>
            <button className="btn" style={{background:'var(--brand-secondary)',color:'var(--brand-primary)'}}>Aplicar</button>
          </div>
        </div>

        <div>
          <div style={{display:'flex',gap:12,alignItems:'center',marginBottom:12}}>
            <div style={{fontWeight:700}}>Resultados</div>
            <div style={{color:'var(--text-secondary)'}}>Selecione até 3 administradoras para comparar</div>
          </div>

          <div style={{display:'grid',gap:12}}>
            {scored.map(a=> (
              <div key={a.id} style={{display:'flex',alignItems:'center',gap:12,background:'white',padding:12,borderRadius:12,boxShadow:'0 2px 6px rgba(0,0,0,0.03)'}}>
                <div style={{flex:1}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                    <div>
                      <div style={{fontWeight:700}}>{a.company_name}</div>
                      <div style={{color:'var(--text-secondary)',marginTop:6}}>{a.city} · {a.price_avg} · {a.rating_avg} ★</div>
                    </div>
                    <div style={{background:'var(--brand-secondary)',padding:'6px 8px',borderRadius:8,fontWeight:700}}>{Math.round(a.score*100)}%</div>
                  </div>

                  <div style={{marginTop:8}}>{a.services.slice(0,3).join(', ')}</div>
                </div>

                <div style={{display:'flex',flexDirection:'column',gap:8}}>
                  <label style={{display:'flex',alignItems:'center',gap:8}}>
                    <input type="checkbox" checked={selected.includes(a.id)} onChange={()=>toggle(a.id)} />
                    <span>Selecionar</span>
                  </label>
                  <div style={{display:'flex',flexDirection:'column',gap:6}}>
                    <button className="btn" onClick={()=>setWhyProfile(a)}>Por que aqui?</button>
                    <button className="btn" onClick={()=>window.open(`/admin/${a.id}`)}>Ver perfil</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{marginTop:16}}>
            <h4>Comparação</h4>
            <div style={{display:'grid',gap:12,marginTop:8}}>
              {scored.filter(s=> selected.includes(s.id)).map(s=> (
                <div key={s.id} className="card" style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <div>
                    <div style={{fontWeight:700}}>{s.company_name}</div>
                    <div style={{color:'var(--text-secondary)'}}>{s.city} · {s.price_avg}</div>
                  </div>
                  <div style={{textAlign:'right'}}>
                    <div style={{fontWeight:700}}>{Math.round(s.computedScore*100)} pts</div>
                    <div style={{color:'var(--text-secondary)'}}>score calculado</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      <WhyModal visible={!!whyProfile} onClose={()=>setWhyProfile(null)} profile={whyProfile} />
    </div>
  )
}
