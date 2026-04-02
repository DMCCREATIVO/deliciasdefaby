import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import './styles/themes.css';
import './styles/admin-override.css';
import { pb } from './lib/pocketbase/client';
import { checkCollection } from './lib/pocketbase/utils/checkCollection';
import { createOrderMessagesCollection } from './lib/pocketbase/collections/order_messages';

console.log('🚀 Iniciando la aplicación...');
console.log('📊 Verificando variables de entorno:');
console.log('🔌 Backend:', import.meta.env.VITE_BACKEND || 'pocketbase');
console.log('🌐 PocketBase URL:', import.meta.env.VITE_POCKETBASE_URL);

// Función para limpiar tokens de autenticación corruptos
const cleanAuthTokens = () => {
  try {
    // Limpiar tokens antiguos de Supabase que ya no se usan
    const supabaseAuthKey = 'sb-czqclqgwpcvdevhxntie-auth-token';
    const dmcAuthKey = 'dmc-catalogo-auth';

    // Verificar si hay tokens corruptos y limpiarlos
    const authToken = localStorage.getItem(supabaseAuthKey);
    const dmcAuthToken = localStorage.getItem(dmcAuthKey);

    if (authToken) {
      console.log('🧹 Limpiando token antiguo de Supabase...');
      localStorage.removeItem(supabaseAuthKey);
    }

    if (dmcAuthToken) {
      try {
        JSON.parse(dmcAuthToken);
      } catch (e) {
        console.log('🧹 Limpiando token DMC corrupto...');
        localStorage.removeItem(dmcAuthKey);
      }
    }

    console.log('✅ Tokens limpiados correctamente');
  } catch (error) {
    console.log('⚠️ Error al limpiar tokens:', error);
  }
};

// Función para inicializar PocketBase
const initializePocketBase = async () => {
  try {
    console.log('🔌 Conectando a PocketBase...');

    // Verificar la conexión con PocketBase
    const health = await pb.health.check();
    console.log('✅ PocketBase conectado correctamente:', health);

    // Verificar si hay una sesión activa
    if (pb.authStore.isValid) {
      console.log('👤 Usuario autenticado:', pb.authStore.model?.email || pb.authStore.model?.username);
    } else {
      console.log('👤 No hay sesión activa');
    }

    return true;
  } catch (error) {
    console.error('❌ Error al conectar con PocketBase:', error);
    // No lanzar error, permitir que la app se cargue de todos modos
    return false;
  }
};

const initializeApp = async () => {
  try {
    // Limpiar tokens corruptos antes de inicializar
    cleanAuthTokens();

    // Inicializar PocketBase
    await initializePocketBase();

    // Asegurar colección de historial de mensajes (para Admin → Pedidos)
    try {
      const exists = await checkCollection('order_messages');
      if (!exists && pb.authStore.isValid) {
        await createOrderMessagesCollection();
      }
    } catch (e) {
      console.error('Error asegurando colección order_messages:', e);
    }

    ReactDOM.createRoot(document.getElementById('root')!).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (error) {
    console.error('Error al inicializar la aplicación:', error);
    // Mostrar un mensaje de error al usuario
    document.body.innerHTML = `
      <div style="display: flex; justify-content: center; align-items: center; height: 100vh; flex-direction: column; font-family: system-ui, -apple-system, sans-serif;">
        <h1 style="color: #ef4444; margin-bottom: 1rem;">Error al inicializar la aplicación</h1>
        <p style="color: #374151; text-align: center; max-width: 400px;">
          Hubo un problema al conectar con el servidor. Por favor, intenta lo siguiente:
          <br/><br/>
          1. Recarga la página
          <br/>
          2. Limpia la caché del navegador
          <br/>
          3. Si el problema persiste, contacta al soporte técnico
        </p>
        <button onclick="window.location.reload()" style="margin-top: 1rem; padding: 0.5rem 1rem; background-color: #ef4444; color: white; border: none; border-radius: 0.375rem; cursor: pointer;">
          Recargar página
        </button>
      </div>
    `;
  }
};

initializeApp();