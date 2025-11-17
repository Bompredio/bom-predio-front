// drizzle/schema.ts
// Placeholder minimal para o build — substituir pelo schema real do Drizzle/DB

export type User = {
  id: string
  name?: string | null
  email?: string | null
  role?: 'admin' | 'owner' | 'provider' | string
  created_at?: string | null
}

// Se o teu código usa tabelas/consts do drizzle, adiciona-os aqui como placeholders
// export const users = {}
