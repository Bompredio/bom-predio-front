'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

interface RatingProps {
  prestadorId: string;
  serviceId?: string;
}

export default function RatingSystem({ prestadorId, serviceId }: RatingProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const submitRating = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      const { error } = await supabase
        .from('ratings')
        .insert({
          prestador_id: prestadorId,
          cliente_id: user.id,
          rating,
          comment,
          service_type: 'general'
        });

      if (!error) {
        alert('Avaliação enviada com sucesso!');
        setRating(0);
        setComment('');
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">Avaliar Prestador</h3>
      
      <div className="flex space-x-2 mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => setRating(star)}
            className={`text-2xl ${
              star <= rating ? 'text-yellow-500' : 'text-gray-300'
            }`}
          >
            ★
          </button>
        ))}
      </div>

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Deixe seu comentário..."
        className="w-full p-3 border rounded-md mb-4"
        rows={3}
      />

      <button
        onClick={submitRating}
        className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
      >
        Enviar Avaliação
      </button>
    </div>
  );
}
