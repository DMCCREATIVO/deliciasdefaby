import { pb } from '../pocketbase/client';
import type { Category, CategoryService } from './types';

export const mapPocketbaseToCategory = (record: any): Category => ({
    id: record.id,
    name: record.name,
    description: record.description || null,
    image: record.image ? pb.files.getURL(record, record.image) : null,
    is_active: record.is_active ?? true,
    sort_order: record.sort_order || 0,
    slug: record.slug || '',
    created_at: record.created,
    updated_at: record.updated,
});

export const pocketbaseCategoryService: CategoryService = {
    async getAll(): Promise<Category[]> {
        try {
            const records = await pb.collection('categories').getFullList({
                sort: 'name',
                // Ocultar categorías desactivadas (p. ej. tras "eliminar" = soft delete)
                filter: 'is_active = true || is_active = null',
            });
            return records.map(mapPocketbaseToCategory);
        } catch (error: any) {
            console.error('Error fetching categories:', error);
            throw new Error(error.message || 'Error al obtener categorías');
        }
    },

    async getById(id: string): Promise<Category | null> {
        if (!id) throw new Error('ID es requerido');

        try {
            const record = await pb.collection('categories').getOne(id);
            return mapPocketbaseToCategory(record);
        } catch (error: any) {
            if (error.status === 404) return null;
            throw new Error(error.message || 'Error al obtener categoría');
        }
    },

    async create(categoryData: Partial<Category>): Promise<Category> {
        try {
            const payload: Record<string, unknown> = {
                name: categoryData.name,
                description: categoryData.description ?? '',
                is_active: categoryData.is_active ?? true,
                sort_order: categoryData.sort_order ?? 0,
            };
            if (categoryData.slug !== undefined && categoryData.slug !== '') {
                payload.slug = categoryData.slug;
            }
            const record = await pb.collection('categories').create(payload);
            return mapPocketbaseToCategory(record);
        } catch (error: any) {
            console.error('Error creating category:', error);
            throw new Error(error.message || 'Error al crear categoría');
        }
    },

    async update(id: string, categoryData: Partial<Category>): Promise<Category> {
        if (!id) throw new Error('ID es requerido');

        try {
            const payload: Record<string, unknown> = {};
            if (categoryData.name !== undefined) payload.name = categoryData.name;
            if (categoryData.description !== undefined) payload.description = categoryData.description;
            if (categoryData.slug !== undefined) payload.slug = categoryData.slug;
            if (categoryData.is_active !== undefined) payload.is_active = categoryData.is_active;
            if (categoryData.sort_order !== undefined) payload.sort_order = categoryData.sort_order;

            const record = await pb.collection('categories').update(id, payload);
            return mapPocketbaseToCategory(record);
        } catch (error: any) {
            console.error('Error updating category:', error);
            throw new Error(error.message || 'Error al actualizar categoría');
        }
    },

    async delete(id: string): Promise<void> {
        if (!id) throw new Error('ID es requerido');

        try {
            await pb.collection('categories').update(id, {
                is_active: false,
            });
        } catch (error: any) {
            console.error('Error deleting category:', error);
            throw new Error(error.message || 'Error al eliminar categoría');
        }
    },
};
