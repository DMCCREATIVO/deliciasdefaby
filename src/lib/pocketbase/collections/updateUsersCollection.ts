import { pb } from '../client';
import { toast } from 'sonner';
import { authenticateAsAdmin } from '../auth/adminAuth';
import { checkCollection } from '../utils/checkCollection';

export const updateUsersCollection = async () => {
  try {
    const isAuthenticated = await authenticateAsAdmin();
    
    if (!isAuthenticated) {
      toast.error("No se pudo autenticar como admin");
      return;
    }

    console.log("Verificando colección users...");
    const existingCollection = await checkCollection('users');
    
    const schema = [
      {
        name: 'name',
        type: 'text',
        required: true,
      },
      {
        name: 'role',
        type: 'select',
        required: true,
        options: {
          maxSelect: 1,
          values: ['admin', 'customer']
        }
      },
      {
        name: 'phone',
        type: 'text',
      },
      {
        name: 'address',
        type: 'json',
      },
      {
        name: 'avatar',
        type: 'file',
        options: {
          maxSelect: 1,
          maxSize: 5242880,
          mimeTypes: ['image/jpg', 'image/jpeg', 'image/png', 'image/webp'],
        }
      },
      {
        name: 'preferences',
        type: 'json',
      }
    ];

    if (existingCollection) {
      console.log("Actualizando campos de la colección users...");
      await pb.collections.update(existingCollection.id, {
        schema: schema,
        options: {
          allowEmailAuth: true,
          allowOAuth2Auth: false,
          allowUsernameAuth: false,
          requireEmail: true,
          minPasswordLength: 8,
        }
      });
    } else {
      console.log("Creando colección users...");
      await pb.collections.create({
        name: 'users',
        type: 'auth',
        schema: schema,
        options: {
          allowEmailAuth: true,
          allowOAuth2Auth: false,
          allowUsernameAuth: false,
          requireEmail: true,
          minPasswordLength: 8,
        },
        listRule: "@request.auth.id != ''",
        viewRule: "@request.auth.id != ''",
        createRule: "",
        updateRule: "@request.auth.id = id || @request.auth.role = 'admin'",
        deleteRule: "@request.auth.role = 'admin'"
      });
    }

    // Intentar crear usuario admin si no existe
    try {
      const adminData = {
        email: 'admin@admin.com',
        password: 'admin12345',
        passwordConfirm: 'admin12345',
        name: 'Admin',
        role: 'admin'
      };

      await pb.collection('users').create(adminData);
      console.log("Usuario admin creado exitosamente");
      toast.success("Usuario admin creado exitosamente");
    } catch (error: any) {
      if (error.status === 400) {
        console.log("El usuario admin ya existe");
      } else {
        console.error("Error creando usuario admin:", error);
        toast.error("Error creando usuario admin");
      }
    }

    console.log("Campos actualizados exitosamente");
    toast.success("Campos de usuario actualizados exitosamente");

  } catch (error: any) {
    console.error('Error actualizando colección:', error);
    toast.error("Error actualizando campos: " + error.message);
  }
};