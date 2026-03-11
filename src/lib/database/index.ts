/**
 * Capa de Abstracción de Base de Datos
 * 
 * Este módulo permite cambiar entre backends (Supabase/PocketBase)
 * mediante la variable de entorno VITE_BACKEND
 * 
 * Uso:
 *   VITE_BACKEND=pocketbase (default)
 *   VITE_BACKEND=supabase
 */

import { pocketbaseProductService } from './products.pocketbase';
import { pocketbaseCategoryService } from './categories.pocketbase';
import { pocketbaseAuthService } from './auth.pocketbase';
import { pocketbaseBlogService } from './blog.pocketbase';
import { pocketbaseOrderService } from './orders.pocketbase';
import { pocketbaseUserService } from './users.pocketbase';
import { pocketbaseSettingsService } from './settings.pocketbase';
import { pocketbaseFavoriteService } from './favorites.pocketbase';
import { pocketbaseScheduleService } from './schedules.pocketbase';
import { pocketbaseStatisticsService } from './statistics.pocketbase';
import { pocketbaseTestimonialService } from './testimonials.pocketbase';

// Re-export types
export * from './types';

// Detectar backend configurado
const BACKEND = import.meta.env.VITE_BACKEND || 'pocketbase';
console.log(`🔌 Database backend: ${BACKEND}`);

// Exportamos los servicios directamente (PocketBase por defecto durante la migración)
export const productService = pocketbaseProductService;
export const categoryService = pocketbaseCategoryService;
export const authService = pocketbaseAuthService;
export const blogService = pocketbaseBlogService;
export const orderService = pocketbaseOrderService;
export const userService = pocketbaseUserService;
export const settingsService = pocketbaseSettingsService;
export const favoriteService = pocketbaseFavoriteService;
export const scheduleService = pocketbaseScheduleService;
export const statisticsService = pocketbaseStatisticsService;
export const testimonialService = pocketbaseTestimonialService;

// Versión síncrona para uso directo
export const db = {
    products: pocketbaseProductService,
    categories: pocketbaseCategoryService,
    auth: pocketbaseAuthService,
    blog: pocketbaseBlogService,
    orders: pocketbaseOrderService,
    users: pocketbaseUserService,
    settings: pocketbaseSettingsService,
    favorites: pocketbaseFavoriteService,
    schedules: pocketbaseScheduleService,
    statistics: pocketbaseStatisticsService,
    testimonials: pocketbaseTestimonialService,
};

export default db;
