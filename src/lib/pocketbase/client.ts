import PocketBase from 'pocketbase';

// Siempre usar la base de datos de producción
const baseUrl = 'https://bd.deliciasdefaby.cl';
export const pb = new PocketBase(baseUrl);
pb.autoCancellation(false);

console.log('🔌 PocketBase configurado para producción:', baseUrl);