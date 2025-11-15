'use client';

import { useAuth } from '@/hooks/useAuth';

export default function DashboardMorador() {
  const { profile } = useAuth();

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Dashboard do Morador 🏠
        </h1>
        <p className="text-gray-600 mt-2">
          Bem-vindo, {profile?.full_name || 'Morador'}! Gerencie seus serviços e atividades no condomínio
        </p>
      </div>

      {/* Stats Grid - Dados estáticos por enquanto */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <span className="text-2xl">📋</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Serviços Ativos</p>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <span className="text-2xl">💰</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pagamentos</p>
              <p className="text-2xl font-bold text-gray-900">R$ 0,00</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <span className="text-2xl">👥</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Assembleias</p>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 rounded-lg">
              <span className="text-2xl">⭐</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avaliações</p>
              <p className="text-2xl font-bold text-gray-900">-</p>
            </div>
          </div>
        </div>
      </div>

      {/* Ações Rápidas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-xl font-semibold mb-4">Ações Rápidas</h3>
          <div className="space-y-3">
            <button 
              onClick={() => window.location.href = '/marketplace'}
              className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span className="font-medium">🔍 Buscar Serviços</span>
              <p className="text-sm text-gray-600">Encontre prestadores no marketplace</p>
            </button>
            <button className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <span className="font-medium">📢 Ver Assembleias</span>
              <p className="text-sm text-gray-600">Participe das decisões do condomínio</p>
            </button>
            <button className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <span className="font-medium">💬 Chat do Condomínio</span>
              <p className="text-sm text-gray-600">Comunique-se com outros moradores</p>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-xl font-semibold mb-4">Atividade Recente</h3>
          <div className="space-y-4">
            <div className="text-center py-8 text-gray-500">
              <p>Nenhuma atividade recente</p>
              <p className="text-sm mt-2">Seus serviços e atividades aparecerão aqui</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
