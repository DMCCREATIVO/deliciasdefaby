import { pb } from '../pocketbase/client';

// Mapping function for blog posts
const mapPbToBlogPost = (record: any) => ({
    id: record.id,
    title: record.title,
    excerpt: record.excerpt || '',
    content: record.content || '',
    image_url: record.featured_image || null,
    created_at: record.created,
    updated_at: record.updated,
    slug: record.slug,
    is_published: record.is_published || false,
    featured: record.featured || false,
    author_id: record.author_id || null,
    published_at: record.published_at || null,
    tags: Array.isArray(record.tags) ? record.tags : [],
    status: record.is_published ? 'published' : 'draft',
});

export const pocketbaseBlogService = {
    async getAll(): Promise<any[]> {
        try {
            const records = await pb.collection('blog_posts').getFullList({
                sort: '-created',
                filter: 'is_published = true',
            });
            return records.map(mapPbToBlogPost);
        } catch (error: any) {
            console.error('Error fetching blog posts:', error);
            return [];
        }
    },

    async getAllAdmin(): Promise<any[]> {
        try {
            const records = await pb.collection('blog_posts').getFullList({
                sort: '-created',
            });
            return records.map(mapPbToBlogPost);
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
            const slug = data.title
                ?.toLowerCase()
                .replace(/[^a-z0-9\s-]/g, '')
                .replace(/\s+/g, '-')
                .substring(0, 60) + '-' + Date.now();

            // Si hay archivo de imagen, usar FormData
            let postData: any;
            if (data.image_url instanceof File) {
                postData = new FormData();
                postData.append('title', data.title || '');
                postData.append('slug', slug);
                postData.append('excerpt', data.excerpt || '');
                postData.append('content', data.content || '');
                postData.append('is_published', String(data.is_published || false));
                postData.append('featured', String(data.featured || false));
                postData.append('featured_image', data.image_url);
                if (data.tags) postData.append('tags', JSON.stringify(data.tags));
            } else {
                postData = {
                    title: data.title,
                    slug,
                    excerpt: data.excerpt || '',
                    content: data.content || '',
                    featured_image: data.image_url || '',
                    is_published: data.is_published || false,
                    featured: data.featured || false,
                    tags: data.tags || [],
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
            let postData: any;
            if (data.image_url instanceof File) {
                postData = new FormData();
                postData.append('title', data.title || '');
                postData.append('excerpt', data.excerpt || '');
                postData.append('content', data.content || '');
                postData.append('is_published', String(data.is_published || false));
                postData.append('featured', String(data.featured || false));
                postData.append('featured_image', data.image_url);
                if (data.tags) postData.append('tags', JSON.stringify(data.tags));
            } else {
                postData = {
                    title: data.title,
                    excerpt: data.excerpt || '',
                    content: data.content || '',
                    featured_image: data.image_url || '',
                    is_published: data.is_published || false,
                    featured: data.featured || false,
                    tags: data.tags || [],
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
