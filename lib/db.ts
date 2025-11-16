// db.ts - placeholder for Drizzle or Supabase usage
import { drizzle } from 'drizzle-orm/supabase'
import { supabase } from './supabase'
export const db = drizzle(supabase)
