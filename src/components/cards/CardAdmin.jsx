import React from 'react'
import { Link } from 'react-router-dom'
import './CardAdmin.css'

export default function CardAdmin({id, company_name='Admin Premium', city='Lisboa', price_avg='€1.200/ano', rating_avg=4.8, services=['Limpeza','Manutenção']}){
  return (
    <div className='card card-admin'>
      <div className='header'>
        <div className='logo-placeholder' />
        <div style={{flex:1}}>
          <div style={{fontWeight:600,fontSize:16}}>{company_name}</div>
          <div style={{color:'var(--text-secondary)',fontSize:13}}>{city} · {price_avg} · ⭐{rating_avg}</div>
        </div>
        <div className='score-badge'>92%</div>
      </div>

      <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
        {services.map(s=> <div className='service-tag' key={s}>{s}</div>)}
      </div>

      <div style={{display:'flex',gap:8,marginTop:8}}>
        <Link to={'/admin/'+(id||1)} className='btn btn-secondary' style={{textDecoration:'none'}}>Ver Perfil</Link>
        <Link to={'/admin/'+(id||1)} className='btn btn-primary' style={{textDecoration:'none'}}>Contactar</Link>
      </div>
    </div>
  )
}
