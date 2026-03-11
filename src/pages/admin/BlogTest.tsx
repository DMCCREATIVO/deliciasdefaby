import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { pocketbaseBlogService as blogService } from '@/lib/database/blog.pocketbase';

const BlogTestAdminPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar datos reales de la base de datos
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        console.log("Cargando posts desde la base de datos...");
        setLoading(true);
        // Intentamos cargar los posts de la base de datos
        const data = await blogService.getAllAdmin();
        console.log("Posts cargados:", data.length);
        setPosts(data);
        setError(null);
      } catch (err) {
        console.error("Error al cargar posts:", err);
        setError("Error al cargar los posts. Utilizando datos de respaldo.");
        // Si hay un error, usamos los datos estáticos como respaldo
        setPosts(getStaticPosts());
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Datos estáticos como respaldo en caso de error
  const getStaticPosts = () => {
    return [
      {
        id: '6b7a1a8d-5afd-4d6e-84a2-17e914c22d9f',
        title: 'Primer post de ejemplo (estático)',
        status: 'Publicado',
        is_published: true,
        date: '10 de mayo, 2025',
        formattedDate: '10 de mayo de 2025',
        slug: 'primer-post-de-ejemplo'
      },
      {
        id: '2',
        title: 'Segundo post de ejemplo (estático)',
        status: 'Borrador',
        is_published: false,
        date: '9 de mayo, 2025',
        formattedDate: '9 de mayo de 2025',
        slug: 'segundo-post-de-ejemplo'
      },
      {
        id: '3',
        title: 'Tercer post de ejemplo (estático)',
        status: 'Publicado',
        is_published: true,
        date: '8 de mayo, 2025',
        formattedDate: '8 de mayo de 2025',
        slug: 'tercer-post-de-ejemplo'
      }
    ];
  };

  // Convertir formato de datos para mostrar
  const formatPostsForDisplay = (post: any) => {
    return {
      ...post,
      status: post.is_published ? 'Publicado' : 'Borrador',
      date: post.formattedDate || new Date(post.created_at).toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    };
  };

  // Filtrado de posts
  const filteredPosts = posts
    .filter(post =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .map(formatPostsForDisplay);

  // Manejo de eliminación
  const handleDelete = async (postId: string, postTitle: string) => {
    if (window.confirm(`¿Estás seguro de eliminar el post "${postTitle}"?`)) {
      try {
        await blogService.delete(postId);
        // Actualizar la lista después de eliminar
        setPosts(posts.filter(post => post.id !== postId));
        alert(`Post "${postTitle}" eliminado correctamente`);
      } catch (err) {
        console.error("Error al eliminar post:", err);
        alert(`Error al eliminar el post: ${err}`);
      }
    }
  };

  // Función para refrescar los datos
  const refreshData = async () => {
    try {
      setLoading(true);
      const data = await blogService.getAllAdmin();
      setPosts(data);
      alert("Datos actualizados correctamente");
    } catch (err) {
      console.error("Error al actualizar datos:", err);
      alert("Error al actualizar los datos");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6 p-6 bg-zinc-950/5">
      <div className="flex flex-col space-y-4 mb-6">
        <h1 className="text-3xl font-bold text-zinc-800">Blog</h1>
        <p className="text-zinc-500">Gestiona el contenido editorial de tu catálogo</p>
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>

      <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-zinc-100">
        <div className="p-5 bg-gradient-to-r from-zinc-50 to-zinc-100 border-b border-zinc-200">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-semibold text-zinc-700">Posts</h2>
              <button
                className="px-4 py-2 bg-brand-pink hover:bg-brand-pink/90 text-white rounded-lg shadow-lg hover:shadow-brand-pink/25 transition-all duration-300 transform hover:-translate-y-0.5 flex items-center gap-2"
                onClick={() => navigate('/admin/blog/new')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>
                Nuevo Post
              </button>
            </div>
            <div className="relative w-full sm:w-64">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
              <input
                type="text"
                placeholder="Buscar posts..."
                className="w-full pl-10 pr-4 py-2.5 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-pink/50 focus:border-brand-pink"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-center p-12">
              <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-brand-pink border-t-transparent mb-3"></div>
              <p className="text-zinc-500">Cargando posts...</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-zinc-50">
                  <th className="text-left p-4 font-medium text-zinc-600">Título</th>
                  <th className="text-left p-4 font-medium text-zinc-600">Estado</th>
                  <th className="text-left p-4 font-medium text-zinc-600">Fecha</th>
                  <th className="text-right p-4 font-medium text-zinc-600">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredPosts.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center p-12 text-zinc-500">
                      {posts.length === 0 ? (
                        <div className="flex flex-col items-center">
                          <svg className="w-16 h-16 text-zinc-300 mb-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><line x1="10" y1="9" x2="8" y2="9" /></svg>
                          <p>No hay posts disponibles</p>
                          <button
                            className="mt-4 px-4 py-2 bg-brand-pink/10 text-brand-pink hover:bg-brand-pink/20 rounded-md text-sm transition-colors"
                            onClick={() => navigate('/admin/blog/new')}
                          >
                            Crea tu primer post
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <svg className="w-16 h-16 text-zinc-300 mb-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /><path d="M8 11h6" /></svg>
                          <p>No se encontraron posts</p>
                          {searchTerm && (
                            <button
                              className="mt-4 px-4 py-2 bg-zinc-200 hover:bg-zinc-300 rounded-md text-sm transition-colors text-zinc-700"
                              onClick={() => setSearchTerm('')}
                            >
                              Limpiar búsqueda
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ) : (
                  filteredPosts.map(post => (
                    <tr key={post.id} className="border-t border-zinc-100 hover:bg-zinc-50/80 transition-colors">
                      <td className="p-4 text-zinc-800 font-medium">{post.title}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${post.status === 'Publicado'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-zinc-100 text-zinc-700'
                          }`}>
                          {post.status}
                        </span>
                      </td>
                      <td className="p-4 text-zinc-600">{post.date}</td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            className="p-2 text-zinc-500 hover:text-brand-pink hover:bg-brand-pink/10 rounded-full transition-colors"
                            onClick={() => navigate(`/blog/${post.slug}`)}
                            title="Ver post"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>
                          </button>
                          <button
                            className="p-2 text-zinc-500 hover:text-brand-pink hover:bg-brand-pink/10 rounded-full transition-colors"
                            onClick={() => navigate(`/admin/blog/edit/${post.id}`)}
                            title="Editar post"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /><path d="m15 5 4 4" /></svg>
                          </button>
                          <button
                            className="p-2 text-zinc-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
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

        <div className="p-5 border-t border-zinc-200 bg-zinc-50 flex items-center justify-between">
          <span className="text-sm text-zinc-500">
            {filteredPosts.length} posts encontrados
          </span>
          <button
            className="px-4 py-2 bg-white border border-zinc-200 hover:bg-zinc-100 rounded-lg text-sm transition-colors flex items-center gap-2 shadow-sm text-zinc-700"
            onClick={refreshData}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="inline-block h-4 w-4 border-2 border-brand-pink/30 border-t-brand-pink rounded-full animate-spin"></span>
                <span className="text-zinc-500">Actualizando...</span>
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 2v6h6" /><path d="M21 12A9 9 0 0 0 6 5.3L3 8" /><path d="M21 22v-6h-6" /><path d="M3 12a9 9 0 0 0 15 6.7l3-2.7" /></svg>
                <span className="text-zinc-700">Actualizar</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlogTestAdminPage; 