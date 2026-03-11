import { Link } from "react-router-dom";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Clock, Calendar } from "lucide-react";
import { BlogPost } from "@/types/blog";

interface BlogPostCardProps {
  post: BlogPost;
}

export default function BlogPostCard({ post }: BlogPostCardProps) {
  // Imagen de fallback para posts sin imagen
  const fallbackImage = "/placeholder-post.jpg";

  // Calcular tiempo de lectura estimado (1 min por cada 200 palabras)
  const wordCount = post.content ? post.content.replace(/<[^>]+>/g, '').split(/\s+/).length : 0;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  // Manejar caso donde created_at sea nulo o indefinido
  const createdAt = post.created_at ? new Date(post.created_at) : new Date();

  return (
    <div className="group bg-white/95 backdrop-blur-sm border border-brand-beige hover:border-brand-cafe/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-brand-cafe/20 hover:border-brand-cafe/40 rounded-2xl shadow-xl overflow-hidden flex flex-col">
      {/* Contenedor de imagen con proporción fija y overflow para imagen */}
      <div className="relative h-0 pb-[56.25%] overflow-hidden">
        <img
          src={post.image_url || fallbackImage}
          alt={post.title}
          className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        {/* Degradado sobre la imagen */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-70 group-hover:opacity-80 transition-opacity duration-300"></div>
      </div>

      <div className="flex-1 flex flex-col p-5 md:p-6">
        {/* Metadatos superiores */}
        <div className="flex items-center gap-3 text-xs text-brand-cafe/60 mb-3">
          <div className="flex items-center gap-1">
            <Calendar size={14} className="text-brand-cafe" />
            <time dateTime={post.created_at || ''}>
              {format(createdAt, "d 'de' MMMM yyyy", { locale: es })}
            </time>
          </div>
          <span className="text-brand-cafe/40">•</span>
          <div className="flex items-center gap-1">
            <Clock size={14} className="text-brand-cafe" />
            <span>{readingTime} min de lectura</span>
          </div>
        </div>

        {/* Título con gradiente */}
        <h2 className="text-xl md:text-2xl font-bold mb-3 text-brand-cafe group-hover:text-brand-brown transition-all duration-300 line-clamp-2">
          {post.title}
        </h2>

        {/* Extracto con límite de 3 líneas */}
        <p className="text-brand-cafe/70 text-sm md:text-base mb-4 line-clamp-3">
          {post.excerpt || 'No hay descripción disponible'}
        </p>

        {/* Autor y botón de leer más */}
        <div className="mt-auto flex items-center justify-between pt-4 border-t border-brand-beige">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full mr-2 bg-brand-cafe/20 flex items-center justify-center text-brand-cafe font-bold text-xs">
              A
            </div>
            <span className="text-xs text-brand-cafe/60">
              {post.author?.name || (post.profiles?.name) || "Admin"}
            </span>
          </div>
          
          <Link
            to={`/blog/${post.slug}`}
            className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-brand-cafe hover:bg-brand-brown text-white font-medium text-sm shadow-lg hover:shadow-brand-cafe/30 transition-all duration-200"
          >
            Leer más
          </Link>
        </div>
      </div>
    </div>
  );
}