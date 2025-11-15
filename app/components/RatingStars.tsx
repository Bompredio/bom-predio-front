'use client';

import { useState } from 'react';

interface RatingStarsProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  editable?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function RatingStars({ 
  rating, 
  onRatingChange, 
  editable = false, 
  size = 'md' 
}: RatingStarsProps) {
  const [hoverRating, setHoverRating] = useState(0);

  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl'
  };

  const handleClick = (newRating: number) => {
    if (editable && onRatingChange) {
      onRatingChange(newRating);
    }
  };

  const handleMouseEnter = (newRating: number) => {
    if (editable) {
      setHoverRating(newRating);
    }
  };

  const handleMouseLeave = () => {
    if (editable) {
      setHoverRating(0);
    }
  };

  return (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => {
        let starClass = 'text-gray-300';
        if (hoverRating >= star) {
          starClass = 'text-yellow-400';
        } else if (!hoverRating && rating >= star) {
          starClass = 'text-yellow-400';
        }

        return (
          <button
            key={star}
            type="button"
            className={`${starClass} ${sizeClasses[size]} ${
              editable ? 'cursor-pointer hover:scale-110 transition-transform' : ''
            }`}
            onClick={() => handleClick(star)}
            onMouseEnter={() => handleMouseEnter(star)}
            onMouseLeave={handleMouseLeave}
            disabled={!editable}
          >
            ★
          </button>
        );
      })}
    </div>
  );
}
