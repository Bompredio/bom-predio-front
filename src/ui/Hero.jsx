import React from 'react'
export default function Hero(){
  return (
    <section className="hero card">
      <div style={{flex:1}}>
        <h2>Encontre prestadores e administradoras confiáveis para o seu condomínio</h2>
        <p className="muted">Compare orçamentos, veja avaliações e escolha com segurança — ideal para públicos tradicionais.</p>
        <div className="search">
          <input placeholder="Pesquisar serviços, ex: limpeza, manutenção..." className="form-input" style={{flex:1}} />
          <button className="btn btn-primary">Pesquisar</button>
        </div>
        <div style={{marginTop:12}}>
          <a href="#how" className="muted">Como funciona — passo a passo</a>
        </div>
      </div>
      <div style={{width:280}}>
        <div className="card" style={{textAlign:'center'}}>
          <strong>Ajuda por telefone</strong>
          <p className="muted">Ligue: +351 900 000 000 (opção fictícia)</p>
          <p style={{marginTop:8}}>Sinal de confiança para públicos tradicionais.</p>
        </div>
      </div>
    </section>
  )
}
