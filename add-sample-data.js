import PocketBase from 'pocketbase/cjs';

async function addSampleData() {
  const pb = new PocketBase('http://localhost:8090');
  
  try {
    console.log('🔌 Conectando a PocketBase local...');
    
    // Autenticar como admin
    await pb.admins.authWithPassword('admin@admin.com', 'admin12345');
    console.log('✅ Autenticación exitosa');
    
    // Crear productos de ejemplo
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
        title: 'Tiramisú Clásico',
        description: 'Auténtico tiramisú italiano con café y mascarpone',
        short_description: 'Tiramisú',
        price: 6800,
        stock: 12,
        is_active: true,
        is_featured: true
      },
      {
        title: 'Brownie con Nueces',
        description: 'Húmedo brownie de chocolate con nueces crujientes',
        short_description: 'Brownie',
        price: 4500,
        stock: 15,
        is_active: true,
        is_featured: false
      }
    ];
    
    console.log('📦 Agregando productos de ejemplo...');
    
    for (const product of sampleProducts) {
      try {
        await pb.collection('products').create(product);
        console.log(`✅ Producto creado: ${product.title}`);
      } catch (error) {
        console.log(`⚠️ Error creando ${product.title}:`, error.message);
      }
    }
    
    // Crear categorías de ejemplo
    const sampleCategories = [
      {
        name: 'Pasteles',
        description: 'Deliciosos pasteles para celebraciones',
        slug: 'pasteles',
        is_active: true,
        sort_order: 1
      },
      {
        name: 'Tortas',
        description: 'Tortas ligeras y refrescantes',
        slug: 'tortas',
        is_active: true,
        sort_order: 2
      },
      {
        name: 'Postres',
        description: 'Postres clásicos y especiales',
        slug: 'postres',
        is_active: true,
        sort_order: 3
      }
    ];
    
    console.log('📂 Agregando categorías de ejemplo...');
    
    for (const category of sampleCategories) {
      try {
        await pb.collection('categories').create(category);
        console.log(`✅ Categoría creada: ${category.name}`);
      } catch (error) {
        console.log(`⚠️ Error creando ${category.name}:`, error.message);
      }
    }
    
    console.log('🎉 Datos de ejemplo agregados exitosamente!');
    
  } catch (error) {
    console.error('❌ Error agregando datos:', error);
    process.exit(1);
  } finally {
    pb.authStore.clear();
  }
}

// Ejecutar el script
addSampleData();
