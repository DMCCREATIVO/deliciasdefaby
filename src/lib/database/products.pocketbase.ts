import { pb } from '../pocketbase/client';
import { authenticateAsAdmin } from '../pocketbase/configurable-admin-auth';
import type { Product, ProductService } from './types';
import { mapPocketbaseToCategory } from './categories.pocketbase';

let categoryRelationFieldsCache: string[] | null = null;
let didLogCategoryRelationFields = false;

const getCategoryRelationFields = async (): Promise<string[]> => {
    if (categoryRelationFieldsCache) return categoryRelationFieldsCache;
    try {
        // En admin, el usuario suele estar autenticado y podremos leer el schema.
        const productsCol: any = await pb.collections.getOne('products');
        const fields: any[] = productsCol?.fields || [];

        const relationFields = fields
            .filter((f) => f?.type === 'relation')
            .filter((f) => {
                const collectionId = f?.options?.collectionId ?? f?.options?.collection;
                return collectionId === 'categories';
            })
            .map((f) => f.name)
            .filter(Boolean);

        // Fallback por si no detecta nada (schema viejo/local)
        const fallback = ['category_id', 'category', 'categoryId'];
        categoryRelationFieldsCache = relationFields.length > 0 ? relationFields : fallback;
        if (import.meta.env.DEV && !didLogCategoryRelationFields) {
            didLogCategoryRelationFields = true;
            console.log('🧩 Detected category relation fields:', categoryRelationFieldsCache);
        }
        return categoryRelationFieldsCache;
    } catch {
        const fallback = ['category_id', 'category', 'categoryId'];
        categoryRelationFieldsCache = fallback;
        return fallback;
    }
};

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
    // Compatibilidad: tomamos la relación desde:
    // - campo directo (category_id/category/categoryId)
    // - o desde record.expand[*] (si PB solo trae expand).
    category_id: (() => {
        const direct = record.category_id ?? record.category ?? record.categoryId ?? null;
        if (direct) {
            if (Array.isArray(direct)) return (direct[0] ?? null) as string | null;
            return direct as string | null;
        }

        const expandObj = record?.expand || {};
        const expandKeys = Object.keys(expandObj);
        for (const k of expandKeys) {
            const expanded = expandObj[k];
            if (!expanded) continue;
            const v = Array.isArray(expanded) ? expanded[0] : expanded;
            if (v?.id) return v.id as string;
        }
        return null;
    })(),
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
    categories: (() => {
        const expandObj = record?.expand || {};
        const expandKeys = Object.keys(expandObj);
        for (const k of expandKeys) {
            let expanded = expandObj[k];
            if (!expanded) continue;
            if (Array.isArray(expanded)) expanded = expanded[0];
            if (!expanded?.id || expanded.name === undefined) continue;

            // Compatibilidad: boolean y sort_order pueden variar nombres en esquemas viejos
            const isActive = expanded.is_active ?? expanded.isActive ?? true;
            const sortOrder = expanded.sort_order ?? expanded.sortOrder ?? 0;
            return {
                id: expanded.id,
                name: expanded.name,
                description: expanded.description ?? null,
                image: expanded.image ?? null,
                is_active: isActive,
                sort_order: sortOrder,
                slug: expanded.slug || '',
                created_at: expanded.created,
                updated_at: expanded.updated,
            };
        }
        return undefined;
    })(),
});

// Construir FormData o plain object según si hay archivos
const buildProductPayload = (
    productData: any,
    categoryField: "category_id" | "category"
): FormData | Record<string, any> => {
    const raw = productData.category_id ?? productData.category;
    const categoryValue = (Array.isArray(raw) ? raw[0] : raw) || '';
    const hasFiles = productData._imageFile instanceof File ||
        (Array.isArray(productData._galleryFiles) && productData._galleryFiles.length > 0);

    if (hasFiles) {
        const fd = new FormData();
        if (productData.title !== undefined) fd.append('title', productData.title || '');
        if (productData.description !== undefined) fd.append('description', productData.description || '');
        if (productData.short_description !== undefined) fd.append('short_description', productData.short_description || '');
        if (productData.price !== undefined) fd.append('price', String(productData.price || 0));
        if (productData.stock !== undefined) fd.append('stock', String(productData.stock || 0));
        if (productData.weight !== undefined && productData.weight !== '' && productData.weight != null) {
            const w = Number(productData.weight);
            if (!Number.isNaN(w)) fd.append('weight', String(w));
        }
        fd.append(categoryField, categoryValue);
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

    const plain: Record<string, unknown> = {
        title: productData.title,
        description: productData.description,
        short_description: productData.short_description,
        price: productData.price,
        compare_at_price: productData.compare_at_price,
        stock: productData.stock,
        [categoryField]: categoryValue,
        is_active: productData.is_active,
        is_featured: productData.is_featured,
        available_days: productData.available_days,
        image_url: clientImageUrl(productData.image_url),
    };
    if (productData.weight !== undefined && productData.weight !== '' && productData.weight != null) {
        const w = Number(productData.weight);
        if (!Number.isNaN(w)) plain.weight = w;
    }
    return plain as Record<string, any>;
};

function clientImageUrl(url: string | undefined | null): string {
    if (url === undefined || url === null) return '';
    return String(url);
}

const buildProductPayloadWithBothCategories = (
    productData: any,
    relationFields: string[]
): FormData | Record<string, any> => {
    const raw = productData.category_id ?? productData.category;
    const categoryValue = (Array.isArray(raw) ? raw[0] : raw) || '';
    const hasFiles = productData._imageFile instanceof File ||
        (Array.isArray(productData._galleryFiles) && productData._galleryFiles.length > 0);

    if (hasFiles) {
        const fd = new FormData();
        if (productData.title !== undefined) fd.append('title', productData.title || '');
        if (productData.description !== undefined) fd.append('description', productData.description || '');
        if (productData.short_description !== undefined) fd.append('short_description', productData.short_description || '');
        if (productData.price !== undefined) fd.append('price', String(productData.price || 0));
        if (productData.stock !== undefined) fd.append('stock', String(productData.stock || 0));
        if (productData.weight !== undefined && productData.weight !== '' && productData.weight != null) {
            const w = Number(productData.weight);
            if (!Number.isNaN(w)) fd.append('weight', String(w));
        }

        // Mandamos todos los campos de relación detectados
        // (y además los nombres comunes) para cubrir esquemas distintos.
        const payloadRelationFields = Array.from(new Set([...relationFields, 'category_id', 'category', 'categoryId']));
        for (const field of payloadRelationFields) {
            if (field) fd.append(field, categoryValue);
        }

        if (productData.is_active !== undefined) fd.append('is_active', String(productData.is_active ?? true));
        if (productData.is_featured !== undefined) fd.append('is_featured', String(productData.is_featured ?? false));
        if (productData.image_url !== undefined) fd.append('image_url', productData.image_url || '');

        if (productData._imageFile instanceof File) fd.append('images', productData._imageFile);
        if (Array.isArray(productData._galleryFiles)) {
            for (const file of productData._galleryFiles) {
                if (file instanceof File) fd.append('images', file);
            }
        }
        return fd;
    }

    const payloadRelationFields = Array.from(new Set([...relationFields, 'category_id', 'category', 'categoryId']));
    const plain: Record<string, unknown> = {
        title: productData.title,
        description: productData.description,
        short_description: productData.short_description,
        price: productData.price,
        compare_at_price: productData.compare_at_price,
        stock: productData.stock,
        category_id: categoryValue,
        category: categoryValue,
        is_active: productData.is_active,
        is_featured: productData.is_featured,
        available_days: productData.available_days,
        image_url: clientImageUrl(productData.image_url),
    };

    for (const field of payloadRelationFields) {
        if (field) plain[field] = categoryValue;
    }

    if (productData.weight !== undefined && productData.weight !== '' && productData.weight != null) {
        const w = Number(productData.weight);
        if (!Number.isNaN(w)) plain.weight = w;
    }

    return plain as Record<string, any>;
};

export const pocketbaseProductService: ProductService = {
    async getAll(): Promise<Product[]> {
        try {
            const categoryRecords = await pb.collection('categories').getFullList({ sort: 'name' });
            const relationFields = await getCategoryRelationFields();

            // listRule filtra visibilidad pública. Para que la categoría aparezca,
            // intentamos expandir por ambas posibles nomenclaturas.
            let records: any[] = [];
            try {
                records = await pb.collection('products').getFullList({
                    sort: 'title',
                    expand: relationFields.join(','),
                });
            } catch {
                try {
                    records = await pb.collection('products').getFullList({ sort: 'title', expand: relationFields[0] });
                } catch {
                    try {
                        records = await pb.collection('products').getFullList({ sort: 'title', expand: 'category' });
                    } catch {
                        records = await pb.collection('products').getFullList({ sort: 'title' });
                    }
                }
            }
            const catById = new Map(categoryRecords.map((c) => [c.id, mapPocketbaseToCategory(c)]));
            return records.map((r) => {
                const p = mapPocketbaseToProduct(r);
                const cid = (() => {
                    if (p.categories?.id) return p.categories.id;
                    for (const field of relationFields) {
                        const cidRaw = r[field];
                        const candidate = Array.isArray(cidRaw) ? (cidRaw[0] as string | undefined) : (cidRaw as string | undefined);
                        if (candidate) return candidate;
                    }
                    return undefined;
                })();
                if (cid && catById.has(cid)) {
                    return { ...p, categories: catById.get(cid)! };
                }
                return p;
            });
        } catch (error: any) {
            console.error('Error fetching products:', error);
            return [];
        }
    },

    async getAllAdmin(): Promise<Product[]> {
        try {
            // Cargamos categorías aparte y hacemos join por id. Para evitar problemas con
            // el nombre real del campo en PocketBase, intentamos expandir por ambas nominaciones.
            const categoryRecords = await pb.collection('categories').getFullList({ sort: 'name' });
            const relationFields = await getCategoryRelationFields();

            let records: any[] = [];
            try {
                records = await pb.collection('products').getFullList({
                    sort: 'title',
                    expand: relationFields.join(','),
                });
            } catch {
                try {
                    records = await pb.collection('products').getFullList({ sort: 'title', expand: relationFields[0] });
                } catch {
                    try {
                        records = await pb.collection('products').getFullList({ sort: 'title', expand: 'category' });
                    } catch {
                        records = await pb.collection('products').getFullList({ sort: 'title' });
                    }
                }
            }

            const catById = new Map(categoryRecords.map((c) => [c.id, mapPocketbaseToCategory(c)]));

            return records.map((r: any) => {
                const p = mapPocketbaseToProduct(r);

                // Si el expand falló, categorías quedará undefined: resolvemos con join.
                if (!p.categories) {
                    const cid = (() => {
                        for (const field of relationFields) {
                            const cidRaw = r[field];
                            const candidate = Array.isArray(cidRaw) ? (cidRaw[0] as string | undefined) : (cidRaw as string | undefined);
                            if (candidate) return candidate;
                        }
                        return undefined;
                    })();
                    if (cid && catById.has(cid)) {
                        return { ...p, categories: catById.get(cid)! };
                    }
                }

                return p;
            });
        } catch (error: any) {
            console.error('Error fetching all products (admin):', error);
            throw new Error(error.message || 'Error al obtener productos');
        }
    },

    async getById(id: string): Promise<Product | null> {
        if (!id) throw new Error('ID es requerido');
        try {
            const categoryRecords = await pb.collection('categories').getFullList({ sort: 'name' });
            const relationFields = await getCategoryRelationFields();

            let record: any = null;
            try {
                record = await pb.collection('products').getOne(id, { expand: relationFields.join(',') });
            } catch {
                try {
                    record = await pb.collection('products').getOne(id, { expand: relationFields[0] });
                } catch {
                    try {
                        record = await pb.collection('products').getOne(id, { expand: 'category' });
                    } catch {
                        record = await pb.collection('products').getOne(id);
                    }
                }
            }
            const catById = new Map(categoryRecords.map((c) => [c.id, mapPocketbaseToCategory(c)]));

            const p = mapPocketbaseToProduct(record);
            if (p.categories) return p;

            const cid = (() => {
                for (const field of relationFields) {
                    const cidRaw = record[field];
                    const candidate = Array.isArray(cidRaw) ? (cidRaw[0] as string | undefined) : (cidRaw as string | undefined);
                    if (candidate) return candidate;
                }
                return undefined;
            })();
            if (cid && catById.has(cid)) {
                return { ...p, categories: catById.get(cid)! };
            }

            return p;
        } catch (error: any) {
            if (error.status === 404) return null;
            throw new Error(error.message || 'Error al obtener producto');
        }
    },

    async create(productData: any): Promise<Product> {
        try {
            // Autenticar como administrador para crear productos
            await authenticateAsAdmin();
            
            try {
                const relationFields = await getCategoryRelationFields();
                const payload = buildProductPayloadWithBothCategories(productData, relationFields);
                const record = await pb.collection('products').create(payload);
                return mapPocketbaseToProduct(record);
            } catch (error: any) {
                // Fallback si falla con ambos: intenta uno por uno
                const payloadA = buildProductPayload(productData, 'category_id');
                try {
                    const recordA = await pb.collection('products').create(payloadA);
                    return mapPocketbaseToProduct(recordA);
                } catch (errorA: any) {
                    const payloadB = buildProductPayload(productData, 'category');
                    const recordB = await pb.collection('products').create(payloadB);
                    return mapPocketbaseToProduct(recordB);
                }
            }
        } catch (error: any) {
            console.error('Error creating product:', error);
            throw new Error(error.message || 'Error al crear producto');
        }
    },

    async update(id: string, productData: any): Promise<Product> {
        if (!id) throw new Error('ID es requerido');
        try {
            try {
                const relationFields = await getCategoryRelationFields();
                const payload = buildProductPayloadWithBothCategories(productData, relationFields);
                const record = await pb.collection('products').update(id, payload);
                return mapPocketbaseToProduct(record);
            } catch (error: any) {
                // Fallback si falla con ambos: intenta uno por uno
                const payloadA = buildProductPayload(productData, 'category_id');
                try {
                    const recordA = await pb.collection('products').update(id, payloadA);
                    return mapPocketbaseToProduct(recordA);
                } catch (errorA: any) {
                    const payloadB = buildProductPayload(productData, 'category');
                    const recordB = await pb.collection('products').update(id, payloadB);
                    return mapPocketbaseToProduct(recordB);
                }
            }
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
            // Autenticar como administrador para eliminar productos
            await authenticateAsAdmin();
            
            // Verificar si el producto existe antes de intentar eliminar
            try {
                const product = await pb.collection('products').getOne(id);
                console.log(`📦 Producto encontrado: ${product.title} (${product.id})`);
            } catch (getError) {
                if (getError.status === 404) {
                    console.log(`ℹ️ Producto ${id} ya no existe en la base de datos`);
                    return;
                }
                throw getError;
            }
            
            // Verificar si hay pedidos asociados
            const orderItems = await pb.collection('order_items').getList(1, 1, {
                filter: `product_id = "${id}"`,
            });
            if (orderItems.totalItems > 0) {
                throw new Error('No se puede eliminar: el producto tiene pedidos asociados.');
            }
            
            // Eliminar el producto
            await pb.collection('products').delete(id);
            console.log(`✅ Producto ${id} eliminado exitosamente`);
            
        } catch (error: any) {
            // Si el producto ya no existe, considerarlo eliminado exitosamente
            if (error.status === 404 || error.message?.includes("wasn't found") || error.message?.includes("not found")) {
                console.log(`ℹ️ Producto ${id} ya no existe en la base de datos`);
                return;
            }
            console.error('Error en hardDelete:', error);
            throw new Error(error.message || 'Error al eliminar producto');
        }
    },

    async uploadImage(file: File): Promise<string> {
        // Método legacy — ya no crea registros temporales
        // La imagen se sube directamente en create/update
        return URL.createObjectURL(file);
    },
};
