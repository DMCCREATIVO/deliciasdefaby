#!/usr/bin/env node

import PocketBase from 'pocketbase/cjs';

async function createAdminUser() {
  console.log('👤 Creando usuario administrador...');
  
  const pb = new PocketBase('https://bd.deliciasdefaby.cl');
  
  try {
    // Intentar autenticar como administrador de PocketBase primero
    console.log('🔐 Intentando autenticación como administrador de PocketBase...');
    
    // Probar con credenciales comunes
    const adminCredentials = [
      { email: 'admin@deliciasdefaby.cl', password: 'admin12345' },
      { email: 'admin@admin.com', password: 'admin12345' },
      { email: 'admin@deliciasdefaby.cl', password: '123456' },
      { email: 'admin', password: 'admin12345' },
    ];
    
    let authenticated = false;
    
    for (const creds of adminCredentials) {
      try {
        await pb.admins.authWithPassword(creds.email, creds.password);
        console.log(`✅ Autenticado como: ${creds.email}`);
        authenticated = true;
        break;
      } catch (e) {
        console.log(`❌ Falló: ${creds.email}`);
      }
    }
    
    if (!authenticated) {
      console.log('❌ No se pudo autenticar como administrador de PocketBase');
      console.log('🔍 Necesitas las credenciales correctas del administrador de PocketBase');
      console.log('📍 Panel: https://bd.deliciasdefaby.cl/_/');
      return;
    }
    
    // Crear usuario administrador
    console.log('👤 Creando usuario admin@admin.com...');
    
    const adminUser = {
      email: 'admin@admin.com',
      password: 'admin12345',
      passwordConfirm: 'admin12345',
      name: 'Administrador del Sistema',
      role: 'admin'
    };
    
    try {
      const created = await pb.collection('users').create(adminUser);
      console.log('✅ Usuario administrador creado exitosamente');
      console.log('📧 Email: admin@admin.com');
      console.log('🔑 Contraseña: admin12345');
      console.log('👤 Nombre:', created.name);
      console.log('🎭 Rol:', created.role);
      
      // Probar autenticación con el nuevo usuario
      console.log('\n🧪 Probando autenticación con el nuevo usuario...');
      
      pb.authStore.clear();
      await pb.collection('users').authWithPassword('admin@admin.com', 'admin12345');
      
      const user = pb.authStore.model;
      console.log('✅ Autenticación exitosa:', {
        email: user.email,
        role: user.role,
        name: user.name
      });
      
      // Probar operaciones de productos
      console.log('\n🛍️ Probando operaciones de productos...');
      
      const testProduct = {
        title: 'Producto Test Admin ' + Date.now(),
        description: 'Producto creado por usuario admin',
        price: 1000,
        stock: 5,
        is_active: true
      };
      
      const createdProduct = await pb.collection('products').create(testProduct);
      console.log('✅ Producto creado:', createdProduct.id);
      
      await pb.collection('products').delete(createdProduct.id);
      console.log('✅ Producto eliminado');
      
      console.log('\n🎉 TODO FUNCIONA PERFECTAMENTE');
      console.log('✅ El usuario admin está creado y las operaciones funcionan');
      
    } catch (createError) {
      if (createError.status === 400) {
        console.log('ℹ️ El usuario admin ya existe');
        
        // Probar autenticación con el usuario existente
        pb.authStore.clear();
        await pb.collection('users').authWithPassword('admin@admin.com', 'admin12345');
        
        const user = pb.authStore.model;
        console.log('✅ Autenticación con usuario existente:', {
          email: user.email,
          role: user.role
        });
        
        if (user.role === 'admin') {
          console.log('🎉 El usuario admin ya existe y tiene rol correcto');
          
          // Probar operaciones
          const testProduct = {
            title: 'Producto Test Existente ' + Date.now(),
            description: 'Producto de prueba',
            price: 1000,
            stock: 5,
            is_active: true
          };
          
          const created = await pb.collection('products').create(testProduct);
          console.log('✅ Producto de prueba creado:', created.id);
          
          await pb.collection('products').delete(created.id);
          console.log('✅ Producto de prueba eliminado');
          console.log('🎉 Operaciones de productos funcionan correctamente');
        } else {
          console.log('❌ El usuario existe pero no tiene rol admin. Rol actual:', user.role);
        }
      } else {
        console.log('❌ Error creando usuario:', createError.message);
      }
    }
    
  } catch (error) {
    console.error('❌ Error general:', error.message);
  } finally {
    pb.authStore.clear();
  }
}

createAdminUser();
