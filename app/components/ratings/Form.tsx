'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/app/providers/AuthProvider'
import RatingStars from './Stars'

interface RatingFormProps {
  prestadorId: string
  serviceId?: string
  onRatingSubmitted: () => void
}

export default function RatingForm({ prestadorId, serviceId, onRatingSubmitted }: RatingFormProps) {
  const { user } = useAuth()
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || rating === 0) return

    setIsSubmitting(true)
    try {
      const { error } = await supabase
        .from('ratings')
        .insert({
          prestador_id: prestadorId,
          cliente_id: user.id,
          service_id: serviceId,
          rating,
          comment,
        })

      if (error) throw error

      setRating(0)
      setComment('')
      onRatingSubmitted()
    } catch (error) {
      console.error('Error submitting rating:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Avaliação
        </label>
        <RatingStars
          rating={rating}
          onRatingChange={setRating}
          editable={true}
        />
      </div>

      <div>
        <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
          Comentário (opcional)
        </label>
        <textarea
          id="comment"
          rows={3}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="input-field"
          placeholder="Partilhe a sua experiência..."
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting || rating === 0}
        className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'A enviar...' : 'Submeter Avaliação'}
      </button>
    </form>
  )
}
