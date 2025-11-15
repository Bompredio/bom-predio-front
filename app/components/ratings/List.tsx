'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import RatingStars from './Stars';

interface Rating {
  id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  cliente: {
    full_name: string;
  }[];
}

interface RatingListProps {
  prestadorId: string;
}

export default function RatingList({ prestadorId }: RatingListProps) {
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRatings = async () => {
    const { data, error } = await supabase
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
      .eq('prestador_id', prestadorId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao carregar avaliações:', error);
    } else {
      setRatings(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRatings();
  }, [prestadorId]);

  if (loading) {
    return <div className="text-center py-4">Carregando avaliações...</div>;
  }

  if (ratings.length === 0) {
    return <div className="text-center py-4 text-gray-500">Nenhuma avaliação ainda.</div>;
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">Avaliações ({ratings.length})</h3>
      
      {ratings.map((rating) => (
        <div key={rating.id} className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-start justify-between mb-2">
            <div>
              <p className="font-medium text-gray-900">
                {rating.cliente[0]?.full_name || 'Cliente'}
              </p>
              <RatingStars rating={rating.rating} size="sm" />
            </div>
            <span className="text-sm text-gray-500">
              {new Date(rating.created_at).toLocaleDateString('pt-BR')}
            </span>
          </div>
          
          {rating.comment && (
            <p className="text-gray-700 mt-2">{rating.comment}</p>
          )}
        </div>
      ))}
    </div>
  );
}
