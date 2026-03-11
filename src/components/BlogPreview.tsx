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
    <section className="w-full py-16 sm:py-20 bg-gradient-to-b from-brand-beige/10 to-background relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-brand-cafe/5 to-transparent pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-brand-brown/10 blur-3xl" />
      <div className="absolute -bottom-24 -left-24 w-48 h-48 rounded-full bg-brand-accent/10 blur-3xl" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <div className="flex items-center justify-center gap-3 mb-4 sm:mb-6">
              <BookOpen className="w-6 sm:w-8 h-6 sm:h-8 text-brand-cafe" />
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-brand-cafe">
                Nuestro Blog
              </h2>
            </div>
            <div className="w-24 h-1 bg-gradient-to-r from-brand-cafe to-brand-brown rounded-full mx-auto mb-3 sm:mb-4"></div>
            <p className="text-base sm:text-lg text-brand-cafe/70 max-w-2xl mx-auto">
              Descubre recetas, consejos y las historias detrás de nuestras deliciosas creaciones artesanales
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-cafe"></div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-12">
                {displayPosts.map((post) => (
                  <Card
                    key={post.id}
                    className="group bg-white/95 backdrop-blur-sm border border-brand-beige hover:border-brand-cafe/50 transition-all duration-500 hover:shadow-xl hover:shadow-brand-cafe/10 cursor-pointer rounded-lg overflow-hidden"
                    onClick={() => navigate(`/blog/${post.slug}`)}
                  >
                    <CardHeader className="relative overflow-hidden p-0">
                      <div className="relative aspect-[16/10] overflow-hidden">
                        <img
                          src={post.image_url}
                          alt={post.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex items-center gap-4 text-xs text-brand-cafe/60 mb-3">
                        <div className="flex items-center gap-1">
                          <Calendar size={14} className="text-brand-cafe" />
                          <time dateTime={post.created_at}>
                            {format(new Date(post.created_at), "d 'de' MMMM", { locale: es })}
                          </time>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock size={14} className="text-brand-cafe" />
                          <span>{calculateReadingTime(post.content)} min</span>
                        </div>
                      </div>

                      <CardTitle className="text-lg sm:text-xl font-bold text-brand-cafe group-hover:text-brand-brown transition-colors duration-300 mb-3 line-clamp-2">
                        {post.title}
                      </CardTitle>

                      <p className="text-brand-cafe/70 text-sm leading-relaxed line-clamp-3 mb-4">
                        {post.excerpt || 'Descubre más sobre este interesante artículo...'}
                      </p>

                      <div className="flex items-center justify-between pt-4 border-t border-brand-beige">
                        <span className="text-brand-cafe font-medium text-sm">Leer artículo</span>
                        <ArrowRight className="w-4 h-4 text-brand-cafe group-hover:translate-x-1 transition-transform duration-300" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="text-center">
                <Button
                  onClick={() => navigate('/blog')}
                  className="bg-brand-cafe hover:bg-brand-brown text-white font-semibold px-6 sm:px-8 py-4 sm:py-6 text-sm sm:text-base rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-500"
                >
                  Ver todos los artículos
                  <ArrowRight className="ml-2 w-4 sm:w-5 h-4 sm:h-5" />
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}; 