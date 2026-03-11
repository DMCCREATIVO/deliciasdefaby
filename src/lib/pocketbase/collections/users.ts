import { pb } from '../client';

export const createUsersCollection = async () => {
  try {
    await pb.collections.create({
      name: 'users',
      type: 'auth',
      schema: [
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
      ],
      options: {
        allowEmailAuth: true,
        allowOAuth2Auth: false,
        allowUsernameAuth: false,
        requireEmail: true,
        minPasswordLength: 8,
        exceptEmailDomains: null,
        onlyEmailDomains: null,
      },
      indexes: ["CREATE UNIQUE INDEX idx_unique_email ON users (email)"],
      listRule: "@request.auth.id != ''",
      viewRule: "@request.auth.id != ''",
      createRule: "",
      updateRule: "@request.auth.id = id || @request.auth.role = 'admin'",
      deleteRule: "@request.auth.role = 'admin'"
    });
    
    // Crear usuario admin por defecto
    await pb.collection('users').create({
      email: 'admin@admin.com',
      password: 'admin12345',
      passwordConfirm: 'admin12345',
      name: 'Admin',
      role: 'admin'
    });
    
    console.log('Colección users y usuario admin creados exitosamente');
  } catch (error: any) {
    if (error.status === 400 && error.data?.code === 'collections_create_error') {
      console.log('La colección users ya existe');
      
      // Intentar crear el usuario admin si la colección ya existe
      try {
        await pb.collection('users').create({
          email: 'admin@admin.com',
          password: 'admin12345',
          passwordConfirm: 'admin12345',
          name: 'Admin',
          role: 'admin'
        });
        console.log('Usuario admin creado exitosamente');
      } catch (userError: any) {
        if (userError.status === 400) {
          console.log('El usuario admin ya existe');
        } else {
          console.error('Error creando usuario admin:', userError);
        }
      }
    } else {
      console.error('Error creando colección users:', error);
    }
  }
};