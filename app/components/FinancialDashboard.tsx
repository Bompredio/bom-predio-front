'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface Transaction {
  id: string;
  amount: number;
  description: string;
  type: 'income' | 'expense';
  category: string;
  created_at: string;
}

export default function FinancialDashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      const { data } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (data) {
        setTransactions(data);
        calculateBalance(data);
      }
    }
  };

  const calculateBalance = (transactions: Transaction[]) => {
    const total = transactions.reduce((acc, transaction) => {
      return transaction.type === 'income' 
        ? acc + transaction.amount 
        : acc - transaction.amount;
    }, 0);
    setBalance(total);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">Gestão Financeira</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-green-100 p-4 rounded-lg">
          <h3 className="font-semibold">Saldo Atual</h3>
          <p className="text-2xl">R$ {balance.toFixed(2)}</p>
        </div>
        
        <div className="bg-blue-100 p-4 rounded-lg">
          <h3 className="font-semibold">Receitas</h3>
          <p className="text-2xl">
            R$ {transactions.filter(t => t.type === 'income')
              .reduce((acc, t) => acc + t.amount, 0)
              .toFixed(2)}
          </p>
        </div>
        
        <div className="bg-red-100 p-4 rounded-lg">
          <h3 className="font-semibold">Despesas</h3>
          <p className="text-2xl">
            R$ {transactions.filter(t => t.type === 'expense')
              .reduce((acc, t) => acc + t.amount, 0)
              .toFixed(2)}
          </p>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-4">Últimas Transações</h3>
        {transactions.slice(0, 5).map((transaction) => (
          <div key={transaction.id} className="flex justify-between items-center p-3 border-b">
            <div>
              <p className="font-medium">{transaction.description}</p>
              <p className="text-sm text-gray-500">{transaction.category}</p>
            </div>
            <span className={transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}>
              {transaction.type === 'income' ? '+' : '-'} R$ {transaction.amount}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
