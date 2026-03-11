'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { pocketbaseBlogService as blogService } from '@/lib/database/blog.pocketbase';
import { Spinner } from '@/components/ui/spinner';

interface BlogFormProps {
  postId?: string;
}

interface FormData {
  title: string;
  excerpt: string;
  content: string;
  image_url: string;
  is_published: boolean;
  featured: boolean;
  tags: string;
}

const BlogForm: React.FC<BlogFormProps> = ({ postId }) => {
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    excerpt: '',
    content: '',
    image_url: '',
    is_published: false,
    featured: false,
    tags: ''
  });

  // Cargar post si es edición
  useEffect(() => {
    if (!postId) return;

    const loadPost = async () => {
      try {
        setLoading(true);
        const post = await blogService.getById(postId);

        if (post) {
          setFormData({
            title: post.title || '',
            excerpt: post.excerpt || '',
            content: post.content || '',
            image_url: post.image_url || '',
            is_published: post.is_published || false,
            featured: post.featured || false,
            tags: Array.isArray(post.tags) ? post.tags.join(', ') : ''
          });
        }
      } catch (error) {
        console.error('Error cargando post:', error);
        alert('Error al cargar el post');
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [postId]);

  // Manejar cambios en el formulario
  const handleChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  }, []);

  // Enviar formulario
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.content.trim()) {
      alert('El título y contenido son obligatorios');
      return;
    }

    setSubmitting(true);

    try {
      const tags = formData.tags
        .split(',')
        .map(t => t.trim())
        .filter(Boolean);

      const postData = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        excerpt: formData.excerpt.trim() || formData.content.substring(0, 150) + '...',
        image_url: formData.image_url.trim() || undefined,
        is_published: formData.is_published,
        featured: formData.featured,
        tags,
      };

      if (postId) {
        await blogService.update(postId, postData);
        alert('Post actualizado correctamente');
      } else {
        await blogService.create(postData);
        alert('Post creado correctamente');
      }

      navigate('/admin/blog');
    } catch (error) {
      console.error('Error guardando post:', error);
      alert('Error al guardar el post');
    } finally {
      setSubmitting(false);
    }
  }, [formData, postId, navigate]);

  // Loading states
  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Spinner className="w-8 h-8" />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <Spinner className="w-8 h-8 mx-auto mb-4" />
          <p className="text-gray-600">Cargando post...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gradient-to-b from-zinc-950 to-zinc-900 min-h-screen">
      <div className="mb-6">
        <button
          onClick={() => navigate('/admin/blog')}
          className="flex items-center gap-2 text-brand-cafe hover:text-brand-rosado mb-4"
        >
          ← Volver al Blog
        </button>
        <h1 className="text-3xl font-bold text-brand-cafe">
          {postId ? 'Editar Post' : 'Nuevo Post'}
        </h1>
      </div>

      <div className="bg-brand-beige rounded-lg shadow-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Título */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Título *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-cafe"
              placeholder="Escribe el título del post..."
            />
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Resumen
            </label>
            <textarea
              name="excerpt"
              value={formData.excerpt}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-cafe"
              placeholder="Breve descripción del post..."
            />
          </div>

          {/* Contenido */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contenido *
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              rows={10}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-cafe"
              placeholder="Escribe el contenido del post..."
            />
          </div>

          {/* URL de imagen */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL de Imagen
            </label>
            <input
              type="url"
              name="image_url"
              value={formData.image_url}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-cafe"
              placeholder="https://ejemplo.com/imagen.jpg"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Etiquetas
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-cafe"
              placeholder="tag1, tag2, tag3..."
            />
            <p className="text-xs text-gray-500 mt-1">
              Separa las etiquetas con comas
            </p>
          </div>

          {/* Opciones */}
          <div className="flex gap-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="is_published"
                checked={formData.is_published}
                onChange={handleChange}
                className="mr-2"
              />
              Publicado
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
                className="mr-2"
              />
              Destacado
            </label>
          </div>

          {/* Botones */}
          <div className="flex gap-4 pt-6">
            <button
              type="button"
              onClick={() => navigate('/admin/blog')}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              disabled={submitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 bg-brand-cafe text-white rounded-md hover:bg-brand-rosado disabled:opacity-50 flex items-center gap-2"
            >
              {submitting && <Spinner className="w-4 h-4" />}
              {submitting ? 'Guardando...' : (postId ? 'Actualizar' : 'Crear')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BlogForm;
