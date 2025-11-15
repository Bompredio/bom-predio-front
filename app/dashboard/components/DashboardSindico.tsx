'use client';

import { useAuth } from '@/hooks/useAuth';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface CondominioStats {
  total_moradores: number;
  total_prestadores: number;
  arrecadado_mes: number;
  pendentes: number;
}

export default function DashboardSindico() {
  const { profile } = useAuth();
  const [stats, setStats] = useState<CondominioStats>({
    total_moradores: 0,
    total_prestadores: 0,
    arrecadado_mes: 0,
    pendentes: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCondominioStats();
  }, []);

  const fetchCondominioStats = async () => {
    // Simulando dados - depois vamos conectar com o banco real
    setStats({
      total_moradores: 48,
      total_prestadores: 15,
      arrecadado_mes: 12480.00,
      pendentes: 3
    });
    setLoading(false);
  };

  const quickActions = [
    {
      title: "📊 Relatório Financeiro",
      description: "Verifique as finanças do condomínio",
      action: () => window.location.href = '/financeiro',
      color: "bg-blue-50 border-blue-200 hover:bg-blue-100"
    },
    {
      title: "👥 Gerenciar Moradores",
      description: "Administre usuários e acessos",
      action: () => window.location.href = '/moradores',
      color: "bg-green-50 border-green-200 hover:bg-green-100"
    },
    {
      title: "🏗️ Obras e Manutenções",
      description: "Gerencie serviços e solicitações",
      action: () => window.location.href = '/servicos',
      color: "bg-purple-50 border-purple-200 hover:bg-purple-100"
    },
    {
      title: "📢 Assembleias",
      description: "Convoque e gerencie reuniões",
      action: () => window.location.href = '/assembleias',
      color: "bg-orange-50 border-orange-200 hover:bg-orange-100"
    }
  ];

  const alertas = [
    {
      id: 1,
      tipo: "urgente",
      titulo: "Pagamentos Atrasados",
      descricao: "3 moradores com pagamento em atraso",
      cor: "bg-red-50 border-red-200",
      badge: "bg-red-100 text-red-800"
    },
    {
      id: 2,
      tipo: "atencao",
      titulo: "Assembleia Pendente",
      descricao: "Assembleia agendada para próxima semana",
      cor: "bg-yellow-50 border-yellow-200",
      badge: "bg-yellow-100 text-yellow-800"
    },
    {
      id: 3,
      tipo: "info",
      titulo: "Manutenção Preventiva",
      descricao: "Elétrica precisa de vistoria trimestral",
      cor: "bg-blue-50 border-blue-200",
      badge: "bg-blue-100 text-blue-800"
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Dashboard do Síndico 🏢
            </h1>
            <p className="text-gray-600 mt-2">
              Bem-vindo, {profile?.full_name || 'Síndico'}! Gerencie todo o condomínio e suas operações
            </p>
          </div>
          <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
            Síndico
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <span className="text-2xl">👥</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total de Moradores</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total_moradores}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <span className="text-2xl">💰</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Arrecadado (Mês)</p>
              <p className="text-2xl font-bold text-gray-900">
                R$ {stats.arrecadado_mes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <span className="text-2xl">🔧</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Prestadores Ativos</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total_prestadores}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 bg-red-100 rounded-lg">
              <span className="text-2xl">⚠️</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pendências Críticas</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pendentes}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Gestão do Condomínio */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-xl font-semibold mb-4">Gestão do Condomínio</h3>
          <div className="space-y-3">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={action.action}
                className={`w-full text-left p-4 border rounded-lg transition-colors ${action.color}`}
              >
                <span className="font-medium block">{action.title}</span>
                <p className="text-sm text-gray-600 mt-1">{action.description}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-xl font-semibold mb-4">Alertas e Notificações</h3>
          <div className="space-y-4">
            {alertas.map((alerta) => (
              <div key={alerta.id} className={`p-4 border rounded-lg ${alerta.cor}`}>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{alerta.titulo}</p>
                    <p className="text-sm text-gray-600 mt-1">{alerta.descricao}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full font-medium ${alerta.badge}`}>
                    {alerta.tipo === 'urgente' ? 'Urgente' : 
                     alerta.tipo === 'atencao' ? 'Atenção' : 'Informação'}
                  </span>
                </div>
                <div className="mt-3 flex space-x-2">
                  <button className="text-xs bg-white px-3 py-1 rounded border hover:bg-gray-50">
                    Resolver
                  </button>
                  <button className="text-xs bg-white px-3 py-1 rounded border hover:bg-gray-50">
                    Adiar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Atividades Recentes e Métricas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-xl font-semibold mb-4">Atividades Recentes</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Novo morador cadastrado</p>
                <p className="text-xs text-gray-500">Há 2 horas</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Pagamento confirmado - Apt 102</p>
                <p className="text-xs text-gray-500">Há 5 horas</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Solicitação de serviço - Encanador</p>
                <p className="text-xs text-gray-500">Há 1 dia</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-xl font-semibold mb-4">Métricas do Condomínio</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Taxa de Ocupação</span>
                <span>92%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '92%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Pagamentos em Dia</span>
                <span>94%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '94%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Satisfação dos Moradores</span>
                <span>88%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-600 h-2 rounded-full" style={{ width: '88%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
