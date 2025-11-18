import React from 'react'
import './Header.css' // opcional: styles simples

export default function Header(){
  return (
    <header className="bp-header">
      <div className="container" style={{display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 0'}}>
        <div style={{display:'flex', alignItems:'center', gap:12}}>
          <span style={{fontSize:28}}>🏢</span>
          <div>
            <div style={{fontSize:20, fontWeight:700, color:'var(--brand-primary, #00032E)'}}>Bom Prédio</div>
            <div style={{fontSize:13, color:'var(--text-secondary, #7A7A7A)'}}>Marketplace de Condomínios</div>
          </div>
        </div>

        <nav style={{display:'flex', gap:20, alignItems:'center'}}>
          <a href="/" style={{color:'var(--text-primary)', textDecoration:'none'}}>Marketplace</a>
          <a href="/compare" style={{color:'var(--text-primary)', textDecoration:'none'}}>Comparar</a>
        </nav>
      </div>
    </header>
  )
}
