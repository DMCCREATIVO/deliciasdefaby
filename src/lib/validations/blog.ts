import * as z from 'zod';

// Esquema para la imagen
const imageSchema = z.union([
  z.string().url(),
  z.instanceof(File).refine(
    (file) => {
      const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
      return validTypes.includes(file.type);
    },
    {
      message: 'El archivo debe ser una imagen (JPEG, PNG, WEBP o GIF)',
    }
  ).refine(
    (file) => file.size <= 5 * 1024 * 1024,
    {
      message: 'La imagen no debe superar los 5MB',
    }
  )
]);

// Esquema para crear/editar un post
export const blogPostSchema = z.object({
  title: z.string()
    .min(3, 'El título debe tener al menos 3 caracteres')
    .max(100, 'El título no debe superar los 100 caracteres'),
  
  content: z.string()
    .min(10, 'El contenido debe tener al menos 10 caracteres'),
  
  excerpt: z.string()
    .max(300, 'El extracto no debe superar los 300 caracteres')
    .optional(),
  
  image_url: imageSchema.optional(),
  
  tags: z.array(z.string())
    .min(1, 'Debes seleccionar al menos una etiqueta')
    .max(5, 'No puedes seleccionar más de 5 etiquetas'),
  
  is_published: z.boolean().default(false),
  
  featured: z.boolean().default(false)
});

// Esquema para filtros de búsqueda
export const blogFilterSchema = z.object({
  searchTerm: z.string().optional(),
  tag: z.string().optional(),
  author: z.string().optional(),
  isPublished: z.boolean().optional(),
  featured: z.boolean().optional()
});

// Tipos inferidos
export type BlogPostFormValues = z.infer<typeof blogPostSchema>;
export type BlogFilterValues = z.infer<typeof blogFilterSchema>; 