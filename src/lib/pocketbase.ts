import { pb } from './pocketbase/client';
import { initializeDatabase } from './pocketbase/initialize';

// Exportamos el cliente de PocketBase
export { pb };

// Exportamos la función de inicialización
export { initializeDatabase };

// No inicializamos aquí para evitar inicializaciones duplicadas