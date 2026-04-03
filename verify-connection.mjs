#!/usr/bin/env node

import PocketBase from 'pocketbase';

// Script para verificar la conexión a la base de datos
async function verifyConnection() {
  console.log('🔍 Verificando conexión a la base de datos...');
  
  // Determinar la URL según el entorno
  const isProd = process.env.NODE_ENV === 'production' || process.env.MODE === 'production';
  const baseUrl = isProd ? 'https://bd.deliciasdefaby.cl' : 'http://localhost:8090';
  
  console.log(`📍 Entorno: ${isProd ? 'Producción' : 'Desarrollo'}`);
  console.log(`🔌 URL PocketBase: ${baseUrl}`);
  
  const pb = new PocketBase(baseUrl);
  
  try {
    // Verificar salud del servidor
    const health = await pb.health.check();
    console.log('✅ Servidor PocketBase saludable:', health);
    
    // Verificar si las colecciones existen
    try {
      const collections = await pb.collections.getFullList();
      const hasProducts = collections.some(c => c.name === 'products');
      const hasCategories = collections.some(c => c.name === 'categories');
      
      console.log('📊 Colecciones encontradas:');
      console.log(`  ${hasProducts ? '✅' : '❌'} products`);
      console.log(`  ${hasCategories ? '✅' : '❌'} categories`);
      
      if (hasProducts) {
        try {
          const products = await pb.collection('products').getList(1, 1);
          console.log(`📦 Productos disponibles: ${products.totalItems}`);
        } catch (error) {
          console.log('⚠️ No se pudieron contar los productos (puede ser normal si no hay auth)');
        }
      }
      
    } catch (error) {
      console.log('⚠️ No se pudieron verificar las colecciones:', error.message);
    }
    
    console.log('🎉 Verificación completada exitosamente');
    
  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
    
    if (error.message.includes('ECONNREFUSED') && !isProd) {
      console.log('');
      console.log('💡 Solución sugerida:');
      console.log('   1. Asegúrate que PocketBase local está corriendo');
      console.log('   2. Ejecuta: ./pocketbase serve --dev');
      console.log('   3. O usa: npm run dev:prod para conectar a producción');
    }
    
    process.exit(1);
  }
}

// Ejecutar verificación
verifyConnection();
