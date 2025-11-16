import React, { useState } from 'react';
import { Star } from 'lucide-react';

interface RatingStarsProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  readOnly?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export default function RatingStars({
  rating,
  onRatingChange,
  readOnly = false,
  size = 'md',
  showLabel = true,
}: RatingStarsProps) {
  const [hoverRating, setHoverRating] = useState(0);

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const getStarColor = (starIndex: number) => {
    const currentRating = hoverRating || rating;
    return starIndex <= currentRating ? 'text-accent fill-accent' : 'text-muted-foreground';
  };

  const handleStarClick = (index: number) => {
    if (!readOnly && onRatingChange) {
      onRatingChange(index);
    }
  };

  const handleStarHover = (index: number) => {
    if (!readOnly) {
      setHoverRating(index);
    }
  };

  const handleMouseLeave = () => {
    setHoverRating(0);
  };

  const getRatingLabel = (rate: number) => {
    const labels: Record<number, string> = {
      0: 'Sem avaliação',
      1: 'Péssimo',
      2: 'Ruim',
      3: 'Bom',
      4: 'Muito Bom',
      5: 'Excelente',
    };
    return labels[rate] || '';
  };

  return (
    <div className="flex items-center gap-2">
      <div
        className="flex gap-1"
        onMouseLeave={handleMouseLeave}
      >
        {[1, 2, 3, 4, 5].map((starIndex) => (
          <button
            key={starIndex}
            onClick={() => handleStarClick(starIndex)}
            onMouseEnter={() => handleStarHover(starIndex)}
            disabled={readOnly}
            className={`transition-colors ${readOnly ? 'cursor-default' : 'cursor-pointer hover:scale-110'}`}
          >
            <Star
              className={`${sizeClasses[size]} ${getStarColor(starIndex)} transition-colors`}
            />
          </button>
        ))}
      </div>
      {showLabel && (
        <span className="text-sm text-muted-foreground">
          {getRatingLabel(hoverRating || rating)}
        </span>
      )}
    </div>
  );
}
