import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Marketplace from './pages/Marketplace'
import AdminProfile from './pages/AdminProfile'
import CompareResults from './pages/CompareResults'

export default function App(){
  return (
    <div style={{minHeight:'100vh', background:'var(--bg-default)'}}>
      <nav style={{padding:12, display:'flex', gap:12, alignItems:'center', background:'var(--brand-primary)', color:'#fff'}}>
        <Link to="/" style={{color:'#fff',textDecoration:'none',fontWeight:700}}>🏢 Bom Prédio</Link>
        <Link to="/compare" style={{color:'#fff',textDecoration:'none'}}>Comparar</Link>
      </nav>
      <main style={{padding:16}}>
        <Routes>
          <Route path="/" element={<Marketplace />} />
          <Route path="/admin/:id" element={<AdminProfile />} />
          <Route path="/compare" element={<CompareResults />} />
          <Route path="*" element={<div>Página não encontrada</div>} />
        </Routes>
      </main>
    </div>
  )
}
