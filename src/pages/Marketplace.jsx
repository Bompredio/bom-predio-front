import React, { useState } from 'react'
import CardAdmin from '../components/cards/CardAdmin'
import SearchBar from '../components/forms/SearchBar'
export default function Marketplace(){
  const [q,setQ] = useState('')
  const admins = [
    {id:'a1',company_name:'Admin Premium Lisboa',city:'Lisboa',price_avg:'€1.200/ano',rating_avg:4.8,description:'Especialistas...',services:['Limpeza','Manutenção']},
    {id:'a2',company_name:'Gestão Total Condomínios',city:'Porto',price_avg:'€980/ano',rating_avg:4.5,description:'Soluções...',services:['ERP','Contabilidade']}
  ]
  return (
    <div className="container">
      <header style={{background:'var(--brand-primary)',color:'#fff',padding:16,borderRadius:8}}>
        <h1>🏢 Bom Prédio</h1>
      </header>
      <section style={{marginTop:16}}>
        <SearchBar value={q} onChange={setQ} placeholder="Pesquisar administradoras..." />
        <div style={{marginTop:16,display:'grid',gap:12}}>
          {admins.map(a=> <CardAdmin key={a.id} admin={a} />)}
        </div>
      </section>
    </div>
  )
}
