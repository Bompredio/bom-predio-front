'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function DebugSupabase() {
  const [status, setStatus] = useState<'loading' | 'connected' | 'error'>('loading')
  const [error, setError] = useState('')

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const { data, error } = await supabase.from('profiles').select('count').limit(1)
        
        if (error) throw error
        setStatus('connected')
      } catch (err: any) {
        setStatus('error')
        setError(err.message)
      }
    }

    checkConnection()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-md mx-auto card">
        <h1 className="text-2xl font-bold text-primary-navy mb-4">Debug Supabase</h1>
        
        <div className="space-y-4">
          <div>
            <strong>Status:</strong>{' '}
            <span className={
              status === 'connected' ? 'text-green-600' :
              status === 'error' ? 'text-red-600' : 'text-yellow-600'
            }>
              {status === 'loading' && 'Carregando...'}
              {status === 'connected' && 'Conectado ✅'}
              {status === 'error' && 'Erro ❌'}
            </span>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded">
              <strong>Erro:</strong> {error}
            </div>
          )}

          <div className="text-sm text-gray-600">
            <p>URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Configurado' : '❌ Não configurado'}</p>
            <p>Chave: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Configurada' : '❌ Não configurada'}</p>
          </div>

          <div className="pt-4 border-t">
            <a href="/" className="btn-primary mr-2">Voltar ao Início</a>
            <a href="/marketplace" className="btn-secondary">Testar Marketplace</a>
          </div>
        </div>
      </div>
    </div>
  )
}
