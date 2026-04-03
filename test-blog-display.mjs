#!/usr/bin/env node

import PocketBase from 'pocketbase/cjs';

const pb = new PocketBase('https://bd.deliciasdefaby.cl');

async function testBlogPosts() {
  console.log('🧪 Probando obtención de posts del blog...\n');
  
  try {
    // Probar sin autenticación (como usuario público)
    console.log('1️⃣ Probando obtención pública de posts...');
    
    // Intentar diferentes filtros
    const attempts = [
      { name: 'is_published = true', filter: 'is_published = true' },
      { name: 'published = true', filter: 'published = true' },
      { name: 'sin filtro', filter: null },
    ];
    
    for (const attempt of attempts) {
      try {
        console.log(`\n   Intentando con: ${attempt.name}`);
        const params = attempt.filter ? { filter: attempt.filter, sort: '-created' } : { sort: '-created' };
        const records = await pb.collection('blog_posts').getFullList(params);
        console.log(`   ✅ Éxito: ${records.length} posts encontrados`);
        
        records.forEach(post => {
          console.log(`      - ${post.title} (Publicado: ${post.is_published})`);
        });
      } catch (error) {
        console.log(`   ❌ Error: ${error.message}`);
      }
    }
    
    // Verificar colección
    console.log('\n2️⃣ Verificando configuración de la colección...');
    try {
      const collection = await pb.collections.getOne('blog_posts');
      console.log('   ✅ Colección existe');
      console.log(`   📋 Campos: ${collection.fields.map(f => f.name).join(', ')}`);
      console.log(`   👁️ List rule: ${collection.listRule}`);
      console.log(`   👁️ View rule: ${collection.viewRule}`);
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
    }
    
    // Ver posts directamente sin filtro
    console.log('\n3️⃣ Obteniendo todos los posts (sin filtro)...');
    try {
      const allPosts = await pb.collection('blog_posts').getFullList({ sort: '-created' });
      console.log(`   ✅ Total de posts en BD: ${allPosts.length}`);
      allPosts.forEach(post => {
        const pubStatus = post.is_published ? '✅ Publicado' : '❌ Borrador';
        console.log(`      - ${post.title} (${pubStatus})`);
      });
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
    }
    
  } catch (error) {
    console.error('❌ Error general:', error.message);
  }
}

testBlogPosts();
