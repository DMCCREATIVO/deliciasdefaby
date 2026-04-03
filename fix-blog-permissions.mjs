#!/usr/bin/env node

import PocketBase from 'pocketbase/cjs';

const pb = new PocketBase('https://bd.deliciasdefaby.cl');

async function fixBlogPermissions() {
  console.log('🔧 Arreglando permisos del blog...\n');
  
  try {
    // Autenticar como admin
    await pb.admins.authWithPassword('dmccreativo@gmail.com', 'Dayn2614@#@');
    console.log('✅ Autenticación exitosa\n');
    
    // Obtener colección
    const collection = await pb.collections.getOne('blog_posts');
    console.log('📋 Colección actual:');
    console.log(`   List rule: ${collection.listRule}`);
    console.log(`   View rule: ${collection.viewRule}`);
    console.log(`   Create rule: ${collection.createRule}`);
    console.log(`   Update rule: ${collection.updateRule}`);
    console.log(`   Delete rule: ${collection.deleteRule}\n`);
    
    // Actualizar reglas para permitir acceso público a posts publicados
    console.log('🔄 Actualizando reglas de acceso...');
    
    collection.listRule = 'is_published = true || @request.auth.id != ""';
    collection.viewRule = 'is_published = true || @request.auth.id != ""';
    
    await pb.collections.update(collection.id, collection);
    console.log('✅ Reglas actualizadas\n');
    
    // Verificar posts
    console.log('📊 Posts en la base de datos:');
    const posts = await pb.collection('blog_posts').getFullList({ sort: '-created' });
    console.log(`   Total: ${posts.length} posts`);
    posts.forEach(post => {
      const pubStatus = post.is_published ? '✅ Publicado' : '❌ Borrador';
      console.log(`   - ${post.title} (${pubStatus})`);
    });
    
    // Probar acceso público
    console.log('\n🧪 Probando acceso público...');
    pb.authStore.clear();
    
    try {
      const publicPosts = await pb.collection('blog_posts').getFullList({
        filter: 'is_published = true',
        sort: '-created'
      });
      console.log(`   ✅ Éxito: ${publicPosts.length} posts públicos encontrados`);
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
    }
    
    console.log('\n🎉 Configuración completada');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    pb.authStore.clear();
  }
}

fixBlogPermissions();
