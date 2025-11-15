'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import RatingStars from './RatingStars';

interface RatingFormProps {
  prestadorId: string;
  serviceId?: string;
  onRatingSubmitted?: () => void;
}

export default function RatingForm({ prestadorId, serviceId, onRatingSubmitted }: RatingFormProps) {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      alert('Você precisa estar logado para avaliar.');
      return;
    }

    if (rating === 0) {
      alert('Por favor, selecione uma avaliação de 1 a 5 estrelas.');
      return;
    }

    setIsSubmitting(true);

    const { error } = await supabase
      .from('ratings')
      .insert({
        prestador_id: prestadorId,
        cliente_id: user.id,
        service_id: serviceId,
        rating,
        comment
      });

    setIsSubmitting(false);

    if (error) {
      console.error('Erro ao enviar avaliação:', error);
      alert('Erro ao enviar avaliação. Tente novamente.');
    } else {
      alert('Avaliação enviada com sucesso!');
      setRating(0);
      setComment('');
      if (onRatingSubmitted) {
        onRatingSubmitted();
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">Avaliar Prestador</h3>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Sua Avaliação
        </label>
        <RatingStars
          rating={rating}
          onRatingChange={setRating}
          editable={true}
          size="lg"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
          Comentário (opcional)
        </label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Conte como foi sua experiência com este prestador..."
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          rows={4}
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Enviando...' : 'Enviar Avaliação'}
      </button>
    </form>
  );
}
