#!/usr/bin/env node

import PocketBase from 'pocketbase/cjs';

async function testProductOperations() {
  console.log('🧪 Probando operaciones de productos...');
  
  const pb = new PocketBase('https://bd.deliciasdefaby.cl');
  
  try {
    // Ver productos existentes
    console.log('\n1. 📊 Verificando productos existentes...');
    const existingProducts = await pb.collection('products').getList(1, 10);
    console.log(`✅ Hay ${existingProducts.totalItems} productos en la base de datos`);
    
    if (existingProducts.items.length > 0) {
      const firstProduct = existingProducts.items[0];
      console.log('📦 Primer producto:', {
        id: firstProduct.id,
        title: firstProduct.title,
        is_active: firstProduct.is_active,
        stock: firstProduct.stock
      });
      
      // Intentar eliminar este producto
      console.log('\n2. 🗑️ Intentando eliminar producto existente...');
      try {
        await pb.collection('products').delete(firstProduct.id);
        console.log('✅ Producto eliminado exitosamente');
        
        // Verificar que se eliminó
        console.log('\n3. 🔍 Verificando eliminación...');
        const afterDelete = await pb.collection('products').getList(1, 10);
        console.log(`📊 Ahora hay ${afterDelete.totalItems} productos`);
        
        if (afterDelete.totalItems === existingProducts.totalItems) {
          console.log('❌ ERROR: El producto NO se eliminó realmente');
          console.log('🔍 Esto indica un problema con la operación de eliminación');
        } else {
          console.log('✅ Eliminación verificada correctamente');
        }
        
      } catch (deleteError) {
        console.log('❌ Error eliminando producto:', deleteError.message);
        console.log('📋 Detalles:', {
          status: deleteError.status,
          data: deleteError.data
        });
        
        // Intentar desactivar en lugar de eliminar
        try {
          await pb.collection('products').update(firstProduct.id, { is_active: false });
          console.log('⚠️ Producto desactivado en lugar de eliminado');
          
          // Verificar desactivación
          const updated = await pb.collection('products').getOne(firstProduct.id);
          console.log('📊 Estado después de desactivar:', {
            is_active: updated.is_active
          });
          
        } catch (updateError) {
          console.log('❌ Error desactivando producto:', updateError.message);
        }
      }
    }
    
    // Intentar crear un nuevo producto
    console.log('\n4. 🆕 Intentando crear nuevo producto...');
    try {
      const newProduct = {
        title: 'Producto Test ' + Date.now(),
        description: 'Producto creado para probar creación',
        price: 5000,
        stock: 10,
        is_active: true
      };
      
      const created = await pb.collection('products').create(newProduct);
      console.log('✅ Producto creado exitosamente:', {
        id: created.id,
        title: created.title
      });
      
      // Verificar que se creó
      console.log('\n5. 🔍 Verificando creación...');
      const afterCreate = await pb.collection('products').getList(1, 50);
      console.log(`📊 Ahora hay ${afterCreate.totalItems} productos`);
      
      if (afterCreate.totalItems > existingProducts.totalItems) {
        console.log('✅ Creación verificada correctamente');
      } else {
        console.log('❌ ERROR: El producto NO se creó realmente');
        console.log('🔍 Esto indica un problema con la operación de creación');
      }
      
    } catch (createError) {
      console.log('❌ Error creando producto:', createError.message);
      console.log('📋 Detalles:', {
        status: createError.status,
        data: createError.data,
        originalError: createError.originalError
      });
    }
    
    console.log('\n🎉 Prueba completada');
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

testProductOperations();
