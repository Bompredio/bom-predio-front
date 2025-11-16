import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import RatingStars from './RatingStars';
import { Loader2 } from 'lucide-react';

interface ReviewFormProps {
  onSubmit: (review: {
    rating: number;
    comment: string;
    positives: string;
    negatives: string;
    wouldRecommend: boolean;
  }) => Promise<void>;
  isLoading?: boolean;
  prestadorName?: string;
}

export default function ReviewForm({
  onSubmit,
  isLoading = false,
  prestadorName = 'Prestador',
}: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [positives, setPositives] = useState('');
  const [negatives, setNegatives] = useState('');
  const [wouldRecommend, setWouldRecommend] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (rating === 0) {
      setError('Por favor, selecione uma avaliação');
      return;
    }

    if (!comment.trim()) {
      setError('Por favor, adicione um comentário');
      return;
    }

    try {
      await onSubmit({
        rating,
        comment,
        positives,
        negatives,
        wouldRecommend,
      });

      // Reset form
      setRating(0);
      setComment('');
      setPositives('');
      setNegatives('');
      setWouldRecommend(false);
    } catch (err) {
      setError('Erro ao enviar avaliação. Tente novamente.');
      console.error(err);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Avaliar {prestadorName}</CardTitle>
        <CardDescription>
          Compartilhe sua experiência com este prestador
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              Qual é sua avaliação?
            </label>
            <RatingStars
              rating={rating}
              onRatingChange={setRating}
              size="lg"
              showLabel={true}
            />
          </div>

          {/* Comment */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Comentário *
            </label>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Descreva sua experiência com o prestador..."
              className="min-h-24"
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground mt-1">
              {comment.length}/500 caracteres
            </p>
          </div>

          {/* Positives */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Pontos Positivos
            </label>
            <Textarea
              value={positives}
              onChange={(e) => setPositives(e.target.value)}
              placeholder="O que você mais gostou? (opcional)"
              className="min-h-20"
              disabled={isLoading}
            />
          </div>

          {/* Negatives */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Pontos a Melhorar
            </label>
            <Textarea
              value={negatives}
              onChange={(e) => setNegatives(e.target.value)}
              placeholder="O que poderia ser melhorado? (opcional)"
              className="min-h-20"
              disabled={isLoading}
            />
          </div>

          {/* Recommendation */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="wouldRecommend"
              checked={wouldRecommend}
              onChange={(e) => setWouldRecommend(e.target.checked)}
              disabled={isLoading}
              className="w-4 h-4 rounded border-border cursor-pointer"
            />
            <label
              htmlFor="wouldRecommend"
              className="text-sm font-medium text-foreground cursor-pointer"
            >
              Eu recomendaria este prestador
            </label>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-destructive/10 border border-destructive/30 rounded p-3">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Enviando...
              </>
            ) : (
              'Enviar Avaliação'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
