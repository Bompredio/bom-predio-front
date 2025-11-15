'use client'

import { useEffect, useState } from 'react'
import { supabase, Administradora, Condominio, PrestadorServico } from '@/lib/supabase'
import { useAuthState } from '@/hooks/useAuth'

export default function AdministradoraDashboard() {
  const { profile } = useAuthState()
  const [administradora, setAdministradora] = useState<Administradora | null>(null)
  const [condominios, setCondominios] = useState<Condominio[]>([])
  const [prestadores, setPrestadores] = useState<PrestadorServico[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (profile?.user_type !== 'administradora') return

    const fetchData = async () => {
      try {
        // Busca dados da administradora
        const { data: adminData } = await supabase
          .from('administradoras')
          .select('*')
          .eq('user_id', profile.id)
          .single()

        setAdministradora(adminData)

        if (adminData) {
          // Busca condomínios administrados
          const { data: condominiosData } = await supabase
            .from('condominios')
            .select('*')
            .eq('administradora_id', adminData.id)

          setCondominios(condominiosData || [])

          // Busca prestadores da administradora
          const { data: prestadoresData } = await supabase
            .from('prestadores_servicos')
            .select('*')
            .eq('administradora_id', adminData.id)

          setPrestadores(prestadoresData || [])
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [profile])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-gold"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-primary-navy text-white p-6">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold">Bom Prédio - Administradora</h1>
          <p className="text-primary-gold">
            {administradora?.nome_empresa}
          </p>
        </div>
      </header>

      <div className="container mx-auto p-6">
        {/* Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-600 mb-2">Condomínios</h3>
            <p className="text-3xl font-bold text-primary-navy">{condominios.length}</p>
          </div>
          
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-600 mb-2">Prestadores</h3>
            <p className="text-3xl font-bold text-primary-navy">{prestadores.length}</p>
          </div>
          
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-600 mb-2">Serviços Ativos</h3>
            <p className="text-3xl font-bold text-primary-navy">
              {prestadores.filter(p => p.tipo_servico).length}
            </p>
          </div>
        </div>

        {/* Condomínios */}
        <div className="card mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-primary-navy">Condomínios Administrados</h2>
            <button className="btn-primary">Adicionar Condomínio</button>
          </div>
          
          <div className="space-y-4">
            {condominios.map((condominio) => (
              <div key={condominio.id} className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-lg">{condominio.nome}</h3>
                <p className="text-gray-600">{condominio.morada}</p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm text-gray-500">
                    {condominio.num_fracoes} frações
                  </span>
                  <button className="btn-secondary text-sm">Gerir</button>
                </div>
              </div>
            ))}
            
            {condominios.length === 0 && (
              <p className="text-center text-gray-500 py-8">
                Nenhum condomínio administrado ainda
              </p>
            )}
          </div>
        </div>

        {/* Prestadores */}
        <div className="card">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-primary-navy">Prestadores de Serviços</h2>
            <button className="btn-primary">Adicionar Prestador</button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {prestadores.map((prestador) => (
              <div key={prestador.id} className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-lg">{prestador.nome_empresa}</h3>
                <p className="text-gray-600 capitalize">{prestador.tipo_servico}</p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm text-gray-500">{prestador.contacto}</span>
                  <button className="btn-secondary text-sm">Ver Detalhes</button>
                </div>
              </div>
            ))}
            
            {prestadores.length === 0 && (
              <p className="text-center text-gray-500 py-8 col-span-2">
                Nenhum prestador de serviços cadastrado
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
