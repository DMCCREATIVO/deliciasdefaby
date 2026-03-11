import { pb } from '../pocketbase/client';
import type { Product } from './types';
import { pocketbaseProductService } from './products.pocketbase';

export interface Favorite {
    id: string;
    user_id: string;
    product_id: string;
    product?: Product;
}

export const pocketbaseFavoriteService = {
    async getAll(userId: string): Promise<Favorite[]> {
        try {
            const records = await pb.collection('favorites').getFullList({
                filter: `user_id = "${userId}"`,
                expand: 'product_id',
                sort: '-created',
            });

            return records.map(record => ({
                id: record.id,
                user_id: record.user_id,
                product_id: record.product_id,
                // We could use the expanded data or fetch it separately
                product: record.expand?.product_id ? {
                    id: record.expand.product_id.id,
                    title: record.expand.product_id.title,
                    description: record.expand.product_id.description,
                    short_description: record.expand.product_id.short_description,
                    price: record.expand.product_id.price,
                    compare_at_price: record.expand.product_id.compare_at_price,
                    weight: record.expand.product_id.weight,
                    stock: record.expand.product_id.stock,
                    category_id: record.expand.product_id.category_id,
                    image_url: record.expand.product_id.featured_image ? pb.getFileUrl(record.expand.product_id, record.expand.product_id.featured_image) : null,
                    images: [],
                    is_active: record.expand.product_id.is_active,
                    is_featured: record.expand.product_id.is_featured,
                    slug: record.expand.product_id.slug,
                    available_days: record.expand.product_id.available_days,
                    created_at: record.expand.product_id.created,
                    updated_at: record.expand.product_id.updated,
                } : undefined,
            }));
        } catch (error: any) {
            console.error('Error fetching favorites:', error);
            return [];
        }
    },

    async toggle(userId: string, productId: string): Promise<boolean> {
        try {
            const existing = await pb.collection('favorites').getFirstListItem(`user_id = "${userId}" && product_id = "${productId}"`).catch(() => null);

            if (existing) {
                await pb.collection('favorites').delete(existing.id);
                return false; // Removed
            } else {
                await pb.collection('favorites').create({ user_id: userId, product_id: productId });
                return true; // Added
            }
        } catch (error: any) {
            console.error('Error toggling favorite:', error);
            return false;
        }
    },

    async remove(favoriteId: string): Promise<boolean> {
        try {
            await pb.collection('favorites').delete(favoriteId);
            return true;
        } catch (error: any) {
            console.error('Error removing favorite:', error);
            return false;
        }
    }
};
