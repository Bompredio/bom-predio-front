import React from 'react'
import { Routes, Route } from 'react-router-dom'

import Header from './components/Header'
import Marketplace from './pages/Marketplace'
import AdminProfile from './pages/AdminProfile'
import CompareResults from './pages/CompareResults'

export default function App() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-default)' }}>
      <Header />

      <main style={{ padding: 16, maxWidth: 1280, margin: '0 auto' }}>
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
