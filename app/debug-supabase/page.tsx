'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function DebugSupabase() {
  const [status, setStatus] = useState('Testando...')
  const [tables, setTables] = useState<string[]>([])
  const [userCount, setUserCount] = useState(0)
  const [prestadoresCount, setPrestadoresCount] = useState(0)

  useEffect(() => {
    testSupabaseConnection()
  }, [])

  const testSupabaseConnection = async () => {
    try {
      setStatus('🔍 Testando conexão com Supabase...')
      
      // Teste 1: Conexão básica
      const { data: session, error: sessionError } = await supabase.auth.getSession()
      if (sessionError) {
        setStatus(`❌ Erro de sessão: ${sessionError.message}`)
        return
      }

      // Teste 2: Listar tabelas
      const { data: tablesData, error: tablesError } = await supabase
        .from('profiles')
        .select('*')
        .limit(1)

      if (tablesError) {
        setStatus(`❌ Erro ao acessar tabela: ${tablesError.message}`)
        return
      }

      // Teste 3: Contar usuários
      const { count: userCount, error: userError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })

      if (userError) {
        console.log('Erro ao contar usuários:', userError)
      } else {
        setUserCount(userCount || 0)
      }

      // Teste 4: Contar prestadores
      const { count: prestadoresCount, error: prestadoresError } = await supabase
        .from('prestadores')
        .select('*', { count: 'exact', head: true })

      if (prestadoresError) {
        console.log('Erro ao contar prestadores:', prestadoresError)
      } else {
        setPrestadoresCount(prestadoresCount || 0)
      }

      setStatus('✅ Conexão com Supabase OK!')
      setTables(['profiles', 'prestadores', 'administradoras', 'mensagens'])

    } catch (error: any) {
      setStatus(`❌ Erro geral: ${error.message}`)
    }
  }

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ color: '#00032E', marginBottom: '30px' }}>Debug - Bom Prédio</h1>
      
      <div style={{
        background: status.includes('✅') ? '#e8f5e8' : '#ffe8e8',
        padding: '20px',
        borderRadius: '10px',
        marginBottom: '30px',
        border: `2px solid ${status.includes('✅') ? '#4CAF50' : '#f44336'}`
      }}>
        <h3>Status da Conexão:</h3>
        <p style={{ 
          fontSize: '18px', 
          fontWeight: 'bold',
          color: status.includes('✅') ? '#2E7D32' : '#D32F2F'
        }}>
          {status}
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        <div style={{
          background: '#e3f2fd',
          padding: '20px',
          borderRadius: '10px',
          textAlign: 'center'
        }}>
          <h3>👤 Usuários</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#00032E' }}>
            {userCount}
          </p>
        </div>

        <div style={{
          background: '#e8f5e8',
          padding: '20px',
          borderRadius: '10px',
          textAlign: 'center'
        }}>
          <h3>🔧 Prestadores</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#00032E' }}>
            {prestadoresCount}
          </p>
        </div>
      </div>

      <div style={{
        background: '#fff3e0',
        padding: '20px',
        borderRadius: '10px',
        marginBottom: '20px'
      }}>
        <h3>Tabelas Verificadas:</h3>
        <ul>
          {tables.map(table => (
            <li key={table} style={{ margin: '8px 0', fontSize: '16px' }}>
              {table}
            </li>
          ))}
        </ul>
      </div>

      <button 
        onClick={testSupabaseConnection}
        style={{
          padding: '12px 24px',
          background: '#C8A969',
          color: '#00032E',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontWeight: 'bold',
          fontSize: '16px'
        }}
      >
        🔄 Testar Novamente
      </button>
    </div>
  )
}
