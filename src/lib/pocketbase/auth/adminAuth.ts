import { pb } from '../client';
import { toast } from 'sonner';

export const authenticateAsAdmin = async () => {
  try {
    console.log("Intentando autenticar como admin...");
    await pb.admins.authWithPassword('admin@admin.com', 'admin12345');
    console.log("Autenticación como admin exitosa");
    return true;
  } catch (error) {
    console.error('Error de autenticación como admin:', error);
    toast.error("Error al autenticar como admin");
    return false;
  }
};