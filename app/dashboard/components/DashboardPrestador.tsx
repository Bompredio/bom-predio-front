'use client';

import { useAuth } from '@/hooks/useAuth';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface PrestadorStats {
  servicos_ativos: number;
  faturamento_mes: number;
  avaliacao_media: number;
  total_clientes: number;
  servicos_concluidos: number;
}

interface Servico {
  id: number;
  titulo: string;
  cliente: string;
  data: string;
  status: 'agendado' | 'andamento' | 'concluido' | 'cancelado';
  valor: number;
}

export default function DashboardPrestador() {
  const { profile, user } = useAuth();
  const [stats, setStats] = useState<PrestadorStats>({
    servicos_ativos: 0,
    faturamento_mes: 0,
    avaliacao_media: 0,
    total_clientes: 0,
    servicos_concluidos: 0
  });
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPrestadorData();
  }, []);

  const fetchPrestadorData = async () => {
    // Simulando dados - depois vamos conectar com o banco real
    setStats({
      servicos_ativos: 5,
      faturamento_mes: 3240.00,
      avaliacao_media: 4.9,
      total_clientes: 18,
      servicos_concluidos: 42
    });

    setServicos([
      {
        id: 1,
        titulo: "Reparo Hidráulico",
        cliente: "Maria Silva - Apt 201",
        data: "Amanhã, 14:00",
        status: "agendado",
        valor: 150.00
      },
      {
        id: 2,
        titulo: "Instalação Elétrica",
        cliente: "João Santos - Apt 305",
        data: "Sexta, 10:00",
        status: "agendado",
        valor: 280.00
      },
      {
        id: 3,
        titulo: "Manutenção Ar Condicionado",
        cliente: "Ana Costa - Apt 102",
        data: "Concluído",
        status: "concluido",
        valor: 120.00
      }
    ]);

    setLoading(false);
  };

  const quickActions = [
    {
      title: "➕ Novo Serviço",
      description: "Oferecer um serviço no marketplace",
      action: () => window.location.href = '/marketplace?novo-servico=true',
      color: "bg-blue-50 border-blue-200 hover:bg-blue-100"
    },
    {
      title: "📊 Meu Desempenho",
      description: "Ver métricas e avaliações detalhadas",
      action: () => window.location.href = '/prestador/analytics',
      color: "bg-green-50 border-green-200 hover:bg-green-100"
    },
    {
      title: "💼 Meu Perfil Público",
      description: "Visualizar e editar perfil no marketplace",
      action: () => window.location.href = `/marketplace/prestador/${user?.id}`,
      color: "bg-purple-50 border-purple-200 hover:bg-purple-100"
    },
    {
      title: "💰 Financeiro",
      description: "Extrato e gestão financeira",
      action: () => window.location.href = '/prestador/financeiro',
      color: "bg-orange-50 border-orange-200 hover:bg-orange-100"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'agendado':
        return 'bg-blue-100 text-blue-800';
      case 'andamento':
        return 'bg-yellow-100 text-yellow-800';
      case 'concluido':
        return 'bg-green-100 text-green-800';
      case 'cancelado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'agendado':
        return 'Agendado';
      case 'andamento':
        return 'Em Andamento';
      case 'concluido':
        return 'Concluído';
      case 'cancelado':
        return 'Cancelado';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
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
              Dashboard do Prestador 🔧
            </h1>
            <p className="text-gray-600 mt-2">
              Bem-vindo, {profile?.full_name || 'Prestador'}! Gerencie seus serviços e avaliações
            </p>
          </div>
          <div className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
            Prestador
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <span className="text-2xl">📋</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Serviços Ativos</p>
              <p className="text-2xl font-bold text-gray-900">{stats.servicos_ativos}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <span className="text-2xl">💰</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Faturamento (Mês)</p>
              <p className="text-2xl font-bold text-gray-900">
                R$ {stats.faturamento_mes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <span className="text-2xl">⭐</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avaliação Média</p>
              <div className="flex items-center">
                <p className="text-2xl font-bold text-gray-900">{stats.avaliacao_media}</p>
                <span className="ml-2 text-yellow-500">★</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 rounded-lg">
              <span className="text-2xl">👥</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Clientes Atendidos</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total_clientes}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Gestão de Serviços */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-xl font-semibold mb-4">Gestão de Serviços</h3>
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
          <h3 className="text-xl font-semibold mb-4">Serviços Agendados</h3>
          <div className="space-y-4">
            {servicos.map((servico) => (
              <div key={servico.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-medium text-gray-900">{servico.titulo}</h4>
                    <p className="text-sm text-gray-600">{servico.cliente}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusColor(servico.status)}`}>
                    {getStatusText(servico.status)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">{servico.data}</span>
                  <span className="font-medium text-green-600">
                    R$ {servico.valor.toFixed(2)}
                  </span>
                </div>
                {servico.status === 'agendado' && (
                  <div className="mt-3 flex space-x-2">
                    <button className="flex-1 bg-blue-600 text-white py-2 px-3 rounded text-sm hover:bg-blue-700">
                      Confirmar
                    </button>
                    <button className="flex-1 bg-gray-200 text-gray-800 py-2 px-3 rounded text-sm hover:bg-gray-300">
                      Reagendar
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Avaliações e Métricas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-xl font-semibold mb-4">Últimas Avaliações</h3>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center mb-2">
                <div className="flex text-yellow-500">
                  {'★'.repeat(5)}
                </div>
                <span className="ml-2 text-sm font-medium">5.0</span>
              </div>
              <p className="text-sm text-gray-700 mb-2">
                "Excelente serviço! Rápido e eficiente. Recomendo muito!"
              </p>
              <p className="text-xs text-gray-500">- Maria Silva, há 2 dias</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center mb-2">
                <div className="flex text-yellow-500">
                  {'★'.repeat(4)}
                  <span className="text-gray-300">★</span>
                </div>
                <span className="ml-2 text-sm font-medium">4.0</span>
              </div>
              <p className="text-sm text-gray-700 mb-2">
                "Bom trabalho, mas chegou um pouco atrasado."
              </p>
              <p className="text-xs text-gray-500">- João Santos, há 1 semana</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-xl font-semibold mb-4">Métricas de Performance</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Taxa de Conclusão</span>
                <span>98%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '98%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Pontualidade</span>
                <span>92%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '92%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Satisfação do Cliente</span>
                <span>96%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-600 h-2 rounded-full" style={{ width: '96%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Serviços Concluídos</span>
                <span>{stats.servicos_concluidos}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-orange-600 h-2 rounded-full" 
                  style={{ width: `${Math.min(100, (stats.servicos_concluidos / 50) * 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
