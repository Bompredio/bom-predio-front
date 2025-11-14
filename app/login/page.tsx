'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Login() {
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    user_type: 'condomino' as 'condomino' | 'sindico' | 'administrador' | 'prestador',
    phone: '',
    empresa_nome: '',
    nif: ''
  })
  const [message, setMessage] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      if (isLogin) {
        // LOGIN
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password
        })
        
        if (error) throw error
        
        setMessage('Login realizado com sucesso!')
        setTimeout(() => router.push('/dashboard'), 1000)
        
      } else {
        // CADASTRO
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              full_name: formData.full_name,
              user_type: formData.user_type
            }
          }
        })
        
        if (error) throw error
        
        if (data.user) {
          // Criar perfil na tabela profiles
          const { error: profileError } = await supabase
            .from('profiles')
            .insert([
              {
                id: data.user.id,
                email: formData.email,
                full_name: formData.full_name,
                user_type: formData.user_type,
                phone: formData.phone
              }
            ])
          
          if (profileError) throw profileError

          // Se for administrador ou prestador, criar registro na tabela específica
          if (formData.user_type === 'administrador') {
            const { error: adminError } = await supabase
              .from('administradoras')
              .insert([
                {
                  user_id: data.user.id,
                  nome_empresa: formData.empresa_nome,
                  nif: formData.nif,
                  email_contato: formData.email,
                  telefone: formData.phone
                }
              ])
            if (adminError) throw adminError
          }

          if (formData.user_type === 'prestador') {
            const { error: prestadorError } = await supabase
              .from('prestadores')
              .insert([
                {
                  user_id: data.user.id,
                  nome_empresa: formData.empresa_nome,
                  nif: formData.nif,
                  email_contato: formData.email,
                  telefone: formData.phone,
                  tipo_servico: 'limpeza' // Default, pode ser alterado depois
                }
              ])
            if (prestadorError) throw prestadorError
          }

          setMessage('Conta criada com sucesso! Verifique seu email para confirmação.')
          setTimeout(() => setIsLogin(true), 3000)
        }
      }
    } catch (error: any) {
      setMessage(`Erro: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ 
      background: 'linear-gradient(135deg, #00032E 0%, #1a237e 100%)', 
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '15px',
        padding: '40px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '450px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '10px' }}>
          <Link href="/" style={{ 
            color: '#00032E', 
            textDecoration: 'none',
            fontSize: '24px',
            fontWeight: 'bold'
          }}>
            🏢 Bom Prédio
          </Link>
        </div>

        <h1 style={{ 
          color: '#00032E', 
          textAlign: 'center',
          marginBottom: '30px'
        }}>
          {isLogin ? 'Entrar na Plataforma' : 'Criar Nova Conta'}
        </h1>

        {message && (
          <div style={{
            padding: '15px',
            background: message.includes('Erro') ? '#fee' : '#efe',
            color: message.includes('Erro') ? '#c33' : '#363',
            borderRadius: '8px',
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {!isLogin && (
            <>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', color: '#00032E', fontWeight: 'bold' }}>
                  Nome Completo *
                </label>
                <input 
                  type="text" 
                  value={formData.full_name}
                  onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #00032E',
                    borderRadius: '8px',
                    fontSize: '16px',
                    boxSizing: 'border-box'
                  }}
                  placeholder="Seu nome completo"
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '5px', color: '#00032E', fontWeight: 'bold' }}>
                  Telefone
                </label>
                <input 
                  type="tel" 
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #00032E',
                    borderRadius: '8px',
                    fontSize: '16px',
                    boxSizing: 'border-box'
                  }}
                  placeholder="+351 123 456 789"
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '5px', color: '#00032E', fontWeight: 'bold' }}>
                  Tipo de Conta *
                </label>
                <select 
                  value={formData.user_type}
                  onChange={(e) => setFormData({...formData, user_type: e.target.value as any})}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #00032E',
                    borderRadius: '8px',
                    fontSize: '16px',
                    boxSizing: 'border-box',
                    background: 'white'
                  }}
                  required
                >
                  <option value="condomino">👤 Condômino</option>
                  <option value="sindico">🏢 Síndico</option>
                  <option value="administrador">👔 Administrador</option>
                  <option value="prestador">🔧 Prestador de Serviços</option>
                </select>
              </div>

              {(formData.user_type === 'administrador' || formData.user_type === 'prestador') && (
                <>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', color: '#00032E', fontWeight: 'bold' }}>
                      Nome da Empresa *
                    </label>
                    <input 
                      type="text" 
                      value={formData.empresa_nome}
                      onChange={(e) => setFormData({...formData, empresa_nome: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '2px solid #00032E',
                        borderRadius: '8px',
                        fontSize: '16px',
                        boxSizing: 'border-box'
                      }}
                      placeholder="Nome da sua empresa"
                      required
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', color: '#00032E', fontWeight: 'bold' }}>
                      NIF *
                    </label>
                    <input 
                      type="text" 
                      value={formData.nif}
                      onChange={(e) => setFormData({...formData, nif: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '2px solid #00032E',
                        borderRadius: '8px',
                        fontSize: '16px',
                        boxSizing: 'border-box'
                      }}
                      placeholder="123456789"
                      required
                    />
                  </div>
                </>
              )}
            </>
          )}

          <div>
            <label style={{ display: 'block', marginBottom: '5px', color: '#00032E', fontWeight: 'bold' }}>
              E-mail *
            </label>
            <input 
              type="email" 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #00032E',
                borderRadius: '8px',
                fontSize: '16px',
                boxSizing: 'border-box'
              }}
              placeholder="seu@email.com"
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', color: '#00032E', fontWeight: 'bold' }}>
              Senha *
            </label>
            <input 
              type="password" 
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #00032E',
                borderRadius: '8px',
                fontSize: '16px',
                boxSizing: 'border-box'
              }}
              placeholder="Sua senha (mínimo 6 caracteres)"
              required
              minLength={6}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{
              padding: '15px',
              background: loading ? '#ccc' : '#C8A969',
              color: '#00032E',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: 'bold',
              marginTop: '10px'
            }}
          >
            {loading ? '⏳ Processando...' : (isLogin ? '🚀 Entrar' : '📝 Criar Conta')}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '25px', paddingTop: '20px', borderTop: '1px solid #eee' }}>
          <button 
            onClick={() => {
              setIsLogin(!isLogin)
              setMessage('')
              setFormData({
                email: '',
                password: '',
                full_name: '',
                user_type: 'condomino',
                phone: '',
                empresa_nome: '',
                nif: ''
              })
            }}
            style={{
              background: 'none',
              border: 'none',
              color: '#00032E',
              cursor: 'pointer',
              textDecoration: 'underline',
              fontSize: '15px'
            }}
          >
            {isLogin ? '📋 Não tem uma conta? Cadastre-se aqui' : '🔐 Já tem uma conta? Faça login aqui'}
          </button>
        </div>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <Link href="/" style={{
            color: '#666',
            textDecoration: 'none',
            fontSize: '14px'
          }}>
            ← Voltar para a página inicial
          </Link>
        </div>
      </div>
    </div>
  )
}
