'use client'

import { useEffect, useState } from 'react'
import { supabase, Rating as RatingType } from '@/lib/supabase'
import { useAuth } from '@/app/providers/AuthProvider'

interface RatingListProps {
  prestadorId: string
}

export default function RatingList({ prestadorId }: RatingListProps) {
  const { user } = useAuth()
  const [ratings, setRatings] = useState<RatingType[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchRatings = async () => {
    try {
      const { data, error } = await supabase
        .from('ratings')
        .select('*')
        .eq('prestador_id', prestadorId)
        .order('created_at', { ascending: false })

      if (error) throw error
      setRatings(data || [])
    } catch (error) {
      console.error('Error fetching ratings:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchRatings()
  }, [prestadorId])

  if (isLoading) {
    return <div className="text-center py-4">A carregar avaliações...</div>
  }

  if (ratings.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Ainda não há avaliações para este prestador.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {ratings.map((rating) => (
        <div key={rating.id} className="border-b border-gray-200 pb-4 last:border-0">
          <div className="flex items-center mb-2">
            <div className="flex text-yellow-400">
              {'⭐'.repeat(rating.rating)}
            </div>
            <span className="text-sm text-gray-500 ml-2">
              {new Date(rating.created_at).toLocaleDateString('pt-PT')}
            </span>
          </div>
          <p className="text-gray-700">{rating.comment}</p>
        </div>
      ))}
    </div>
  )
}
