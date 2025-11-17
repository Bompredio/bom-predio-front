import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../services/supabase'

export default function AdminProfile() {
  const { id } = useParams()
  const [admin, setAdmin] = useState(null)

  useEffect(() => {
    async function load() {
      if (supabase && supabase.from) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', id)
          .single()
        setAdmin(data)
      }
    }
    load()
  }, [id])

  if (!admin) return <div className="card">Carregando...</div>

  return (
    <div className="card">
      <h2>{admin.company_name}</h2>
      <p className="muted">{admin.city}</p>
      <p>{admin.description}</p>

      <Link to="/request" className="btn btn-primary">Comparar</Link>
    </div>
  )
}
