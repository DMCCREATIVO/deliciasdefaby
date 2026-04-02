import { motion } from "framer-motion";
import { ChevronDown, FileText, BookOpen, Calendar, User } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { blogService } from "@/lib/database/index";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function BlogPage() {
  const navigate = useNavigate();

  // Función para desplazarse al listado de posts
  const scrollToContent = () => {
    const element = document.getElementById('blog-content');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  // Consulta para obtener todos los posts
  const { data: posts, isLoading, error } = useQuery({
    queryKey: ['blog-posts'],
    queryFn: async () => {
      return await blogService.getAll();
    }
  });

  const displayPosts = posts ?? [];

  // Obtener el post destacado o el más reciente para el hero
  const featuredPost = displayPosts.find(post => post.featured) || displayPosts[0];

  const calculateReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.replace(/<[^>]+>/g, '').split(/\s+/).length;
    return Math.max(1, Math.ceil(words / wordsPerMinute));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-beige/10 via-background to-brand-beige/5 -mt-16 sm:-mt-20">
      {/* Hero Section con imagen de fondo del post destacado - Optimizado */}
      <div className="relative min-h-[70vh] sm:min-h-[80vh] overflow-hidden pt-24 sm:pt-28">
        {/* Imagen de fondo del post destacado */}
        {featuredPost?.image_url && (
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${featuredPost.image_url})`
            }}
          />
        )}

        {/* Capa vidriosa transparente con los colores del tema */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-cafe/80 via-brand-brown/70 to-brand-cafe/80 backdrop-blur-[1px]" />

        {/* Capa adicional para mejor legibilidad */}
        <div className="absolute inset-0 bg-black/30" />

        {/* Degradado desde abajo */}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-cafe/60 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 text-center h-full flex flex-col justify-center">
          <motion.div
            className="flex items-center justify-center gap-2 sm:gap-3 mb-4 sm:mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <BookOpen className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white" />
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white">
              Nuestro Blog
            </h1>
          </motion.div>

          <motion.p
            className="text-base sm:text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-3 sm:mb-4 px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Descubre nuestras recetas, consejos y las historias detrás de nuestras deliciosas creaciones artesanales
          </motion.p>

          {/* Información del post destacado */}
          {featuredPost && (
            <motion.div
              className="max-w-sm sm:max-w-md mx-auto mb-6 sm:mb-8 bg-white/10 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="flex items-center justify-center gap-2 text-brand-accent text-xs sm:text-sm font-medium mb-2">
                <span className="w-2 h-2 bg-brand-accent rounded-full animate-pulse"></span>
                Post Destacado
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2 line-clamp-2">
                {featuredPost.title}
              </h3>
              <p className="text-white/80 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">
                {featuredPost.excerpt}
              </p>
              <Button
                onClick={() => navigate(`/blog/${featuredPost.slug}`)}
                className="bg-brand-accent hover:bg-brand-accent/90 text-brand-cafe font-medium w-full min-h-[44px]"
              >
                Leer artículo
              </Button>
            </motion.div>
          )}

          {/* Indicador de scroll */}
          <motion.button
            onClick={scrollToContent}
            className="flex items-center justify-center p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors mx-auto group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            whileHover={{ scale: 1.1 }}
          >
            <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6 group-hover:text-brand-accent transition-colors animate-bounce" />
          </motion.button>
        </div>
      </div>

      {/* Contenido principal - Sin margen excesivo */}
      <div
        id="blog-content"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 -mt-8 sm:-mt-12 relative z-10"
      >
        <div className="flex items-center mb-6 sm:mb-8 border-b border-brand-cafe/20 pb-3 sm:pb-4">
          <FileText className="text-brand-cafe mr-2 w-5 h-5 sm:w-6 sm:h-6" />
          <h2 className="text-xl sm:text-2xl font-bold text-brand-cafe">Artículos Recientes</h2>
          {displayPosts.length > 0 && (
            <span className="ml-auto text-brand-cafe/60 text-xs sm:text-sm">
              {displayPosts.length} {displayPosts.length === 1 ? 'artículo' : 'artículos'}
            </span>
          )}
        </div>

        {/* Loading skeleton */}
        {isLoading && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <div className="p-4 sm:p-6 space-y-3">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="text-center py-8 sm:py-12">
            <p className="text-red-600 mb-4">Error al cargar los artículos</p>
            <Button onClick={() => window.location.reload()} variant="outline">
              Reintentar
            </Button>
          </div>
        )}

        {/* Posts grid */}
        {!isLoading && displayPosts.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {displayPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card
                  className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group border-brand-cafe/10"
                  onClick={() => navigate(`/blog/${post.slug}`)}
                >
                  {/* Imagen del post */}
                  <div className="relative h-48 sm:h-56 overflow-hidden">
                    <img
                      src={post.image_url || '/1.png'}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Badge de post destacado */}
                    {post.featured && (
                      <div className="absolute top-3 sm:top-4 left-3 sm:left-4 bg-brand-accent text-brand-cafe px-2 py-1 rounded-full text-xs font-medium">
                        Destacado
                      </div>
                    )}
                  </div>

                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-brand-cafe/60 mb-2 sm:mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>
                          {format(new Date(post.created_at), 'dd MMM yyyy', { locale: es })}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>{calculateReadingTime(post.content)} min</span>
                      </div>
                    </div>

                    <h3 className="text-lg sm:text-xl font-bold text-brand-cafe mb-2 sm:mb-3 line-clamp-2 group-hover:text-brand-brown transition-colors">
                      {post.title}
                    </h3>

                    <p className="text-brand-cafe/70 text-xs sm:text-sm line-clamp-3 mb-3 sm:mb-4">
                      {post.excerpt || post.content.replace(/<[^>]+>/g, '').substring(0, 120) + '...'}
                    </p>

                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full border-brand-cafe/20 text-brand-cafe hover:bg-brand-cafe hover:text-white transition-colors min-h-[40px]"
                    >
                      Leer más
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && displayPosts.length === 0 && (
          <div className="text-center py-12 sm:py-16">
            <BookOpen className="w-16 h-16 sm:w-20 sm:h-20 text-brand-cafe/30 mx-auto mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold text-brand-cafe mb-2">No hay artículos disponibles</h3>
            <p className="text-brand-cafe/60 text-sm sm:text-base">¡Vuelve pronto para leer nuestros nuevos artículos!</p>
          </div>
        )}
      </div>
    </div>
  );
}