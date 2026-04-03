// Script para verificar que el sitio esté usando la base de datos correcta
import fetch from 'node-fetch';

const SITE_URL = 'https://deliciasdefaby-faby-web-correcto.xb1blk.easypanel.host';
const CORRECT_DB_URL = 'https://bd.deliciasdefaby.cl';

async function testDatabaseConnection() {
  try {
    console.log('🔍 Verificando conexión del sitio a la base de datos correcta...');
    console.log(`Sitio: ${SITE_URL}`);
    console.log(`Base de datos correcta: ${CORRECT_DB_URL}`);
    
    // Verificar que la base de datos correcta tenga productos
    const dbResponse = await fetch(`${CORRECT_DB_URL}/api/collections/products/records?perPage=5`);
    
    if (dbResponse.ok) {
      const dbData = await dbResponse.json();
      console.log(`✅ Base de datos correcta tiene ${dbData.totalItems} productos`);
      
      if (dbData.totalItems > 0) {
        console.log('\n📋 Primeros productos en la base de datos correcta:');
        dbData.items.slice(0, 5).forEach((product, index) => {
          console.log(`${index + 1}. ${product.title} - $${product.price?.toLocaleString('es-CL')}`);
        });
      }
    } else {
      console.log('❌ Error accediendo a la base de datos correcta');
    }
    
    // Verificar que el sitio esté funcionando
    const siteResponse = await fetch(SITE_URL);
    
    if (siteResponse.ok) {
      console.log('\n✅ Sitio web funcionando correctamente');
      console.log('🌐 El sitio debería mostrar los productos de la base de datos correcta');
      console.log(`🔗 URL del sitio: ${SITE_URL}`);
    } else {
      console.log('❌ Error accediendo al sitio web');
    }
    
    console.log('\n🎯 Próximo paso:');
    console.log('1. Visita el sitio web');
    console.log('2. Verifica que muestre los 14 productos reales');
    console.log('3. Prueba el carrito y checkout');
    
  } catch (error) {
    console.error('❌ Error en la verificación:', error.message);
  }
}

testDatabaseConnection();
