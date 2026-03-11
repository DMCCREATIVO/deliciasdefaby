import { useState, useEffect } from 'react';
import { BlogPost, BlogPostFilters, PaginatedBlogPosts } from '@/types/blog';
import { blogService } from '@/lib/database/index';
import BlogPostCard from './BlogPostCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from '@/components/ui/skeleton';
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { motion } from "framer-motion";

interface BlogListProps {
  initialPosts?: PaginatedBlogPosts;
  showFilters?: boolean;
  showPagination?: boolean;
  postsPerRow?: 1 | 2 | 3 | 4;
  className?: string;
}

// Posts de muestra para fallback (si no hay conexión a la base de datos)
const SAMPLE_POSTS: BlogPost[] = [
  {
    id: '1',
    slug: 'post-de-prueba-1',
    title: 'Post de Prueba 1',
    content: '<p>Este es un post de prueba para ver si funciona correctamente la navegación.</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam eget felis nec magna vestibulum tincidunt.</p>',
    excerpt: 'Este es un post de prueba para ver si funciona correctamente la navegación.',
    image_url: '/placeholder-post.jpg',
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    author_id: null,
    tags: ['prueba', 'ejemplo']
  },
  {
    id: '2',
    slug: 'post-de-prueba-2',
    title: 'Post de Prueba 2',
    content: '<p>Segundo post de prueba con contenido diferente.</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>',
    excerpt: 'Segundo post de prueba con contenido diferente.',
    image_url: '/placeholder-post.jpg',
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    author_id: null,
    tags: ['prueba', 'ejemplo']
  },
  {
    id: '3',
    slug: 'los-mejores-postres-para-la-temporada-otonal',
    title: 'Los mejores postres para la temporada otoñal',
    content: '<p>El otoño es la temporada perfecta para disfrutar de sabores cálidos y reconfortantes. En este artículo compartimos nuestras recetas favoritas para esta época del año.</p><p>Las tartas de manzana con canela, los pasteles de calabaza y los brownies con nueces son opciones deliciosas que no puedes dejar de probar. Además, te explicamos cómo conseguir la textura perfecta en cada una de estas preparaciones.</p>',
    excerpt: 'Descubre las mejores recetas de postres para disfrutar durante el otoño con ingredientes de temporada.',
    image_url: 'https://images.unsplash.com/photo-1569864358642-9d1684040f43?auto=format&fit=crop&w=800&q=80',
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    author_id: null,
    tags: ['recetas', 'postres', 'otoño']
  },
  {
    id: '4',
    slug: 'como-decorar-pasteles-como-un-profesional',
    title: 'Cómo decorar pasteles como un profesional',
    content: '<p>La decoración de pasteles es un arte que puedes dominar con práctica y las herramientas adecuadas. En este artículo te revelamos los secretos de los pasteleros profesionales.</p><p>Aprenderás técnicas para conseguir un glaseado perfecto, cómo hacer flores de fondant realistas y trucos para escribir con chocolate de manera impecable. Con estos consejos, tus creaciones lucirán como si vinieran de una pastelería profesional.</p>',
    excerpt: 'Técnicas y consejos de decoración para conseguir pasteles dignos de una pastelería profesional desde tu cocina.',
    image_url: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?auto=format&fit=crop&w=800&q=80',
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    author_id: null,
    tags: ['decoración', 'técnicas', 'pasteles']
  },
  {
    id: '5',
    slug: 'panes-del-mundo-un-viaje-gastronomico',
    title: 'Panes del mundo: un viaje gastronómico',
    content: '<p>El pan es un alimento universal con miles de variantes alrededor del mundo. Te invitamos a un recorrido por las recetas más emblemáticas de diferentes culturas.</p><p>Desde el baguette francés hasta el naan indio, pasando por el pan de muerto mexicano o el pretzel alemán, cada país tiene su propia tradición panadera. Exploraremos sus ingredientes, técnicas de elaboración y el papel cultural que desempeñan en sus lugares de origen.</p>',
    excerpt: 'Recorrido por las variedades de pan más famosas del mundo, sus ingredientes y técnicas tradicionales.',
    image_url: 'https://images.unsplash.com/photo-1555951015-6da1e2452e10?auto=format&fit=crop&w=800&q=80',
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    author_id: null,
    tags: ['pan', 'internacional', 'tradiciones']
  }
];

export default function BlogList({
  initialPosts,
  showFilters = true,
  showPagination = true,
  postsPerRow = 3,
  className = ''
}: BlogListProps) {
  // Configurar para usar posts reales de la base de datos por defecto
  const [useSamplePosts, setUseSamplePosts] = useState(false);
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
    enabled: !useSamplePosts // Consultar la base de datos cuando no estemos usando posts de muestra
  });

  // Usar posts de la base de datos o de muestra como fallback
  const posts = useSamplePosts ? SAMPLE_POSTS : postsFromDB;

  // Mostrar información de depuración para el desarrollador
  useEffect(() => {
    console.log("Estado de BlogList:", {
      useSamplePosts,
      postsFromDB: postsFromDB?.length || 0,
      error: error ? (error as Error).message : null,
      isLoading
    });
  }, [useSamplePosts, postsFromDB, error, isLoading]);

  if (isLoading && !useSamplePosts) return (
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

  if ((error || !postsFromDB || postsFromDB.length === 0) && !useSamplePosts) return (
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
          <button
            onClick={() => setUseSamplePosts(true)}
            className="px-4 py-2 bg-brand-cafe/30 text-brand-beige hover:bg-brand-cafe/50 rounded-full text-sm transition-colors mt-2"
          >
            Usar posts de muestra
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