#!/usr/bin/env node

import PocketBase from 'pocketbase/cjs';

async function quickTest() {
  console.log('🚀 Test rápido de conexión y autenticación');
  
  const pb = new PocketBase('https://bd.deliciasdefaby.cl');
  
  try {
    // 1. Verificar conexión
    const health = await pb.health.check();
    console.log('✅ Conexión OK:', health.message);
    
    // 2. Intentar autenticar como usuario admin
    try {
      await pb.collection('users').authWithPassword('admin@admin.com', 'admin12345');
      const user = pb.authStore.model;
      console.log('✅ Usuario autenticado:', {
        email: user.email,
        role: user.role,
        id: user.id
      });
      
      // 3. Intentar crear producto
      try {
        const testProduct = {
          title: 'Test Quick ' + Date.now(),
          description: 'Producto de prueba rápida',
          price: 1000,
          stock: 5,
          is_active: true
        };
        
        const created = await pb.collection('products').create(testProduct);
        console.log('✅ Producto creado:', created.id);
        
        // 4. Intentar eliminar producto
        await pb.collection('products').delete(created.id);
        console.log('✅ Producto eliminado');
        
        console.log('🎉 TODO FUNCIONA CORRECTAMENTE');
        
      } catch (opError) {
        console.log('❌ Error en operaciones:', opError.message);
        console.log('📋 Detalles:', opError.data);
      }
      
    } catch (authError) {
      console.log('❌ Error de autenticación:', authError.message);
      console.log('🔍 El usuario admin@admin.com no existe o la contraseña es incorrecta');
    }
    
  } catch (error) {
    console.error('❌ Error general:', error.message);
  } finally {
    pb.authStore.clear();
  }
}

quickTest();
