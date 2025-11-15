'use client';

import { useAuth } from '@/hooks/useAuth';
import UserTypeSetup from '../components/UserTypeSetup';
import DashboardMorador from './components/DashboardMorador';
import DashboardSindico from './components/DashboardSindico';
import DashboardPrestador from './components/DashboardPrestador';

export default function DashboardPage() {
  const { user, profile, loading } = useAuth();

  // Mostrar loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  // Se não está logado, redirecionar para login
  if (!user) {
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    return null;
  }

  // Se usuário não tem tipo definido, mostrar setup
  if (!profile?.user_type) {
    return <UserTypeSetup />;
  }

  // Renderizar dashboard baseado no tipo de usuário
  const renderDashboard = () => {
    switch (profile.user_type) {
      case 'sindico':
        return <DashboardSindico />;
      case 'prestador':
        return <DashboardPrestador />;
      default:
        return <DashboardMorador />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {renderDashboard()}
    </div>
  );
}
