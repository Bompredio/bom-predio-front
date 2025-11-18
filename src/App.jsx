import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Header from './components/Header/Header.jsx'
import Marketplace from './pages/Marketplace/Marketplace.jsx'
import AdminProfile from './pages/AdminProfile/AdminProfile.jsx'
import CompareResults from './pages/CompareResults/CompareResults.jsx'

export default function App(){
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-default)' }}>
      <Header />
      <main style={{ padding: '16px' }}>
        <Routes>
          <Route path='/' element={<Marketplace />} />
          <Route path='/admin/:id' element={<AdminProfile />} />
          <Route path='/compare' element={<CompareResults />} />
          <Route path='*' element={<div>Página não encontrada</div>} />
        </Routes>
      </main>
    </div>
  )
}
