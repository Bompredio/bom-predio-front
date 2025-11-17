import React from 'react'
import ProviderCard from './ProviderCard'

const sample = [
  {id:1, name:'Limpezas Silva', rating:4.8, price:'€45/h', desc:'Especializados em condomínios e áreas comuns.'},
  {id:2, name:'Manutenção Rápida', rating:4.6, price:'€30/h', desc:'Pequenas reparações e eletricidade.'},
  {id:3, name:'Jardins & Cia', rating:4.7, price:'€35/h', desc:'Manutenção de espaços verdes.'},
  {id:4, name:'Serviços Gerais Lda', rating:4.5, price:'€28/h', desc:'Faxina, pintura e assistência.'}
]

export default function ProviderList(){
  return (
    <div className="provider-grid" aria-live="polite">
      {sample.map(p => <ProviderCard key={p.id} provider={p} />)}
    </div>
  )
}
