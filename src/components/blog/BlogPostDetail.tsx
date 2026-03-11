import { useQuery } from "@tanstack/react-query";
import { blogService } from "@/lib/database/index";
import { BlogPost } from "@/lib/database/types";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";
import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { ArrowLeft, Calendar, Clock, User } from "lucide-react";

// Posts de muestra para fallback
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
    featured: false,
    author_id: null,
  },
  // ... rest of sample posts but with corrected types
];

export const BlogPostDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [samplePost, setSamplePost] = useState<BlogPost | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Buscar post de muestra que coincida con el slug
  useEffect(() => {
    if (slug) {
      const matchingSamplePost = SAMPLE_POSTS.find(post => post.slug === slug);
      if (matchingSamplePost) {
        setSamplePost(matchingSamplePost as BlogPost);
        console.log("Usando post de muestra:", matchingSamplePost.title);
      }
    }
  }, [slug]);

  const { data: postFromDB, isLoading, error } = useQuery({
    queryKey: ["blog-post", slug],
    queryFn: () => blogService.getBySlug(slug!),
    enabled: !!slug && !samplePost, // No consultar la base de datos si ya tenemos un post de muestra
  });

  // Usar el post de muestra o el de la base de datos
  const post = samplePost || postFromDB;

  // Calcular tiempo de lectura estimado (1 min por cada 200 palabras)
  const calculateReadingTime = (content: string): number => {
    const wordCount = content.replace(/<[^>]+>/g, '').split(/\s+/).length;
    return Math.max(1, Math.ceil(wordCount / 200));
  };

  if (isLoading && !samplePost) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto px-4 py-8">
        <Skeleton className="h-64 w-full rounded-xl" />
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-1/4" />
        <div className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center py-16 max-w-4xl mx-auto">
        <h3 className="text-2xl text-brand-rosado font-bold mb-4">Post no encontrado</h3>
        <p className="text-zinc-400 mb-8">El post que buscas no existe o ha sido eliminado.</p>
        <Link
          to="/blog"
          className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-gradient-to-r from-brand-rosado to-brand-rosado/80 text-white shadow-lg shadow-brand-rosado/20 hover:shadow-brand-rosado/30 transition-all duration-200"
        >
          <ArrowLeft size={18} className="mr-2" />
          Volver al blog
        </Link>
      </div>
    );
  }

  const readingTime = calculateReadingTime(post.content);

  return (
    <article className="max-w-4xl mx-auto px-4 py-12">
      {/* Cabecera con navegación */}
      <div className="mb-8 flex items-center justify-between">
        <Link
          to="/blog"
          className="inline-flex items-center text-brand-rosado hover:text-brand-rosado/90 transition-colors duration-200 group"
        >
          <ArrowLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
          <span className="text-sm md:text-base font-medium">Volver al blog</span>
        </Link>

        {samplePost && (
          <div className="bg-brand-rosado/20 text-white px-4 py-2 rounded-full text-xs md:text-sm">
            Mostrando post de muestra
          </div>
        )}
      </div>

      {/* Imagen de portada */}
      {post.image_url && (
        <div className="aspect-video mb-8 overflow-hidden rounded-xl relative">
          <img
            src={post.image_url}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            onLoad={() => setIsLoaded(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/50 to-transparent opacity-60"></div>
        </div>
      )}

      {/* Título y metadatos */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-brand-rosado mb-4">{post.title}</h1>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-zinc-400 mb-6">
          <div className="flex items-center gap-2">
            <User size={16} className="text-brand-rosado" />
            <span>{post.author?.name || post.profiles?.name || "Admin"}</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-brand-rosado" />
            <time dateTime={post.created_at}>
              {format(new Date(post.created_at), "d 'de' MMMM, yyyy", { locale: es })}
            </time>
          </div>
          <span>•</span>
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-brand-rosado" />
            <span>{readingTime} min de lectura</span>
          </div>
        </div>
      </div>

      {/* Extracto */}
      {post.excerpt && (
        <p className="text-xl text-zinc-300 mb-8 font-light leading-relaxed border-l-4 border-brand-rosado/30 pl-4 py-2 bg-brand-rosado/5 rounded-r-md">
          {post.excerpt}
        </p>
      )}

      {/* Contenido principal */}
      <div
        className="prose prose-invert prose-pink max-w-none
          prose-headings:text-zinc-100 prose-headings:font-bold
          prose-p:text-zinc-300 prose-p:leading-relaxed
          prose-strong:text-brand-rosado prose-strong:font-bold
          prose-a:text-brand-rosado prose-a:no-underline hover:prose-a:underline
          prose-blockquote:border-l-4 prose-blockquote:border-brand-rosado/50 
          prose-blockquote:bg-brand-rosado/5 prose-blockquote:rounded-r
          prose-img:rounded-xl prose-img:shadow-lg
          prose-code:text-brand-rosado prose-code:bg-zinc-800 prose-code:px-1 prose-code:rounded"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* Separador decorativo */}
      <div className="my-12 flex items-center justify-center">
        <div className="w-16 h-1 bg-gradient-to-r from-brand-rosado/50 to-brand-rosado rounded-full"></div>
      </div>

      {/* Footer con acciones */}
      <div className="mt-10 pt-6 border-t border-zinc-800/50 flex flex-col md:flex-row items-center justify-between gap-6">
        <Link
          to="/blog"
          className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-brand-rosado/90 to-brand-rosado/70 text-white font-medium shadow-lg shadow-brand-rosado/20 hover:shadow-brand-rosado/30 transition-all duration-200"
        >
          <ArrowLeft size={16} className="mr-2" />
          Volver al blog
        </Link>

        {/* Botones de compartir */}
        <div className="flex items-center gap-3">
          <span className="text-sm text-zinc-400">Compartir:</span>
          <button
            onClick={() => navigator.clipboard.writeText(window.location.href).then(() => alert('¡Enlace copiado!'))}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-zinc-800 hover:bg-brand-rosado/80 text-zinc-300 hover:text-white transition-all duration-300"
            title="Copiar enlace"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
          </button>
          <a
            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(post.title)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-9 h-9 flex items-center justify-center rounded-full bg-zinc-800 hover:bg-[#1DA1F2]/80 text-zinc-300 hover:text-white transition-all duration-300"
            title="Compartir en Twitter"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
          </a>
        </div>
      </div>
    </article>
  );
};