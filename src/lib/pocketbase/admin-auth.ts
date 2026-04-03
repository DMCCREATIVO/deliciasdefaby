import { pb } from './client';

// Función para autenticar como administrador
export async function authenticateAsAdmin(): Promise<boolean> {
  try {
    // Primero intentar autenticar como administrador de PocketBase
    try {
      await pb.admins.authWithPassword('admin@admin.com', 'admin12345');
      console.log('✅ Autenticación como administrador de PocketBase exitosa');
      return true;
    } catch (adminError) {
      console.log('⚠️ No se pudo autenticar como administrador de PocketBase, intentando usuario admin...');
      
      // Si falla, intentar con usuario regular que tenga rol admin
      try {
        await pb.collection('users').authWithPassword('admin@admin.com', 'admin12345');
        const user = pb.authStore.model;
        
        if (user && user.role === 'admin') {
          console.log('✅ Autenticación como usuario admin exitosa');
          return true;
        } else {
          console.log('❌ Usuario no tiene rol admin');
          return false;
        }
      } catch (userError) {
        console.error('❌ Error en autenticación de usuario admin:', userError.message);
        return false;
      }
    }
  } catch (error: any) {
    console.error('❌ Error general en autenticación:', error.message);
    return false;
  }
}

// Función para verificar si tenemos permisos de administrador
export function hasAdminPermissions(): boolean {
  const user = pb.authStore.model;
  return user?.role === 'admin' || pb.authStore.isAdmin;
}

// Wrapper para operaciones administrativas
export async function withAdminAuth<T>(
  operation: () => Promise<T>
): Promise<T> {
  const isAuthenticated = await authenticateAsAdmin();
  
  if (!isAuthenticated) {
    throw new Error('No se tienen permisos de administrador. Verifica las credenciales.');
  }
  
  try {
    return await operation();
  } finally {
    // No limpiamos la autenticación para mantener la sesión
  }
}
