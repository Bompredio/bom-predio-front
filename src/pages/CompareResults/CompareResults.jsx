import React from 'react'
import { useSearchParams } from 'react-router-dom'
import CondoForm from '../../components/forms/CondoForm'

import CardAdmin from '../../components/cards/CardAdmin'

export default function CompareResults(){
  const [search] = useSearchParams()
  const leadId = search.get('leadId')

  if(!leadId){
    return (
      <div className='container'>
        <h2>Comparar administradoras</h2>
        <p>Antes de comparar, conte-nos sobre o seu condomínio:</p>
        <CondoForm />
      </div>
    )
  }

  // Mock recommended list
  const recommended = [
    { id:1, company_name:'Admin Premium Lisboa', city:'Lisboa', price_avg:'€1.200/ano', rating_avg:4.8, services:['Limpeza']},
    { id:2, company_name:'Gestão Total', city:'Porto', price_avg:'€980/ano', rating_avg:4.5, services:['ERP']}
  ]

  return (
    <div className='container'>
      <h2>Resultados para lead {leadId}</h2>
      <div style={{display:'grid',gap:12}}>
        {recommended.map(r=> <CardAdmin key={r.id} {...r} />)}
      </div>
    </div>
  )
}
