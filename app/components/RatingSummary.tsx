'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import RatingStars from './RatingStars';

interface RatingSummaryProps {
  prestadorId: string;
}

interface RatingStats {
  average: number;
  total: number;
  distribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

export default function RatingSummary({ prestadorId }: RatingSummaryProps) {
  const [stats, setStats] = useState<RatingStats>({
    average: 0,
    total: 0,
    distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRatingStats();
  }, [prestadorId]);

  const fetchRatingStats = async () => {
    const { data, error } = await supabase
      .from('ratings')
      .select('rating')
      .eq('prestador_id', prestadorId);

    if (data && !error) {
      const total = data.length;
      const average = total > 0 
        ? data.reduce((sum, item) => sum + item.rating, 0) / total 
        : 0;

      const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
      data.forEach(item => {
        distribution[item.rating as keyof typeof distribution]++;
      });

      setStats({
        average: Number(average.toFixed(1)),
        total,
        distribution
      });
    }
    setLoading(false);
  };

  if (loading) {
    return <div className="text-center py-4">Carregando...</div>;
  }

  if (stats.total === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
        <p className="text-gray-500">Ainda não há avaliações</p>
      </div>
    );
  }

  const getPercentage = (count: number) => {
    return stats.total > 0 ? (count / stats.total) * 100 : 0;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
        {/* Nota Geral */}
        <div className="text-center">
          <div className="text-4xl font-bold text-gray-900">{stats.average}</div>
          <RatingStars rating={stats.average} size="lg" />
          <p className="text-sm text-gray-600 mt-2">{stats.total} avaliações</p>
        </div>

        {/* Distribuição */}
        <div className="flex-1 space-y-2">
          {[5, 4, 3, 2, 1].map((star) => (
            <div key={star} className="flex items-center space-x-2">
              <span className="text-sm text-gray-600 w-4">{star}</span>
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-yellow-400 h-2 rounded-full"
                  style={{ width: `${getPercentage(stats.distribution[star as keyof typeof stats.distribution])}%` }}
                ></div>
              </div>
              <span className="text-sm text-gray-600 w-8">
                ({stats.distribution[star as keyof typeof stats.distribution]})
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
