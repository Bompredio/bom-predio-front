'use client'

import { useEffect, useState } from 'react'
import { supabase, PrestadorServico, Service, Rating } from '@/lib/supabase'
import { useAuth } from '@/app/providers/AuthProvider'

export default function PrestadorDashboard() {
  const { profile } = useAuth()
  const [prestador, setPrestador] = useState<PrestadorServico | null>(null)
  const [services, setServices] = useState<Service[]>([])
  const [ratings, setRatings] = useState<Rating[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (profile?.user_type !== 'prestador') return

    const fetchData = async () => {
      try {
        const { data: prestadorData } = await supabase
          .from('prestadores_servicos')
          .select('*')
          .eq('user_id', profile.id)
          .single()

        setPrestador(prestadorData)

        if (prestadorData) {
          const { data: servicesData } = await supabase
            .from('services')
            .select('*')
            .eq('prestador_id', prestadorData.id)

          setServices(servicesData || [])

          const { data: ratingsData } = await supabase
            .from('ratings')
            .select('*')
            .eq('prestador_id', prestadorData.id)

          setRatings(ratingsData || [])
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [profile])

  const completedServices = services.filter(s => s.status === 'completed').length
  const averageRating = ratings.length > 0 
    ? ratings.reduce((acc, curr) => acc + curr.rating, 0) / ratings.length 
    : 0

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-gold"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-primary-navy text-white p-6">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold">Bom Prédio - Prestador</h1>
          <p className="text-primary-gold">
            {prestador?.nome_empresa} • {prestador?.tipo_servico}
          </p>
        </div>
      </header>

      <div className="container mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-600 mb-2">Serviços Totais</h3>
            <p className="text-3xl font-bold text-primary-navy">{services.length}</p>
          </div>
          
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-600 mb-2">Concluídos</h3>
            <p className="text-3xl font-bold text-semantic-success">{completedServices}</p>
          </div>
          
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-600 mb-2">Avaliação Média</h3>
            <p className="text-3xl font-bold text-primary-navy">
              {averageRating.toFixed(1)} ⭐
            </p>
          </div>
          
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-600 mb-2">Avaliações</h3>
            <p className="text-3xl font-bold text-primary-navy">{ratings.length}</p>
          </div>
        </div>

        <div className="card mb-8">
          <h2 className="text-xl font-bold text-primary-navy mb-6">Serviços Recentes</h2>
          
          <div className="space-y-4">
            {services.slice(0, 5).map((service) => (
              <div key={service.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg">{service.title}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    service.status === 'completed' ? 'bg-semantic-success text-white' :
                    service.status === 'in_progress' ? 'bg-semantic-warning text-white' :
                    'bg-gray-200 text-gray-700'
                  }`}>
                    {service.status === 'completed' ? 'Concluído' :
                     service.status === 'in_progress' ? 'Em Andamento' :
                     service.status === 'pending' ? 'Pendente' : 'Cancelado'}
                  </span>
                </div>
                <p className="text-gray-600 mb-2">{service.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    {new Date(service.created_at).toLocaleDateString('pt-PT')}
                  </span>
                  <span className="font-semibold text-primary-navy">
                    {service.price ? `${service.price}€` : 'Orçamento pendente'}
                  </span>
                </div>
              </div>
            ))}
            
            {services.length === 0 && (
              <p className="text-center text-gray-500 py-8">
                Nenhum serviço registrado ainda
              </p>
            )}
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-bold text-primary-navy mb-6">Últimas Avaliações</h2>
          
          <div className="space-y-4">
            {ratings.slice(0, 3).map((rating) => (
              <div key={rating.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <div className="flex text-yellow-400 mr-2">
                    {'⭐'.repeat(rating.rating)}
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(rating.created_at).toLocaleDateString('pt-PT')}
                  </span>
                </div>
                <p className="text-gray-700">{rating.comment}</p>
              </div>
            ))}
            
            {ratings.length === 0 && (
              <p className="text-center text-gray-500 py-8">
                Nenhuma avaliação recebida ainda
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
