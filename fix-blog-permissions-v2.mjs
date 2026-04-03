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
    console.log(`   List rule: "${collection.listRule}"`);
    console.log(`   View rule: "${collection.viewRule}"`);
    console.log(`   Create rule: "${collection.createRule}"`);
    console.log(`   Update rule: "${collection.updateRule}"`);
    console.log(`   Delete rule: "${collection.deleteRule}"\n`);
    
    // Actualizar reglas - permitir lectura pública de posts publicados
    // y permitir todo a usuarios autenticados
    collection.listRule = 'is_published = true';
    collection.viewRule = 'is_published = true';
    collection.createRule = '@request.auth.id != ""';
    collection.updateRule = '@request.auth.id != ""';
    collection.deleteRule = '@request.auth.id != ""';
    
    console.log('🔄 Actualizando reglas...');
    console.log('   List rule: is_published = true');
    console.log('   View rule: is_published = true');
    console.log('   Create/Update/Delete: solo usuarios autenticados\n');
    
    await pb.collections.update(collection.id, collection);
    console.log('✅ Reglas actualizadas\n');
    
    // Verificar posts
    console.log('📊 Verificando posts...');
    const posts = await pb.collection('blog_posts').getFullList({ sort: '-created' });
    console.log(`   ✅ Total de posts: ${posts.length}`);
    posts.forEach(post => {
      console.log(`   - ${post.title} (Publicado: ${post.is_published})`);
    });
    
    console.log('\n🎉 Permisos del blog corregidos exitosamente');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.data) {
      console.error('   Detalles:', JSON.stringify(error.data, null, 2));
    }
  } finally {
    pb.authStore.clear();
  }
}

fixBlogPermissions();
