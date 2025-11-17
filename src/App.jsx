import React from 'react'
import { Link } from 'react-router-dom'

export default function App() {
  return (
    <div style={{ padding: 40, fontFamily: 'Inter, system-ui, -apple-system' }}>
      <div style={{ background: '#fff', padding: 20, borderRadius: 8, border: '1px solid #eee' }}>
        <h1>✔️ TESTE DE DEPLOY - Bom Prédio</h1>
        <p><strong>Timestamp build:</strong> {new Date().toLocaleString()}</p>
        <p>Se você vê esta página, o deploy atual está a servir o commit mais recente.</p>
        <div style={{ marginTop: 12 }}>
          <Link to="/" className="btn" style={{ marginRight: 8 }}>Marketplace ( / )</Link>
          <Link to="/request" className="btn" style={{ marginRight: 8 }}>Formulário ( /request )</Link>
          <Link to="/compare" className="btn">Compare ( /compare )</Link>
        </div>
        <hr style={{ margin: '20px 0' }} />
        <p style={{ color: '#666' }}>Depois de confirmar, reponha o App.jsx original (eu envio o original de volta se quiseres).</p>
      </div>
    </div>
  )
}
