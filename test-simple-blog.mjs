#!/usr/bin/env node

import PocketBase from 'pocketbase/cjs';

const pb = new PocketBase('https://bd.deliciasdefaby.cl');

async function testSimpleBlogQuery() {
  console.log('🧪 Probando consultas simples al blog...\n');
  
  try {
    // Intentar sin filtros primero
    console.log('1️⃣ Consulta simple sin filtros...');
    try {
      const records = await pb.collection('blog_posts').getList(1, 10);
      console.log(`   ✅ Éxito: ${records.totalItems} posts`);
      records.items.forEach(post => {
        console.log(`      - ${post.title}`);
      });
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
    }
    
    // Intentar con sort
    console.log('\n2️⃣ Consulta con sort...');
    try {
      const records = await pb.collection('blog_posts').getList(1, 10, { sort: '-created' });
      console.log(`   ✅ Éxito: ${records.totalItems} posts`);
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
    }
    
    // Intentar getFullList sin filtros
    console.log('\n3️⃣ getFullList sin parámetros...');
    try {
      const records = await pb.collection('blog_posts').getFullList();
      console.log(`   ✅ Éxito: ${records.length} posts`);
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
    }
    
    // Probar autenticado
    console.log('\n4️⃣ Probando autenticado...');
    await pb.admins.authWithPassword('dmccreativo@gmail.com', 'Dayn2614@#@');
    try {
      const records = await pb.collection('blog_posts').getFullList({ sort: '-created' });
      console.log(`   ✅ Éxito autenticado: ${records.length} posts`);
      records.forEach(post => {
        console.log(`      - ${post.title} (is_published: ${post.is_published})`);
      });
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
    }
    
  } catch (error) {
    console.error('❌ Error general:', error.message);
  }
}

testSimpleBlogQuery();
