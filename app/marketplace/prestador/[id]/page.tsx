'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import { supabase, PrestadorServico, Rating } from '@/lib/supabase'

export default function PrestadorProfile() {
  const params = useParams()
  const [prestador, setPrestador] = useState<PrestadorServico | null>(null)
  const [ratings, setRatings] = useState<Rating[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchPrestador = async () => {
      try {
        const { data, error } = await supabase
          .from('prestadores_servicos')
          .select('*')
          .eq('id', params.id)
          .single()

        if (error) throw error
        setPrestador(data)

        // Buscar avaliações
        const { data: ratingsData } = await supabase
          .from('ratings')
          .select('*')
          .eq('prestador_id', params.id)

        setRatings(ratingsData || [])
      } catch (error) {
        console.error('Error fetching prestador:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (params.id) {
      fetchPrestador()
    }
  }, [params.id])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-gold"></div>
      </div>
    )
  }

  if (!prestador) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-primary-navy mb-4">
            Prestador não encontrado
          </h1>
          <p className="text-gray-600">
            O prestador de serviços que você está procurando não existe.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="card mb-6">
          <h1 className="text-3xl font-bold text-primary-navy mb-2">
            {prestador.nome_empresa}
          </h1>
          <p className="text-lg text-gray-600 mb-4 capitalize">
            {prestador.tipo_servico}
          </p>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <span className="text-yellow-400 text-lg">⭐</span>
              <span className="ml-1 text-gray-700">
                {ratings.length > 0 
                  ? (ratings.reduce((acc, curr) => acc + curr.rating, 0) / ratings.length).toFixed(1)
                  : '0.0'
                }
              </span>
            </div>
            <span className="text-gray-500">•</span>
            <span className="text-gray-600">{ratings.length} avaliações</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="card mb-6">
              <h2 className="text-xl font-semibold text-primary-navy mb-4">
                Sobre
              </h2>
              <p className="text-gray-600">
                Prestador de serviços especializado em {prestador.tipo_servico}.
              </p>
            </div>

            <div className="card">
              <h2 className="text-xl font-semibold text-primary-navy mb-4">
                Avaliações
              </h2>
              {ratings.length > 0 ? (
                <div className="space-y-4">
                  {ratings.map((rating) => (
                    <div key={rating.id} className="border-b border-gray-200 pb-4 last:border-0">
                      <div className="flex items-center mb-2">
                        <div className="flex text-yellow-400">
                          {'⭐'.repeat(rating.rating)}
                        </div>
                        <span className="text-sm text-gray-500 ml-2">
                          {new Date(rating.created_at).toLocaleDateString('pt-PT')}
                        </span>
                      </div>
                      <p className="text-gray-700">{rating.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  Nenhuma avaliação ainda.
                </p>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="card">
              <h3 className="font-semibold text-primary-navy mb-4">Contactos</h3>
              <p className="text-gray-600 mb-2">{prestador.contacto}</p>
              <p className="text-gray-600">{prestador.email}</p>
            </div>

            <div className="card">
              <button className="btn-primary w-full">
                Solicitar Orçamento
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
