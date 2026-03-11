import { supabase } from '@/lib/supabase'
import { Database } from '@/lib/database.types'
import { slugify } from '@/lib/utils'

type Category = Database['public']['Tables']['categories']['Row']
type CategoryInsert = Database['public']['Tables']['categories']['Insert']
type CategoryUpdate = Database['public']['Tables']['categories']['Update']

class CategoryError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'CategoryError'
  }
}

export class CategoryService {
  /**
   * Obtiene todas las categorías ordenadas por fecha de creación
   */
  async getAll() {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw new CategoryError(error.message)
      return data || []
    } catch (error) {
      console.error('Error al obtener las categorías:', error)
      throw error instanceof CategoryError
        ? error
        : new CategoryError('Error al obtener las categorías')
    }
  }

  /**
   * Obtiene una categoría por su ID
   */
  async getById(id: string) {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw new CategoryError(error.message)
      return data
    } catch (error) {
      console.error(`Error al obtener la categoría con ID ${id}:`, error)
      throw error instanceof CategoryError
        ? error
        : new CategoryError(`Error al obtener la categoría con ID ${id}`)
    }
  }

  /**
   * Crea una nueva categoría
   */
  async create(category: Omit<CategoryInsert, 'id' | 'created_at' | 'updated_at'>) {
    try {
      // Crear un slug a partir del nombre
      const slug = slugify(category.name)
      
      const { data, error } = await supabase
        .from('categories')
        .insert([{ ...category, slug }])
        .select()
        .single()

      if (error) throw new CategoryError(error.message)
      return data
    } catch (error) {
      console.error('Error al crear la categoría:', error)
      throw error instanceof CategoryError
        ? error
        : new CategoryError('Error al crear la categoría')
    }
  }

  /**
   * Actualiza una categoría existente
   */
  async update(id: string, category: Partial<CategoryUpdate>) {
    try {
      // Si se actualiza el nombre, actualizar también el slug
      const updates: Partial<CategoryUpdate> = { ...category }
      if (category.name) {
        updates.slug = slugify(category.name)
      }
      
      const { data, error } = await supabase
        .from('categories')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw new CategoryError(error.message)
      return data
    } catch (error) {
      console.error(`Error al actualizar la categoría con ID ${id}:`, error)
      throw error instanceof CategoryError
        ? error
        : new CategoryError(`Error al actualizar la categoría con ID ${id}`)
    }
  }

  /**
   * Elimina una categoría por su ID
   */
  async delete(id: string) {
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id)

      if (error) throw new CategoryError(error.message)
      return true
    } catch (error) {
      console.error(`Error al eliminar la categoría con ID ${id}:`, error)
      throw error instanceof CategoryError
        ? error
        : new CategoryError(`Error al eliminar la categoría con ID ${id}`)
    }
  }
}

export const categoryService = new CategoryService() 