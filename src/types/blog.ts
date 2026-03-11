import type { Database } from '@/lib/database.types';

// Tipo base desde la base de datos
type BaseBlogPost = Database['public']['Tables']['blog_posts']['Row'];

// Tipo extendido con información adicional
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  image_url: string | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  author_id?: string | null;
  published_at?: string | null;
  tags?: string[] | null;
  featured?: boolean | null;
  
  // Campos opcionales para relaciones
  profiles?: {
    id: string;
    name: string;
    avatar_url: string | null;
  } | null;
  
  // Campos para cuando se usa author:profiles en la consulta
  author?: {
    id: string;
    name: string;
    avatar_url: string | null;
  } | null;
  
  // Campos enriquecidos
  readingTime?: number;
  formattedDate?: string;
}

// Tipo para crear un nuevo post
export type CreateBlogPostData = {
  title: string;
  content: string;
  excerpt?: string;
  image_url?: string | File;
  is_published?: boolean;
  featured?: boolean;
  tags?: string[];
  slug?: string;
};

// Tipo para actualizar un post existente
export type UpdateBlogPostData = Partial<CreateBlogPostData>;

// Estados de publicación
export const BLOG_POST_STATUS = {
  DRAFT: false,
  PUBLISHED: true,
} as const;

// Tipo para los filtros de búsqueda
export interface BlogPostFilters {
  isPublished?: boolean;
  searchTerm?: string;
  tag?: string;
  featured?: boolean;
  author?: string;
}

// Tipo para la respuesta paginada
export interface PaginatedBlogPosts {
  posts: BlogPost[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface BlogPostFormValues {
  title: string;
  content: string;
  excerpt?: string;
  image_url?: string;
  is_published?: boolean;
  featured?: boolean;
  tags?: string[];
} 