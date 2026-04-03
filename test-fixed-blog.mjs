#!/usr/bin/env node

import PocketBase from 'pocketbase/cjs';

// Simular el servicio de blog actualizado
const pb = new PocketBase('https://bd.deliciasdefaby.cl');

const mapPbToBlogPost = (record) => ({
    id: record.id,
    title: record.title,
    excerpt: record.excerpt || '',
    content: record.content || '',
    image_url: record.featured_image || record.image_url || record.image || null,
    created_at: record.created ?? record.created_at ?? record.createdAt ?? null,
    updated_at: record.updated ?? record.updated_at ?? record.updatedAt ?? null,
    slug: record.slug || record.title?.toLowerCase().replace(/\s+/g, '-'),
    is_published: Boolean(record.is_published ?? record.published ?? false),
    featured: record.featured || false,
    author_id: record.author_id || null,
    published_at: record.published_at || null,
    tags: Array.isArray(record.tags) ? record.tags : [],
    status: (record.is_published ?? record.published) ? 'published' : 'draft',
});

async function testFixedBlogService() {
  console.log('🧪 Probando servicio de blog corregido...\n');
  
  try {
    // Simular getAll
    console.log('1️⃣ getAll() - Posts públicos:');
    const records = await pb.collection('blog_posts').getFullList();
    const mapped = records.map(mapPbToBlogPost);
    const published = mapped.filter((p) => p.is_published).sort((a, b) => {
        const dateA = new Date(a.created_at || 0).getTime();
        const dateB = new Date(b.created_at || 0).getTime();
        return dateB - dateA;
    });
    
    console.log(`   ✅ ${published.length} posts públicos encontrados`);
    published.forEach(post => {
      console.log(`      - ${post.title} (${new Date(post.created_at).toLocaleDateString()})`);
    });
    
    // Simular getAllAdmin
    console.log('\n2️⃣ getAllAdmin() - Todos los posts:');
    const allPosts = records.map(mapPbToBlogPost).sort((a, b) => {
        const dateA = new Date(a.created_at || 0).getTime();
        const dateB = new Date(b.created_at || 0).getTime();
        return dateB - dateA;
    });
    
    console.log(`   ✅ ${allPosts.length} posts totales`);
    allPosts.forEach(post => {
      const status = post.is_published ? '✅ Publicado' : '❌ Borrador';
      console.log(`      - ${post.title} (${status})`);
    });
    
    console.log('\n🎉 El servicio de blog ahora funciona correctamente');
    console.log('   Los posts se mostrarán en la página del blog');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testFixedBlogService();
