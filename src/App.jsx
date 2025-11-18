import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Marketplace from './pages/Marketplace'
import AdminProfile from './pages/AdminProfile'
import CompareResults from './pages/CompareResults'
export default function App(){
  return (
    <Routes>
      <Route path='/' element={<Marketplace/>} />
      <Route path='/admin/:id' element={<AdminProfile/>} />
      <Route path='/compare' element={<CompareResults/>} />
    </Routes>
  )
}
