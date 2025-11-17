// src/App.jsx (diagnóstico - sem Router)
import React from 'react'

export default function App() {
  return (
    <div style={{ padding: 40, fontFamily: 'Inter, system-ui, -apple-system' }}>
      <div style={{ background: '#fff', padding: 20, borderRadius: 8, border: '1px solid #eee' }}>
        <h1>✔️ TESTE DE DEPLOY — Página estável</h1>
        <p><strong>Timestamp client:</strong> {new Date().toLocaleString()}</p>
        <p>Se você vê esta página, o deploy mais recente está a servir o commit atual.</p>
        <p style={{ color:'#666' }}>Próximo passo: reintroduzir as rotas ou colar aqui o erro do Console (F12 → Console).</p>
      </div>
    </div>
  )
}
