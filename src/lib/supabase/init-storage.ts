import { supabase } from './client';

export async function initStorage() {
  // Inicialización de storage simplificada para evitar errores de permisos ANON
  console.log('initStorage: inicialización simplificada (sin listar buckets)');
  // Aquí puedes agregar lógica específica solo si es necesario
  return true;
} 