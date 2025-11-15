'úse client'


import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';

// Novas importações da pasta ratings
import RatingSummary from '../../../components/ratings/Summary';
import RatingList from '../../../components/ratings/List';
import RatingForm from '../../../components/ratings/Form';

interface Prestador {
  id: string;
  full_name: string;
  avatar_url: string;
  bio: string;
  services: string[];
  user_type: string;
}

export default function PrestadorProfile() {
  const params = useParams();
  const { user } = useAuth();
  const [prestador, setPrestador] = useState<Prestador | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPrestador();
  }, [params.id]);

  const fetchPrestador = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', params.id)
      .single();

    if (data && !error) {
      setPrestador(data);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!prestador) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Prestador não encontrado</h1>
          <p className="text-gray-600 mt-2">O prestador que você está procurando não existe.</p>
        </div>
      </div>
    );
  }

  const isOwnProfile = user?.id === prestador.id;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex items-start space-x-6">
            <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center">
              {prestador.avatar_url ? (
                <img 
                  src={prestador.avatar_url} 
                  alt={prestador.full_name}
                  className="w-24 h-24 rounded-full object-cover"
                />
              ) : (
                <span className="text-2xl text-gray-600">
                  {prestador.full_name?.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">{prestador.full_name}</h1>
              <p className="text-gray-600 mt-2">{prestador.bio || 'Prestador de serviços no condomínio'}</p>
              
              {prestador.services && prestador.services.length > 0 && (
                <div className="mt-4">
                  <h3 className="font-semibold text-gray-900">Serviços oferecidos:</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {prestador.services.map((service, index) => (
                      <span 
                        key={index}
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <RatingSummary prestadorId={prestador.id} />
            <RatingList prestadorId={prestador.id} />
          </div>

          <div className="space-y-6">
            {!isOwnProfile && user && (
              <RatingForm 
                prestadorId={prestador.id}
                onRatingSubmitted={fetchPrestador}
              />
            )}
            
            {!user && (
              <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
                <h3 className="text-lg font-semibold mb-2">Faça login para avaliar</h3>
                <p className="text-gray-600 mb-4">Entre na sua conta para deixar uma avaliação.</p>
                <button 
                  onClick={() => window.location.href = '/login'}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Fazer Login
                </button>
              </div>
            )}

            {isOwnProfile && (
              <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">Seu Perfil</h3>
                <p className="text-blue-700">
                  Esta é a visualização pública do seu perfil. As avaliações aparecerão aqui.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
