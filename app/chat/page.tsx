'use client'

import { useAuth } from '@/app/providers/AuthProvider'

export default function Chat() {
  const { user, profile, isLoading } = useAuth()

  if (isLoading) {
    return <div>Carregando...</div>
  }

  if (!user) {
    return <div>Por favor, faça login para acessar o chat.</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold text-primary-navy mb-6">Chat</h1>
      <div className="card">
        <p>Funcionalidade de chat em desenvolvimento...</p>
      </div>
    </div>
  )
}
