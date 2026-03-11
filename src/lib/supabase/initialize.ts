import { supabase } from './client';

export const initializeDatabase = async () => {
  console.log('Iniciando configuración de Supabase...');
  
  try {
    // Verificar la conexión a Supabase usando una consulta simple
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      console.error('Error al conectar con Supabase:', error);
      throw error;
    }

    console.log('Conexión a Supabase establecida correctamente');
    return true;
    
  } catch (error) {
    console.error('Error inicializando la base de datos:', error);
    throw error;
  }
};