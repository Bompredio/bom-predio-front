import React, { useState } from 'react'
import SearchBar from '../components/forms/SearchBar'
import CardAdmin from '../components/cards/CardAdmin'
import ContactModal from '../components/overlays/ContactModal'
export default function Marketplace(){
  const [q,setQ]=useState('')
  const [modalProfile,setModalProfile]=useState(null)
  const admins = [
    {id:'a1',company_name:'Admin Premium Lisboa',city:'Lisboa',price_avg:'€1.200/ano',rating_avg:4.8,description:'Especialistas em condomínios de luxo',services:['Limpeza','Manutenção'],score:0.92},
    {id:'a2',company_name:'Gestão Total Condomínios',city:'Porto',price_avg:'€980/ano',rating_avg:4.5,description:'Soluções completas',services:['ERP','Contabilidade'],score:0.85}
  ]
  return (
    <div className="container">
      <header style={{background:'var(--brand-primary)',color:'#fff',padding:16,borderRadius:8}}>
        <h1 style={{margin:0}}>🏢 Bom Prédio</h1>
      </header>

      <section style={{marginTop:16}}>
        <SearchBar value={q} onChange={setQ} placeholder="Pesquisar administradoras..." />
        <div style={{marginTop:16,display:'grid',gap:12}}>
          {admins.map(a => <CardAdmin key={a.id} admin={a} onContactClick={(p)=>setModalProfile(p)} />)}
        </div>
      </section>

      <ContactModal visible={!!modalProfile} onClose={()=>setModalProfile(null)} profile={modalProfile} />
    </div>
  )
}
