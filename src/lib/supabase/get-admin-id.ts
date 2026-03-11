import { supabase } from './client';

export const getUserIdAndSetAdmin = async (email: string) => {
  try {
    // Obtener el usuario por email
    const { data: userData, error: userError } = await supabase
      .from('auth.users')
      .select('id')
      .eq('email', email)
      .single();

    if (userError) {
      console.error('Error obteniendo usuario:', userError);
      throw userError;
    }

    if (!userData) {
      throw new Error('Usuario no encontrado');
    }

    // Agregar el usuario como administrador
    const { data: adminData, error: adminError } = await supabase
      .rpc('insert_admin_if_not_exists', {
        p_user_id: userData.id
      });

    if (adminError) {
      console.error('Error agregando administrador:', adminError);
      throw adminError;
    }

    console.log('Usuario agregado como administrador:', adminData);
    return userData.id;
  } catch (error) {
    console.error('Error en el proceso:', error);
    throw error;
  }
}; 