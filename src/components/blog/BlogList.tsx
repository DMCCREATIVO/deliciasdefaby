import { useState, useEffect } from 'react';
import { BlogPost, PaginatedBlogPosts } from '@/types/blog';
import { blogService } from '@/lib/database/index';
import BlogPostCard from './BlogPostCard';
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";

interface BlogListProps {
  initialPosts?: PaginatedBlogPosts;
  showFilters?: boolean;
  showPagination?: boolean;
  postsPerRow?: 1 | 2 | 3 | 4;
  className?: string;
}

export default function BlogList({
  initialPosts,
  showFilters = true,
  showPagination = true,
  postsPerRow = 3,
  className = ''
}: BlogListProps) {
  const [debugInfo, setDebugInfo] = useState<string>("");

  // Usar función flecha para preservar el contexto 'this' en la función getAll
  const { data: postsFromDB, isLoading, error } = useQuery<BlogPost[]>({
    queryKey: ["blog-posts"],
    queryFn: async () => {
      try {
        // Verificar estructura de base de datos
        await blogService.checkDatabaseStructure();

        console.log("Consultando posts desde la base de datos...");
        const data = await blogService.getAll();

        // Guardar información de depuración
        setDebugInfo(`Posts cargados: ${data?.length || 0}. 
          ${data?.map(p => `ID: ${p.id}, Título: ${p.title}`).join('\n') || 'No hay datos'}`);

        return data;
      } catch (err: any) {
        console.error("Error al cargar posts:", err);
        setDebugInfo(`Error: ${err.message || 'Error desconocido'}`);
        return [];
      }
    },
    enabled: true
  });

  const posts = postsFromDB ?? [];

  // Mostrar información de depuración para el desarrollador
  useEffect(() => {
    console.log("Estado de BlogList:", {
      postsFromDB: postsFromDB?.length || 0,
      error: error ? (error as Error).message : null,
      isLoading
    });
  }, [postsFromDB, error, isLoading]);

  if (isLoading) return (
    <div className="space-y-8">
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((n) => (
          <div
            key={n}
            className="bg-gradient-to-br from-white/5 to-brand-rosado/5 backdrop-blur-sm border border-zinc-800/30 rounded-xl shadow-lg p-6 animate-pulse h-72"
          />
        ))}
      </div>
    </div>
  );

  if (error || !postsFromDB || postsFromDB.length === 0) return (
    <div className="space-y-4">
      <div className="text-center p-8 rounded-lg bg-white/5 border border-zinc-800/30">
        <p className="text-brand-rosado">No se pudieron cargar los posts de la base de datos</p>
        <pre className="text-xs text-left bg-zinc-800/50 p-4 mt-4 rounded-md overflow-auto max-h-32">
          {debugInfo || 'Sin información de depuración disponible'}
        </pre>
        <div className="flex flex-col gap-2 mt-4 items-center">
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-brand-rosado/20 text-brand-rosado hover:bg-brand-rosado/30 rounded-full text-sm transition-colors"
          >
            Intentar de nuevo
          </button>
          <button
            onClick={() => {
              blogService.checkDatabaseStructure()
                .then(() => alert('Verificación completa. Revisa la consola del navegador.'))
                .catch(err => alert('Error: ' + err.message));
            }}
            className="px-4 py-2 bg-white/10 text-zinc-300 hover:bg-white/20 rounded-full text-sm transition-colors mt-2"
          >
            Verificar base de datos
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <motion.div
      className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {posts && posts.map((post, index) => (
        <motion.div
          key={post.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <BlogPostCard post={post} />
        </motion.div>
      ))}
    </motion.div>
  );
}