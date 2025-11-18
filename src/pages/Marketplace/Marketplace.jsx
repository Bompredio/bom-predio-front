import React from 'react'
import CardAdmin from '../../components/cards/CardAdmin'
import SearchBar from '../../components/SearchBar/SearchBar'
import ButtonPrimary from '../../components/buttons/ButtonPrimary'

export default function Marketplace(){
  const data = [
    { id:1, company_name:'Admin Premium Lisboa', city:'Lisboa', price_avg:'€1.200/ano', rating_avg:4.8, services:['Limpeza','Manutenção','Segurança']},
    { id:2, company_name:'Gestão Total', city:'Porto', price_avg:'€980/ano', rating_avg:4.5, services:['ERP','Manutenção','Contabilidade']},
    { id:3, company_name:'Condomínios & Cia', city:'Coimbra', price_avg:'€760/ano', rating_avg:4.2, services:['Limpeza','Jardim']}
  ]

  return (
    <div className='container'>
      <section style={{marginTop:12}}>
        <div className='card' style={{padding:20,background:'var(--brand-primary)',color:'#fff'}}>
          <h1 style={{margin:0}}>Encontre a melhor administradora</h1>
          <p style={{marginTop:8,color:'#fff'}}>Transparência, avaliações reais e preços competitivos</p>
          <div style={{marginTop:12}}>
            <ButtonPrimary onClick={()=> window.location.href='/compare'}>Avaliar meu condomínio</ButtonPrimary>
          </div>
        </div>
      </section>

      <section style={{marginTop:16}}>
        <SearchBar />
      </section>

      <section style={{marginTop:16}}>
        <div style={{display:'grid',gap:16}}>
          {data.map(d=> <CardAdmin key={d.id} {...d} />)}
        </div>
      </section>
    </div>
  )
}
