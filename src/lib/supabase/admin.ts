import { supabase } from './client';

export const addAdmin = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .rpc('insert_admin_if_not_exists', {
        p_user_id: userId
      });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error al agregar administrador:', error);
    throw error;
  }
}; 