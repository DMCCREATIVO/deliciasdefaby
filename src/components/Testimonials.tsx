import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext
} from "@/components/ui/carousel";
import { useState, useEffect } from "react";
import { TestimonialForm } from "./TestimonialForm";
import { Button } from "./ui/button";
import { toast } from "@/hooks/use-toast";
import { Star, Quote, ArrowRight } from "lucide-react";
import { pb } from "@/lib/pocketbase/client";

interface Testimonial {
  id: string;
  name: string;
  comment: string;
  rating: number;
  avatar?: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

export const Testimonials = () => {
  const [showForm, setShowForm] = useState(false);
  const [testimonialsList, setTestimonialsList] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedTestimonials, setExpandedTestimonials] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    loadTestimonials();
  }, []);

  const toggleExpanded = (testimonialId: string) => {
    setExpandedTestimonials(prev => ({
      ...prev,
      [testimonialId]: !prev[testimonialId]
    }));
  };

  const truncateText = (text: string, maxLength: number = 120) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  async function loadTestimonials() {
    try {
      setIsLoading(true);

      // Intentar cargar testimonios de PocketBase
      try {
        const records = await pb.collection('testimonials').getList(1, 50, {
          sort: 'name',
        });

        if (records.items && records.items.length > 0) {
          const testimonials = records.items.map(record => ({
            id: record.id,
            name: record.name,
            comment: record.comment,
            rating: record.rating,
            avatar: record.avatar,
            status: record.status || 'approved',
            created_at: record.created
          }));
          setTestimonialsList(testimonials);
          return;
        }
      } catch (pbError) {
        console.log('No se pudieron cargar testimonios de PocketBase, usando testimonios estáticos');
      }

      // Si no hay testimonios en PocketBase o hubo error, usar estáticos
      setTestimonialsList(getStaticTestimonials());
    } catch (error) {
      console.error('Error loading testimonials:', error);
      setTestimonialsList(getStaticTestimonials());
    } finally {
      setIsLoading(false);
    }
  }

  function getStaticTestimonials(): Testimonial[] {
    return [
      {
        id: '1',
        name: "María González",
        comment: "¡Los mejores pasteles que he probado! Siempre frescos y deliciosos. La calidad de los ingredientes se nota desde el primer bocado y el servicio al cliente es excepcional.",
        avatar: "/lovable-uploads/63e31e76-6658-4f03-b1a3-2eea65235d73.png",
        rating: 5,
        status: 'approved',
        created_at: new Date().toISOString()
      },
      {
        id: '2',
        name: "Juan Pérez",
        comment: "El servicio es excelente y los productos son de primera calidad.",
        avatar: "/lovable-uploads/5877841d-d8f6-412c-891a-daace8802a54.png",
        rating: 5,
        status: 'approved',
        created_at: new Date().toISOString()
      },
      {
        id: '3',
        name: "Ana Martínez",
        comment: "Me encanta cómo cuidan cada detalle. ¡Totalmente recomendados! Desde el momento en que entras a la tienda, te recibe el aroma de pan recién horneado. Los pasteles son obras de arte comestibles y el personal siempre está dispuesto a ayudar con una sonrisa. Sin duda, es mi panadería favorita en toda la ciudad.",
        avatar: "/lovable-uploads/e6a5756a-0b88-4eec-bac0-68840688da5a.png",
        rating: 5,
        status: 'approved',
        created_at: new Date().toISOString()
      },
      {
        id: '4',
        name: "Carlos Rodríguez",
        comment: "Increíble experiencia. Los panes artesanales son únicos.",
        avatar: "/lovable-uploads/63e31e76-6658-4f03-b1a3-2eea65235d73.png",
        rating: 5,
        status: 'approved',
        created_at: new Date().toISOString()
      },
      {
        id: '5',
        name: "Lucía Fernández",
        comment: "La atención personalizada y la calidad de los productos hacen de este lugar algo muy especial. Cada visita es una experiencia gastronómica memorable. Los precios son justos considerando la alta calidad de los ingredientes y la dedicación que ponen en cada producto. Altamente recomendado para cualquier ocasión especial.",
        avatar: "/lovable-uploads/e6a5756a-0b88-4eec-bac0-68840688da5a.png",
        rating: 5,
        status: 'approved',
        created_at: new Date().toISOString()
      }
    ];
  }

  const handleTestimonialSubmit = async (newTestimonial: { name: string; comment: string; rating: number }) => {
    try {
      await pb.collection('testimonials').create({
        name: newTestimonial.name,
        comment: newTestimonial.comment,
        rating: newTestimonial.rating,
        status: 'pending',
      });

      setShowForm(false);
      toast({
        title: 'Gracias por tu testimonio',
        description: 'Tu testimonio será revisado y publicado pronto.',
      });
    } catch (error) {
      console.error('Error submitting testimonial:', error);
      toast({
        title: 'Error',
        description: 'No se pudo enviar el testimonio. Por favor, intenta de nuevo.',
        variant: 'destructive'
      });
    }
  };

  return (
    <section className="themed-testimonials-section w-full py-12 sm:py-16 md:py-20 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-48 sm:h-64 bg-gradient-to-b from-[var(--theme-accent)]/5 to-transparent pointer-events-none" />
      <div className="absolute -top-24 -left-24 w-40 sm:w-48 h-40 sm:h-48 rounded-full opacity-30 blur-3xl" style={{ backgroundColor: 'var(--theme-accent)' }} />
      <div className="absolute -bottom-24 -right-24 w-40 sm:w-48 h-40 sm:h-48 rounded-full opacity-20 blur-3xl" style={{ backgroundColor: 'var(--theme-accent-secondary)' }} />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10 sm:mb-12 md:mb-16">
            <h2 className="themed-section-title text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">
              Lo que dicen nuestros clientes
            </h2>
            <div className="w-16 sm:w-24 h-1 rounded-full mx-auto mb-3 sm:mb-4" style={{ background: `linear-gradient(to right, var(--theme-accent), var(--theme-accent-secondary))` }} />
            <p className="themed-section-subtitle text-sm sm:text-base md:text-lg max-w-lg mx-auto px-2">
              Descubre por qué nuestros clientes nos eligen una y otra vez para sus momentos especiales
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-48 sm:h-64">
              <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-2 border-[var(--theme-accent)]/30 border-t-[var(--theme-accent)]"></div>
            </div>
          ) : (
            <>
              <div className="relative px-8 sm:px-10 md:px-12">
                <Carousel
                  opts={{
                    align: "start",
                    loop: true
                  }}
                  className="w-full relative"
                >
                  <div className="overflow-hidden">
                    <CarouselContent>
                      {testimonialsList.map((testimonial, index) => {
                        const isExpanded = expandedTestimonials[testimonial.id];
                        const needsTruncation = testimonial.comment.length > 120;
                        const displayText = isExpanded ? testimonial.comment : truncateText(testimonial.comment);

                        return (
                          <CarouselItem key={index} className="basis-full sm:basis-[85%] md:basis-1/2 lg:basis-1/3 pl-2 sm:pl-4">
                            <div className="h-full min-h-[280px] sm:min-h-[320px]">
                              <Card className="themed-testimonial-card h-full min-h-[280px] sm:h-80 backdrop-blur-sm border transition-all duration-500 hover:shadow-xl rounded-lg overflow-hidden flex flex-col">
                                <CardHeader className="flex flex-row items-center space-x-3 sm:space-x-4 p-3 sm:p-4 flex-shrink-0">
                                  <Avatar className="h-10 w-10 sm:h-12 sm:w-12 border-2 shrink-0 themed-testimonial-avatar-ring">
                                    <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                                    <AvatarFallback className="text-white font-bold text-sm" style={{ background: `linear-gradient(135deg, var(--theme-accent), var(--theme-accent-secondary))` }}>
                                      {testimonial.name[0]}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1 min-w-0">
                                    <CardTitle className="themed-feature-title text-sm sm:text-base font-bold truncate">
                                      {testimonial.name}
                                    </CardTitle>
                                    <div className="flex space-x-0.5 sm:space-x-1 mt-1">
                                      {Array.from({ length: 5 }).map((_, i) => (
                                        <Star
                                          key={i}
                                          className={`w-3 h-3 ${i < testimonial.rating ? 'themed-testimonial-star fill-current' : 'opacity-25'}`}
                                        />
                                      ))}
                                    </div>
                                  </div>
                                  <Quote className="w-4 h-4 sm:w-5 sm:h-5 opacity-30 flex-shrink-0 themed-testimonial-accent" />
                                </CardHeader>

                                <CardContent className="flex-1 flex flex-col justify-between p-3 sm:p-4 pt-0">
                                  <div className="flex-1">
                                    <p className="themed-feature-text leading-relaxed text-xs sm:text-sm italic">
                                      "{displayText}"
                                    </p>
                                  </div>

                                  {needsTruncation && (
                                    <div className="mt-3 pt-3 border-t themed-footer-border">
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          toggleExpanded(testimonial.id);
                                        }}
                                        className="themed-page-accent hover:opacity-80 text-xs font-medium transition-colors duration-300 flex items-center gap-1 py-2"
                                      >
                                        {isExpanded ? 'Ver menos' : 'Leer más'}
                                        <ArrowRight className={`w-3 h-3 transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''}`} />
                                      </button>
                                    </div>
                                  )}
                                </CardContent>
                              </Card>
                            </div>
                          </CarouselItem>
                        );
                      })}
                    </CarouselContent>
                  </div>
                  <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none px-1 sm:px-2">
                    <div className="pointer-events-auto">
                      <CarouselPrevious className="h-9 w-9 sm:h-10 sm:w-10 bg-[var(--theme-card-bg)]/95 hover:bg-[var(--theme-card-bg)] border-[var(--theme-card-border)] hover:border-[var(--theme-accent)] shadow-lg transition-all duration-300" />
                    </div>
                    <div className="pointer-events-auto">
                      <CarouselNext className="h-9 w-9 sm:h-10 sm:w-10 bg-[var(--theme-card-bg)]/95 hover:bg-[var(--theme-card-bg)] border-[var(--theme-card-border)] hover:border-[var(--theme-accent)] shadow-lg transition-all duration-300" />
                    </div>
                  </div>
                </Carousel>
              </div>

              <div className="mt-10 sm:mt-12 md:mt-16 text-center px-2">
                {!showForm ? (
                  <Button
                    onClick={() => setShowForm(true)}
                    className="themed-btn-primary font-semibold px-6 sm:px-8 py-5 sm:py-6 rounded-full shadow-lg transition-all duration-300 w-full sm:w-auto max-w-xs mx-auto"
                  >
                    Compartir tu Experiencia
                  </Button>
                ) : (
                  <div className="max-w-md mx-auto themed-card backdrop-blur-sm p-6 sm:p-8 rounded-2xl border shadow-xl">
                    <h3 className="themed-feature-title text-lg sm:text-xl font-bold mb-4">Tu opinión es importante</h3>
                    <TestimonialForm onSubmit={handleTestimonialSubmit} />
                    <Button
                      onClick={() => setShowForm(false)}
                      variant="outline"
                      className="themed-card-btn-outline mt-4 w-full"
                    >
                      Cancelar
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};