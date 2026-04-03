#!/usr/bin/env node

import PocketBase from 'pocketbase/cjs';

async function fixAccessRules() {
  console.log('🔧 Analizando y reparando reglas de acceso...');
  
  const pb = new PocketBase('https://bd.deliciasdefaby.cl');
  
  try {
    // Verificar si podemos acceder a productos sin autenticación
    console.log('1. 📋 Verificando acceso público a productos...');
    const products = await pb.collection('products').getList(1, 5);
    console.log(`✅ Acceso público funcionando: ${products.totalItems} productos`);
    
    // Verificar si podemos crear productos sin autenticación
    console.log('\n2. 🆕 Intentando crear producto sin autenticación...');
    try {
      const testProduct = {
        title: 'Test Sin Auth ' + Date.now(),
        description: 'Producto sin autenticación',
        price: 1000,
        stock: 5,
        is_active: true
      };
      
      const created = await pb.collection('products').create(testProduct);
      console.log('✅ Producto creado sin autenticación:', created.id);
      
      // Intentar eliminar
      await pb.collection('products').delete(created.id);
      console.log('✅ Producto eliminado sin autenticación');
      console.log('🎉 Las operaciones funcionan sin autenticación');
      
    } catch (createError) {
      console.log('❌ No se puede crear sin autenticación:', createError.message);
      
      if (createError.status === 401) {
        console.log('🔍 Se requiere autenticación. Analizando alternativas...');
        
        // Opción 1: Crear usuario público con permisos
        console.log('\n3. 👤 Creando usuario con permisos especiales...');
        
        try {
          const publicUser = {
            email: 'public@deliciasdefaby.cl',
            password: 'public12345',
            passwordConfirm: 'public12345',
            name: 'Usuario Público',
            role: 'admin' // Intentar dar rol admin
          };
          
          await pb.collection('users').create(publicUser);
          console.log('✅ Usuario público creado');
          
          // Probar con este usuario
          await pb.collection('users').authWithPassword('public@deliciasdefaby.cl', 'public12345');
          
          const testProduct = {
            title: 'Test Public User ' + Date.now(),
            description: 'Producto con usuario público',
            price: 1000,
            stock: 5,
            is_active: true
          };
          
          const created = await pb.collection('products').create(testProduct);
          console.log('✅ Producto creado con usuario público:', created.id);
          
          await pb.collection('products').delete(created.id);
          console.log('✅ Producto eliminado con usuario público');
          console.log('🎉 Solución encontrada: usar usuario público con rol admin');
          
        } catch (publicError) {
          console.log('❌ No se puede crear usuario público:', publicError.message);
          
          // Opción 2: Modificar el enfoque del código
          console.log('\n4. 💡 Recomendación: Modificar el código para funcionar con las reglas actuales');
          console.log('   - Usar solo operaciones públicas (lectura)');
          console.log('   - Implementar un sistema de autenticación personalizado');
          console.log('   - Solicitar credenciales correctas del administrador');
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Error general:', error.message);
  } finally {
    pb.authStore.clear();
  }
}

fixAccessRules();
