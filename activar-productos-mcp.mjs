#!/usr/bin/env node

/**
 * Script para activar productos usando la API REST de PocketBase
 * Alternativa cuando el MCP update_record requiere autenticación
 * 
 * Uso: node activar-productos-mcp.mjs
 */

const POCKETBASE_URL = process.env.VITE_POCKETBASE_URL || 
  'https://clientes-pocketbasedeliciasdefaby.4dgggl.easypanel.host';

async function fetchProducts() {
  const res = await fetch(
    `${POCKETBASE_URL}/api/collections/products/records?perPage=100&sort=-created`
  );
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

async function updateProduct(id, data) {
  const res = await fetch(
    `${POCKETBASE_URL}/api/collections/products/records/${id}`,
    {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }
  );
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `HTTP ${res.status}`);
  }
  return res.json();
}

async function main() {
  console.log('🔗 Conectando a PocketBase:', POCKETBASE_URL);
  console.log('');

  try {
    let data;
    try {
      data = await fetchProducts();
    } catch (e) {
      console.error('Error al obtener productos:', e.message);
      throw e;
    }
    const { items } = data;
    console.log(`📦 Encontrados ${items.length} productos`);
    const inactivos = items.filter(p => !p.is_active);
    console.log(`   Inactivos: ${inactivos.length}\n`);

    if (inactivos.length === 0) {
      console.log('✅ Todos los productos ya están activos');
      return;
    }

    let activados = 0;
    let destacados = 0;
    for (let i = 0; i < inactivos.length; i++) {
      const p = inactivos[i];
      const data = { is_active: true };
      if (i < 5) data.is_featured = true;
      try {
        await updateProduct(p.id, data);
        console.log(`   ✅ ${p.title}${i < 5 ? ' (destacado)' : ''}`);
        activados++;
        if (i < 5) destacados++;
      } catch (e) {
        console.log(`   ❌ ${p.title}: ${e.message}`);
      }
    }

    console.log('');
    console.log(`📊 Activados: ${activados}, Destacados: ${destacados}`);
    console.log('🌐 Ver en: http://localhost:5173');
  } catch (e) {
    console.error('❌ Error:', e.message);
    process.exit(1);
  }
}

main();
