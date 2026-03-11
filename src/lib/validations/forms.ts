import { z } from "zod";

export const productSchema = z.object({
  title: z.string().min(3, "El título debe tener al menos 3 caracteres"),
  description: z.string().min(10, "La descripción debe tener al menos 10 caracteres"),
  price: z.number().min(0, "El precio no puede ser negativo"),
  weight: z.string().min(1, "El peso es requerido"),
  category: z.string().min(1, "La categoría es requerida"),
  stock: z.number().min(0, "El stock no puede ser negativo"),
  imageUrl: z.string().url("La URL de la imagen no es válida"),
  isActive: z.boolean(),
  availableDays: z.array(z.string())
});

export const customerInfoSchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  email: z.string().email("El email no es válido"),
  phone: z.string().min(8, "El teléfono debe tener al menos 8 caracteres"),
  address: z.string().min(10, "La dirección debe tener al menos 10 caracteres")
});

export const loginSchema = z.object({
  email: z.string().email("El email no es válido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres")
});

export const registerSchema = loginSchema.extend({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  phone: z.string().min(8, "El teléfono debe tener al menos 8 caracteres")
});