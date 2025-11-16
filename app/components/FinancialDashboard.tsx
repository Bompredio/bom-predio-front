'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/app/providers/AuthProvider'

interface Transaction {
  id: string
  description: string
  amount: number
  type: 'income' | 'expense'
  created_at: string
}

export default function FinancialDashboard() {
  const { profile } = useAuth()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchTransactions = async () => {
    if (!profile?.condominio_id) return

    try {
      // Esta é uma query exemplo - ajuste conforme a estrutura do seu banco
      const { data, error } = await supabase
        .from('transactions') // Ajuste para o nome da sua tabela
        .select('*')
        .eq('condominio_id', profile.condominio_id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setTransactions(data || [])
    } catch (error) {
      console.error('Error fetching transactions:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchTransactions()
  }, [profile?.condominio_id])

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, curr) => acc + curr.amount, 0)

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, curr) => acc + curr.amount, 0)

  const balance = totalIncome - totalExpenses

  if (isLoading) {
    return <div className="text-center py-4">A carregar transações...</div>
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card text-center">
          <h3 className="text-lg font-semibold text-gray-600">Receitas</h3>
          <p className="text-2xl font-bold text-green-600">{totalIncome}€</p>
        </div>
        <div className="card text-center">
          <h3 className="text-lg font-semibold text-gray-600">Despesas</h3>
          <p className="text-2xl font-bold text-red-600">{totalExpenses}€</p>
        </div>
        <div className="card text-center">
          <h3 className="text-lg font-semibold text-gray-600">Saldo</h3>
          <p className={`text-2xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {balance}€
          </p>
        </div>
      </div>

      <div className="card">
        <h2 className="text-xl font-bold text-primary-navy mb-4">Últimas Transações</h2>
        <div className="space-y-2">
          {transactions.slice(0, 5).map(transaction => (
            <div key={transaction.id} className="flex justify-between items-center py-2 border-b">
              <div>
                <p className="font-medium">{transaction.description}</p>
                <p className="text-sm text-gray-500">
                  {new Date(transaction.created_at).toLocaleDateString('pt-PT')}
                </p>
              </div>
              <p className={`font-semibold ${
                transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
              }`}>
                {transaction.type === 'income' ? '+' : '-'}{transaction.amount}€
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
