import PocketBase from 'pocketbase/cjs';

const pb = new PocketBase('https://bd.deliciasdefaby.cl');

async function setupBlogCollection() {
  console.log('🔧 Configurando colección blog_posts...');
  
  try {
    // Autenticar como admin
    await pb.admins.authWithPassword('dmccreativo@gmail.com', 'Dayn2614@#@');
    console.log('✅ Autenticación exitosa');
    
    // Verificar si la colección existe
    try {
      const collection = await pb.collections.getOne('blog_posts');
      console.log('ℹ️ La colección blog_posts ya existe');
      console.log('📋 Campos actuales:', collection.fields.map(f => f.name).join(', '));
      
      // Verificar si tiene todos los campos necesarios
      const requiredFields = ['title', 'slug', 'content', 'excerpt', 'featured_image', 'is_published', 'featured', 'tags', 'published_at', 'author_id'];
      const existingFields = collection.fields.map(f => f.name);
      const missingFields = requiredFields.filter(f => !existingFields.includes(f));
      
      if (missingFields.length > 0) {
        console.log('⚠️ Faltan campos:', missingFields.join(', '));
        console.log('🔄 Actualizando colección...');
        
        // Agregar campos faltantes
        const newFields = [];
        
        if (!existingFields.includes('slug')) {
          newFields.push({
            name: 'slug',
            type: 'text',
            required: false,
            options: { max: 200 }
          });
        }
        
        if (!existingFields.includes('excerpt')) {
          newFields.push({
            name: 'excerpt',
            type: 'text',
            required: false,
            options: { max: 500 }
          });
        }
        
        if (!existingFields.includes('featured_image')) {
          newFields.push({
            name: 'featured_image',
            type: 'file',
            required: false,
            options: {
              maxSelect: 1,
              maxSize: 5242880,
              mimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
            }
          });
        }
        
        if (!existingFields.includes('is_published')) {
          newFields.push({
            name: 'is_published',
            type: 'bool',
            required: false,
            default: false
          });
        }
        
        if (!existingFields.includes('featured')) {
          newFields.push({
            name: 'featured',
            type: 'bool',
            required: false,
            default: false
          });
        }
        
        if (!existingFields.includes('tags')) {
          newFields.push({
            name: 'tags',
            type: 'json',
            required: false
          });
        }
        
        if (!existingFields.includes('published_at')) {
          newFields.push({
            name: 'published_at',
            type: 'date',
            required: false
          });
        }
        
        if (!existingFields.includes('author_id')) {
          newFields.push({
            name: 'author_id',
            type: 'text',
            required: false
          });
        }
        
        // Actualizar colección con nuevos campos
        if (newFields.length > 0) {
          collection.fields = [...collection.fields, ...newFields];
          await pb.collections.update(collection.id, collection);
          console.log('✅ Colección actualizada con nuevos campos');
        }
      } else {
        console.log('✅ La colección tiene todos los campos necesarios');
      }
      
    } catch (error) {
      if (error.status === 404) {
        console.log('🆕 La colección no existe, creándola...');
        
        // Crear colección blog_posts
        const newCollection = {
          name: 'blog_posts',
          type: 'base',
          schema: [
            {
              name: 'title',
              type: 'text',
              required: true,
              options: { max: 200 }
            },
            {
              name: 'slug',
              type: 'text',
              required: false,
              options: { max: 200 }
            },
            {
              name: 'content',
              type: 'text',
              required: false
            },
            {
              name: 'excerpt',
              type: 'text',
              required: false,
              options: { max: 500 }
            },
            {
              name: 'featured_image',
              type: 'file',
              required: false,
              options: {
                maxSelect: 1,
                maxSize: 5242880,
                mimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
              }
            },
            {
              name: 'is_published',
              type: 'bool',
              required: false,
              default: false
            },
            {
              name: 'featured',
              type: 'bool',
              required: false,
              default: false
            },
            {
              name: 'tags',
              type: 'json',
              required: false
            },
            {
              name: 'published_at',
              type: 'date',
              required: false
            },
            {
              name: 'author_id',
              type: 'text',
              required: false
            }
          ],
          listRule: 'id != ""',
          viewRule: 'id != ""',
          createRule: '@request.auth.id != ""',
          updateRule: '@request.auth.id != ""',
          deleteRule: '@request.auth.id != ""'
        };
        
        await pb.collections.create(newCollection);
        console.log('✅ Colección blog_posts creada exitosamente');
      } else {
        throw error;
      }
    }
    
    // Verificar posts existentes
    const posts = await pb.collection('blog_posts').getList(1, 10);
    console.log(`📊 Posts existentes: ${posts.totalItems}`);
    
    if (posts.items.length === 0) {
      console.log('💡 No hay posts. Puedes crear uno desde el panel de administración.');
    } else {
      posts.items.forEach(post => {
        console.log(`  - ${post.title} (${post.is_published ? 'Publicado' : 'Borrador'})`);
      });
    }
    
    console.log('\n🎉 Configuración del blog completada');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    pb.authStore.clear();
  }
}

setupBlogCollection();
