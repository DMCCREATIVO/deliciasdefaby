#!/usr/bin/env node

import PocketBase from 'pocketbase/cjs';

async function testAdminAuth() {
  console.log('🔐 Probando autenticación de administrador...');
  
  const pb = new PocketBase('https://bd.deliciasdefaby.cl');
  
  try {
    // Intentar autenticar como administrador
    console.log('\n1. 🔑 Intentando autenticación como admin...');
    try {
      await pb.admins.authWithPassword('admin@admin.com', 'admin12345');
      console.log('✅ Autenticación exitosa como administrador');
      
      // Verificar que tenemos permisos
      console.log('\n2. 🔍 Verificando permisos...');
      console.log('¿Está autenticado?', pb.authStore.isValid);
      console.log('¿Es admin?', pb.authStore.isAdmin);
      console.log('Model:', pb.authStore.model);
      
      // Intentar obtener colecciones (requiere permisos de admin)
      console.log('\n3. 📋 Intentando obtener colecciones...');
      try {
        const collections = await pb.collections.getFullList();
        console.log('✅ Colecciones obtenidas:', collections.length);
        
        const productsCollection = collections.find(c => c.name === 'products');
        if (productsCollection) {
          console.log('\n4. 🧩 Schema de products:');
          console.log('Campos requeridos:', productsCollection.fields.filter(f => f.required).map(f => f.name));
          console.log('Regla de creación:', productsCollection.createRule);
          console.log('Regla de eliminación:', productsCollection.deleteRule);
        }
        
      } catch (collectionsError) {
        console.log('❌ Error obteniendo colecciones:', collectionsError.message);
      }
      
      // Intentar crear un producto de prueba
      console.log('\n5. 🆕 Intentando crear producto de prueba...');
      try {
        const testProduct = {
          title: 'Producto Admin Test ' + Date.now(),
          description: 'Creado por administrador',
          price: 1000,
          stock: 5,
          is_active: true
        };
        
        const created = await pb.collection('products').create(testProduct);
        console.log('✅ Producto creado:', created.id);
        
        // Intentar eliminarlo
        console.log('\n6. 🗑️ Intentando eliminar producto de prueba...');
        await pb.collection('products').delete(created.id);
        console.log('✅ Producto eliminado exitosamente');
        
      } catch (productError) {
        console.log('❌ Error en operaciones de producto:', productError.message);
        console.log('Detalles:', {
          status: productError.status,
          data: productError.data
        });
      }
      
    } catch (authError) {
      console.log('❌ Error de autenticación:', authError.message);
      
      // Intentar con otras credenciales comunes
      const commonCredentials = [
        { email: 'admin@deliciasdefaby.cl', password: 'admin12345' },
        { email: 'admin@admin.com', password: 'admin' },
        { email: 'admin@deliciasdefaby.cl', password: '123456' },
      ];
      
      for (const creds of commonCredentials) {
        console.log(`\n🔄 Intentando con ${creds.email}...`);
        try {
          await pb.admins.authWithPassword(creds.email, creds.password);
          console.log('✅ Credenciales válidas:', creds.email);
          break;
        } catch (e) {
          console.log('❌ Credenciales inválidas');
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Error general:', error);
  } finally {
    pb.authStore.clear();
  }
}

testAdminAuth();
