'use client'

import { useAuth } from '@/app/providers/AuthProvider'

export default function Marketplace() {
  const { user, profile, isLoading } = useAuth()

  if (isLoading) {
    return <div>Carregando...</div>
  }

  if (!user) {
    return <div>Por favor, faça login para acessar o marketplace.</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold text-primary-navy mb-6">Marketplace</h1>
      <div className="card">
        <p>Funcionalidade de marketplace em desenvolvimento...</p>
      </div>
    </div>
  )
}
