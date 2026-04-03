#!/usr/bin/env node

import PocketBase from 'pocketbase/cjs';

async function checkSchema() {
  console.log('🔍 Analizando schema de la base de datos...');
  
  const pb = new PocketBase('https://bd.deliciasdefaby.cl');
  
  try {
    // Obtener todas las colecciones
    console.log('\n1. 📋 Colecciones disponibles...');
    const collections = await pb.collections.getFullList();
    console.log('✅ Colecciones encontradas:');
    collections.forEach(c => {
      console.log(`  - ${c.name} (${c.type})`);
    });
    
    // Buscar colección de productos
    const productsCollection = collections.find(c => c.name === 'products');
    if (!productsCollection) {
      console.log('❌ No se encontró la colección "products"');
      return;
    }
    
    console.log('\n2. 🧩 Schema de la colección products:');
    console.log('📋 Campos requeridos:');
    const requiredFields = productsCollection.fields.filter(f => f.required);
    requiredFields.forEach(f => {
      console.log(`  ✅ ${f.name} (${f.type}) - REQUERIDO`);
    });
    
    console.log('\n📋 Campos opcionales:');
    const optionalFields = productsCollection.fields.filter(f => !f.required);
    optionalFields.forEach(f => {
      console.log(`  ⭕ ${f.name} (${f.type})`);
    });
    
    console.log('\n3. 🔒 Reglas de acceso:');
    console.log(`  List: ${productsCollection.listRule || 'Sin restricción'}`);
    console.log(`  Create: ${productsCollection.createRule || 'Sin restricción'}`);
    console.log(`  Update: ${productsCollection.updateRule || 'Sin restricción'}`);
    console.log(`  Delete: ${productsCollection.deleteRule || 'Sin restricción'}`);
    
    // Verificar si hay problemas con los campos
    console.log('\n4. 🔍 Análisis de problemas potenciales:');
    
    // Verificar campos comunes que podrían faltar
    const commonFields = ['title', 'price', 'stock', 'is_active'];
    const availableFields = productsCollection.fields.map(f => f.name);
    
    commonFields.forEach(field => {
      if (!availableFields.includes(field)) {
        console.log(`  ❌ Campo faltante: ${field}`);
      } else {
        const fieldInfo = productsCollection.fields.find(f => f.name === field);
        const status = fieldInfo.required ? '✅' : '⭕';
        console.log(`  ${status} Campo presente: ${field} (${fieldInfo.type})`);
      }
    });
    
    // Intentar obtener un producto específico para verificar IDs
    console.log('\n5. 🆔 Verificando IDs de productos...');
    try {
      const products = await pb.collection('products').getList(1, 5);
      console.log(`✅ Encontrados ${products.items.length} productos:`);
      products.items.forEach((p, i) => {
        console.log(`  ${i + 1}. ID: ${p.id} - ${p.title}`);
      });
      
      // Intentar obtener el primer producto por ID
      if (products.items.length > 0) {
        const firstId = products.items[0].id;
        console.log(`\n🔍 Intentando obtener producto con ID: ${firstId}`);
        try {
          const product = await pb.collection('products').getOne(firstId);
          console.log('✅ Producto obtenido:', product.title);
        } catch (getError) {
          console.log('❌ Error obteniendo producto por ID:', getError.message);
        }
      }
    } catch (listError) {
      console.log('❌ Error listando productos:', listError.message);
    }
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

checkSchema();
