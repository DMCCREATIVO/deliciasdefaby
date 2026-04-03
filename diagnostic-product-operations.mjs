#!/usr/bin/env node

import PocketBase from 'pocketbase/cjs';

async function diagnoseProductOperations() {
  console.log('🔍 Diagnosticando operaciones de productos...');
  
  const pb = new PocketBase('https://bd.deliciasdefaby.cl');
  
  try {
    // 1. Verificar conexión
    console.log('\n1. 🔌 Verificando conexión...');
    const health = await pb.health.check();
    console.log('✅ Conexión exitosa:', health);
    
    // 2. Intentar autenticar como admin (necesitaremos credenciales)
    console.log('\n2. 🔐 Intentando autenticación...');
    try {
      await pb.admins.authWithPassword('admin@admin.com', 'admin12345');
      console.log('✅ Autenticación exitosa');
    } catch (authError) {
      console.log('❌ Error de autenticación:', authError.message);
      console.log('📝 Nota: Se necesitan credenciales de administrador para diagnosticar completamente');
      
      // Intentar sin auth para ver qué podemos acceder
      console.log('\n3. 📊 Verificando acceso público...');
      try {
        const products = await pb.collection('products').getList(1, 5);
        console.log('✅ Acceso público a productos:', products.totalItems, 'productos encontrados');
        
        if (products.items.length > 0) {
          console.log('📦 Primer producto:', {
            id: products.items[0].id,
            title: products.items[0].title,
            is_active: products.items[0].is_active,
            stock: products.items[0].stock
          });
        }
      } catch (publicError) {
        console.log('❌ Error accediendo a productos públicos:', publicError.message);
      }
      return;
    }
    
    // 3. Verificar esquema de colecciones
    console.log('\n3. 🧩 Verificando esquema de colecciones...');
    
    try {
      const productsCollection = await pb.collections.getOne('products');
      console.log('✅ Colección products encontrada');
      console.log('📋 Campos:', productsCollection.fields.map(f => `${f.name} (${f.type})`).join(', '));
      
      // Verificar reglas de acceso
      console.log('🔒 Reglas de acceso:');
      console.log('  List rule:', productsCollection.listRule || 'Sin restricción');
      console.log('  Create rule:', productsCollection.createRule || 'Sin restricción');
      console.log('  Update rule:', productsCollection.updateRule || 'Sin restricción');
      console.log('  Delete rule:', productsCollection.deleteRule || 'Sin restricción');
      
    } catch (schemaError) {
      console.log('❌ Error obteniendo esquema:', schemaError.message);
    }
    
    // 4. Intentar crear un producto de prueba
    console.log('\n4. 🆕 Intentando crear producto de prueba...');
    try {
      const testProduct = {
        title: 'Producto de Prueba Diagnóstico',
        description: 'Este es un producto creado para diagnóstico',
        price: 1000,
        stock: 5,
        is_active: true
      };
      
      const created = await pb.collection('products').create(testProduct);
      console.log('✅ Producto creado exitosamente:', {
        id: created.id,
        title: created.title
      });
      
      // 5. Intentar eliminar el producto de prueba
      console.log('\n5. 🗑️ Intentando eliminar producto de prueba...');
      try {
        await pb.collection('products').delete(created.id);
        console.log('✅ Producto eliminado exitosamente');
      } catch (deleteError) {
        console.log('❌ Error eliminando producto:', deleteError.message);
        
        // Intentar desactivar en lugar de eliminar
        try {
          await pb.collection('products').update(created.id, { is_active: false });
          console.log('⚠️ Producto desactivado (no eliminado)');
        } catch (updateError) {
          console.log('❌ Error desactivando producto:', updateError.message);
        }
      }
      
    } catch (createError) {
      console.log('❌ Error creando producto:', createError.message);
      console.log('📋 Detalles del error:', {
        status: createError.status,
        data: createError.data,
        isAbort: createError.isAbort
      });
    }
    
    // 6. Verificar si hay relaciones con otras colecciones
    console.log('\n6. 🔗 Verificando relaciones...');
    try {
      const collections = await pb.collections.getFullList();
      const relatedCollections = collections.filter(c => 
        c.name.includes('order') || 
        c.name.includes('item') || 
        c.name.includes('cart')
      );
      
      console.log('📊 Colecciones relacionadas con pedidos:');
      relatedCollections.forEach(c => {
        console.log(`  - ${c.name} (${c.type})`);
      });
      
      // Verificar si hay order_items
      if (relatedCollections.some(c => c.name === 'order_items')) {
        console.log('🔍 Verificando order_items...');
        try {
          const orderItems = await pb.collection('order_items').getList(1, 1);
          console.log('✅ order_items accesible:', orderItems.totalItems, 'registros');
        } catch (oiError) {
          console.log('❌ Error accediendo a order_items:', oiError.message);
        }
      }
      
    } catch (collectionsError) {
      console.log('❌ Error obteniendo colecciones:', collectionsError.message);
    }
    
    console.log('\n🎉 Diagnóstico completado');
    
  } catch (error) {
    console.error('❌ Error general en diagnóstico:', error);
  } finally {
    pb.authStore.clear();
  }
}

// Ejecutar diagnóstico
diagnoseProductOperations();
