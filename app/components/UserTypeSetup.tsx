'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';

export default function UserTypeSetup() {
  const { user } = useAuth();
  const [userType, setUserType] = useState<'morador' | 'sindico' | 'prestador'>('morador');
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!user) return;
    
    setIsLoading(true);
    
    const { error } = await supabase
      .from('profiles')
      .update({ user_type: userType })
      .eq('id', user.id);

    if (error) {
      console.error('Erro ao salvar tipo de usuário:', error);
      alert('Erro ao salvar tipo de usuário. Tente novamente.');
    } else {
      // Força recarregamento para atualizar o contexto de auth
      window.location.reload();
    }
    setIsLoading(false);
  };

  const userTypes = [
    {
      id: 'morador' as const,
      title: 'Morador',
      description: 'Acesso aos serviços do condomínio e marketplace',
      icon: '🏠',
      color: 'blue'
    },
    {
      id: 'sindico' as const,
      title: 'Síndico',
      description: 'Gestão completa do condomínio e administração',
      icon: '🏢',
      color: 'green'
    },
    {
      id: 'prestador' as const,
      title: 'Prestador',
      description: 'Oferecer serviços no marketplace do condomínio',
      icon: '🔧',
      color: 'purple'
    }
  ];

  const getBorderColor = (typeId: string, currentColor: string) => {
    if (userType !== typeId) return 'border-gray-200 hover:border-gray-300';
    
    switch (currentColor) {
      case 'blue': return 'border-blue-500 bg-blue-50';
      case 'green': return 'border-green-500 bg-green-50';
      case 'purple': return 'border-purple-500 bg-purple-50';
      default: return 'border-blue-500 bg-blue-50';
    }
  };

  const getCheckboxColor = (typeId: string, currentColor: string) => {
    if (userType !== typeId) return 'border-gray-400';
    
    switch (currentColor) {
      case 'blue': return 'border-blue-500 bg-blue-500';
      case 'green': return 'border-green-500 bg-green-500';
      case 'purple': return 'border-purple-500 bg-purple-500';
      default: return 'border-blue-500 bg-blue-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Bem-vindo ao Bom Prédio! 🏢
          </h1>
          <p className="text-gray-600">
            Para personalizar sua experiência, selecione seu tipo de usuário:
          </p>
        </div>

        <div className="space-y-4 mb-8">
          {userTypes.map((type) => (
            <div 
              key={type.id}
              className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${getBorderColor(type.id, type.color)}`}
              onClick={() => setUserType(type.id)}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${getCheckboxColor(type.id, type.color)}`}>
                  {userType === type.id && (
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  )}
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{type.icon}</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">{type.title}</h3>
                    <p className="text-sm text-gray-600">{type.description}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={handleSave}
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Salvando...' : 'Continuar para o Dashboard'}
        </button>
        
        <p className="text-center text-sm text-gray-500 mt-4">
          Você poderá alterar isso depois nas configurações do perfil
        </p>
      </div>
    </div>
  );
}
