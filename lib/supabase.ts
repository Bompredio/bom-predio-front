```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipos baseados na nova estrutura
export type UserType = 'morador' | 'administradora' | 'prestador'
export type CargoCondominio = 'sindico' | 'morador' | 'proprietario'

export interface Profile {
  id: string
  full_name: string
  avatar_url: string | null
  user_type: UserType
  administradora_id: string | null
  condominio_id: string | null
  created_at: string
}

export interface Administradora {
  id: string
  nome_empresa: string
  nif: string
  contacto: string
  email: string
  morada: string
  user_id: string
  created_at: string
  updated_at: string
}

export interface Condominio {
  id: string
  nome: string
  morada: string
  num_fracoes: number
  administradora_id: string | null
  created_at: string
  updated_at: string
}

export interface CondominioMorador {
  id: string
  condominio_id: string
  user_id: string
  cargo: CargoCondominio
  permilagem: number
  fraccao: string
  created_at: string
}

export interface PrestadorServico {
  id: string
  nome_empresa: string
  tipo_servico: string
  contacto: string
  email: string
  administradora_id: string
  created_at: string
  updated_at: string
}

export interface Service {
  id: string
  prestador_id: string
  condominio_id: string
  administradora_id: string
  title: string
  description: string
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
  price: number
  scheduled_date: string
  completed_date: string
  created_at: string
  updated_at: string
}

export interface Rating {
  id: string
  prestador_id: string
  condominio_id: string
  service_id: string
  rating: number
  comment: string
  created_at: string
}
