import React from 'react'
export default function Dashboard({session}){
  return (
    <div className="card">
      <h2>Dashboard</h2>
      <p>Área privada — bem-vindo, {session.user.email}</p>
      <p className="muted">Aqui terá o histórico de pedidos, contratos e mensagens.</p>
    </div>
  )
}
