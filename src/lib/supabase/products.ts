import { supabase } from './client';
import type { Database } from '../database.types';
import { type ProductFormValues } from '@/lib/validations/product';
import { Category } from './categories';

export type Product = Database['public']['Tables']['products']['Row'];

export interface ProductWithCategory extends Product {
  category?: Category;
}

export type CreateProductData = Omit<ProductFormValues, 'id' | 'created_at' | 'updated_at'>;
export type UpdateProductData = Partial<CreateProductData>;

const STORAGE_BUCKET = 'products';

export const productService = {
  async getAll() {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        categories (
          id,
          name
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getById(id: string) {
    if (!id) throw new Error('ID es requerido');

    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        categories (
          id,
          name
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async create(productData: Partial<Product>) {
    const { data, error } = await supabase
      .from('products')
      .insert(productData)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, productData: Partial<Product>) {
    if (!id) throw new Error('ID es requerido');

    const { data, error } = await supabase
      .from('products')
      .update(productData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    if (!id) throw new Error('ID es requerido');

    // Soft delete: marcar como inactivo en lugar de eliminar
    // Esto preserva el historial de pedidos
    const { error } = await supabase
      .from('products')
      .update({ is_active: false })
      .eq('id', id);

    if (error) throw error;
  },

  async hardDelete(id: string) {
    if (!id) throw new Error('ID es requerido');

    // Verificar si hay pedidos asociados
    const { data: orderItems, error: checkError } = await supabase
      .from('order_items')
      .select('id')
      .eq('product_id', id)
      .limit(1);

    if (checkError) throw checkError;

    if (orderItems && orderItems.length > 0) {
      throw new Error('No se puede eliminar: el producto tiene pedidos asociados. Use la opción de desactivar.');
    }

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async uploadImage(file: File) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(fileName);

    return data.publicUrl;
  },

  async uploadImages(files: File[]) {
    const uploadPromises = files.map(file => this.uploadImage(file));
    return Promise.all(uploadPromises);
  },

  async deleteImage(imageUrl: string) {
    try {
      // Extraer el nombre del archivo de la URL de Supabase
      const urlParts = imageUrl.split('/');
      const fileName = urlParts[urlParts.length - 1].split('?')[0];
      
      if (!fileName) throw new Error('URL de imagen inválida');

      // Primero, actualizar cualquier producto que use esta imagen como principal
      const { error: updateError } = await supabase
        .from('products')
        .update({ image_url: null })
        .eq('image_url', imageUrl);

      if (updateError) {
        console.error('Error al actualizar referencias de imagen:', updateError);
      }

      // Luego, eliminar la imagen del storage
      const { error } = await supabase.storage
        .from(STORAGE_BUCKET)
        .remove([fileName]);

      if (error) {
        console.error('Error al eliminar imagen:', error);
        throw new Error('Error al eliminar la imagen');
      }
    } catch (error) {
      console.error('Error al eliminar imagen:', error);
      throw error;
    }
  }
}; 