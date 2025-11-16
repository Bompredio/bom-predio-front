'use client'

import { useState } from 'react'
import { supabase, UserType } from '@/lib/supabase'
import { useAuth } from '@/app/providers/AuthProvider'

export default function UserTypeSetup() {
  const { user, refreshProfile } = useAuth()
  const [selectedType, setSelectedType] = useState<UserType | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleUserTypeSelect = async (userType: UserType) => {
    if (!user) return
    
    setIsLoading(true)
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ user_type: userType })
        .eq('id', user.id)

      if (error) throw error

      await refreshProfile()
    } catch (error) {
      console.error('Error setting user type:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const userTypes = [
    {
      type: 'morador' as UserType,
      title: 'Morador/Síndico',
      description: 'Você mora em um condomínio e quer gerenciar sua residência',
      icon: '🏠'
    },
    {
      type: 'administradora' as UserType,
      title: 'Administradora',
      description: 'Empresa profissional de administração de condomínios',
      icon: '🏢'
    },
    {
      type: 'prestador' as UserType,
      title: 'Prestador de Serviços',
      description: 'Fornece serviços especializados para condomínios',
      icon: '🔧'
    }
  ]

  return (
    <div className="min-h-screen bg-primary-navy flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary-gold mb-4">
            Bom Prédio
          </h1>
          <p className="text-xl text-white">
            Escolha o seu perfil na plataforma
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {userTypes.map((userType) => (
            <button
              key={userType.type}
              onClick={() => handleUserTypeSelect(userType.type)}
              disabled={isLoading}
              className={`p-6 rounded-xl text-left transition-all duration-200 ${
                selectedType === userType.type
                  ? 'bg-primary-gold text-primary-navy transform scale-105'
                  : 'bg-white text-primary-navy hover:bg-gray-50'
              } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <div className="text-3xl mb-4">{userType.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{userType.title}</h3>
              <p className="text-sm opacity-75">{userType.description}</p>
            </button>
          ))}
        </div>

        {isLoading && (
          <div className="text-center mt-6">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-gold"></div>
            <p className="text-white mt-2">Configurando sua conta...</p>
          </div>
        )}
      </div>
    </div>
  )
}
