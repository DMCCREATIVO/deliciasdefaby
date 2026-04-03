// Script para agregar productos de ejemplo a PocketBase
import fetch from 'node-fetch';

const POCKETBASE_URL = 'https://bd.deliciasdefaby.cl';

const sampleProducts = [
  {
    title: 'Pastel de Chocolate',
    description: 'Delicioso pastel de chocolate con tres leches, perfecto para celebraciones especiales',
    short_description: 'Pastel de chocolate tradicional',
    price: 8500,
    stock: 10,
    is_active: true,
    is_featured: true
  },
  {
    title: 'Torta de Merengue',
    description: 'Ligera torta de merengue con frutas frescas de temporada',
    short_description: 'Torta de merengue',
    price: 7200,
    stock: 8,
    is_active: true,
    is_featured: false
  },
  {
    title: 'Cheesecake de Frutos Rojos',
    description: 'Clásico cheesecake con salsa de frutos rojos, postre ideal para cualquier ocasión',
    short_description: 'Cheesecake',
    price: 9200,
    stock: 6,
    is_active: true,
    is_featured: true
  },
  {
    title: 'Brownie con Nueces',
    description: 'Húmedo brownie de chocolate con nueces, acompañado de helado',
    short_description: 'Brownie de chocolate',
    price: 4500,
    stock: 15,
    is_active: true,
    is_featured: false
  },
  {
    title: 'Tiramisú Clásico',
    description: 'Auténtico tiramisú italiano con café y mascarpone',
    short_description: 'Tiramisú',
    price: 6800,
    stock: 12,
    is_active: true,
    is_featured: true
  }
];

async function addSampleProducts() {
  try {
    console.log('🔌 Agregando productos de ejemplo a PocketBase...');
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const product of sampleProducts) {
      try {
        const response = await fetch(`${POCKETBASE_URL}/api/collections/products/records`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(product)
        });
        
        if (response.ok) {
          const result = await response.json();
          console.log(`✅ Producto creado: ${result.title}`);
          successCount++;
        } else {
          const error = await response.text();
          console.log(`❌ Error creando "${product.title}":`, response.status, error);
          errorCount++;
        }
      } catch (error) {
        console.log(`❌ Error creando "${product.title}":`, error.message);
        errorCount++;
      }
    }
    
    console.log(`\n🎉 Resultado:`);
    console.log(`✅ Productos creados: ${successCount}`);
    console.log(`❌ Errores: ${errorCount}`);
    
    if (successCount > 0) {
      console.log(`\n🚀 Ahora puedes ver los productos en la página web!`);
    }
    
  } catch (error) {
    console.error('❌ Error general:', error.message);
  }
}

addSampleProducts();
