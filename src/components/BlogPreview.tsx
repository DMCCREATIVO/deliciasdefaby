import { useQuery } from "@tanstack/react-query";
import { blogService } from "@/lib/database/index";
import { BlogPost } from "@/lib/database/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, ArrowRight, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export const BlogPreview = () => {
  const navigate = useNavigate();

  const { data: posts, isLoading } = useQuery({
    queryKey: ['blog-preview'],
    queryFn: async () => {
      const allPosts = await blogService.getAll();
      return allPosts.slice(0, 3);
    }
  });

  // Posts de respaldo si no hay datos
  const fallbackPosts: BlogPost[] = [
    {
      id: '1',
      title: 'Los Secretos del Pan Artesanal',
      excerpt: 'Descubre las técnicas tradicionales que hacen único nuestro pan diario.',
      content: 'Contenido del artículo...',
      image_url: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&w=800&q=80',
      created_at: new Date().toISOString(),
      slug: 'secretos-pan-artesanal',
      is_published: true,
      featured: false,
      author_id: null
    },
    {
      id: '2',
      title: 'Postres de Temporada: Sabores del Otoño',
      excerpt: 'Endulza tus días con nuestras creaciones especiales de temporada.',
      content: 'Contenido del artículo...',
      image_url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80',
      created_at: new Date().toISOString(),
      slug: 'postres-temporada-otono',
      is_published: true,
      featured: false,
      author_id: null
    },
    {
      id: '3',
      title: 'La Historia Detrás de Cada Receta',
      excerpt: 'Conoce las tradiciones familiares que inspiran nuestras creaciones.',
      content: 'Contenido del artículo...',
      image_url: 'https://images.unsplash.com/photo-1517433670267-08bbd4be890f?auto=format&fit=crop&w=800&q=80',
      created_at: new Date().toISOString(),
      slug: 'historia-detras-recetas',
      is_published: true,
      featured: false,
      author_id: null
    }
  ];

  const displayPosts = posts?.length ? posts : fallbackPosts;

  const calculateReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.replace(/<[^>]+>/g, '').split(/\s+/).length;
    return Math.max(1, Math.ceil(words / wordsPerMinute));
  };

  return (
    <section className="themed-blog-section w-full py-12 sm:py-16 md:py-20 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-48 sm:h-64 bg-gradient-to-b from-[var(--theme-accent)]/5 to-transparent pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-40 sm:w-48 h-40 sm:h-48 rounded-full opacity-20 blur-3xl" style={{ backgroundColor: 'var(--theme-accent-secondary)' }} />
      <div className="absolute -bottom-24 -left-24 w-40 sm:w-48 h-40 sm:h-48 rounded-full opacity-15 blur-3xl" style={{ backgroundColor: 'var(--theme-accent)' }} />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10 sm:mb-12 md:mb-16">
            <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4 md:mb-6">
              <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 themed-blog-accent" />
              <h2 className="themed-section-title text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold">
                Nuestro Blog
              </h2>
            </div>
            <div className="w-16 sm:w-24 h-1 rounded-full mx-auto mb-3 sm:mb-4" style={{ background: `linear-gradient(to right, var(--theme-accent), var(--theme-accent-secondary))` }} />
            <p className="themed-section-subtitle text-sm sm:text-base md:text-lg max-w-2xl mx-auto px-2">
              Descubre recetas, consejos y las historias detrás de nuestras deliciosas creaciones artesanales
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-48 sm:h-64">
              <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-2 border-[var(--theme-accent)]/20 border-t-[var(--theme-accent)]"></div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mb-8 sm:mb-12">
                {displayPosts.map((post) => (
                  <Card
                    key={post.id}
                    className="themed-blog-card group backdrop-blur-sm border transition-all duration-500 hover:shadow-xl cursor-pointer rounded-lg overflow-hidden"
                    onClick={() => navigate(`/blog/${post.slug}`)}
                  >
                    <CardHeader className="relative overflow-hidden p-0">
                      <div className="relative aspect-[16/10] overflow-hidden">
                        <img
                          src={post.image_url}
                          alt={post.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          loading="lazy"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 sm:p-5 md:p-6">
                      <div className="flex items-center gap-3 sm:gap-4 text-xs themed-section-subtitle mb-3">
                        <div className="flex items-center gap-1">
                          <Calendar size={14} className="themed-blog-accent shrink-0" />
                          <time dateTime={post.created_at}>
                            {format(new Date(post.created_at), "d 'de' MMMM", { locale: es })}
                          </time>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock size={14} className="themed-blog-accent shrink-0" />
                          <span>{calculateReadingTime(post.content)} min</span>
                        </div>
                      </div>

                      <CardTitle className="themed-blog-title text-base sm:text-lg md:text-xl font-bold transition-colors duration-300 mb-3 line-clamp-2">
                        {post.title}
                      </CardTitle>

                      <p className="themed-section-subtitle text-sm leading-relaxed line-clamp-3 mb-4">
                        {post.excerpt || 'Descubre más sobre este interesante artículo...'}
                      </p>

                      <div className="flex items-center justify-between pt-4 border-t themed-footer-border">
                        <span className="themed-page-accent font-medium text-sm">Leer artículo</span>
                        <ArrowRight className="w-4 h-4 themed-blog-accent group-hover:translate-x-1 transition-transform duration-300 shrink-0" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="text-center">
                <Button
                  onClick={() => navigate('/blog')}
                  className="themed-btn-primary font-semibold px-5 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6 text-sm sm:text-base rounded-full shadow-lg transition-all duration-300 w-full sm:w-auto max-w-xs mx-auto"
                >
                  Ver todos los artículos
                  <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}; 