'use client'

import { useEffect, useState } from 'react'
import { supabase, Condominio, CondominioMorador } from '@/lib/supabase'
import { useAuth } from '@/app/providers/AuthProvider'

export default function MoradorDashboard() {
  const { profile, user } = useAuth()
  const [condominio, setCondominio] = useState<Condominio | null>(null)
  const [moradorInfo, setMoradorInfo] = useState<CondominioMorador | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (profile?.user_type !== 'morador') return

    const fetchData = async () => {
      try {
        const { data: moradorData } = await supabase
          .from('condominio_moradores')
          .select('*')
          .eq('user_id', user?.id)
          .single()

        setMoradorInfo(moradorData)

        if (moradorData) {
          const { data: condominioData } = await supabase
            .from('condominios')
            .select('*')
            .eq('id', moradorData.condominio_id)
            .single()

          setCondominio(condominioData)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [profile, user])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-gold"></div>
      </div>
    )
  }

  const isSindico = moradorInfo?.cargo === 'sindico'

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-primary-navy text-white p-6">
        <div className="container mx-auto">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Bom Prédio - Morador</h1>
              <p className="text-primary-gold">
                {profile?.full_name} {isSindico && '(Síndico)'}
              </p>
            </div>
            {isSindico && (
              <span className="bg-primary-gold text-primary-navy px-3 py-1 rounded-full text-sm font-medium">
                Síndico
              </span>
            )}
          </div>
        </div>
      </header>

      <div className="container mx-auto p-6">
        {condominio && (
          <div className="card mb-8">
            <h2 className="text-xl font-bold text-primary-navy mb-4">Meu Condomínio</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-lg">{condominio.nome}</h3>
                <p className="text-gray-600">{condominio.morada}</p>
              </div>
              <div className="text-right">
                <p className="text-gray-600">
                  <strong>Fração:</strong> {moradorInfo?.fraccao}
                </p>
                <p className="text-gray-600">
                  <strong>Permilagem:</strong> {moradorInfo?.permilagem}‰
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <button className="card text-left hover:shadow-xl transition-shadow duration-200">
            <div className="text-2xl mb-2">📋</div>
            <h3 className="font-semibold">Assembleias</h3>
            <p className="text-sm text-gray-600">Participe das votações</p>
          </button>

          <button className="card text-left hover:shadow-xl transition-shadow duration-200">
            <div className="text-2xl mb-2">💬</div>
            <h3 className="font-semibold">Comunicação</h3>
            <p className="text-sm text-gray-600">Fale com a administradora</p>
          </button>

          <button className="card text-left hover:shadow-xl transition-shadow duration-200">
            <div className="text-2xl mb-2">🔧</div>
            <h3 className="font-semibold">Serviços</h3>
            <p className="text-sm text-gray-600">Solicite reparações</p>
          </button>

          <button className="card text-left hover:shadow-xl transition-shadow duration-200">
            <div className="text-2xl mb-2">📊</div>
            <h3 className="font-semibold">Relatórios</h3>
            <p className="text-sm text-gray-600">Acompanhe as contas</p>
          </button>
        </div>

        {isSindico && (
          <div className="card">
            <h2 className="text-xl font-bold text-primary-navy mb-4">Ações do Síndico</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button className="btn-primary w-full py-3">Gerir Moradores</button>
              <button className="btn-secondary w-full py-3">Aprovar Orçamentos</button>
              <button className="btn-primary w-full py-3">Convocar Assembleia</button>
              <button className="btn-secondary w-full py-3">Supervisionar Administradora</button>
            </div>
          </div>
        )}

        {!condominio && (
          <div className="card text-center py-12">
            <div className="text-4xl mb-4">🏠</div>
            <h3 className="text-xl font-semibold text-primary-navy mb-2">
              Você ainda não está vinculado a um condomínio
            </h3>
            <p className="text-gray-600 mb-4">
              Entre em contato com o síndico ou administradora para ser adicionado ao condomínio.
            </p>
            <button className="btn-primary">Solicitar Vinculação</button>
          </div>
        )}
      </div>
    </div>
  )
}
