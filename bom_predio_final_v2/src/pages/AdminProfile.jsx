import React, { useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import BreakdownBar from '../components/data/BreakdownBar'
import ContactModal from '../components/overlays/ContactModal'
import '../styles/globals.css'

const MOCK_ADMINS = [
  {id:'a1',company_name:'Admin Premium Lisboa',city:'Lisboa',price_avg:'€1.200/ano',rating_avg:4.8,description:'Especialistas em condomínios de luxo com mais de 15 anos de experiência. Oferecemos contabilidade, gestão de contratos, manutenção preventiva e apoio em assembleias.',services:['Limpeza','Manutenção','Segurança','Jardim'],score:0.92,contact_email:'contact@adminpremium.pt',breakdown:{price:0.3,rating:0.2,complexity:0.15,location:0.1,services:0.15,tech:0.1}},
  {id:'a2',company_name:'Gestão Total Condomínios',city:'Porto',price_avg:'€980/ano',rating_avg:4.5,description:'Soluções completas e personalizadas para condomínios de pequeno a grande porte. Foco em transparência e tecnologia.',services:['ERP','Manutenção','Contabilidade'],score:0.85,contact_email:'info@gestaototal.pt',breakdown:{price:0.25,rating:0.2,complexity:0.15,location:0.1,services:0.2,tech:0.1}}
]

export default function AdminProfile(){
  const { id } = useParams()
  const navigate = useNavigate()
  const [contactVisible, setContactVisible] = useState(false)

  const profile = useMemo(()=> MOCK_ADMINS.find(a=>a.id===id) || null, [id])

  if(!profile){
    return (
      <div className="container">
        <div className="card">
          <h2>Administradora não encontrada</h2>
          <p>Volte ao marketplace.</p>
          <button onClick={()=>navigate(-1)} className="btn" style={{marginTop:12}}>Voltar</button>
        </div>
      </div>
    )
  }

  return (
    <div style={{minHeight:'80vh',paddingBottom:120}}>
      <div style={{background:'var(--brand-primary)',color:'#fff',padding:20}}>
        <div className="container" style={{display:'flex',alignItems:'center',gap:16}}>
          <div style={{width:96,height:96,borderRadius:12,background:'#fff3',flex:'0 0 96px'}} aria-hidden/>
          <div>
            <h1 style={{margin:0}}>{profile.company_name}</h1>
            <div style={{color:'var(--text-secondary)',marginTop:6}}>{profile.city} · {profile.price_avg} · {profile.rating_avg} ★</div>
          </div>
        </div>
      </div>

      <div className="container" style={{marginTop:-40}}>
        <div className="card">
          <h2>Sobre</h2>
          <p style={{color:'var(--text-secondary)'}}>{profile.description}</p>

          <h3 style={{marginTop:16}}>Serviços</h3>
          <div style={{display:'flex',gap:8,flexWrap:'wrap',marginTop:8}}>
            {profile.services.map(s=> <span key={s} style={{background:'var(--bg-default)',padding:'6px 10px',borderRadius:999,fontSize:13}}>{s}</span>)}
          </div>

          <h3 style={{marginTop:18}}>Como foi calculado o score</h3>
          <div style={{marginTop:8,display:'grid',gap:8}}>
            {Object.entries(profile.breakdown).map(([k,v])=> <BreakdownBar key={k} label={k} value={v} />)}
          </div>

          <h3 style={{marginTop:18}}>Avaliações</h3>
          <div style={{marginTop:8}}>
            <div style={{background:'#fafafa',padding:12,borderRadius:8}}>
              <strong>João S.</strong>
              <div style={{color:'var(--text-secondary)',marginTop:6}}>Serviço excelente e comunicação rápida. Recomendo.</div>
            </div>
          </div>

          <div style={{display:'flex',justifyContent:'flex-end',gap:8,marginTop:18}}>
            <button className="btn" onClick={()=>navigate(-1)}>Voltar</button>
            <button className="btn" style={{background:'var(--brand-secondary)',color:'var(--brand-primary)'}} onClick={()=>setContactVisible(true)}>Contactar administradora</button>
          </div>
        </div>
      </div>

      <div style={{position:'fixed',right:20,bottom:20}}>
        <button style={{background:'var(--brand-secondary)',border:'none',padding:'12px 16px',borderRadius:12,fontWeight:700}} onClick={()=>setContactVisible(true)}>Contactar</button>
      </div>

      <ContactModal visible={contactVisible} onClose={()=>setContactVisible(false)} profile={profile} />
    </div>
  )
}
