import React, { useState, useEffect, lazy, Suspense, useCallback, useMemo } from 'react';
import { useNavigate, Routes, Route, useParams } from 'react-router-dom';
import { pocketbaseBlogService as blogService } from '@/lib/database/blog.pocketbase';
import { Spinner } from '@/components/ui/spinner';

// Definir interfaces para los tipos
interface BlogPost {
  id: string;
  title: string;
  excerpt?: string;
  content: string;
  image_url?: string;
  is_published: boolean;
  featured?: boolean;
  tags?: string[];
  slug: string;
  created_at?: string;
  updated_at?: string;
  published_at?: string | null;
  author_id?: string;
  status?: string;
  date?: string;
  formattedDate?: string;
}

// Componente del formulario
const BlogFormWrapper = React.memo(() => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageOption, setImageOption] = useState<'url' | 'upload'>('url');
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    image_url: '',
    is_published: false,
    featured: false,
    tags: '',
  });

  // Cargar post para edición
  useEffect(() => {
    if (id) {
      const loadPost = async () => {
        try {
          setLoading(true);
          const post = await blogService.getById(id);
          if (post) {
            setFormData({
              title: post.title || '',
              excerpt: post.excerpt || '',
              content: post.content || '',
              image_url: post.image_url || '',
              is_published: post.is_published || false,
              featured: post.featured || false,
              tags: post.tags?.join(', ') || '',
            });
            // Si hay una imagen URL, mostrar preview
            if (post.image_url) {
              setImagePreview(post.image_url);
              setImageOption('url');
            }
          }
        } catch (error) {
          console.error('Error al cargar post:', error);
        } finally {
          setLoading(false);
        }
      };
      loadPost();
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  // Manejar cambio de archivo de imagen
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      // Crear preview
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      // Limpiar URL si estaba usando esa opción
      setFormData(prev => ({ ...prev, image_url: '' }));
    }
  };

  // Manejar cambio de URL de imagen
  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setFormData(prev => ({ ...prev, image_url: url }));
    setImagePreview(url);
    // Limpiar archivo si estaba usando esa opción
    setImageFile(null);
  };

  // Cambiar opción de imagen
  const handleImageOptionChange = (option: 'url' | 'upload') => {
    setImageOption(option);
    setImagePreview(null);
    setImageFile(null);
    setFormData(prev => ({ ...prev, image_url: '' }));
  };

  // Eliminar imagen
  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setFormData(prev => ({ ...prev, image_url: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('El título es requerido');
      return;
    }

    try {
      setLoading(true);
      const postData = {
        title: formData.title,
        excerpt: formData.excerpt,
        content: formData.content,
        image_url: imageFile || formData.image_url, // Puede ser File o string
        is_published: formData.is_published,
        featured: formData.featured,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      };

      if (id) {
        await blogService.update(id, postData);
        alert('Post actualizado correctamente');
      } else {
        await blogService.create(postData);
        alert('Post creado correctamente');
      }

      // Fuerza refresh del listado admin al volver
      window.dispatchEvent(new CustomEvent('blog:refresh'));
      navigate('/admin/blog');
    } catch (error) {
      console.error('Error al guardar post:', error);
      alert('Error al guardar el post: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  if (loading && id) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Spinner className="w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <button
          onClick={() => navigate('/admin/blog')}
          className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 mb-4"
        >
          ← Volver al Blog
        </button>
        <h1 className="text-3xl font-bold text-slate-200">
          {id ? 'Editar Post' : 'Nuevo Post'}
        </h1>
      </div>

      <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Título */}
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">
              Título *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-200"
              placeholder="Escribe el título del post..."
            />
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">
              Resumen
            </label>
            <textarea
              name="excerpt"
              value={formData.excerpt}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-200"
              placeholder="Breve descripción del post..."
            />
          </div>

          {/* Contenido */}
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">
              Contenido *
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows={10}
              required
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-200"
              placeholder="Escribe el contenido del post..."
            />
          </div>

          {/* Imagen - Con opciones de URL o subir archivo */}
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-3">
              Imagen de portada
            </label>

            {/* Opciones de imagen */}
            <div className="flex gap-4 mb-4">
              <button
                type="button"
                onClick={() => handleImageOptionChange('url')}
                className={`px-4 py-2 rounded-md transition-colors ${imageOption === 'url'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-600 text-slate-300 hover:bg-slate-500'
                  }`}
              >
                📎 URL de imagen
              </button>
              <button
                type="button"
                onClick={() => handleImageOptionChange('upload')}
                className={`px-4 py-2 rounded-md transition-colors ${imageOption === 'upload'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-600 text-slate-300 hover:bg-slate-500'
                  }`}
              >
                📁 Subir archivo
              </button>
            </div>

            {/* Campo según opción seleccionada */}
            {imageOption === 'url' ? (
              <input
                type="url"
                name="image_url"
                value={formData.image_url}
                onChange={handleImageUrlChange}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-200"
                placeholder="https://ejemplo.com/imagen.jpg"
              />
            ) : (
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileChange}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-200 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-emerald-600 file:text-white hover:file:bg-emerald-700"
                />
                <p className="text-xs text-slate-400 mt-1">
                  Formatos soportados: JPG, PNG, GIF, WebP (máx. 5MB)
                </p>
              </div>
            )}

            {/* Preview de la imagen */}
            {imagePreview && (
              <div className="mt-4">
                <div className="relative inline-block">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full max-w-md h-48 object-cover rounded-md border border-slate-600"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                    title="Eliminar imagen"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 6 6 18" />
                      <path d="M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">
              Etiquetas (separadas por comas)
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-200"
              placeholder="recetas, pan, dulces"
            />
          </div>

          {/* Opciones */}
          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-slate-200">
              <input
                type="checkbox"
                name="is_published"
                checked={formData.is_published}
                onChange={handleChange}
                className="rounded border-slate-600 text-emerald-500 focus:ring-emerald-500"
              />
              Publicar
            </label>
            <label className="flex items-center gap-2 text-slate-200">
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
                className="rounded border-slate-600 text-emerald-500 focus:ring-emerald-500"
              />
              Destacar
            </label>
          </div>

          {/* Botones */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Spinner className="w-4 h-4" />
                  Guardando...
                </>
              ) : (
                <>
                  {id ? '💾 Actualizar' : '✨ Crear'}
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/blog')}
              className="px-6 py-2 bg-slate-600 text-white rounded-md hover:bg-slate-700"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
});

// Lista de posts
const BlogListPage = React.memo(() => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const data = await blogService.getAllAdmin();
        const sorted = [...data].sort((a, b) => {
          const aTime = new Date(a.created_at || a.updated_at || 0).getTime();
          const bTime = new Date(b.created_at || b.updated_at || 0).getTime();
          return bTime - aTime;
        });
        setPosts(sorted);
        setError(null);
      } catch (err) {
        console.error("Error al cargar posts:", err);
        setError("Error al cargar los posts");
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
    const onRefresh = () => fetchPosts();
    window.addEventListener('blog:refresh', onRefresh);
    return () => window.removeEventListener('blog:refresh', onRefresh);
  }, []);

  // Filtrado de posts
  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Manejo de eliminación
  const handleDelete = async (postId: string, postTitle: string) => {
    if (window.confirm(`¿Estás seguro de eliminar el post "${postTitle}"?`)) {
      try {
        await blogService.delete(postId);
        setPosts(posts.filter(post => post.id !== postId));
        alert(`Post "${postTitle}" eliminado correctamente`);
      } catch (err) {
        console.error("Error al eliminar post:", err);
        alert(`Error al eliminar el post: ${err}`);
      }
    }
  };

  return (
    <div className="p-6">
      <div className="flex flex-col space-y-4 mb-6">
        <h1 className="text-3xl font-bold text-slate-200">Blog</h1>
        <p className="text-slate-400">Gestiona el contenido editorial de tu catálogo</p>
        {error && <p className="text-red-400 text-sm">{error}</p>}
      </div>

      <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
        <div className="p-5 border-b border-slate-700">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-semibold text-slate-200">Posts</h2>
              <button
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors flex items-center gap-2"
                onClick={() => navigate('new')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>
                Nuevo Post
              </button>
            </div>
            <div className="relative w-full sm:w-64">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
              <input
                type="text"
                placeholder="Buscar posts..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-center p-12">
              <Spinner className="w-10 h-10 mx-auto mb-3 text-emerald-500" />
              <p className="text-slate-400">Cargando posts...</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-slate-700/50">
                  <th className="text-left p-4 font-medium text-slate-300">Título</th>
                  <th className="text-left p-4 font-medium text-slate-300">Estado</th>
                  <th className="text-left p-4 font-medium text-slate-300">Fecha</th>
                  <th className="text-right p-4 font-medium text-slate-300">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredPosts.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center p-12 text-slate-400">
                      {posts.length === 0 ? (
                        <div className="flex flex-col items-center">
                          <svg className="w-16 h-16 text-slate-600 mb-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><line x1="10" y1="9" x2="8" y2="9" /></svg>
                          <p>No hay posts disponibles</p>
                          <button
                            className="mt-4 px-4 py-2 bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 rounded-md text-sm transition-colors"
                            onClick={() => navigate('new')}
                          >
                            Crear primer post
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <svg className="w-16 h-16 text-slate-600 mb-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /><path d="M8 11h6" /></svg>
                          <p>No se encontraron posts</p>
                          <button
                            className="mt-4 px-4 py-2 bg-slate-600 hover:bg-slate-500 rounded-md text-sm transition-colors"
                            onClick={() => setSearchTerm('')}
                          >
                            Limpiar búsqueda
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ) : (
                  filteredPosts.map(post => (
                    <tr key={post.id} className="border-t border-slate-700 hover:bg-slate-700/30 transition-colors">
                      <td className="p-4 text-slate-200 font-medium">{post.title}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${post.is_published
                            ? 'bg-green-500/20 text-green-300'
                            : 'bg-yellow-500/20 text-yellow-300'
                          }`}>
                          {post.is_published ? 'Publicado' : 'Borrador'}
                        </span>
                      </td>
                      <td className="p-4 text-slate-400">
                        {post.created_at ? new Date(post.created_at).toLocaleDateString('es-ES') : 'Sin fecha'}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            className="p-2 text-slate-400 hover:text-emerald-400 hover:bg-emerald-400/10 rounded-full transition-colors"
                            onClick={() => navigate(`/blog/${post.slug}`)}
                            title="Ver post"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>
                          </button>
                          <button
                            className="p-2 text-slate-400 hover:text-emerald-400 hover:bg-emerald-400/10 rounded-full transition-colors"
                            onClick={() => navigate(`edit/${post.id}`)}
                            title="Editar post"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /><path d="m15 5 4 4" /></svg>
                          </button>
                          <button
                            className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-full transition-colors"
                            onClick={() => handleDelete(post.id, post.title)}
                            title="Eliminar post"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" x2="10" y1="11" y2="17" /><line x1="14" x2="14" y1="11" y2="17" /></svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
});

// Componente principal simplificado
export default function BlogAdminPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="text-center">
          <Spinner className="w-8 h-8 mx-auto mb-4" />
          <p className="text-slate-400">Cargando...</p>
        </div>
      </div>
    }>
      <Routes>
        <Route index element={<BlogListPage />} />
        <Route path="new" element={<BlogFormWrapper />} />
        <Route path="edit/:id" element={<BlogFormWrapper />} />
      </Routes>
    </Suspense>
  );
} 