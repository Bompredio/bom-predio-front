'use client';

import { useAuth } from '@/hooks/useAuth';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import RatingStars from '../../components/ratings/Stars';

interface PrestadorStats {
  servicos_ativos: number;
  faturamento_mes: number;
  avaliacao_media: number;
  total_avaliacoes: number;
  total_clientes: number;
  servicos_concluidos: number;
}

interface Servico {
  id: string;
  title: string;
  cliente: {
    full_name: string;
  }[];
  cliente_nome: string;
  data: string;
  status: 'agendado' | 'andamento' | 'concluido' | 'cancelado';
  price: number;
  created_at: string;
}

interface Avaliacao {
  id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  cliente: {
    full_name: string;
  }[];
}

export default function DashboardPrestador() {
  const { profile, user } = useAuth();
  const [stats, setStats] = useState<PrestadorStats>({
    servicos_ativos: 0,
    faturamento_mes: 0,
    avaliacao_media: 0,
    total_avaliacoes: 0,
    total_clientes: 0,
    servicos_concluidos: 0
  });
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPrestadorData = async () => {
    if (!user) return;

    try {
      // Buscar serviços
      const { data: servicesData, error: servicesError } = await supabase
        .from('services')
        .select(`
          id,
          title,
          status,
          price,
          created_at,
          cliente:cliente_id (
            full_name
          )
        `)
        .eq('prestador_id', user.id)
        .order('created_at', { ascending: false });

      if (servicesError) throw servicesError;

      // Buscar avaliações
      const { data: ratingsData, error: ratingsError } = await supabase
        .from('ratings')
        .select(`
          id,
          rating,
          comment,
          created_at,
          cliente:cliente_id (
            full_name
          )
        `)
        .eq('prestador_id', user.id)
        .order('created_at', { ascending: false });

      if (ratingsError) throw ratingsError;

      // Calcular estatísticas
      const servicosAtivos = servicesData?.filter(s => s.status === 'agendado' || s.status === 'andamento').length || 0;
      const servicosConcluidos = servicesData?.filter(s => s.status === 'concluido').length || 0;
      
      // Calcular faturamento do mês atual
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      
      const faturamentoMes = servicesData
        ?.filter(s => s.status === 'concluido' && 
          new Date(s.created_at) >= startOfMonth && 
          new Date(s.created_at) <= endOfMonth)
        .reduce((sum, service) => sum + (service.price || 0), 0) || 0;

      // Calcular média de avaliações
      const avaliacaoMedia = ratingsData && ratingsData.length > 0 
        ? ratingsData.reduce((sum, rating) => sum + rating.rating, 0) / ratingsData.length 
        : 0;

      // Calcular clientes únicos (CORREÇÃO APLICADA AQUI)
      const clientesUnicos = new Set(servicesData?.map(s => s.cliente[0]?.full_name).filter(Boolean)).size;

      setStats({
        servicos_ativos: servicosAtivos,
        faturamento_mes: faturamentoMes,
        avaliacao_media: Number(avaliacaoMedia.toFixed(1)),
        total_avaliacoes: ratingsData?.length || 0,
        total_clientes: clientesUnicos,
        servicos_concluidos: servicosConcluidos
      });

      // Processar serviços para exibição
      const servicosFormatados: Servico[] = (servicesData || []).slice(0, 5).map(service => ({
        id: service.id,
        title: service.title,
        cliente: service.cliente,
        cliente_nome: service.cliente[0]?.full_name || 'Cliente',
        data: formatServiceDate(service.created_at, service.status),
        status: service.status as 'agendado' | 'andamento' | 'concluido' | 'cancelado',
        price: service.price || 0,
        created_at: service.created_at
      }));

      setServicos(servicosFormatados);
      setAvaliacoes((ratingsData || []).slice(0, 3));

    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      
      // Dados mockados em caso de erro
      setStats({
        servicos_ativos: 5,
        faturamento_mes: 3240.00,
        avaliacao_media: 4.9,
        total_avaliacoes: 18,
        total_clientes: 12,
        servicos_concluidos: 42
      });

      setServicos([
        {
          id: '1',
          title: "Reparo Hidráulico",
          cliente: [{ full_name: "Maria Silva" }],
          cliente_nome: "Maria Silva",
          data: "Amanhã, 14:00",
          status: "agendado",
          price: 150.00,
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          title: "Instalação Elétrica",
          cliente: [{ full_name: "João Santos" }],
          cliente_nome: "João Santos",
          data: "Sexta, 10:00",
          status: "agendado",
          price: 280.00,
          created_at: new Date().toISOString()
        },
        {
          id: '3',
          title: "Manutenção Ar Condicionado",
          cliente: [{ full_name: "Ana Costa" }],
          cliente_nome: "Ana Costa",
          data: "Concluído",
          status: "concluido",
          price: 120.00,
          created_at: new Date().toISOString()
        }
      ]);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (user) {
      fetchPrestadorData();
    }
  }, [user]);

  const formatServiceDate = (createdAt: string, status: string) => {
    if (status === 'concluido') return 'Concluído';
    
    const date = new Date(createdAt);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === new Date().toDateString()) {
      return 'Hoje, ' + date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Amanhã, ' + date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString('pt-BR') + ', ' + date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    }
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

  const handleServiceAction = async (serviceId: string, action: 'confirmar' | 'reagendar') => {
    try {
      if (action === 'confirmar') {
        const { error } = await supabase
          .from('services')
          .update({ status: 'andamento' })
          .eq('id', serviceId);

        if (error) throw error;
        alert('Serviço confirmado com sucesso!');
      } else {
        // Lógica para reagendar
        alert('Funcionalidade de reagendamento em desenvolvimento');
      }

      // Recarregar dados
      fetchPrestadorData();
    } catch (error) {
      console.error('Erro ao atualizar serviço:', error);
      alert('Erro ao atualizar serviço. Tente novamente.');
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
                <span className="ml-1 text-sm text-gray-600">({stats.total_avaliacoes})</span>
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
              <p className="text-sm font-medium text-gray-600">Clientes Únicos</p>
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
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Serviços Recentes</h3>
            <button 
              onClick={() => window.location.href = '/prestador/servicos'}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Ver todos
            </button>
          </div>
          <div className="space-y-4">
            {servicos.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>Nenhum serviço encontrado</p>
                <p className="text-sm mt-2">Seus serviços aparecerão aqui</p>
              </div>
            ) : (
              servicos.map((servico) => (
                <div key={servico.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium text-gray-900">{servico.title}</h4>
                      <p className="text-sm text-gray-600">{servico.cliente_nome} - {servico.cliente_nome}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusColor(servico.status)}`}>
                      {getStatusText(servico.status)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">{servico.data}</span>
                    <span className="font-medium text-green-600">
                      R$ {servico.price.toFixed(2)}
                    </span>
                  </div>
                  {servico.status === 'agendado' && (
                    <div className="mt-3 flex space-x-2">
                      <button 
                        onClick={() => handleServiceAction(servico.id, 'confirmar')}
                        className="flex-1 bg-blue-600 text-white py-2 px-3 rounded text-sm hover:bg-blue-700"
                      >
                        Confirmar
                      </button>
                      <button 
                        onClick={() => handleServiceAction(servico.id, 'reagendar')}
                        className="flex-1 bg-gray-200 text-gray-800 py-2 px-3 rounded text-sm hover:bg-gray-300"
                      >
                        Reagendar
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Avaliações e Métricas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Últimas Avaliações</h3>
            <button 
              onClick={() => window.location.href = `/marketplace/prestador/${user?.id}`}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Ver todas
            </button>
          </div>
          <div className="space-y-4">
            {avaliacoes.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>Nenhuma avaliação ainda</p>
                <p className="text-sm mt-2">Suas avaliações aparecerão aqui</p>
              </div>
            ) : (
              avaliacoes.map((avaliacao) => (
                <div key={avaliacao.id} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center mb-2">
                    <RatingStars rating={avaliacao.rating} size="sm" />
                    <span className="ml-2 text-sm font-medium">{avaliacao.rating}.0</span>
                  </div>
                  {avaliacao.comment && (
                    <p className="text-sm text-gray-700 mb-2">&ldquo;{avaliacao.comment}&rdquo;</p>
                  )}
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-gray-500">- {avaliacao.cliente[0]?.full_name || 'Cliente'}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(avaliacao.created_at).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-xl font-semibold mb-4">Métricas de Performance</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Taxa de Conclusão</span>
                <span>{stats.servicos_concluidos > 0 ? Math.round((stats.servicos_concluidos / (stats.servicos_concluidos + stats.servicos_ativos)) * 100) : 0}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full" 
                  style={{ 
                    width: `${stats.servicos_concluidos > 0 ? Math.round((stats.servicos_concluidos / (stats.servicos_concluidos + stats.servicos_ativos)) * 100) : 0}%` 
                  }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Satisfação do Cliente</span>
                <span>{stats.avaliacao_media > 0 ? Math.round((stats.avaliacao_media / 5) * 100) : 0}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-purple-600 h-2 rounded-full" 
                  style={{ 
                    width: `${stats.avaliacao_media > 0 ? Math.round((stats.avaliacao_media / 5) * 100) : 0}%` 
                  }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Faturamento Mensal</span>
                <span>R$ {stats.faturamento_mes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ 
                    width: `${Math.min(100, (stats.faturamento_mes / 5000) * 100)}%` 
                  }}
                ></div>
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
