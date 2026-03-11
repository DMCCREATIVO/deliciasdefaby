import * as z from "zod";

export const orderItemSchema = z.object({
  product_id: z
    .string()
    .uuid("ID de producto inválido"),
  
  quantity: z
    .number()
    .int("La cantidad debe ser un número entero")
    .min(1, "La cantidad mínima es 1")
    .max(100, "La cantidad máxima es 100"),
  
  unit_price: z
    .number()
    .min(0, "El precio unitario debe ser mayor o igual a 0"),
  
  subtotal: z
    .number()
    .min(0, "El subtotal debe ser mayor o igual a 0"),
  
  notes: z
    .string()
    .max(500, "Las notas no pueden exceder los 500 caracteres")
    .nullable()
});

export const orderSchema = z.object({
  user_id: z
    .string()
    .uuid("ID de usuario inválido"),
  
  status: z
    .enum([
      'pendiente',
      'confirmado',
      'en_preparacion',
      'listo_para_entrega',
      'entregado',
      'cancelado'
    ], {
      required_error: "El estado es requerido",
      invalid_type_error: "Estado inválido"
    })
    .default('pendiente'),
  
  total_amount: z
    .number()
    .min(0, "El total debe ser mayor o igual a 0"),
  
  shipping_address: z
    .string()
    .min(10, "La dirección debe tener al menos 10 caracteres")
    .max(500, "La dirección no puede exceder los 500 caracteres"),
  
  contact_phone: z
    .string()
    .min(7, "El teléfono debe tener al menos 7 dígitos")
    .max(20, "El teléfono no puede exceder los 20 caracteres")
    .regex(/^[+]?[\d\s-()]+$/, "Número de teléfono inválido"),
  
  contact_email: z
    .string()
    .email("Email inválido")
    .max(255, "El email no puede exceder los 255 caracteres"),
  
  contact_name: z
    .string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(255, "El nombre no puede exceder los 255 caracteres"),
  
  delivery_date: z
    .string()
    .datetime("Fecha de entrega inválida")
    .nullable(),
  
  notes: z
    .string()
    .max(1000, "Las notas no pueden exceder los 1000 caracteres")
    .nullable(),
  
  items: z
    .array(orderItemSchema)
    .min(1, "El pedido debe tener al menos un producto")
    .max(50, "El pedido no puede exceder los 50 productos")
});

export type OrderFormValues = z.infer<typeof orderSchema>;
export type OrderItemFormValues = z.infer<typeof orderItemSchema>; 