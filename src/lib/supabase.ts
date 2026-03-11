/**
 * ⚠️ ARCHIVO REDIRECCIÓN - NO USAR DIRECTAMENTE
 * 
 * Este archivo redirige al cliente único de Supabase para evitar 
 * múltiples instancias de GoTrueClient.
 * 
 * USAR SIEMPRE: import { supabase } from '@/lib/supabase/client'
 */

// Redirigir al cliente único
export { supabase, supabase as default, getSupabaseClient } from './supabase/client'; 