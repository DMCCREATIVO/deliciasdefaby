import { pb } from '../pocketbase/client';
import type { Product, ProductService } from './types';

// Mapear campos de PocketBase (products) a nuestra estructura de Product
const mapPocketbaseToProduct = (record: any): Product => ({
    id: record.id,
    title: record.title,
    description: record.description || null,
    short_description: record.short_description || null,
    price: record.price || 0,
    compare_at_price: record.compare_at_price || null,
    weight: record.weight || null,
    stock: record.stock ?? 0,
    category_id: record.category_id || null,
    // Prioridad: image_url texto > primer archivo en images
    image_url: record.image_url ||
        (record.images && record.images.length > 0
            ? pb.files.getURL(record, Array.isArray(record.images) ? record.images[0] : record.images)
            : null),
    // Galería: todos los archivos images como URLs
    images: record.images
        ? (Array.isArray(record.images)
            ? record.images.map((img: string) => pb.files.getURL(record, img))
            : [pb.files.getURL(record, record.images)])
        : [],
    is_active: record.is_active ?? true,
    is_featured: record.is_featured ?? false,
    slug: record.slug || '',
    available_days: record.available_days || null,
    created_at: record.created,
    updated_at: record.updated,
    categories: record.expand?.category_id ? {
        id: record.expand.category_id.id,
        name: record.expand.category_id.name,
        description: record.expand.category_id.description,
        image: record.expand.category_id.image,
        is_active: record.expand.category_id.is_active,
        sort_order: record.expand.category_id.sort_order || 0,
        slug: record.expand.category_id.slug || '',
        created_at: record.expand.category_id.created,
        updated_at: record.expand.category_id.updated,
    } : undefined,
});

// Construir FormData o plain object según si hay archivos
const buildProductPayload = (productData: any): FormData | Record<string, any> => {
    const hasFiles = productData._imageFile instanceof File ||
        (Array.isArray(productData._galleryFiles) && productData._galleryFiles.length > 0);

    if (hasFiles) {
        const fd = new FormData();
        if (productData.title !== undefined) fd.append('title', productData.title || '');
        if (productData.description !== undefined) fd.append('description', productData.description || '');
        if (productData.short_description !== undefined) fd.append('short_description', productData.short_description || '');
        if (productData.price !== undefined) fd.append('price', String(productData.price || 0));
        if (productData.stock !== undefined) fd.append('stock', String(productData.stock || 0));
        if (productData.weight !== undefined) fd.append('weight', productData.weight || '');
        if (productData.slug !== undefined) fd.append('slug', productData.slug || '');
        if (productData.category_id !== undefined) fd.append('category_id', productData.category_id || '');
        if (productData.is_active !== undefined) fd.append('is_active', String(productData.is_active ?? true));
        if (productData.is_featured !== undefined) fd.append('is_featured', String(productData.is_featured ?? false));
        if (productData.image_url !== undefined) fd.append('image_url', productData.image_url || '');

        // Imagen principal como archivo
        if (productData._imageFile instanceof File) {
            fd.append('images', productData._imageFile);
        }
        // Galería adicional
        if (Array.isArray(productData._galleryFiles)) {
            for (const file of productData._galleryFiles) {
                if (file instanceof File) fd.append('images', file);
            }
        }
        return fd;
    }

    // Plain object sin archivos
    return {
        title: productData.title,
        description: productData.description,
        short_description: productData.short_description,
        price: productData.price,
        compare_at_price: productData.compare_at_price,
        weight: productData.weight,
        stock: productData.stock,
        slug: productData.slug,
        category_id: productData.category_id,
        is_active: productData.is_active,
        is_featured: productData.is_featured,
        available_days: productData.available_days,
        image_url: productData.image_url || '',
    };
};

export const pocketbaseProductService: ProductService = {
    async getAll(): Promise<Product[]> {
        try {
            const records = await pb.collection('products').getFullList({
                sort: 'title',
                filter: 'is_active = true',
                expand: 'category_id',
            });
            return records.map(mapPocketbaseToProduct);
        } catch (error: any) {
            console.error('Error fetching products:', error);
            throw new Error(error.message || 'Error al obtener productos');
        }
    },

    async getAllAdmin(): Promise<Product[]> {
        try {
            const records = await pb.collection('products').getFullList({
                sort: 'title',
                expand: 'category_id',
            });
            return records.map(mapPocketbaseToProduct);
        } catch (error: any) {
            console.error('Error fetching all products (admin):', error);
            throw new Error(error.message || 'Error al obtener productos');
        }
    },

    async getById(id: string): Promise<Product | null> {
        if (!id) throw new Error('ID es requerido');
        try {
            const record = await pb.collection('products').getOne(id, { expand: 'category_id' });
            return mapPocketbaseToProduct(record);
        } catch (error: any) {
            if (error.status === 404) return null;
            throw new Error(error.message || 'Error al obtener producto');
        }
    },

    async create(productData: any): Promise<Product> {
        try {
            const payload = buildProductPayload(productData);
            const record = await pb.collection('products').create(payload);
            return mapPocketbaseToProduct(record);
        } catch (error: any) {
            console.error('Error creating product:', error);
            throw new Error(error.message || 'Error al crear producto');
        }
    },

    async update(id: string, productData: any): Promise<Product> {
        if (!id) throw new Error('ID es requerido');
        try {
            const payload = buildProductPayload(productData);
            const record = await pb.collection('products').update(id, payload);
            return mapPocketbaseToProduct(record);
        } catch (error: any) {
            console.error('Error updating product:', error);
            throw new Error(error.message || 'Error al actualizar producto');
        }
    },

    async delete(id: string): Promise<void> {
        if (!id) throw new Error('ID es requerido');
        try {
            await pb.collection('products').update(id, { is_active: false });
        } catch (error: any) {
            throw new Error(error.message || 'Error al desactivar producto');
        }
    },

    async hardDelete(id: string): Promise<void> {
        if (!id) throw new Error('ID es requerido');
        try {
            const orderItems = await pb.collection('order_items').getList(1, 1, {
                filter: `product_id = "${id}"`,
            });
            if (orderItems.totalItems > 0) {
                throw new Error('No se puede eliminar: el producto tiene pedidos asociados.');
            }
            await pb.collection('products').delete(id);
        } catch (error: any) {
            throw new Error(error.message || 'Error al eliminar producto');
        }
    },

    async uploadImage(file: File): Promise<string> {
        // Método legacy — ya no crea registros temporales
        // La imagen se sube directamente en create/update
        return URL.createObjectURL(file);
    },
};
