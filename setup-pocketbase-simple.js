// Script para verificar y crear productos de ejemplo en PocketBase
import fetch from 'node-fetch';

const POCKETBASE_URL = 'https://clientes-pocketbasedeliciasdefaby.4dgggl.easypanel.host';

async function checkAndCreateProducts() {
  try {
    console.log('🔌 Verificando conexión a PocketBase...');
    
    // Intentar obtener productos existentes
    const response = await fetch(`${POCKETBASE_URL}/api/collections/products/records?page=1&perPage=1`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Conexión exitosa a PocketBase');
      console.log(`📦 Productos existentes: ${data.totalItems || 0}`);
      
      if (data.totalItems > 0) {
        console.log('🎉 La base de datos ya tiene productos');
        return;
      }
    } else if (response.status === 404) {
      console.log('⚠️ La colección products no existe');
      console.log('💡 Necesita crear la colección manualmente desde el admin de PocketBase');
      return;
    } else {
      console.log('❌ Error de conexión:', response.status);
      return;
    }
    
    // Si no hay productos, mostrar mensaje
    console.log('📝 Para agregar productos manualmente:');
    console.log('1. Ve al panel de admin de PocketBase');
    console.log('2. Crea la colección "products" con los campos necesarios');
    console.log('3. Agrega algunos productos de ejemplo');
    
  } catch (error) {
    console.error('❌ Error verificando la base de datos:', error.message);
  }
}

checkAndCreateProducts();
