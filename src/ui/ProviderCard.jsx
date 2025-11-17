import React from 'react'
export default function ProviderCard({provider}){
  return (
    <article className="provider-card" role="article" aria-label={provider.name}>
      <h4>{provider.name}</h4>
      <div className="muted">Avaliação: {provider.rating} ★ · {provider.price}</div>
      <p style={{marginTop:8}}>{provider.desc}</p>
      <div style={{marginTop:12, display:'flex', gap:8}}>
        <button className="btn">Ver perfil</button>
        <button className="btn btn-primary">Pedir orçamento</button>
      </div>
    </article>
  )
}
