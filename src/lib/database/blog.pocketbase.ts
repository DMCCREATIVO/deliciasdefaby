import { pb } from '../pocketbase/client';

let blogFieldCache: Set<string> | null = null;

const getBlogFieldSet = async (): Promise<Set<string>> => {
    if (blogFieldCache) return blogFieldCache;
    try {
        const col: any = await pb.collections.getOne('blog_posts');
        const fields: any[] = col?.fields || [];
        blogFieldCache = new Set(fields.map((f) => f.name));
        return blogFieldCache;
    } catch {
        // Fallback con aliases comunes
        blogFieldCache = new Set([
            'title',
            'slug',
            'excerpt',
            'content',
            'is_published',
            'published',
            'featured',
            'featured_image',
            'image_url',
            'image',
            'tags',
            'published_at',
            'author_id',
        ]);
        return blogFieldCache;
    }
};

const createSlug = (title: string) => {
    const base = String(title || 'post')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
        .slice(0, 60) || 'post';
    return `${base}-${Date.now()}`;
};

// Mapping function for blog posts (schema-flexible)
const mapPbToBlogPost = (record: any) => ({
    id: record.id,
    title: record.title,
    excerpt: record.excerpt || '',
    content: record.content || '',
    image_url: record.featured_image || record.image_url || record.image || null,
    created_at: record.created ?? record.created_at ?? record.createdAt ?? null,
    updated_at: record.updated ?? record.updated_at ?? record.updatedAt ?? null,
    slug: record.slug || createSlug(record.title || 'post'),
    is_published: Boolean(record.is_published ?? record.published ?? false),
    featured: record.featured || false,
    author_id: record.author_id || null,
    published_at: record.published_at || null,
    tags: Array.isArray(record.tags) ? record.tags : [],
    status: (record.is_published ?? record.published) ? 'published' : 'draft',
});

export const pocketbaseBlogService = {
    async getAll(): Promise<any[]> {
        try {
            // Obtener posts sin filtros complejos que causan errores
            const records = await pb.collection('blog_posts').getFullList();
            const mapped = records.map(mapPbToBlogPost);
            // Filtrar solo publicados en el cliente
            return mapped.filter((p) => p.is_published).sort((a, b) => {
                const dateA = new Date(a.created_at || 0).getTime();
                const dateB = new Date(b.created_at || 0).getTime();
                return dateB - dateA; // Orden descendente
            });
        } catch (error: any) {
            console.error('Error fetching blog posts:', error);
            return [];
        }
    },

    async getAllAdmin(): Promise<any[]> {
        try {
            // Admin: obtener todos y ordenar en cliente
            const records = await pb.collection('blog_posts').getFullList();
            return records.map(mapPbToBlogPost).sort((a, b) => {
                const dateA = new Date(a.created_at || 0).getTime();
                const dateB = new Date(b.created_at || 0).getTime();
                return dateB - dateA; // Orden descendente
            });
        } catch (error: any) {
            console.error('Error fetching admin blog posts:', error);
            return [];
        }
    },

    async getById(id: string): Promise<any | null> {
        try {
            const record = await pb.collection('blog_posts').getOne(id);
            return mapPbToBlogPost(record);
        } catch (error: any) {
            if (error.status === 404) return null;
            console.error('Error fetching blog post by id:', error);
            return null;
        }
    },

    async getBySlug(slug: string): Promise<any | null> {
        try {
            const record = await pb.collection('blog_posts').getFirstListItem(`slug="${slug}"`);
            return mapPbToBlogPost(record);
        } catch (error: any) {
            if (error.status === 404) return null;
            console.error('Error fetching blog post by slug:', error);
            return null;
        }
    },

    async create(data: any): Promise<any> {
        try {
            const fields = await getBlogFieldSet();
            const slug = createSlug(data.title || 'post');
            // Si el formulario no manda estado, publicar por defecto para que se refleje de inmediato.
            const isPublished = Boolean(data.is_published ?? data.published ?? true);

            // Si hay archivo de imagen, usar FormData
            let postData: any;
            if (data.image_url instanceof File) {
                postData = new FormData();
                postData.append('title', data.title || '');
                if (fields.has('slug')) postData.append('slug', slug);
                if (fields.has('excerpt')) postData.append('excerpt', data.excerpt || '');
                if (fields.has('content')) postData.append('content', data.content || '');
                if (fields.has('is_published')) postData.append('is_published', String(isPublished));
                if (fields.has('published')) postData.append('published', String(isPublished));
                if (fields.has('featured')) postData.append('featured', String(data.featured || false));
                if (fields.has('featured_image')) postData.append('featured_image', data.image_url);
                else if (fields.has('image_url')) postData.append('image_url', data.image_url.name || '');
                if (fields.has('tags') && data.tags) postData.append('tags', JSON.stringify(data.tags));
                if (fields.has('published_at') && isPublished) postData.append('published_at', new Date().toISOString());
            } else {
                postData = {
                    title: data.title,
                    ...(fields.has('slug') ? { slug } : {}),
                    ...(fields.has('excerpt') ? { excerpt: data.excerpt || '' } : {}),
                    ...(fields.has('content') ? { content: data.content || '' } : {}),
                    ...(fields.has('featured_image') ? { featured_image: data.image_url || '' } : {}),
                    ...(fields.has('image_url') ? { image_url: data.image_url || '' } : {}),
                    ...(fields.has('image') ? { image: data.image_url || '' } : {}),
                    ...(fields.has('is_published') ? { is_published: isPublished } : {}),
                    ...(fields.has('published') ? { published: isPublished } : {}),
                    ...(fields.has('featured') ? { featured: data.featured || false } : {}),
                    ...(fields.has('tags') ? { tags: data.tags || [] } : {}),
                    ...(fields.has('published_at') && isPublished ? { published_at: new Date().toISOString() } : {}),
                };
            }

            const record = await pb.collection('blog_posts').create(postData);
            return mapPbToBlogPost(record);
        } catch (error: any) {
            console.error('Error creating blog post:', error);
            throw new Error(error.message || 'Error al crear el post');
        }
    },

    async update(id: string, data: any): Promise<any> {
        try {
            const fields = await getBlogFieldSet();
            const isPublished = Boolean(data.is_published ?? data.published ?? false);
            let postData: any;
            if (data.image_url instanceof File) {
                postData = new FormData();
                postData.append('title', data.title || '');
                if (fields.has('excerpt')) postData.append('excerpt', data.excerpt || '');
                if (fields.has('content')) postData.append('content', data.content || '');
                if (fields.has('is_published')) postData.append('is_published', String(isPublished));
                if (fields.has('published')) postData.append('published', String(isPublished));
                if (fields.has('featured')) postData.append('featured', String(data.featured || false));
                if (fields.has('featured_image')) postData.append('featured_image', data.image_url);
                if (fields.has('tags') && data.tags) postData.append('tags', JSON.stringify(data.tags));
                if (fields.has('published_at') && isPublished) postData.append('published_at', new Date().toISOString());
            } else {
                postData = {
                    title: data.title,
                    ...(fields.has('excerpt') ? { excerpt: data.excerpt || '' } : {}),
                    ...(fields.has('content') ? { content: data.content || '' } : {}),
                    ...(fields.has('featured_image') ? { featured_image: data.image_url || '' } : {}),
                    ...(fields.has('image_url') ? { image_url: data.image_url || '' } : {}),
                    ...(fields.has('image') ? { image: data.image_url || '' } : {}),
                    ...(fields.has('is_published') ? { is_published: isPublished } : {}),
                    ...(fields.has('published') ? { published: isPublished } : {}),
                    ...(fields.has('featured') ? { featured: data.featured || false } : {}),
                    ...(fields.has('tags') ? { tags: data.tags || [] } : {}),
                    ...(fields.has('published_at') && isPublished ? { published_at: new Date().toISOString() } : {}),
                };
            }
            const record = await pb.collection('blog_posts').update(id, postData);
            return mapPbToBlogPost(record);
        } catch (error: any) {
            console.error('Error updating blog post:', error);
            throw new Error(error.message || 'Error al actualizar el post');
        }
    },

    async delete(id: string): Promise<void> {
        try {
            await pb.collection('blog_posts').delete(id);
        } catch (error: any) {
            console.error('Error deleting blog post:', error);
            throw new Error(error.message || 'Error al eliminar el post');
        }
    },

    async checkDatabaseStructure(): Promise<void> {
        return Promise.resolve();
    }
};
