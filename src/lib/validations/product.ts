import * as z from "zod";

export const productSchema = z.object({
  title: z
    .string()
    .min(1, "El título es obligatorio")
    .min(3, "El título debe tener al menos 3 caracteres")
    .max(100, "El título no puede exceder los 100 caracteres")
    .trim(),
  
  description: z
    .string()
    .max(500, "La descripción no puede exceder los 500 caracteres")
    .optional()
    .or(z.literal("")),
  
  price: z
    .number()
    .min(0.01, "El precio debe ser mayor a 0")
    .max(999999.99, "El precio máximo permitido es 999,999.99"),
  
  stock: z
    .number()
    .int("El stock debe ser un número entero")
    .min(0, "El stock debe ser mayor o igual a 0")
    .default(0),
  
  category_id: z
    .string()
    .min(1, "Debe seleccionar una categoría"),
  
  is_active: z
    .boolean()
    .default(true),
  
  gallery: z
    .array(z.string())
    .default([]),
  
  image_url: z
    .string()
    .optional()
    .or(z.literal("")),
  
  weight: z
    .string()
    .max(20, "El peso no puede exceder los 20 caracteres")
    .optional()
    .or(z.literal("")),
  
  short_description: z
    .string()
    .max(150, "La descripción corta no puede exceder los 150 caracteres")
    .optional()
    .or(z.literal("")),
  
  is_featured: z
    .boolean()
    .default(false),
});

export type ProductFormValues = z.infer<typeof productSchema>; 