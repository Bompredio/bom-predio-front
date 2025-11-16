import React from 'react';
import { Star } from 'lucide-react';

interface RatingSummaryProps {
  averageRating: number;
  totalReviews: number;
  distribution?: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

export default function RatingSummary({
  averageRating,
  totalReviews,
  distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
}: RatingSummaryProps) {
  const maxCount = Math.max(...Object.values(distribution), 1);

  const getPercentage = (count: number) => {
    return totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
  };

  return (
    <div className="space-y-6">
      {/* Average Rating */}
      <div className="flex items-start gap-6">
        <div className="text-center">
          <div className="text-4xl font-bold text-foreground">
            {averageRating.toFixed(1)}
          </div>
          <div className="flex gap-1 justify-center mt-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-4 h-4 ${
                  star <= Math.round(averageRating)
                    ? 'text-accent fill-accent'
                    : 'text-muted-foreground'
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            {totalReviews} avaliação{totalReviews !== 1 ? 'ões' : ''}
          </p>
        </div>

        {/* Distribution */}
        <div className="flex-1 space-y-2">
          {[5, 4, 3, 2, 1].map((rating) => (
            <div key={rating} className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground w-12">
                {rating} ⭐
              </span>
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent transition-all"
                  style={{
                    width: `${
                      maxCount > 0
                        ? (distribution[rating as keyof typeof distribution] / maxCount) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
              <span className="text-sm text-muted-foreground w-12 text-right">
                {getPercentage(distribution[rating as keyof typeof distribution])}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
