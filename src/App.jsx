// src/App.jsx
import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'

import Marketplace from './pages/Marketplace'
import AdminProfile from './pages/AdminProfile'
import RequestForm from './pages/RequestForm'
import CompareResults from './pages/CompareResults'

export default function App() {
  return (
    <div className="App container" style={{ padding: 20 }}>
      <header className="site-header" style={{ display:'flex', justifyContent:'space-between', alignItems:'center', background:'#fff', padding:12, borderRadius:8, marginBottom:20 }}>
        <div>
          <h1 style={{ color:'#111', margin:0 }}>🏢 Bom Prédio</h1>
          <div style={{ color:'#6b7280', fontSize:14 }}>Marketplace de Condomínios</div>
        </div>

        <nav style={{ display:'flex', gap:12, alignItems:'center' }}>
          <Link to="/">Marketplace</Link>
          <Link to="/request">Avaliar Condomínio</Link>
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Marketplace />} />
          <Route path="/admin/:id" element={<AdminProfile />} />
          <Route path="/request" element={<RequestForm />} />
          <Route path="/compare" element={<CompareResults />} />
        </Routes>
      </main>
    </div>
  )
}
