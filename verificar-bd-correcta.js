// Script para verificar la base de datos correcta
import fetch from 'node-fetch';

const POCKETBASE_URL = 'https://bd.deliciasdefaby.cl';

async function checkCorrectDatabase() {
  try {
    console.log('🔌 Verificando base de datos correcta...');
    console.log(`URL: ${POCKETBASE_URL}`);
    
    // Intentar obtener productos existentes
    const response = await fetch(`${POCKETBASE_URL}/api/collections/products/records?page=1&perPage=50`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Conexión exitosa a la base de datos correcta');
      console.log(`📦 Total de productos: ${data.totalItems || 0}`);
      
      if (data.totalItems > 0) {
        console.log('\n📋 Lista de productos:');
        data.items.forEach((product, index) => {
          console.log(`${index + 1}. ${product.title} - $${product.price?.toLocaleString('es-CL') || 'N/A'} - Stock: ${product.stock || 'N/A'}`);
        });
        
        console.log(`\n🎉 ¡Se encontraron ${data.totalItems} productos en la base de datos correcta!`);
        console.log('🔄 El sitio web debería mostrar estos productos después del despliegue.');
      } else {
        console.log('⚠️ La base de datos correcta está vacía');
      }
      
    } else if (response.status === 404) {
      console.log('❌ Error 404: La colección products no existe en la base de datos correcta');
      console.log('💡 Se necesita crear la colección manualmente');
    } else {
      console.log(`❌ Error de conexión: ${response.status}`);
      const errorText = await response.text();
      console.log('Detalles:', errorText);
    }
    
  } catch (error) {
    console.error('❌ Error verificando la base de datos:', error.message);
  }
}

checkCorrectDatabase();
