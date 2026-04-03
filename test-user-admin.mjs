#!/usr/bin/env node

import PocketBase from 'pocketbase/cjs';

async function testUserAdmin() {
  console.log('🔐 Probando usuario admin...');
  
  const pb = new PocketBase('https://bd.deliciasdefaby.cl');
  
  try {
    // Intentar autenticar como usuario admin
    console.log('\n1. 🔑 Intentando autenticación como usuario admin...');
    try {
      await pb.collection('users').authWithPassword('admin@admin.com', 'admin12345');
      console.log('✅ Autenticación exitosa como usuario admin');
      
      // Verificar que tenemos permisos
      console.log('\n2. 🔍 Verificando permisos...');
      console.log('¿Está autenticado?', pb.authStore.isValid);
      console.log('¿Es admin de PB?', pb.authStore.isAdmin);
      console.log('Usuario:', {
        id: pb.authStore.model?.id,
        email: pb.authStore.model?.email,
        role: pb.authStore.model?.role
      });
      
      // Intentar obtener colecciones (puede requerir permisos especiales)
      console.log('\n3. 📋 Intentando obtener colecciones...');
      try {
        const collections = await pb.collections.getFullList();
        console.log('✅ Colecciones obtenidas:', collections.length);
        
        const productsCollection = collections.find(c => c.name === 'products');
        if (productsCollection) {
          console.log('\n4. 🧩 Schema de products:');
          console.log('Campos requeridos:', productsCollection.fields.filter(f => f.required).map(f => `${f.name} (${f.type})`));
          console.log('Regla de creación:', productsCollection.createRule);
          console.log('Regla de eliminación:', productsCollection.deleteRule);
        }
        
      } catch (collectionsError) {
        console.log('❌ Error obteniendo colecciones:', collectionsError.message);
        console.log('ℹ️ Esto puede ser normal si el usuario no tiene permisos de administrador de PocketBase');
      }
      
      // Intentar obtener productos
      console.log('\n5. 📦 Intentando obtener productos...');
      try {
        const products = await pb.collection('products').getList(1, 5);
        console.log('✅ Productos obtenidos:', products.totalItems);
        
        if (products.items.length > 0) {
          const firstProduct = products.items[0];
          console.log('Primer producto:', {
            id: firstProduct.id,
            title: firstProduct.title,
            is_active: firstProduct.is_active
          });
        }
      } catch (productsError) {
        console.log('❌ Error obteniendo productos:', productsError.message);
      }
      
      // Intentar crear un producto de prueba
      console.log('\n6. 🆕 Intentando crear producto de prueba...');
      try {
        const testProduct = {
          title: 'Producto Test Admin ' + Date.now(),
          description: 'Creado por usuario admin',
          price: 1000,
          stock: 5,
          is_active: true
        };
        
        const created = await pb.collection('products').create(testProduct);
        console.log('✅ Producto creado:', created.id);
        
        // Intentar eliminarlo
        console.log('\n7. 🗑️ Intentando eliminar producto de prueba...');
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
    }
    
  } catch (error) {
    console.error('❌ Error general:', error);
  } finally {
    pb.authStore.clear();
  }
}

testUserAdmin();
