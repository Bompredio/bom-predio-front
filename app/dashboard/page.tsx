'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthState } from '@/hooks/useAuth'
import UserTypeSetup from '../components/UserTypeSetup'

export default function DashboardPage() {
  const { profile, isLoading } = useAuthState()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && profile?.user_type) {
      // Redireciona para o dashboard específico baseado no tipo de usuário
      router.push(`/dashboard/${profile.user_type}`)
    }
  }, [profile, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-gold"></div>
      </div>
    )
  }

  // Se não tem tipo de usuário definido, mostra o setup
  if (!profile?.user_type) {
    return <UserTypeSetup />
  }

  // Loading durante o redirecionamento
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-gold mx-auto mb-4"></div>
        <p className="text-primary-navy">Redirecionando para seu dashboard...</p>
      </div>
    </div>
  )
}
