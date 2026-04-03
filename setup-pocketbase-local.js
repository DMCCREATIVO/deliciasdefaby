import PocketBase from 'pocketbase/cjs';

async function setupDatabase() {
  const pb = new PocketBase('http://localhost:8090');
  
  try {
    console.log('🔌 Conectando a PocketBase local...');
    
    // Autenticar como admin
    await pb.admins.authWithPassword('admin@admin.com', 'admin12345');
    console.log('✅ Autenticación exitosa');
    
    // Crear colección categories primero
    try {
      const categoriesCollection = {
        name: 'categories',
        type: 'base',
        schema: [
          {
            name: 'name',
            type: 'text',
            required: true,
            options: { max: 100 }
          },
          {
            name: 'description',
            type: 'text',
            required: false
          },
          {
            name: 'slug',
            type: 'text',
            required: false,
            options: { max: 120 }
          },
          {
            name: 'image',
            type: 'file',
            required: false
          },
          {
            name: 'is_active',
            type: 'bool',
            required: false,
            default: true
          },
          {
            name: 'sort_order',
            type: 'number',
            required: false,
            default: 0
          }
        ],
        listRule: "",
        viewRule: "",
        createRule: "@request.auth.role = 'admin'",
        updateRule: "@request.auth.role = 'admin'",
        deleteRule: "@request.auth.role = 'admin'"
      };
      
      await pb.collections.create(categoriesCollection);
      console.log('✅ Colección categories creada');
    } catch (error) {
      if (error.status === 400) {
        console.log('⚠️ La colección categories ya existe');
      } else {
        throw error;
      }
    }
    
    // Crear colección products
    try {
      const productsCollection = {
        name: 'products',
        type: 'base',
        schema: [
          {
            name: 'title',
            type: 'text',
            required: true,
            options: { max: 200 }
          },
          {
            name: 'description',
            type: 'text',
            required: false
          },
          {
            name: 'short_description',
            type: 'text',
            required: false
          },
          {
            name: 'price',
            type: 'number',
            required: true,
            options: { min: 0 }
          },
          {
            name: 'compare_at_price',
            type: 'number',
            required: false
          },
          {
            name: 'weight',
            type: 'number',
            required: false
          },
          {
            name: 'stock',
            type: 'number',
            required: true,
            options: { min: 0 }
          },
          {
            name: 'category_id',
            type: 'relation',
            required: false,
            options: {
              collection: 'categories',
              maxSelect: 1
            }
          },
          {
            name: 'images',
            type: 'file',
            required: false,
            options: {
              maxSelect: 10,
              maxSize: 5242880,
              mimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
            }
          },
          {
            name: 'is_active',
            type: 'bool',
            required: false,
            default: true
          },
          {
            name: 'is_featured',
            type: 'bool',
            required: false,
            default: false
          },
          {
            name: 'available_days',
            type: 'text',
            required: false
          }
        ],
        listRule: "id != \"\" && is_active = true",
        viewRule: "id != \"\" && is_active = true",
        createRule: "@request.auth.role = 'admin'",
        updateRule: "@request.auth.role = 'admin'",
        deleteRule: "@request.auth.role = 'admin'"
      };
      
      await pb.collections.create(productsCollection);
      console.log('✅ Colección products creada');
    } catch (error) {
      if (error.status === 400) {
        console.log('⚠️ La colección products ya existe');
      } else {
        throw error;
      }
    }
    
    // Crear algunos productos de ejemplo
    try {
      const sampleProducts = [
        {
          title: 'Pastel de Chocolate',
          description: 'Delicioso pastel de chocolate con tres leches, perfecto para celebraciones',
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
          description: 'Clásico cheesecake con salsa de frutos rojos, postre ideal',
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
          description: 'Húmedo brownie de chocolate con nueces',
          short_description: 'Brownie',
          price: 4500,
          stock: 15,
          is_active: true,
          is_featured: false
        }
      ];
      
      for (const product of sampleProducts) {
        await pb.collection('products').create(product);
      }
      
      console.log('✅ Productos de ejemplo creados');
    } catch (error) {
      console.log('⚠️ Error creando productos de ejemplo:', error.message);
    }
    
    console.log('🎉 Base de datos local configurada exitosamente!');
    
  } catch (error) {
    console.error('❌ Error configurando la base de datos:', error);
    process.exit(1);
  } finally {
    pb.authStore.clear();
  }
}

// Ejecutar el setup
setupDatabase();
