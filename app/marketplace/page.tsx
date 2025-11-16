'use client'

import { useEffect, useState } from 'react'
import { supabase, PrestadorServico } from '@/lib/supabase'
import { useAuth } from '@/app/providers/AuthProvider'
import Link from 'next/link'

export default function Marketplace() {
  const { user, isLoading: authLoading } = useAuth()
  const [prestadores, setPrestadores] = useState<PrestadorServico[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchPrestadores = async () => {
      try {
        const { data, error } = await supabase
          .from('prestadores_servicos')
          .select('*')
          .limit(20) // Limite para não sobrecarregar

        if (error) throw error
        setPrestadores(data || [])
      } catch (error) {
        console.error('Error fetching prestadores:', error)
        setPrestadores([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchPrestadores()
  }, [])

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-gold mx-auto mb-4"></div>
          <p className="text-primary-navy">A verificar autenticação...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-4xl mb-4">🔐</div>
          <h1 className="text-2xl font-bold text-primary-navy mb-4">Acesso Restrito</h1>
          <p className="text-gray-600 mb-6">
            Para acessar o marketplace, você precisa estar autenticado.
          </p>
          <div className="space-y-3">
            <Link href="/auth/login" className="btn-primary w-full block">
              Fazer Login
            </Link>
            <Link href="/auth/signup" className="btn-secondary w-full block">
              Criar Conta
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-primary-navy text-white p-6">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold">Marketplace</h1>
          <p className="text-primary-gold">
            Encontre os melhores prestadores de serviços para o seu condomínio
          </p>
        </div>
      </header>

      <div className="container mx-auto p-6">
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-gold mx-auto mb-4"></div>
              <p className="text-primary-navy">A carregar prestadores...</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {prestadores.map((prestador) => (
              <Link 
                key={prestador.id} 
                href={`/marketplace/prestador/${prestador.id}`}
                className="block"
              >
                <div className="card cursor-pointer hover:shadow-xl transition-all duration-200 hover:transform hover:scale-105">
                  <h3 className="font-semibold text-lg text-primary-navy mb-2">
                    {prestador.nome_empresa}
                  </h3>
                  <p className="text-gray-600 capitalize mb-2">
                    {prestador.tipo_servico}
                  </p>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>{prestador.contacto}</span>
                    <span className="btn-secondary text-xs py-1 px-2">
                      Ver detalhes
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {!isLoading && prestadores.length === 0 && (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">🔍</div>
            <h2 className="text-xl font-semibold text-primary-navy mb-2">
              Nenhum prestador encontrado
            </h2>
            <p className="text-gray-600">
              Não há prestadores de serviços cadastrados no momento.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
