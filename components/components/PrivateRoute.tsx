import React from 'react';
import { useAuth } from '@/_core/hooks/useAuth';
import { useLocation } from 'wouter';
import { getLoginUrl } from '@/const';
import { Loader2 } from 'lucide-react';

interface PrivateRouteProps {
  children: React.ReactNode;
  requiredUserType?: 'morador' | 'administradora' | 'prestador';
}

/**
 * PrivateRoute component para proteger rotas que requerem autenticação
 * Redireciona para login se não autenticado
 * Opcionalmente valida tipo de usuário
 */
export default function PrivateRoute({ children, requiredUserType }: PrivateRouteProps) {
  const { user, loading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  // Enquanto carrega autenticação
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  // Não autenticado
  if (!isAuthenticated) {
    // Redirecionar para login
    window.location.href = getLoginUrl();
    return null;
  }

  // Validar tipo de usuário se necessário
  if (requiredUserType && user?.userType !== requiredUserType) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center">
          <h1 className="text-2xl font-bold text-foreground">Acesso Negado</h1>
          <p className="text-muted-foreground">
            Você não tem permissão para acessar esta página.
          </p>
          <button
            onClick={() => setLocation('/')}
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Voltar para Home
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
