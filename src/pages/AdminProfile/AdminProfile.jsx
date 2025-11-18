import React from 'react'
import { useParams } from 'react-router-dom'
import CardAdmin from '../../components/cards/CardAdmin'

export default function AdminProfile(){
  const { id } = useParams()
  // In real app fetch by id; here mock
  return (
    <div className='container'>
      <div style={{height:160, background:'var(--brand-primary)', borderRadius:12}} />
      <div style={{marginTop:-40}}>
        <CardAdmin id={id} company_name={'Admin Premium '+id} city='Lisboa' price_avg='€1.200/ano' rating_avg={4.8} services={['Limpeza','Manutenção','Segurança']} />
      </div>

      <section style={{marginTop:16}} className='card'>
        <h3>Sobre</h3>
        <p>Especialistas em condomínios de luxo com mais de 15 anos de experiência. Este perfil esconde detalhes do algoritmo de score; exiba apenas um botão "Entenda porquê" para abrir um modal.</p>
        <button className='btn btn-secondary' style={{marginTop:12}}>Entenda porquê</button>
      </section>
    </div>
  )
}
