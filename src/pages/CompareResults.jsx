import React, { useState } from 'react'
import WeightSliderGroup from '../components/forms/WeightSliderGroup'
import CardAdmin from '../components/cards/CardAdmin'
export default function CompareResults(){
  const [weights,setWeights]=useState({price:0.3,rating:0.2,complexity:0.15,location:0.1,services:0.15,tech:0.1})
  const onChange=(k,v)=> setWeights(prev=>({...prev,[k]:v}))
  const admins = [
    {id:'a1',company_name:'Admin Premium Lisboa',city:'Lisboa',price_avg:'€1.200/ano',rating_avg:4.8,description:'',services:['Limpeza'],score:0.92,breakdown:{price:0.3,rating:0.2,complexity:0.15,location:0.1,services:0.15,tech:0.1}},
    {id:'a2',company_name:'Gestão Total Condomínios',city:'Porto',price_avg:'€980/ano',rating_avg:4.5,description:'',services:['ERP'],score:0.85,breakdown:{price:0.25,rating:0.2,complexity:0.15,location:0.1,services:0.2,tech:0.1}}
  ]
  return (
    <div className="container">
      <h2>Comparar Administradoras</h2>
      <WeightSliderGroup weights={weights} onChange={onChange} />
      <div style={{marginTop:16,display:'grid',gap:12}}>
        {admins.map(a=> <CardAdmin key={a.id} admin={a} />)}
      </div>
    </div>
  )
}
