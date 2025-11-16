'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/app/providers/AuthProvider'

interface RatingSummaryProps {
  prestadorId: string
}

interface RatingStats {
  average: number
  total: number
  distribution: { [key: number]: number }
}

export default function RatingSummary({ prestadorId }: RatingSummaryProps) {
  const [stats, setStats] = useState<RatingStats>({
    average: 0,
    total: 0,
    distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  })
  const [isLoading, setIsLoading] = useState(true)

  const fetchRatingStats = async () => {
    try {
      const { data, error } = await supabase
        .from('ratings')
        .select('rating')
        .eq('prestador_id', prestadorId)

      if (error) throw error

      const ratings = data || []
      const total = ratings.length
      const average = total > 0 ? ratings.reduce((acc, curr) => acc + curr.rating, 0) / total : 0
      
      const distribution: { [key: number]: number } = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
      ratings.forEach(rating => {
        distribution[rating.rating] = (distribution[rating.rating] || 0) + 1
      })

      setStats({ average, total, distribution })
    } catch (error) {
      console.error('Error fetching rating stats:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchRatingStats()
  }, [prestadorId])

  if (isLoading) {
    return <div className="text-center py-4">A carregar...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <div className="text-4xl font-bold text-primary-navy">
          {stats.average.toFixed(1)}
        </div>
        <div>
          <div className="flex text-yellow-400 text-2xl">
            {'⭐'.repeat(Math.round(stats.average))}
          </div>
          <div className="text-sm text-gray-600">
            {stats.total} avaliação{stats.total !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {[5, 4, 3, 2, 1].map((star) => (
          <div key={star} className="flex items-center space-x-2">
            <span className="text-sm text-gray-600 w-4">{star}</span>
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div
                className="bg-yellow-400 h-2 rounded-full"
                style={{
                  width: `${
                    stats.total > 0 ? (stats.distribution[star] / stats.total) * 100 : 0
                  }%`,
                }}
              />
            </div>
            <span className="text-sm text-gray-600 w-8">
              {stats.distribution[star]}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
