#!/usr/bin/env node

import PocketBase from 'pocketbase/cjs';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function fixProductOperations() {
  console.log('🔧 Herramienta de diagnóstico y reparación de operaciones de productos');
  console.log('==================================================\n');
  
  console.log('📍 Base de datos: https://bd.deliciasdefaby.cl');
  console.log('🔍 Problemas detectados:');
  console.log('  - Creación de productos falla (error 400)');
  console.log('  - Eliminación de productos falla (error 404)');
  console.log('  - Probablemente problema de autenticación/permisos\n');
  
  // Opciones
  console.log('¿Qué deseas hacer?');
  console.log('1. Probar credenciales personalizadas');
  console.log('2. Verificar schema de la colección products');
  console.log('3. Crear usuario administrador');
  console.log('4. Probar operaciones con credenciales por defecto');
  console.log('5. Salir\n');
  
  const choice = await question('Selecciona una opción (1-5): ');
  
  switch (choice) {
    case '1':
      await testCustomCredentials();
      break;
    case '2':
      await checkSchema();
      break;
    case '3':
      await createAdminUser();
      break;
    case '4':
      await testDefaultCredentials();
      break;
    case '5':
      console.log('👋 Saliendo...');
      break;
    default:
      console.log('❌ Opción no válida');
  }
  
  rl.close();
}

async function testCustomCredentials() {
  console.log('\n🔐 Probando credenciales personalizadas...');
  
  const email = await question('Email de administrador: ');
  const password = await question('Contraseña: ');
  
  await testCredentials(email, password);
}

async function testCredentials(email, password) {
  const pb = new PocketBase('https://bd.deliciasdefaby.cl');
  
  try {
    console.log('\n🔄 Probando autenticación...');
    
    // Intentar como admin de PocketBase
    try {
      await pb.admins.authWithPassword(email, password);
      console.log('✅ Autenticación exitosa como administrador de PocketBase');
      await testOperations(pb);
      return;
    } catch (adminError) {
      console.log('⚠️ Falló autenticación como administrador de PocketBase');
    }
    
    // Intentar como usuario con rol admin
    try {
      await pb.collection('users').authWithPassword(email, password);
      const user = pb.authStore.model;
      
      if (user && user.role === 'admin') {
        console.log('✅ Autenticación exitosa como usuario con rol admin');
        await testOperations(pb);
      } else {
        console.log('❌ Usuario no tiene rol admin. Rol:', user?.role);
      }
    } catch (userError) {
      console.log('❌ Falló autenticación como usuario:', userError.message);
    }
    
  } catch (error) {
    console.error('❌ Error general:', error.message);
  } finally {
    pb.authStore.clear();
  }
}

async function testOperations(pb) {
  console.log('\n🧪 Probando operaciones de productos...');
  
  try {
    // Ver productos existentes
    const products = await pb.collection('products').getList(1, 3);
    console.log(`📦 Hay ${products.totalItems} productos`);
    
    if (products.items.length > 0) {
      const testProduct = products.items[0];
      console.log(`📋 Probando con producto: ${testProduct.title} (${testProduct.id})`);
      
      // Intentar eliminar
      try {
        await pb.collection('products').delete(testProduct.id);
        console.log('✅ Producto eliminado exitosamente');
      } catch (deleteError) {
        console.log('❌ Error eliminando:', deleteError.message);
      }
    }
    
    // Intentar crear
    try {
      const newProduct = {
        title: 'Producto Test ' + Date.now(),
        description: 'Producto de prueba',
        price: 1000,
        stock: 5,
        is_active: true
      };
      
      const created = await pb.collection('products').create(newProduct);
      console.log('✅ Producto creado exitosamente:', created.id);
      
      // Limpiar: eliminar el producto creado
      await pb.collection('products').delete(created.id);
      console.log('🧹 Producto de prueba eliminado');
      
    } catch (createError) {
      console.log('❌ Error creando:', createError.message);
      console.log('📋 Detalles:', createError.data);
    }
    
  } catch (error) {
    console.error('❌ Error en operaciones:', error.message);
  }
}

async function checkSchema() {
  console.log('\n🧩 Verificando schema (requiere credenciales)...');
  
  const email = await question('Email de administrador: ');
  const password = await question('Contraseña: ');
  
  const pb = new PocketBase('https://bd.deliciasdefaby.cl');
  
  try {
    await pb.admins.authWithPassword(email, password);
    
    const collections = await pb.collections.getFullList();
    const productsCollection = collections.find(c => c.name === 'products');
    
    if (productsCollection) {
      console.log('\n📋 Schema de la colección products:');
      console.log('Campos requeridos:');
      productsCollection.fields.filter(f => f.required).forEach(f => {
        console.log(`  ✅ ${f.name} (${f.type})`);
      });
      
      console.log('\nReglas de acceso:');
      console.log(`  Create: ${productsCollection.createRule}`);
      console.log(`  Delete: ${productsCollection.deleteRule}`);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    pb.authStore.clear();
  }
}

async function createAdminUser() {
  console.log('\n👤 Creando usuario administrador...');
  console.log('⚠️ Esta función requiere credenciales de administrador de PocketBase');
  
  const adminEmail = await question('Email de administrador de PocketBase: ');
  const adminPassword = await question('Contraseña de administrador de PocketBase: ');
  
  const newAdminEmail = await question('Email del nuevo usuario admin: ');
  const newAdminPassword = await question('Contraseña del nuevo usuario admin: ');
  
  const pb = new PocketBase('https://bd.deliciasdefaby.cl');
  
  try {
    await pb.admins.authWithPassword(adminEmail, adminPassword);
    
    const newAdmin = {
      email: newAdminEmail,
      password: newAdminPassword,
      passwordConfirm: newAdminPassword,
      name: 'Administrador',
      role: 'admin'
    };
    
    await pb.collection('users').create(newAdmin);
    console.log('✅ Usuario administrador creado exitosamente');
    console.log(`📧 Email: ${newAdminEmail}`);
    console.log('🔑 Contraseña:', newAdminPassword);
    
  } catch (error) {
    console.error('❌ Error creando usuario:', error.message);
  } finally {
    pb.authStore.clear();
  }
}

async function testDefaultCredentials() {
  console.log('\n🔐 Probando credenciales por defecto...');
  await testCredentials('admin@admin.com', 'admin12345');
}

fixProductOperations();
