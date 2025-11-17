import React, { useEffect, useState } from 'react'
import { Routes, Route, Navigate, Link } from 'react-router-dom'
import { supabase } from './services/supabase'
import Marketplace from './pages/Marketplace'
import Dashboard from './pages/Dashboard'
import Login from './components/Auth/Login'
import Register from './components/Auth/Register'

function App(){
  const [session, setSession] = useState(null)
  useEffect(()=>{
    supabase.auth.getSession().then(({data})=> setSession(data.session))
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return ()=> data.subscription.unsubscribe()
  },[])

  return (
    <div className="App container">
      <header className="site-header">
        <div>
          <h1 style={{color:'var(--primary)'}}>🏢 Bom Prédio</h1>
          <div className="muted">Marketplace de Condomínios</div>
        </div>
        <nav>
          <Link to="/">Marketplace</Link>
          {!session ? (
            <>
              <Link to="/login">Entrar</Link>
              <Link to="/register">Registar</Link>
            </>
          ) : (
            <>
              <Link to="/dashboard">Dashboard</Link>
              <button className="btn" onClick={()=> supabase.auth.signOut()}>Sair</button>
            </>
          )}
        </nav>
      </header>

      <main style={{paddingTop:20}}>
        <Routes>
          <Route path="/" element={<Marketplace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={ session ? <Dashboard session={session} /> : <Navigate to="/login" replace />} />
        </Routes>
      </main>
    </div>
  )
}
export default App
