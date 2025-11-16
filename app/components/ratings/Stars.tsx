'use client'

interface RatingStarsProps {
  rating: number
  onRatingChange?: (rating: number) => void
  editable?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export default function RatingStars({ 
  rating, 
  onRatingChange, 
  editable = false, 
  size = 'md' 
}: RatingStarsProps) {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl'
  }

  const handleClick = (newRating: number) => {
    if (editable && onRatingChange) {
      onRatingChange(newRating)
    }
  }

  return (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => handleClick(star)}
          disabled={!editable}
          className={`${sizeClasses[size]} ${
            editable ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'
          } ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
        >
          ⭐
        </button>
      ))}
    </div>
  )
}
